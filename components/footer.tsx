import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 sm:py-12">
      <div className="px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold">
              a111y<span className="text-white">auditor</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base">Making the web accessible for everyone.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:col-span-1 lg:col-span-2">
            <div>
              <h4 className="font-bold mb-3 sm:mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                    className="text-gray-300 hover:text-white text-sm sm:text-base"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WCAG Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.w3.org/WAI/fundamentals/"
                    className="text-gray-300 hover:text-white text-sm sm:text-base"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Accessibility Fundamentals
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white text-sm sm:text-base">
                    About Our Tool
                  </Link>
                </li>
                <li>
                  <Link href="/#audit-form" className="text-gray-300 hover:text-white text-sm sm:text-base">
                    Try It Now
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 sm:mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white text-sm sm:text-base">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white text-sm sm:text-base">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 sm:mt-12 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
          © All Rights Reserved. {new Date().getFullYear()}. a111yauditor.com
        </div>
      </div>
    </footer>
  )
}
