# web.py
import os
import json
import time
import base64
from io import BytesIO
from PIL import Image
import google.generativeai as genai
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager
from axe_selenium_python import Axe

# Configure logging for better debugging on Vercel
import logging
logging.basicConfig(level=logging.INFO)


class AccessibilityAuditor:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        if not self.api_key:
            logging.error("GEMINI_API_KEY not found in environment variables.")
            raise ValueError("GEMINI_API_KEY not set.")

        try:
            genai.configure(api_key=self.api_key)
            # Using a stable, generally available model recommended for production
            self.model = genai.GenerativeModel("gemini-1.5-flash")
            logging.info("Gemini Model initialized.")
        except Exception as e:
            logging.error(f"Failed to configure Gemini: {e}")
            raise

    def setup_driver(self, mobile=False):
        """Set up webdriver using webdriver-manager for local execution"""
        logging.info(f"Setting up WebDriver (Mobile: {mobile}) using webdriver-manager")
        options = Options()
        # Keep essential options for headless execution
        options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--window-size=1280x800") # Standard size
        # Add user agent if needed, but often not required locally
        # options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36")

        if mobile:
            mobile_emulation = {"deviceName": "iPhone X"}
            options.add_experimental_option("mobileEmulation", mobile_emulation)
            logging.info("Mobile emulation enabled for iPhone X.")

        try:
            # Let webdriver-manager handle the driver download and path automatically
            # It will find your installed Chrome. Make sure Chrome is installed!
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=options)
            logging.info("WebDriver created successfully via webdriver-manager.")
            return driver
        except Exception as e:
             # Catch any exception during driver setup
             logging.error(f"WebDriver setup via webdriver-manager failed: {e}", exc_info=True)
             # Re-raise a specific error to be caught by analyze_page
             raise WebDriverException(f"Failed to set up Chrome Driver using webdriver-manager: {e}")


    def analyze_page(self, url, wait_time=15): # Increased wait time slightly
        """Full analysis of a page, including direct Gemini analysis"""
        logging.info(f"Starting analysis for URL: {url}")
        results = {"url": url, "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"), "findings": {}, "errors": []}

        # Validate URL basic format
        if not url.startswith(('http://', 'https://')):
            logging.error(f"Invalid URL format: {url}")
            results["errors"].append("Invalid URL format. Please include http:// or https://")
            return results


        for device in ["desktop", "mobile"]:
            driver = None # Ensure driver is None initially for finally block
            logging.info(f"Analyzing {device} version of {url}")
            try:
                driver = self.setup_driver(mobile=(device == "mobile"))

                logging.info(f"Loading URL: {url}")
                driver.get(url)
                WebDriverWait(driver, wait_time).until(
                    EC.presence_of_element_located((By.TAG_NAME, "body"))
                )
                logging.info("Page body located. Waiting for dynamic content.")
                time.sleep(5)  # Wait for potential JS rendering

                # 1. Run axe accessibility test
                logging.info("Injecting Axe core")
                axe = Axe(driver)
                axe.inject()
                logging.info("Running Axe analysis")
                axe_results = axe.run()
                logging.info(f"Axe analysis complete. Violations: {len(axe_results.get('violations', []))}")


                # 2. Capture screenshot
                # Setting a reasonable height, full scroll capture can be flaky/slow
                screenshot_height = min(driver.execute_script("return document.body.scrollHeight"), 3000)
                screenshot_width = 1280 if device == "desktop" else 375 # Width from options or emulation
                driver.set_window_size(screenshot_width, screenshot_height)
                time.sleep(1) # Allow resize to settle

                logging.info("Capturing screenshot")
                screenshot = driver.get_screenshot_as_png()
                img = Image.open(BytesIO(screenshot))


                # 3. Get page HTML source
                logging.info("Getting HTML source")
                html_source = driver.page_source


                # 4. Direct Gemini analysis
                logging.info("Starting Gemini analysis")
                gemini_analysis = self._analyze_with_gemini(
                    url=url,
                    html=html_source,
                    axe_results=axe_results,
                    screenshot=img,
                    device_type=device
                )
                logging.info("Gemini analysis complete")

                # Store results
                results["findings"][device] = {
                    "axe_violations_count": len(axe_results.get("violations", [])),
                    # Storing only key details to keep JSON small, modify if needed
                    "axe_violations_summary": [
                         {
                            "id": v['id'],
                            "impact": v['impact'],
                            "help": v['help'],
                            "nodes": len(v['nodes'])
                         } for v in axe_results.get("violations", [])[:5] # Top 5 violations
                    ],
                    "gemini_analysis": gemini_analysis
                }
                logging.info(f"âœ… {device.title()} analysis successful")

            except TimeoutException as e:
                error_msg = f"Error analyzing {device} version: Page timed out after {wait_time} seconds. The site might be too slow, complex, or inaccessible."
                logging.error(error_msg + f" Details: {e}")
                results["findings"][device] = {"error": error_msg}
                results["errors"].append(f"{device.title()} analysis failed: Page timed out.")
            except WebDriverException as e:
                 error_msg = f"Error analyzing {device} version: WebDriver issue. This might be due to browser compatibility or configuration on the server."
                 logging.error(error_msg + f" Details: {e}")
                 results["findings"][device] = {"error": error_msg}
                 results["errors"].append(f"{device.title()} analysis failed: WebDriver error.")
            except Exception as e:
                error_msg = f"An unexpected error occurred during {device} analysis."
                logging.error(error_msg + f" Details: {str(e)}")
                results["findings"][device] = {"error": error_msg}
                results["errors"].append(f"{device.title()} analysis failed: {str(e)}")
            finally:
                if driver:
                    logging.info(f"Quitting WebDriver for {device} view.")
                    driver.quit()

        # Final comprehensive analysis comparing both views (if both successful)
        if "desktop" in results["findings"] and "mobile" in results["findings"] and \
           "error" not in results["findings"]["desktop"] and "error" not in results["findings"]["mobile"]:
            try:
                logging.info("Generating comprehensive analysis")
                results["comprehensive_analysis"] = self._generate_comprehensive_analysis(
                    results["findings"]["desktop"],
                    results["findings"]["mobile"],
                    url
                )
                logging.info("Comprehensive analysis generated.")
            except Exception as e:
                error_msg = "Error generating comprehensive analysis."
                logging.error(error_msg + f" Details: {str(e)}")
                results["errors"].append(error_msg)
                results["comprehensive_analysis"] = f"Could not generate comprehensive analysis: {e}"

        logging.info(f"Analysis finished for {url}. Errors encountered: {len(results['errors'])}")
        return results

    def _analyze_with_gemini(self, url, html, axe_results, screenshot, device_type):
        """Send data directly to Gemini for multimodal analysis - CONCISE version"""
        logging.info(f"Preparing prompt for Gemini ({device_type})...")

        violations = axe_results.get("violations", [])
        # Focus on critical/serious violations first
        critical_violations = [v for v in violations if v['impact'] in ['critical', 'serious']]
        violation_summary = "\n".join([
            f"- {v['id']} ({v['impact']}): {v['help']} ({len(v['nodes'])} instances)"
            for v in critical_violations[:5] # Top 5 critical/serious
        ])
        if not violation_summary:
             violation_summary = "No critical/serious Axe violations found." if not violations else "Top Axe violations:\n" + "\n".join([
                f"- {v['id']} ({v['impact']}): {v['help']} ({len(v['nodes'])} instances)"
                for v in violations[:3] # Top 3 any violations if no critical ones
            ])


        # CONCISE Prompt for impactful words
        prompt = f"""
        Analyze the accessibility of this {device_type} website view ({url}) based on the screenshot, HTML snippet, and Axe results. Focus ONLY on critical barriers impacting users with disabilities, specifically regarding WCAG 2.1 AA and EN 301 549 (EU).

        Key Axe Violations Summary:
        {violation_summary}

        HTML Start: `{html[:500]}...`

        Instructions:
        1.  Identify **max 3-5** most severe accessibility barriers visible or implied.
        2.  For each barrier, **concisely** state the issue, its impact on users (e.g., keyboard users, screen reader users), and the relevant WCAG/EN 301 549 standard violated (e.g., WCAG 1.1.1, EN 9.1.1.1).
        3.  **Avoid generic advice.** Focus on specific problems observed.
        4.  Mention mobile-specific issues (contrast, touch targets, responsive layout) ONLY if analyzing the mobile view or if clearly evident in the desktop view screenshot.
        5.  Use **strong, direct language**. Be precise.
        6.  Output format: Use bullet points for barriers. Start with a one-sentence overall assessment.
        """

        try:
            response = self.model.generate_content([prompt, screenshot])
            logging.info(f"Gemini response received for {device_type}.")
            # Basic check for safety blocking - add more robust checks if needed
            if not response.parts:
                 logging.warning(f"Gemini response for {device_type} might be empty or blocked.")
                 # Look for prompt feedback if available
                 prompt_feedback = getattr(response, 'prompt_feedback', None)
                 if prompt_feedback and prompt_feedback.block_reason:
                     logging.error(f"Gemini content blocked. Reason: {prompt_feedback.block_reason}")
                     return f"Error: Gemini analysis blocked due to safety settings (Reason: {prompt_feedback.block_reason}). Input might contain sensitive content or violate policies."
                 return "Error: Gemini returned an empty response. The analysis could not be performed for this view."

            return response.text
        except Exception as e:
            logging.error(f"Gemini API call failed for {device_type}: {e}")
            return f"Error: Failed to get analysis from Gemini API. ({e})"


    def _generate_comprehensive_analysis(self, desktop_results, mobile_results, url):
        """Generate comprehensive analysis comparing desktop and mobile findings - CONCISE version"""
        logging.info("Preparing comprehensive analysis prompt...")

        # Extract key points concisely
        desktop_summary = desktop_results.get('gemini_analysis', 'Desktop analysis unavailable or failed.')
        mobile_summary = mobile_results.get('gemini_analysis', 'Mobile analysis unavailable or failed.')

        prompt = f"""
        Synthesize the desktop and mobile accessibility analyses for {url} into a concise, high-impact report for an EU remediation proposal.

        Desktop Findings Summary:
        {desktop_summary}

        Mobile Findings Summary:
        {mobile_summary}

        Instructions:
        1.  **Overall Assessment:** Start with a 1-2 sentence summary of the site's overall accessibility state regarding EN 301 549.
        2.  **Critical Barriers (Max 3-4):** Identify the *most critical, cross-device* accessibility barriers preventing compliance. Describe the barrier and its direct impact concisely. Mention relevant EN 301 549 / WCAG points.
        3.  **Mobile-Specific Failures (Max 1-2):** Highlight any severe issues *unique* to the mobile experience (e.g., layout breakage, unusable controls).
        4.  **Remediation Priority:** Briefly state the top 1-2 *types* of fixes needed most urgently (e.g., "Fix keyboard navigation", "Improve color contrast").
        5.  **Compliance Statement:** Conclude with a direct statement on whether the site currently meets EN 301 549 requirements (likely 'No').
        6.  **Use minimal words.** Focus on impact and compliance failure. Avoid jargon where possible, but reference standards. No generic advice. Be direct and assertive.
        """

        try:
            response = self.model.generate_content(prompt)
            logging.info("Comprehensive analysis received from Gemini.")
             # Basic check for safety blocking
            if not response.parts:
                 logging.warning("Comprehensive Gemini response might be empty or blocked.")
                 prompt_feedback = getattr(response, 'prompt_feedback', None)
                 if prompt_feedback and prompt_feedback.block_reason:
                     logging.error(f"Comprehensive Gemini content blocked. Reason: {prompt_feedback.block_reason}")
                     return f"Error: Comprehensive analysis blocked due to safety settings (Reason: {prompt_feedback.block_reason})."
                 return "Error: Gemini returned an empty response for the comprehensive analysis."
            return response.text
        except Exception as e:
            logging.error(f"Comprehensive Gemini API call failed: {e}")
            return f"Error: Failed to generate comprehensive analysis via Gemini API. ({e})"

