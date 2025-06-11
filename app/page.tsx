import Link from "next/link"
import { ArrowRight, Eye, MousePointer, Brain, Heart, CheckCircle, AlertTriangle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AuditForm from "@/components/audit-form"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="w-full py-8 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <div className="w-full md:w-1/2 space-y-4">
              <div className="inline-flex items-center bg-black text-white px-3 py-1 rounded-full text-xs">
                <span>WCAG 2.1 AA Compliance</span>
              </div>
              <p className="text-gray-600 max-w-md">
                Comprehensive accessibility analysis, actionable recommendations, and AI-powered insights to make your
                website accessible to everyone.
              </p>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Audit Your <br />
                Website <span className="outline-text">Accessibility.</span>
              </h1>

              <div className="pt-4">
                <AuditForm />
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-10 rounded-lg border border-gray-200 shadow-lg mb-8">
                <div className="flex flex-col space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium mb-1">Color Contrast</p>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-green-600 h-3 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium mb-1">Alt Text</p>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-green-600 h-3 rounded-full" style={{ width: "88%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-yellow-100 p-3 rounded-full flex-shrink-0">
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium mb-1">Keyboard Navigation</p>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-yellow-500 h-3 rounded-full" style={{ width: "67%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium mb-1">ARIA Labels</p>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-red-500 h-3 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-6 bg-white p-4 rounded-lg shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">WCAG Compliance</p>
                      <p className="text-xs text-gray-500">73% of criteria met</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-full text-sm"
            >
              Our Approach
            </Link>
            <h2 className="text-xl mt-4">Comprehensive Accessibility Analysis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-black text-white p-6 rounded-xl">
              <div className="mb-4">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Perceivable</h3>
              <p className="text-sm text-gray-300">
                We analyze text alternatives, time-based media, adaptability, and distinguishability to ensure your
                content is perceivable by all users.
              </p>
            </div>

            <div className="bg-black text-white p-6 rounded-xl">
              <div className="mb-4">
                <MousePointer className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Operable</h3>
              <p className="text-sm text-gray-300">
                We check keyboard accessibility, timing, navigation, and input modalities to ensure your interface is
                operable by everyone.
              </p>
            </div>

            <div className="bg-black text-white p-6 rounded-xl">
              <div className="mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Understandable</h3>
              <p className="text-sm text-gray-300">
                We evaluate readability, predictability, and input assistance to ensure your content is understandable
                to all users.
              </p>
            </div>

            <div className="bg-black text-white p-6 rounded-xl">
              <div className="mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Robust</h3>
              <p className="text-sm text-gray-300">
                We check compatibility with current and future user tools to ensure your content is robust enough to be
                interpreted by a wide variety of user agents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container space-y-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple. Fast. Accurate.</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our accessibility auditor provides detailed insights and actionable recommendations to improve your
                website's accessibility.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl px-4">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start gap-8 mb-12 border-l-4 border-black pl-6 py-4">
              <div className="flex-shrink-0">
                <div className="bg-black text-white h-12 w-12 rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2">Enter Your URL</h3>
                <p className="text-muted-foreground mb-4">
                  Simply enter your website URL in our audit form at the top of the page and click "Analyze Now". Our
                  system will begin scanning your website immediately.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start gap-8 mb-12 border-l-4 border-black pl-6 py-4">
              <div className="flex-shrink-0">
                <div className="bg-black text-white h-12 w-12 rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2">Comprehensive Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Our AI-powered engine scans your website for WCAG 2.1 AA compliance issues, analyzing every aspect of
                  your site's accessibility.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex flex-col items-center text-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium">Perceivable</span>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex flex-col items-center text-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium">Operable</span>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex flex-col items-center text-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium">Understandable</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start gap-8 border-l-4 border-black pl-6 py-4">
              <div className="flex-shrink-0">
                <div className="bg-black text-white h-12 w-12 rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2">Detailed Report</h3>
                <p className="text-muted-foreground mb-4">
                  Receive a detailed report with actionable recommendations to improve accessibility, prioritized by
                  impact and implementation effort.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Critical: Missing alt text on 6 images</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-yellow-100 p-2 rounded-full mr-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Warning: Low contrast text in navigation</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-full text-sm">
              Testimonials
            </div>
            <h2 className="text-xl mt-4">See why our users love our accessibility auditor.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-gray-200 p-6 rounded-xl">
              <div className="mb-4">
                <div className="bg-gray-100 w-full p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-black text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                      SJ
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-xs text-gray-500">Accessibility Specialist</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm">
                "This tool has transformed how we approach accessibility testing. The detailed reports and actionable
                recommendations have helped us improve our WCAG compliance significantly."
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-xl">
              <div className="mb-4">
                <div className="bg-gray-100 w-full p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-black text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                      AC
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Alex Chen</p>
                      <p className="text-xs text-gray-500">Frontend Developer</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm">
                "As a developer, I appreciate the technical depth of the reports. It helps me understand exactly what
                needs to be fixed and how to implement the solutions correctly."
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-xl">
              <div className="mb-4">
                <div className="bg-gray-100 w-full p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-black text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                      MR
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Maria Rodriguez</p>
                      <p className="text-xs text-gray-500">UX Designer</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm">
                "The visual reports make it easy to communicate accessibility issues to stakeholders. It's become an
                essential part of our design process."
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-xl">
              <div className="mb-4">
                <div className="bg-gray-100 w-full p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-black text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                      DK
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">David Kim</p>
                      <p className="text-xs text-gray-500">Product Manager</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm">
                "This tool has helped us prioritize accessibility in our product roadmap. The insights are invaluable
                for ensuring we build inclusive products."
              </p>
            </div>
          </div>

          <div className="mt-12"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to make your website accessible to everyone?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Start your accessibility journey today with our comprehensive auditing tool.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <div className="flex justify-center">
              <Link
                href="#audit-form"
                className="bg-black text-white px-8 py-3 rounded-full inline-flex items-center justify-center text-lg font-medium"
              >
                Try It Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
