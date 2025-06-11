import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as axe from "axe-core";
import type { AxeResults, Result } from "axe-core";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Utility to summarise Axe violations for prompt
 */
function buildViolationSummary(violations: Result[]): string {
  if (!violations.length) return "No Axe violations found.";
  // Focus on critical/serious first
  const critical = violations.filter((v) => ["critical", "serious"].includes(v.impact || ""));
  const top = (critical.length ? critical : violations).slice(0, 5);
  return top
    .map((v) => `- ${v.id} (${v.impact}): ${v.help} (${v.nodes.length} instances)`) // eslint-disable-line prettier/prettier
    .join("\n");
}

async function runAxe(page: puppeteer.Page) {
  await page.addScriptTag({ path: require.resolve("axe-core") });
  // @ts-ignore - axe will be available in page context
  return page.evaluate(async () => await (window as any).axe.run());
}

async function captureScreenshot(page: puppeteer.Page): Promise<string> {
  const buffer = await page.screenshot({ fullPage: true, type: "png" });
  return buffer!.toString("base64");
}

async function analyzeWithGemini(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  {
    url,
    html,
    axeResults,
    screenshotBase64,
    deviceType,
  }: {
    url: string;
    html: string;
    axeResults: AxeResults;
    screenshotBase64: string;
    deviceType: "desktop" | "mobile";
  }
) {
  const violationSummary = buildViolationSummary(axeResults.violations);

  const prompt = `Analyze the accessibility of this ${deviceType} website view (${url}) based on the screenshot, HTML snippet, and Axe results. Focus ONLY on critical barriers impacting users with disabilities, specifically regarding WCAG 2.1 AA and EN 301 549 (EU).

Key Axe Violations Summary:\n${violationSummary}

HTML Start: \`${html.slice(0, 500)}...\`

Instructions:
1. Identify **max 3-5** most severe accessibility barriers visible or implied.
2. For each barrier, **concisely** state the issue, its impact on users (e.g., keyboard users, screen reader users), and the relevant WCAG/EN 301 549 standard violated (e.g., WCAG 1.1.1, EN 9.1.1.1).
3. **Avoid generic advice.** Focus on specific problems observed.
4. Mention mobile-specific issues (contrast, touch targets, responsive layout) ONLY if analyzing the mobile view or if clearly evident in the desktop view screenshot.
5. Use **strong, direct language**. Be precise.
6. Output format: Use bullet points for barriers. Start with a one-sentence overall assessment.`;

  const imagePart = {
    inlineData: {
      data: screenshotBase64,
      mimeType: "image/png",
    },
  } as const;

  const response = await model.generateContent([
    { text: prompt },
    imagePart as any,
  ]);

  let output = "";
  // Prefer .response.text() if available
  // @ts-ignore
  if (response?.response && typeof response.response.text === "function") {
    // @ts-ignore
    output = await response.response.text();
  // @ts-ignore
  } else if (typeof response.text === "function") {
    // Original SDK versions expose text() directly
    // @ts-ignore
    output = await response.text();
  } else {
    // Fallback manual extraction
    // @ts-ignore
    output = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  return output;
}

async function generateComprehensive(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  desktopAnalysis: string,
  mobileAnalysis: string,
  url: string
) {
  const prompt = `Synthesize the desktop and mobile accessibility analyses for ${url} into a concise, high-impact report for an EU remediation proposal.

Desktop Findings Summary:
${desktopAnalysis}

Mobile Findings Summary:
${mobileAnalysis}

Instructions:
1. **Overall Assessment:** Start with a 1-2 sentence summary of the site's overall accessibility state regarding EN 301 549.
2. **Critical Barriers (Max 3-4):** Identify the *most critical, cross-device* accessibility barriers preventing compliance. Describe the barrier and its direct impact concisely. Mention relevant EN 301 549 / WCAG points.
3. **Mobile-Specific Failures (Max 1-2):** Highlight any severe issues *unique* to the mobile experience (e.g., layout breakage, unusable controls).
4. **Remediation Priority:** Briefly state the top 1-2 *types* of fixes needed most urgently (e.g., "Fix keyboard navigation", "Improve color contrast").
5. **Compliance Statement:** Conclude with a direct statement on whether the site currently meets EN 301 549 requirements (likely 'No').
6. **Use minimal words.** Focus on impact and compliance failure. Avoid jargon where possible, but reference standards. No generic advice. Be direct and assertive.`;

  const res = await model.generateContent(prompt);
  let text = "";
  // @ts-ignore
  if (res?.response && typeof res.response.text === "function") {
    // @ts-ignore
    text = await res.response.text();
  // @ts-ignore
  } else if (typeof res.text === "function") {
    // @ts-ignore
    text = await res.text();
  } else {
    // @ts-ignore
    text = res?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }
  return text;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { url } = await req.json();
    if (!url || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: "Invalid or missing URL." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not set in environment." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

    const results: any = { url, timestamp: new Date().toISOString(), findings: {}, errors: [] };

    const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });

    const devices: ("desktop" | "mobile")[] = ["desktop", "mobile"];

    for (const device of devices) {
      const page = await browser.newPage();
      if (device === "mobile") {
        await page.setUserAgent(
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) " +
            "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1"
        );
        await page.setViewport({ width: 375, height: 812, isMobile: true, deviceScaleFactor: 2 });
      } else {
        await page.setViewport({ width: 1280, height: 800 });
      }

      try {
        await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
        await page.waitForTimeout(3000); // allow extra JS rendering

        const axeResults: AxeResults = await runAxe(page);

        const screenshotBase64 = await captureScreenshot(page);
        const html = await page.content();

        const geminiAnalysis = await analyzeWithGemini(model, {
          url,
          html,
          axeResults,
          screenshotBase64,
          deviceType: device,
        });

        results.findings[device] = {
          axe_violations_count: axeResults.violations.length,
          axe_violations_summary: axeResults.violations.slice(0, 5).map((v) => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            nodes: v.nodes.length,
          })),
          gemini_analysis: geminiAnalysis,
        };
      } catch (err: any) {
        const msg = `Error analyzing ${device}: ${err.message}`;
        results.findings[device] = { error: msg };
        results.errors.push(msg);
      } finally {
        await page.close();
      }
    }

    await browser.close();

    if (results.findings.desktop && results.findings.mobile && !results.errors.length) {
      results.comprehensive_analysis = await generateComprehensive(
        model,
        results.findings.desktop.gemini_analysis,
        results.findings.mobile.gemini_analysis,
        url
      );
    }

    return NextResponse.json(results, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
} 