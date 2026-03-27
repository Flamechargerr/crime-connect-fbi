# 🛡️ FBI CrimeConnect - Criminal Intelligence System

<p align="center">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
</p>

<p align="center">
  <strong>A professional FBI-inspired criminal intelligence dashboard with cinematic design aesthetics</strong>
</p>

<p align="center">
  <em>"Not just connecting clues — connecting dots with data."</em>
</p>

---

## 🎯 ABOUT THE BUILDER (RESUME EXTRACT)

**CrimeConnect – Full-Stack Analytics & Case Management Platform 2025 · GitHub**
*React, Node.js, JavaScript, Python, PostgreSQL, SQL, scikit-learn, REST APIs*
• Built a responsive full-stack web application with a React frontend and Node.js REST API backend; designed intuitive UI components enabling non-technical users to query and visualise complex operational data at scale.
• Integrated Python ML classification pipeline (scikit-learn, 82% accuracy) with the web interface via REST API; designed PostgreSQL schemas with optimised analytical queries, reducing manual data processing time by 60%

---

## 🎯 PROJECT OVERVIEW

**FBI CrimeConnect** is a comprehensive criminal intelligence management system featuring a professional, cinematic FBI aesthetic. The application combines sleek dark themes with refined visual effects to create an immersive yet functional law enforcement dashboard.

### ✨ KEY FEATURES

- **Command Center Dashboard** - Real-time metrics, case status, and quick actions
- **Case Management** - Comprehensive case files with priority badges and status tracking
- **Criminal Database (NCIC)** - Threat levels, biometric data, and warrant status
- **Evidence Vault** - Chain of custody management with evidence categorization
- **Witness Protection Database** - Protected witness records and statements
- **Agent Directory** - Personnel records with security clearances
- **Federal Court System** - Court registries and case scheduling
- **3D Global Threat Map** - Interactive revolving globe with threat markers
- **Most Wanted Fugitives** - High-priority targets with reward information
- **Intelligence Reports** - Classified report generation and viewing

---

## 🚀 LIVE DEMO

**Deployed Application:** [https://crime-connect-fbi.vercel.app](https://crime-connect-fbi.vercel.app)

**Test Credentials:**
- Email: `test@test.com`
- Password: `password123`

---

## 🎨 DESIGN PHILOSOPHY

### Professional Cinematic FBI Aesthetic

The design philosophy centers on creating an authentic FBI command center experience while maintaining professional usability:

#### **Visual Identity**
- Deep slate and blue color palette with atmospheric glows
- Subtle scan effects and pulse animations for real-time data
- CLASSIFIED badges and security level indicators
- Clean, organized layouts with clear information hierarchy

#### **Key Design Elements**
- **Command Center Headers** - FBI-style section headers with status indicators
- **Card-Modern Components** - Glassmorphism cards with subtle glow effects
- **Status Badges** - Threat levels, clearance levels, and case priorities
- **Stat Cards** - Animated metrics with color-coded categories

### 🎨 COLOR SYSTEM

| Element | Description |
|---------|------------|
| **Background** | Deep slate (`slate-950`) with blue-tinted gradients |
| **Primary** | FBI Blue (`#3b82f6`) for interactive elements |
| **Success** | Green for active/resolved status |
| **Warning** | Amber for pending/medium priority |
| **Danger** | Red for critical/high threat |
| **Cards** | Dark `slate-900` with subtle borders |

---

## 🛠️ QUICK START

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Flamechargerr/crime-connect-fbi.git

# Navigate to frontend
cd crime-connect-fbi/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
```

---

## 📁 PROJECT STRUCTURE

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/          # Sidebar, TopBar, Layout
│   │   ├── ui/              # Shadcn UI components
│   │   ├── globe/           # 3D Globe component
│   │   └── effects/         # Visual effects
│   ├── pages/
│   │   ├── Dashboard.tsx    # Command Center
│   │   ├── Cases.tsx        # Case Files
│   │   ├── Criminals.tsx    # NCIC Database
│   │   ├── Evidence.tsx     # Evidence Vault
│   │   ├── Witnesses.tsx    # Witness Database
│   │   ├── Officers.tsx     # Agent Directory
│   │   ├── Courts.tsx       # Federal Courts
│   │   ├── Globe.tsx        # 3D Threat Map
│   │   ├── MostWanted.tsx   # Fugitive List
│   │   ├── Reports.tsx      # Intelligence Reports
│   │   ├── Profile.tsx      # Agent Profile
│   │   ├── Login.tsx        # Authentication
│   │   └── Register.tsx     # New Agent Registration
│   ├── context/             # Auth context
│   ├── hooks/               # Custom hooks
│   └── index.css            # Global styles & design tokens
├── index.html
└── package.json
```

---

## 🎯 MODULE BREAKDOWN

### 📊 Command Center (Dashboard)
- Real-time case statistics
- Active cases and alerts
- Quick action buttons
- System status indicators

### 🗂️ Case Files
- Priority levels (High/Medium/Low)
- Case ID formatting
- Status tracking (Open/Pending/Closed)
- Last updated timestamps

### 🔍 Criminal Database (NCIC)
- Threat level indicators (Extreme/High/Medium/Low)
- Warrant status (Wanted/Incarcerated/Released)
- Biometric data types
- Last known locations

### 📦 Evidence Vault
- Chain of custody tracking
- Evidence categories (Physical/Digital/Biometric)
- Storage locations
- Case linking

### 👥 Witness Database
- Protection status
- Witness statements
- Credibility ratings
- Case associations

### 🕵️ Agent Directory
- Security clearance levels (SECRET/TOP SECRET/SCI)
- Cases solved metrics
- Years of service
- Division assignments

### ⚖️ Federal Court System
- Jurisdiction types
- Session status
- Pending case counts
- Judge assignments

### 🌍 3D Global Threat Map
- Interactive revolving globe
- Real-time threat markers
- Target intelligence panel
- Coordinate tracking

---

## 🔧 TECH STACK

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Styling |
| **Vite** | Build Tool |
| **Shadcn/UI** | Component Library |
| **React Router** | Navigation |
| **React Query** | Data Fetching |
| **Lucide Icons** | Iconography |
| **Three.js** | 3D Globe Visualization |

---

## 📄 LICENSE

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 ACKNOWLEDGEMENTS

- [Shadcn/UI](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide Icons](https://lucide.dev/) - Clean icon library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [React Globe.gl](https://github.com/vasturiano/react-globe.gl) - 3D Globe

---

<div align="center">
  <h3>🛡️ FBI CrimeConnect</h3>
  <p><em>Professional Criminal Intelligence System</em></p>
  <p>Built with precision and style</p>
</div>