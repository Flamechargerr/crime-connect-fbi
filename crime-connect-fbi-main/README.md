<h1 align="center">🕵️‍♂️ CrimeConnect FBI</h1>
<p align="center"><em>A digital corkboard for case visualization and criminal tracking — built with React, TypeScript, and Tailwind CSS.</em></p>

<p align="center">
  <img src="https://img.shields.io/github/languages/top/Flamechargerr/crime-connect-fbi?style=flat-square" alt="Top Language">
  <img src="https://img.shields.io/github/last-commit/Flamechargerr/crime-connect-fbi?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=flat-square">
  <img src="https://img.shields.io/badge/UI-shadcn--ui-yellow?style=flat-square">
  <img src="https://img.shields.io/badge/Data-localStorage-green?style=flat-square">
</p>

---

## 🔗 Live Demo

👉 _Coming soon_

---

## 🧠 Project Overview

**CrimeConnect FBI** is a modern, interactive web app inspired by real-world detective corkboards. Designed for crime investigation, case management, and collaborative brainstorming, it provides a visually rich, drag-and-drop workspace for:

- Building and visualizing complex cases
- Connecting suspects, evidence, locations, and leads
- Managing all data locally (offline-first, privacy-friendly)
- Mimicking the workflow of real investigators and analysts

Whether you’re a student, hobbyist, or UX enthusiast, CrimeConnect FBI offers a unique, hands-on experience in digital investigation.

---

## 🛠 Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Frontend    | React + TypeScript + Vite           |
| Styling     | Tailwind CSS + Shadcn UI            |
| Data        | localStorage (offline-first)        |
| Testing     | Jest + React Testing Library        |
| Drag & Drop | react-dnd + HTML5 backend           |

---

## ⚙️ Features

- **Visual Corkboard:** Drag, drop, and connect items (suspects, evidence, notes, locations, documents, etc.)
- **Multiple Boards:** Create, rename, and switch between multiple investigation boards
- **Rich Item Types:** Each item can have images, metadata, and custom content
- **Connections:** Draw labeled, color-coded lines between any items
- **Image Support:** Use Unsplash/randomuser.me images or upload your own
- **Offline-First:** All data is stored in your browser (no backend required)
- **Responsive Design:** Works beautifully on desktop and mobile
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation, and focus management
- **Error Boundaries:** Graceful error handling and recovery
- **Testing:** Unit and integration tests for critical flows
- **Demo Login:** Quick access for demo/testing (no real authentication)
- **Role-Based UI:** Admin/user roles for future extensibility
- **Modern UI:** Built with Tailwind CSS and Shadcn UI for a clean, professional look

---

## 📸 Screenshots

> _Add screenshots or GIFs here to showcase the corkboard, entity pages, and mobile responsiveness._

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Setup & Usage

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

## 🧑‍💻 Developer Notes

- **LocalStorage-Only:** All CRUD operations are handled in-browser for privacy and offline use.
- **No Backend Required:** Perfect for demos, workshops, and experimentation.
- **Extensible:** Easily add new item types, board features, or integrate a backend if needed.
- **Testing:** Run `npm test` to execute all unit and integration tests.
- **Accessibility:** All interactive elements are keyboard-accessible and screen reader-friendly.

---

## 🤝 Contributing

We welcome contributions! To get started:

1. Fork the repo and create your branch from `main`.
2. Install dependencies with `npm install`.
3. Make your changes and add tests if needed.
4. Run tests with `npm test`.
5. Submit a pull request with a clear description.

### Code Style
- Use Prettier and ESLint for formatting and linting.
- Write clear, descriptive commit messages.
- Add/expand tests for new features or bugfixes.

---

## ♿ Accessibility & Testing

- All interactive elements use semantic HTML and ARIA labels.
- Keyboard navigation and focus states are supported throughout.
- Error boundaries catch and display errors gracefully.
- Unit and integration tests cover critical components and flows.

---

## ❓ FAQ

**Q: Is my data private?**
> Yes! All data is stored locally in your browser. Nothing is sent to a server.

**Q: Can I use this for real investigations?**
> This app is for educational and demo purposes only. Do not use for sensitive or real-world investigations.

**Q: How do I reset the demo data?**
> Use the "Reset Demo Data" button on the corkboard page to restore the original boards.

**Q: Can I add my own images?**
> Yes! You can upload images or use links for any corkboard item.

---

## 🛠 Troubleshooting

- If you see a blank screen, check the browser console for errors.
- Make sure you are running Node.js v18+ and have installed all dependencies.
- For issues with localStorage, try clearing your browser storage and reloading.
- If you encounter a bug, please open an issue or submit a pull request.

---

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com/) and [randomuser.me](https://randomuser.me/) for open-source images
- [Shadcn UI](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/) for UI components
- [React DnD](https://react-dnd.github.io/react-dnd/about) for drag-and-drop
- [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/) for testing

---

## 👨‍💻 Author

- **Anamay Tripathy** – [@Flamechargerr](https://github.com/Flamechargerr)

---

## 📃 License

MIT License — Open for educational or experimental use.

---

> “Not just connecting clues — connecting dots with data.”
