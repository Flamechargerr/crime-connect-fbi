# 🕵️‍♂️ CrimeConnect FBI

A digital corkboard for case visualization and criminal tracking — built with React, TypeScript, and Tailwind CSS.

<p align="center">
  <img src="https://img.shields.io/github/languages/top/Flamechargerr/crime-connect-fbi?style=flat-square" alt="Top Language">
  <img src="https://img.shields.io/github/last-commit/Flamechargerr/crime-connect-fbi?style=flat-square" alt="Last Commit">
</p>

---

## Project Overview

CrimeConnect FBI is a modern, interactive web app inspired by real-world detective corkboards. It provides a drag-and-drop workspace for:
- Building and visualizing complex cases
- Connecting suspects, evidence, locations, and leads
- Managing all data locally (offline-first, privacy-friendly)

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, Shadcn UI
- **Data:** localStorage (offline-first)
- **Testing:** Jest, React Testing Library
- **Drag & Drop:** react-dnd

---

## Features

- Visual corkboard: drag, drop, and connect items (suspects, evidence, notes, locations, documents)
- Multiple boards: create, rename, and switch between investigation boards
- Rich item types: images, metadata, and custom content
- Labeled, color-coded connections
- Image support: Unsplash/randomuser.me or upload your own
- Offline-first: all data in your browser
- Responsive and accessible design
- Error boundaries for graceful error handling
- Unit and integration tests for critical flows
- Demo login (no real authentication)

---

## Getting Started

**Prerequisites:**
- Node.js (v18+ recommended)
- npm or yarn

**Setup:**
```bash
# 1. Clone this repo
git clone https://github.com/Flamechargerr/crime-connect-fbi.git
cd crime-connect-fbi-main

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
The app will be served at: `http://localhost:5173`

---

## Folder Structure
```
crime-connect-fbi-main/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # UI components
│   ├── pages/           # App views
│   ├── context/         # Auth/global context
│   ├── hooks/           # Custom hooks
│   ├── types/           # TypeScript types
│   └── ...
├── tailwind.config.ts   # Tailwind config
└── vite.config.ts       # Vite config
```

---

## Contributing

1. Fork the repo and create your branch from `main`.
2. Install dependencies with `npm install`.
3. Make your changes and add tests if needed.
4. Run tests with `npm test`.
5. Submit a pull request with a clear description.

---

## Accessibility & Testing

- Semantic HTML and ARIA labels
- Keyboard navigation and focus states
- Error boundaries for graceful error handling
- Unit and integration tests for critical components

---

## FAQ

**Q: Is my data private?**
> Yes! All data is stored locally in your browser. Nothing is sent to a server.

**Q: Can I use this for real investigations?**
> This app is for educational and demo purposes only.

**Q: How do I reset the demo data?**
> Use the "Reset Demo Data" button on the corkboard page.

**Q: Can I add my own images?**
> Yes! You can upload images or use links for any corkboard item.

---

## Troubleshooting

- If you see a blank screen, check the browser console for errors.
- Make sure you are running Node.js v18+ and have installed all dependencies.
- For issues with localStorage, try clearing your browser storage and reloading.
- If you encounter a bug, please open an issue or submit a pull request.

---

## Acknowledgments

- [Unsplash](https://unsplash.com/) and [randomuser.me](https://randomuser.me/) for open-source images
- [Shadcn UI](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/) for UI components
- [React DnD](https://react-dnd.github.io/react-dnd/about) for drag-and-drop
- [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/) for testing

---

## Author

- **Anamay Tripathy** – [@Flamechargerr](https://github.com/Flamechargerr)

---

## License

MIT License — Open for educational or experimental use.

> “Not just connecting clues — connecting dots with data.”
