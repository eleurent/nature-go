# Nature GO PWA

A Progressive Web App version of the Nature GO wildlife identification game.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## PWA Installation

The app can be installed as a PWA on supported browsers:
- Chrome: Click the install icon in the address bar
- Safari iOS: Tap Share → Add to Home Screen

## Features

- 📷 Camera capture with WebRTC
- 🗺️ Map with Leaflet and observation markers
- 🌿 Species identification and collection
- 🎓 Quiz system for studying species
- 👤 User profiles with levels and badges

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Leaflet for maps
- next-pwa for PWA support
