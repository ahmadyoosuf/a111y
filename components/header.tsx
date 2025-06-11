"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full py-4 px-4 sm:py-6 flex justify-between items-center border-b border-gray-100 bg-white z-50 relative">
      <div className="flex items-center">
        <Link href="/" className="text-xl sm:text-2xl font-bold">
          a111y<span className="text-black">auditor</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/" className="text-sm font-medium hover:text-gray-600">
          Home
        </Link>
        <Link href="/about" className="text-sm font-medium hover:text-gray-600">
          About
        </Link>
        <Link href="/results?url=example.com" className="text-sm font-medium hover:text-gray-600">
          Demo Report
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <div className="flex items-center md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white z-50 p-4 border-b border-gray-100 md:hidden shadow-md">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-sm font-medium hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/results?url=example.com"
              className="text-sm font-medium hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Demo Report
            </Link>
            <Link
              href="/#audit-form"
              className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Audit Your Site
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
