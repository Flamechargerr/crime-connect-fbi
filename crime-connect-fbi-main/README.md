<h1 align="center">🕵️‍♂️ CrimeConnect FBI</h1>
<p align="center"><em>A digital corkboard for case visualization and criminal tracking — built with React, TypeScript, and Tailwind CSS.</em></p>

<p align="center">
  <img src="https://img.shields.io/github/languages/top/Flamechargerr/crime-connect-fbi?style=flat-square" alt="Top Language">
  <img src="https://img.shields.io/github/last-commit/Flamechargerr/crime-connect-fbi?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/badge/Backend-Supabase-3fca8b?style=flat-square">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=flat-square">
  <img src="https://img.shields.io/badge/UI-shadcn--ui-yellow?style=flat-square">
</p>

---

## 🔗 Live Demo

👉 _Coming soon_

---

## 🧠 Project Overview

**CrimeConnect FBI** is a visual investigation aid modeled after real-world FBI corkboards. This app allows users to:

- Add suspects, cases, evidence, and documents to a digital workspace
- Visually connect clues, leads, and evidence
- Mimic an investigation board experience digitally
- All data is stored in the browser using localStorage (no backend required)
- Enjoy a fast, modern interface built with Vite, TailwindCSS, and Shadcn UI

---

## 🛠 Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Frontend    | React + TypeScript + Vite           |
| Styling     | Tailwind CSS + Shadcn UI            |
| Data        | localStorage (offline-first)        |
| Testing     | Jest + React Testing Library        |

---

## ⚙️ Features

- 📌 Drag-and-drop visual corkboard (multiple boards, connections, images, and more)
- 🧩 Add suspects, notes, locations, evidence, and documents
- 🧠 Brainstorm leads and link them visually
- 🗂️ Data stored locally in the browser (robust offline demo)
- 🎯 Responsive, accessible design
- 🔐 Demo login system (no real authentication)
- 🛡️ Error boundaries for graceful error handling
- 🦾 Accessibility and keyboard navigation
- 🧪 Unit and integration tests for critical flows

---

## 🧪 Setup & Usage

To run the project locally:

```bash
# 1. Clone this repo
git clone https://github.com/Flamechargerr/crime-connect-fbi.git
cd crime-connect-fbi-main

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will be served at: `http://localhost:5173` (or as shown in your terminal)

---

## 📁 Folder Structure

```
crime-connect-fbi-main/
├── public/              # Static assets (images, placeholder, etc.)
├── src/                 # Frontend source code
│   ├── components/      # React UI components
│   ├── pages/           # Application views
│   ├── context/         # Auth and global context
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript types
│   └── ...
├── tailwind.config.ts   # Tailwind styling
└── vite.config.ts       # Vite configuration
```

---

## 🤝 Contributing

1. Fork the repo and create your branch from `main`.
2. Install dependencies with `npm install`.
3. Make your changes and add tests if needed.
4. Run tests with `npm test`.
5. Submit a pull request with a clear description.

---

## ♿ Accessibility & Testing

- All interactive elements use semantic HTML and ARIA labels.
- Keyboard navigation and focus states are supported throughout.
- Error boundaries catch and display errors gracefully.
- Unit and integration tests cover critical components and flows.

---

## 👨‍💻 Author

- **Anamay Tripathy** – [@Flamechargerr](https://github.com/Flamechargerr)

---

## 📃 License

MIT License — Open for educational or experimental use.

---

> “Not just connecting clues — connecting dots with data.”
