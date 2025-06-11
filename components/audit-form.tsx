"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

export default function AuditForm() {
  const [url, setUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic URL validation
    if (!url) {
      setError("Please enter a URL")
      return
    }

    let formattedUrl = url
    if (!url.match(/^https?:\/\//i)) {
      formattedUrl = "https://" + url
    }

    try {
      new URL(formattedUrl)
    } catch (e) {
      setError("Please enter a valid URL")
      return
    }

    setIsSubmitting(true)

    try {
      // Call the audit API
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: formattedUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze website")
      }

      const auditData = await response.json()
      
      // Store the audit data in sessionStorage and redirect to results
      sessionStorage.setItem("auditData", JSON.stringify(auditData))
      const domain = new URL(formattedUrl).hostname
      router.push(`/results?url=${encodeURIComponent(domain)}`)
      
    } catch (err: any) {
      console.error("Audit failed:", err)
      setError(err.message || "Failed to analyze website. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} id="audit-form" className="w-full">
      <div className="relative flex-1">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter your website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50"
            />
            {error && <p className="text-red-500 text-xs mt-1 ml-3">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 whitespace-nowrap btn-hover-effect relative overflow-hidden disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1200 ease-in-out pointer-events-none"></div>
            {isSubmitting ? "Analyzing..." : "Analyze Now"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  )
}
