

markdown
# 🕵️‍♂️ CrimeConnect FBI

_A visual corkboard investigation app to map cases, connect clues, and track suspects — with drag-and-drop precision._

<p align="center">
  <img src="https://img.shields.io/github/last-commit/Flamechargerr/crime-connect-fbi?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/github/languages/top/Flamechargerr/crime-connect-fbi?style=flat-square" alt="Top Language">
  <img src="https://img.shields.io/badge/Backend-Supabase-3fca8b?style=flat-square">
  <img src="https://img.shields.io/badge/UI-shadcn--ui-yellow?style=flat-square">
  <img src="https://img.shields.io/badge/Offline%20Mode-localStorage-informational?style=flat-square">
</p>

---

## 📌 Overview

**CrimeConnect FBI** is a drag-and-drop case visualization tool modeled after detective corkboards.  
Connect suspects, evidence, locations, and notes in an interactive board designed to mimic investigative thinking.

> Designed for fiction, education, and UX exploration — not real-world investigations.

---

### 🔍 Features

- 🧩 Drag-and-drop workspace for suspects, leads, and clues  
- 🔗 Create labeled, color-coded connections between nodes  
- 📁 Multiple boards for different cases — switch and rename freely  
- 🧠 Add custom metadata, notes, and links to items  
- 🖼️ Upload images or use avatars from Unsplash/randomuser.me  
- 📦 LocalStorage-based **offline-first** support  
- 🔐 Supabase-backed login for cloud version  
- ⚡ Fast, Vite-powered UI with responsive design  
- ♿ Accessible with ARIA tags and keyboard navigation  
- 🧪 Unit & integration tested using Jest + RTL  
- 🌙 Light/Dark Mode toggle (WIP)

---

## 🛠️ Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
  <img src="https://img.shields.io/badge/Shadcn/UI-000000?style=for-the-badge&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/Supabase-3fca8b?style=for-the-badge&logo=supabase&logoColor=white">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">
</p>

---

## 🚀 Live Demo

🔗 [**Launch the App**](https://crime-connect-fbi.lovable.app/login)  
⚠️ *Requires internet & Supabase login for live version. Offline works locally.*

---

## 📂 Folder Structure

```

crime-connect-fbi/
├── public/              # Static assets
├── src/                 # Frontend source code
│   ├── components/      # React UI components
│   ├── pages/           # App views
│   ├── context/         # Global context (auth, boards)
│   ├── hooks/           # Reusable logic
│   ├── types/           # TypeScript types
│   └── ...
├── supabase/            # Supabase schema & config
├── tailwind.config.ts   # Tailwind setup
└── vite.config.ts       # Vite config

````

---

## 💻 How to Run Locally

```bash
git clone https://github.com/Flamechargerr/crime-connect-fbi.git
cd crime-connect-fbi
npm install
npm run dev
````

➡️ Open `http://localhost:5173` in your browser.
✅ Works without login in **offline mode** (localStorage only).

---

## 🧪 Testing

```bash
npm run test
```

Test coverage includes:

* 📋 Board interactions
* 💾 LocalStorage logic
* 🧩 Node connections
* ❌ Error boundaries

---

## 🤔 FAQ

**Q: Is my data private?**
✅ Yes. In offline mode, everything stays in your browser (localStorage). Nothing is uploaded.

**Q: Can I use this for real investigations?**
🚫 No. This is for demos, UX testing, and education only.

**Q: Can I add my own images?**
🖼️ Yes — upload directly or use a public image URL.

**Q: What happens without internet?**
💾 The app fully supports offline usage — boards persist in the browser.

---

## ✨ Future Enhancements

* 🗺️ Map-based node positioning
* 🧑‍🤝‍🧑 Multi-user real-time collaboration
* 🧠 Smart linking suggestions (AI/ML powered)
* 📤 Export boards as PDF or image
* 🔐 Role-based board access

---

## 👨‍💻 Author

Built with 🧠, 🎯, and 💻 by
**[@Flamechargerr (Anamay)](https://github.com/Flamechargerr)**

---

## 📜 License

MIT License — free to use for educational, experimental, and creative projects.

---

> *“Not just connecting clues — connecting dots with data.”*

```

---

✅ **Copy-paste ready**  
✅ **Styled exactly like HackOps**  
✅ **Modern, polished markdown with badges, emojis, and section separation**

Let me know if you'd like this in `.md` file format or want a GitHub Pages–optimized version too!
```
