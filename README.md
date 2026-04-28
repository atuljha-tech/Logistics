# SmartLogistics 🌐

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
</div>

<br />

**SmartLogistics** is an advanced, premium Supply Chain Operating System designed for modern logistics. It features highly interactive dashboards, real-time shipment tracking, predictive analytics, and a stunning UI powered by Next.js and Framer Motion.

## ✨ Key Features

- **Dynamic Role-Based Dashboards:** Distinct experiences for Administrators and Users with seamless role-switching.
- **Interactive "Antigravity" UI:** Features smooth 3D flip-card components, hover micro-interactions, and premium sharp-corner glassmorphic designs.
- **Real-Time Supply Chain Tracking:** Interactive timelines tracking shipments from origin to destination.
- **Advanced Analytics:** Data visualization for efficiency, revenue, and risk using Recharts.
- **Actionable Alerts:** Notification center to manage urgent supply chain disruptions or route optimizations.
- **Performance Monitoring:** Circular animated progress rings evaluating user and system performance.
- **Backend Fallback Resilience:** Built-in sophisticated mock-data system that seamlessly functions when the production database is unreachable.

## 🛠 Tech Stack

### Frontend
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend
- **Framework:** Express.js (Node.js)
- **Database Architecture:** Supabase / PostgreSQL ready (currently utilizing resilient mock data layer for development).

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm/pnpm installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/Satyansh-edith/logistics.git
cd logistics
```

### 2. Setup the Frontend
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend will be available at `http://localhost:3000`.

### 3. Setup the Backend
Open a new terminal window:
```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the backend server
npm run dev
```
The backend API will run on `http://localhost:3001`.

## 🧭 Navigation & Routes

- **Landing Page:** `/`
- **Admin Dashboard:** `/admin` (Includes Users, Shipments, Analytics, Alerts, Approvals)
- **User Dashboard:** `/user-dashboard` (Includes My Shipments, Track Package, History, Notifications)
- **Supply Chain Detail:** `/supply-chain/[id]` (Detailed view of individual shipments)

## 🎨 Design System

SmartLogistics implements a custom design language:
- **Sharp Corners:** Eliminating border-radiuses for a precise, industrial aesthetic.
- **Glassmorphism:** Layered frosted glass panels over dynamic SVG mapping backgrounds.
- **Color Palette:** High-contrast dark mode with neon accents (Cyan, Emerald, Amber, Violet).
- **Typography:** Premium layout utilizing custom fonts (`Pepi-Thin` for headers, `Biotif-Pro` for body text).

---
*Built with ❤️ for modern logistics management.*
