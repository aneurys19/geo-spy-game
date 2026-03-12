# 🌍 Geo Spy: Interactive Mobile Geography 

> **Current Status: 🚧 IN PROGRESS (v1.2)**
> This project is actively being developed as a showcase for mobile-responsive game logic and gamified educational experiences.

## 🎯 The Vision
Geo Spy is a React-based web application designed to teach geography and regional identification to young learners through high-stakes "spy missions." The project balances high-resolution visual storytelling with precise technical engineering.



---

## 🚀 Technical Milestones (Completed)
### 1. Multi-Level State Management
Developed a robust mission manager that handles transitions between distinct geographical data sets.
* **Level 1 (Colombia Recon 🇨🇴):** 10x10 training grid focused on identification.
* **Level 2 (Dominican Republic 🇩🇴):** 15x15 complex mission featuring hazard logic (Colombian outposts) and terrain-specific movement (swimming/water wading).

### 2. Mobile-First Optimization
Engineered a custom layout strategy to ensure the app functions as a "Native-Feel" experience on high-end mobile devices (optimized for Pixel 9 Pro XL).
* **Dynamic Viewports:** Utilized `100dvh` and `flex-shrink` to prevent layout breaking on tall aspect ratios.
* **Touch-Optimized UI:** Designed a custom D-Pad controller and glass-morphism HUD for seamless mobile play.

### 3. Sprite Engineering & Aperture Masking
Resolved complex visual regressions inherent in 2D grid rendering.
* **Problem:** Sprite mirroring and "bleeding" between 15x15 grid tiles.
* **Solution:** Implemented an **Aperture Masking system** using CSS `overflow: hidden` and precise `translateX` transforms to isolate individual 32px icons from a master sprite sheet.

---

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite)
* **Styling:** CSS-in-JS (Flexbox/Grid)
* **Deployment:** Vercel (CI/CD)
* **Assets:** Custom Sprite Sheets & Dashboard UI

---

## 🗺️ Roadmap (In Development)
- [ ] **Level 3: Iceland 🇮🇸** - Introducing ice-sliding physics and temperature-gauge mechanics.
- [ ] **Audio Integration** - Contextual sound effects for mission success and hazards.
- [ ] **Firebase Backend** - Persistent high-score leaderboards and user profiles.

---

---
**Developer Note:** Managed and Architected by Aneurys S. as part of a Software Engineering & Project Management portfolio.
