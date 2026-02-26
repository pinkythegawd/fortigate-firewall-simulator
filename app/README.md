# 🔥 Firewall Block Page Simulator

> A comprehensive training platform for cybersecurity awareness, simulating realistic firewall block pages for educational purposes.

[![GitHub](https://img.shields.io/badge/GitHub-@pinkythegawd-181717?style=flat&logo=github)](https://github.com/pinkythegawd)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

![Screenshot](https://via.placeholder.com/800x400/1a1a2e/ffffff?text=Firewall+Block+Page+Simulator)

---

## 🎯 Purpose

This platform is designed for **cybersecurity awareness training**, **educational demonstrations**, and **lab simulations**. It generates realistic-looking firewall block pages similar to what enterprise security products display, helping users understand and recognize network security controls.

**⚠️ DISCLAIMER:** This is a **simulated training tool** for educational purposes only. No actual security blocking occurs.

---

## ✨ Features

### 🔐 Authentication System
- Local-only user authentication (no backend required)
- Three user roles: **Admin**, **Instructor**, **Trainee**
- Session management with 24-hour tokens
- User profile management

### 🎨 Multi-Firewall Simulation Modes
| Mode | Description |
|------|-------------|
| **Fortinet FortiGate** | Authentic Fortinet-style with geometric header |
| **Corporate Firewall** | Professional enterprise security style |
| **School Network Filter** | Friendly, educational-focused design |
| **ISP Level Block** | Official/legal compliance style |
| **Custom Branded** | Fully customizable with logo/colors |

### 🚀 Scenario Presets
- Malware Distribution Site
- Phishing Attempt
- Adult Content Block
- Gaming Website Block
- Geo-Blocked Region
- Social Media Block
- Streaming Media Block

### 📊 Analytics Dashboard
- Total blocked attempts counter
- Threat distribution charts
- Blocks by hour/day analytics
- Top blocked URLs tracking

### 🌍 Multi-Language Support
- 🇺🇸 English
- 🇫🇷 French
- 🇪🇸 Spanish

### 🎨 Theme System
- Light Mode, Dark Mode
- Legacy Style, Minimal UI
- High Alert Mode

### 📤 Export Options
- Export as standalone HTML
- Download ZIP package
- Copy to clipboard
- Export JSON configuration
- Generate screenshots

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/pinkythegawd/firewall-block-simulator.git

# Navigate to project directory
cd firewall-block-simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Default Login Credentials
```
Email: admin@training.local
Password: admin123
Role: Administrator
```

---

## 🏗️ Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/pinkythegawd/firewall-block-simulator)

### Option 2: CLI Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 📁 Project Structure

```
firewall-block-simulator/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── ProtectedRoute.tsx
│   ├── hooks/
│   │   ├── useAuth.tsx      # Authentication context
│   │   ├── useLocalStorage.ts
│   │   └── useLanguage.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Profile.tsx
│   │   └── MainApp.tsx
│   ├── lib/
│   │   ├── i18n/            # Translations (EN, FR, ES)
│   │   ├── scenarios.ts
│   │   ├── themes.ts
│   │   ├── firewall-templates.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── App.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Routing:** React Router DOM

---

## 🛡️ Security & Ethical Use

This tool is designed for **authorized training purposes only**:

- ✅ Cybersecurity awareness training
- ✅ IT onboarding simulations
- ✅ Lab environment demonstrations
- ✅ Security policy education

**Prohibited uses:**
- ❌ Deceiving or misleading users
- ❌ Bypassing real security systems
- ❌ Social engineering attacks
- ❌ Any malicious activities

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**MikePinku** ([@pinkythegawd](https://github.com/pinkythegawd))

- GitHub: [@pinkythegawd](https://github.com/pinkythegawd)

---

## 🙏 Acknowledgments

- Inspired by enterprise firewall products for educational purposes
- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Charts powered by [Recharts](https://recharts.org/)

---

<p align="center">
  Made with ❤️ for cybersecurity education
</p>
