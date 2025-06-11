"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ArrowLeft, Download, ExternalLink, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import Link from "next/link"

// Interfaces for our audit data structure
interface AuditSummary {
  critical: number
  serious: number
  moderate: number
  minor: number
  passed: number
}

interface AuditIssue {
  id: string
  type: "critical" | "serious" | "moderate" | "minor"
  title: string
  description: string
  wcag: string
  elements: { selector: string; location: string }[]
  recommendation: string
  impact: string
}

interface DeviceFindings {
  axe_violations_count: number
  axe_violations_summary: Array<{
    id: string
    impact: string
    help: string
    nodes: number
  }>
  gemini_analysis: string
  error?: string
}

interface AuditData {
  url: string
  timestamp: string
  findings: {
    desktop?: DeviceFindings
    mobile?: DeviceFindings
  }
  comprehensive_analysis?: string
  errors: string[]
}

// Convert Gemini analysis text to structured issues for UI compatibility
function parseGeminiAnalysisToIssues(analysis: string, axeSummary: any[]): AuditIssue[] {
  const issues: AuditIssue[] = []
  
  // Split analysis into bullet points or lines
  const lines = analysis.split('\n').filter(line => line.trim())
  let issueCounter = 1
  
  for (const line of lines) {
    // Skip overall assessment lines
    if (line.includes('Overall') || line.includes('assessment') || line.length < 20) continue
    
    // Look for bullet points or numbered items
    if (line.match(/^[\-\*•]\s/) || line.match(/^\d+\.\s/)) {
      const cleanLine = line.replace(/^[\-\*•\d\.\s]+/, '').trim()
      
      // Extract WCAG reference if present
      const wcagMatch = cleanLine.match(/(WCAG|EN)\s+[\d\.]+/i)
      const wcag = wcagMatch ? wcagMatch[0] : "WCAG 2.1 AA"
      
      // Determine severity from keywords
      let severity: "critical" | "serious" | "moderate" | "minor" = "moderate"
      if (cleanLine.toLowerCase().includes('critical') || cleanLine.toLowerCase().includes('severe')) {
        severity = "critical"
      } else if (cleanLine.toLowerCase().includes('serious') || cleanLine.toLowerCase().includes('major')) {
        severity = "serious"
      } else if (cleanLine.toLowerCase().includes('minor')) {
        severity = "minor"
      }
      
      // Create issue title (first sentence or up to 80 chars)
      const title = cleanLine.split('.')[0].substring(0, 80) + (cleanLine.length > 80 ? '...' : '')
      
      // Find related axe violation for more context
      const relatedAxe = axeSummary.find(axe => 
        cleanLine.toLowerCase().includes(axe.id.toLowerCase()) ||
        cleanLine.toLowerCase().includes(axe.help.toLowerCase().split(' ')[0])
      )
      
      issues.push({
        id: `gemini-${issueCounter++}`,
        type: severity,
        title: title,
        description: cleanLine,
        wcag: wcag,
        elements: relatedAxe ? [{ selector: `[data-axe-${relatedAxe.id}]`, location: "Multiple locations" }] : [],
        recommendation: "Address this accessibility barrier to improve compliance.",
        impact: "This barrier affects users with disabilities and impacts WCAG compliance."
      })
    }
  }
  
  // If no issues parsed, create a general one
  if (issues.length === 0 && analysis.trim()) {
    issues.push({
      id: "gemini-1",
      type: "moderate",
      title: "Accessibility Assessment Available",
      description: analysis.substring(0, 200) + "...",
      wcag: "WCAG 2.1 AA",
      elements: [],
      recommendation: "Review the full analysis for detailed recommendations.",
      impact: "See analysis for specific impacts on users with disabilities."
    })
  }
  
  return issues
}

