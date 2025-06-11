# a111y

**Enterprise-grade accessibility auditing platform powered by AI and automated testing.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=flat-square)](https://a111y.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)](https://nextjs.org)

---

## Overview

a111y provides comprehensive accessibility auditing for modern web applications, combining automated testing with AI-powered analysis to ensure WCAG 2.1 AA and EN 301 549 compliance.

**🚀 [Try it live](https://a111y.vercel.app)**

## Features

- **Dual-Device Analysis** — Desktop and mobile accessibility testing
- **AI-Powered Insights** — Gemini-enhanced violation detection and recommendations
- **Automated Testing** — Axe-core integration for comprehensive coverage
- **Visual Analysis** — Screenshot-based accessibility assessment
- **Compliance Reporting** — EU and international standards alignment
- **Real-time Results** — Instant analysis and actionable recommendations

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Python (Flask), Selenium WebDriver
- **AI:** Google Gemini API
- **Testing:** Axe-core accessibility engine
- **Deployment:** Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.8+
- Chrome browser
- Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/ahmadyoosuf/a111y.git
cd a111y

# Install dependencies
npm install
pip install -r requirements.txt

# Set environment variables
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Run development server
npm run dev
```

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
```

## Usage

1. **Enter URL** — Input any website URL for analysis
2. **Run Audit** — Automated testing across desktop and mobile
3. **Review Results** — Detailed accessibility findings and recommendations
4. **Export Report** — Compliance-ready documentation

## API Reference

### Analyze Endpoint

```typescript
POST /api/analyze
{
  "url": "https://example.com"
}
```

**Response:**
```typescript
{
  "url": string,
  "timestamp": string,
  "findings": {
    "desktop": AnalysisResult,
    "mobile": AnalysisResult
  },
  "comprehensive_analysis": string,
  "errors": string[]
}
```

## Standards Compliance

- **WCAG 2.1 AA** — Web Content Accessibility Guidelines
- **EN 301 549** — European accessibility standard
- **Section 508** — US federal accessibility requirements

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 **Email:** [support@a111y.com](mailto:support@a111y.com)
- 🐛 **Issues:** [GitHub Issues](https://github.com/ahmadyoosuf/a111y/issues)
- 📖 **Documentation:** [Wiki](https://github.com/ahmadyoosuf/a111y/wiki)

---

**Built with ❤️ for digital accessibility** 