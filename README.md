

````markdown
# 🕵️‍♂️ CrimeConnect FBI

A digital corkboard for case visualization and criminal tracking — built with **React**, **TypeScript**, **Tailwind CSS**, **Shadcn UI**, and **Supabase**.

<p align="center">
  <img src="https://img.shields.io/github/languages/top/Flamechargerr/crime-connect-fbi?style=flat-square" alt="Top Language">
  <img src="https://img.shields.io/github/last-commit/Flamechargerr/crime-connect-fbi?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/badge/Backend-Supabase-3fca8b?style=flat-square">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=flat-square">
  <img src="https://img.shields.io/badge/UI-shadcn--ui-yellow?style=flat-square">
</p>

---

## 🔗 Live Demo

👉 [Access the app](https://crime-connect-fbi.lovable.app/login)

---

## 🧠 Project Overview

**CrimeConnect FBI** is a modern, interactive web app inspired by real-world detective corkboards. It provides a drag-and-drop workspace for:

- Building and visualizing complex cases
- Connecting suspects, evidence, locations, and leads
- Managing data either locally (offline-first) or via Supabase (cloud)
- Collaborative visual investigation boards with minimal UI

This project is a creative UX experiment blending crime investigation design patterns with modern full-stack development, built entirely on **Lovable.io**.

---

## 🛠 Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Frontend    | React + TypeScript + Vite           |
| Styling     | Tailwind CSS + Shadcn UI            |
| Backend     | Supabase (PostgreSQL + Auth) / localStorage |
| Drag & Drop | react-dnd                           |
| Deployment  | Lovable.io                          |
| Testing     | Jest + React Testing Library        |

---

## ⚙️ Features

- 📌 Drag-and-drop corkboard to add and connect suspects, evidence, notes, and places
- 📁 Multiple board support — create, rename, switch investigations
- 🎨 Color-coded labels, metadata-rich links, and styled nodes
- 🧠 Custom content: photos, descriptions, external links
- 🧪 Unit & integration tests for critical flows
- 🔐 Demo login (with Supabase) + optional offline mode
- 💾 Offline-first (localStorage fallback for privacy)
- 🖼️ Upload your own images or use Unsplash/randomuser.me
- 📱 Fully responsive and accessible
- ⚠️ Error boundaries for graceful crash handling

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Setup

```bash
# 1. Clone this repo
git clone https://github.com/Flamechargerr/crime-connect-fbi.git
cd crime-connect-fbi

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
````

The app will be served at: [http://localhost:5173](http://localhost:5173)

---

## 📁 Folder Structure

```
crime-connect-fbi/
├── public/              # Static assets
├── src/                 # Frontend source code
│   ├── components/      # React UI components
│   ├── pages/           # App views
│   ├── context/         # Auth/global context
│   ├── hooks/           # Custom hooks
│   ├── types/           # TypeScript definitions
│   └── ...
├── supabase/            # Supabase schema & config
├── tailwind.config.ts   # Tailwind config
└── vite.config.ts       # Vite build config
```

---

## ✅ Accessibility & Testing

* Semantic HTML & ARIA attributes
* Keyboard navigation support
* Focus states for accessibility
* Error boundaries for stable UX
* Unit + integration testing with Jest & RTL

```bash
npm run test
```

---

## ❓ FAQ

**Q: Is my data private?**

> Yes! All data is stored **locally in your browser** by default (via localStorage). No servers unless using the Supabase demo backend.

**Q: Can I use this for real investigations?**

> This is a concept project meant for educational/demo use only.

**Q: Can I reset the demo data?**

> Yes — use the "Reset Demo Data" option on the corkboard page.

**Q: Can I upload my own images?**

> Yes! Drag and drop files or paste image URLs.

**Q: Does it work offline?**

> Yes! The app uses localStorage to support full offline functionality.

---

## 🛸 Future Ideas

* 🔐 Role-based access (viewer/editor/investigator)
* 🤝 Real-time collaboration with WebSockets
* 📍 Interactive map integration (case locations)
* 🧠 ML/AI integration (facial matching or link suggestions)
* 🧾 Export/Print board as PDF

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b my-feature`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to the branch: `git push origin my-feature`
5. Open a pull request with a detailed description

---

## 🏆 Acknowledgments

* [Unsplash](https://unsplash.com/) and [randomuser.me](https://randomuser.me/) for demo image assets
* [Shadcn UI](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/) for UI components
* [React DnD](https://react-dnd.github.io/react-dnd/about) for drag-and-drop support
* [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/) for testing

---

## 👨‍💻 Author

* **Anamay Tripathy** — [@Flamechargerr](https://github.com/Flamechargerr)

---

## 📃 License

MIT License — open for educational and experimental use.

> “Not just connecting clues — connecting dots with data.”

```

---

✅ **All formatting preserved.**  
✅ **Includes merged Supabase + offline versions.**  
✅ **Clean structure, ready to paste into GitHub.**

Let me know if you'd like this as a downloadable `.md` file or also want a `README-light.md` version for a project site!
```
