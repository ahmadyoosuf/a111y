import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Eye, MousePointer, Brain, Heart, CheckCircle, Users, Scale, BarChart2, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About a111y Accessibility Auditor</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to make the web accessible to everyone, regardless of ability or disability.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="w-full py-12 md:py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our accessibility auditor was born out of frustration with existing tools that were either too complex
                  for non-experts or too simplistic to provide actionable insights.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  We realized that accessibility testing was often an afterthought in the development process, leading
                  to websites that excluded millions of users with disabilities.
                </p>
                <p className="text-lg text-gray-600">
                  That's why we built this tool - to make accessibility testing simple, comprehensive, and actionable
                  for developers, designers, and content creators of all skill levels.
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200 shadow-md">
                <div className="flex flex-col space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-black text-white h-12 w-12 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">Inclusive Design</h3>
                      <p className="text-sm text-gray-600">Creating experiences that work for everyone</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-black text-white h-12 w-12 rounded-full flex items-center justify-center">
                      <Scale className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">WCAG Compliance</h3>
                      <p className="text-sm text-gray-600">Meeting international accessibility standards</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-black text-white h-12 w-12 rounded-full flex items-center justify-center">
                      <BarChart2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">Data-Driven</h3>
                      <p className="text-sm text-gray-600">Using analytics to improve accessibility</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-black text-white h-12 w-12 rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">AI-Powered</h3>
                      <p className="text-sm text-gray-600">Leveraging AI for smarter accessibility testing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WCAG Standards */}
        <section className="w-full py-12 md:py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Understanding WCAG Standards</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">What is WCAG?</h3>
                <p className="text-gray-600 mb-4">
                  The Web Content Accessibility Guidelines (WCAG) are developed through the W3C process in cooperation
                  with individuals and organizations around the world, with a goal of providing a single shared standard
                  for web content accessibility.
                </p>
                <p className="text-gray-600">
                  WCAG 2.1, the latest version, builds on WCAG 2.0 and includes new success criteria addressing mobile
                  accessibility, people with low vision, and people with cognitive and learning disabilities.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Conformance Levels</h3>
                <p className="text-gray-600 mb-4">WCAG defines three levels of conformance:</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-black text-white px-2 py-1 rounded text-xs font-bold mr-2">A</span>
                    <span>The most basic web accessibility features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-black text-white px-2 py-1 rounded text-xs font-bold mr-2">AA</span>
                    <span>
                      Deals with the biggest and most common barriers for disabled users (most sites should aim for this
                      level)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-black text-white px-2 py-1 rounded text-xs font-bold mr-2">AAA</span>
                    <span>The highest level of web accessibility</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Perceivable</h3>
                <p className="text-gray-600">
                  Information and user interface components must be presentable to users in ways they can perceive.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
                  <MousePointer className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Operable</h3>
                <p className="text-gray-600">User interface components and navigation must be operable by all users.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Understandable</h3>
                <p className="text-gray-600">
                  Information and the operation of the user interface must be understandable.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Robust</h3>
                <p className="text-gray-600">
                  Content must be robust enough to be interpreted by a wide variety of user agents, including assistive
                  technologies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How Our Tool Works */}
        <section className="w-full py-12 md:py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">How Our Tool Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6 text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Comprehensive Scanning</h3>
                <p className="text-gray-600">
                  Our tool crawls your website and analyzes it against WCAG 2.1 AA standards, checking everything from
                  color contrast to keyboard navigation.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6 text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Powered Analysis</h3>
                <p className="text-gray-600">
                  Our AI engine goes beyond simple rule-checking to understand context and provide more accurate and
                  relevant recommendations.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6 text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Actionable Reports</h3>
                <p className="text-gray-600">
                  Receive detailed reports with clear explanations of issues, their impact on users, and specific
                  recommendations for fixing them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Accessibility Matters */}
        <section className="w-full py-12 md:py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold mb-6">Why Accessibility Matters</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-black text-white p-2 rounded-full mt-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Inclusion</h3>
                      <p className="text-gray-600">
                        Over 1 billion people worldwide have disabilities. Accessible websites ensure everyone can
                        access your content.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-black text-white p-2 rounded-full mt-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Legal Compliance</h3>
                      <p className="text-gray-600">
                        Many countries have laws requiring websites to be accessible, such as the ADA in the US and the
                        EAA in Europe.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-black text-white p-2 rounded-full mt-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Better UX for Everyone</h3>
                      <p className="text-gray-600">
                        Accessibility improvements often make websites better for all users, not just those with
                        disabilities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-black text-white p-2 rounded-full mt-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">SEO Benefits</h3>
                      <p className="text-gray-600">
                        Many accessibility practices, like proper heading structure and alt text, also improve search
                        engine optimization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200 shadow-md h-full">
                  <div className="flex flex-col h-full justify-center">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-black text-white rounded-full mb-4">
                        <Users className="h-10 w-10" />
                      </div>
                      <h3 className="text-2xl font-bold">1 in 4</h3>
                      <p className="text-gray-600">Adults in the US have some type of disability</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-black">98%</p>
                        <p className="text-xs text-gray-600">of websites have accessibility issues</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-black">$6.9T</p>
                        <p className="text-xs text-gray-600">global disability market</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600 italic">
                        "The power of the Web is in its universality. Access by everyone regardless of disability is an
                        essential aspect."
                      </p>
                      <p className="text-sm font-medium mt-2">
                        - Tim Berners-Lee, W3C Director and inventor of the World Wide Web
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Get Started</div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Make your website accessible to everyone.
                </h2>
                <Link
                  href="/"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-70 bg-black text-white"
                >
                  Start Auditing
                </Link>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Resources</div>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Looking to learn more about web accessibility? Check out these resources to deepen your understanding.
                </p>
                <Link
                  href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  WCAG Guidelines <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