function calculateAuditScore(findings: AuditData['findings']): number {
  const desktopCount = findings.desktop?.axe_violations_count || 0
  const mobileCount = findings.mobile?.axe_violations_count || 0
  const totalViolations = desktopCount + mobileCount
  
  // Simple scoring: start at 100, subtract points for violations
  let score = 100 - (totalViolations * 2)
  return Math.max(score, 0)
}

function generateSummary(findings: AuditData['findings']): AuditSummary {
  const summary: AuditSummary = { critical: 0, serious: 0, moderate: 0, minor: 0, passed: 0 }
  
  // Count violations by impact from both desktop and mobile
  [findings.desktop, findings.mobile].forEach(device => {
    if (device?.axe_violations_summary) {
      device.axe_violations_summary.forEach(violation => {
        const impact = violation.impact as keyof AuditSummary
        if (impact in summary) {
          summary[impact] += violation.nodes
        }
      })
    }
  })
  
  // Estimate passed tests (rough calculation)
  summary.passed = Math.max(40 - (summary.critical + summary.serious + summary.moderate + summary.minor), 0)
  
  return summary
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const urlParam = searchParams.get("url")
  const [activeTab, setActiveTab] = useState("summary")
  const [auditData, setAuditData] = useState<AuditData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Try to get audit data from sessionStorage first
    const storedData = sessionStorage.getItem("auditData")
    if (storedData) {
      try {
        const data: AuditData = JSON.parse(storedData)
        setAuditData(data)
        setIsLoading(false)
        // Clear the stored data
        sessionStorage.removeItem("auditData")
        return
      } catch (e) {
        console.error("Failed to parse stored audit data:", e)
      }
    }
    
    // If no stored data and we have a URL parameter, this might be a direct link or refresh
    // In this case, show a message asking user to run a new audit
    if (urlParam) {
      setError("No audit data found. Please run a new accessibility audit.")
      setIsLoading(false)
    }
  }, [urlParam])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing website accessibility...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !auditData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Audit Data Available</h1>
            <p className="text-gray-600 mb-6">{error || "Please run an accessibility audit first."}</p>
            <Link href="/" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
              Start New Audit
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Process audit data for UI
  const score = calculateAuditScore(auditData.findings)
  const summary = generateSummary(auditData.findings)
  
  // Convert Gemini analysis to issues for UI compatibility
  const desktopIssues = auditData.findings.desktop?.gemini_analysis 
    ? parseGeminiAnalysisToIssues(auditData.findings.desktop.gemini_analysis, auditData.findings.desktop.axe_violations_summary || [])
    : []
  
  const mobileIssues = auditData.findings.mobile?.gemini_analysis
    ? parseGeminiAnalysisToIssues(auditData.findings.mobile.gemini_analysis, auditData.findings.mobile.axe_violations_summary || [])
    : []

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "serious":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case "moderate":
        return <Info className="w-5 h-5 text-yellow-500" />
      case "minor":
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const renderSummary = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Accessibility Score</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32">
              <div className="w-full h-full rounded-full border-8 border-gray-100 flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full border-8 border-transparent"
                  style={{
                    borderTopColor: score >= 90 ? "#10b981" : score >= 70 ? "#f59e0b" : "#ef4444",
                    borderRightColor: score >= 90 ? "#10b981" : score >= 70 ? "#f59e0b" : "#ef4444",
                    transform: `rotate(${score * 3.6}deg)`,
                    transition: "transform 1s ease-in-out",
                  }}
                ></div>
                <span className="text-3xl font-bold z-10">{score}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">URL: {auditData.url}</p>
              <p className="text-sm text-gray-500">Date: {new Date(auditData.timestamp).toLocaleDateString()}</p>
              <div className="mt-2">
                {score >= 90 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" /> Excellent
                  </span>
                ) : score >= 70 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Needs Improvement
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3 mr-1" /> Poor
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Issues Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">{summary.critical}</p>
              <p className="text-sm text-gray-700">Critical</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-600">{summary.serious}</p>
              <p className="text-sm text-gray-700">Serious</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">{summary.moderate}</p>
              <p className="text-sm text-gray-700">Moderate</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{summary.minor}</p>
              <p className="text-sm text-gray-700">Minor</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{summary.passed}</p>
              <p className="text-sm text-gray-700">Passed</p>
            </div>
          </div>
        </div>

        {auditData.comprehensive_analysis && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Comprehensive Analysis</h2>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {auditData.comprehensive_analysis}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Top Issues to Fix</h2>
          <div className="space-y-4">
            {[...desktopIssues, ...mobileIssues]
              .sort((a, b) => {
                const severityOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 }
                return severityOrder[a.type] - severityOrder[b.type]
              })
              .slice(0, 3)
              .map((issue, index) => (
                <div key={`${issue.id}-${index}`} className="border-l-4 border-l-red-500 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    {getIssueIcon(issue.type)}
                    <h3 className="font-medium">{issue.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                  <p className="text-xs text-gray-500 mt-1">WCAG: {issue.wcag}</p>
                </div>
              ))}
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => setActiveTab("desktop")}
              className="text-sm text-black hover:underline inline-flex items-center"
            >
              View all issues <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderIssuesList = (issues: AuditIssue[], deviceFindings: DeviceFindings) => {
    return (
      <div className="space-y-6">
        {/* Show Gemini Analysis */}
        {deviceFindings.gemini_analysis && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-4">AI Analysis</h2>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {deviceFindings.gemini_analysis}
              </div>
            </div>
          </div>
        )}

        {/* Show detailed issues if parsed */}
        {issues.map((issue, index) => (
          <div key={`${issue.id}-${index}`} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-start gap-3">
              {getIssueIcon(issue.type)}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{issue.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                <div className="mt-3 p-2 bg-gray-50 rounded-md">
                  <p className="text-xs font-medium text-gray-500">WCAG Criterion</p>
                  <p className="text-sm">{issue.wcag}</p>
                </div>
                {issue.elements.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500">Affected Elements</p>
                    <ul className="mt-1 space-y-1">
                      {issue.elements.map((element, elemIndex) => (
                        <li key={elemIndex} className="text-sm">
                          <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{element.selector}</code> in{" "}
                          <span className="text-gray-700">{element.location}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500">Recommendation</p>
                  <p className="text-sm mt-1">{issue.recommendation}</p>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500">User Impact</p>
                  <p className="text-sm mt-1">{issue.impact}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Show Axe violations summary */}
        {deviceFindings.axe_violations_summary && deviceFindings.axe_violations_summary.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Axe Violations Summary</h2>
            <div className="space-y-2">
              {deviceFindings.axe_violations_summary.map((violation, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium text-sm">{violation.id}</span>
                    <p className="text-xs text-gray-600">{violation.help}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      violation.impact === 'critical' ? 'bg-red-100 text-red-800' :
                      violation.impact === 'serious' ? 'bg-orange-100 text-orange-800' :
                      violation.impact === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {violation.impact}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{violation.nodes} instances</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow px-4 py-8 sm:py-12 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Accessibility Audit Results</h1>
            <p className="text-gray-600">
              <span className="font-medium">{auditData.url}</span> • {new Date(auditData.timestamp).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href={auditData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Site
            </a>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
        </div>

        <>
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "summary"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setActiveTab("desktop")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "desktop"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Desktop Issues ({auditData.findings.desktop?.axe_violations_count || 0})
                </button>
                <button
                  onClick={() => setActiveTab("mobile")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "mobile"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Mobile Issues ({auditData.findings.mobile?.axe_violations_count || 0})
                </button>
              </nav>
            </div>
          </div>

          {activeTab === "summary" && renderSummary()}
          {activeTab === "desktop" && auditData.findings.desktop && renderIssuesList(desktopIssues, auditData.findings.desktop)}
          {activeTab === "mobile" && auditData.findings.mobile && renderIssuesList(mobileIssues, auditData.findings.mobile)}
        </>
      </main>

      <Footer />
    </div>
  )
}
