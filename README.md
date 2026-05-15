# 🎧 Noise Generator

A browser-based ambient noise generator built with React, TypeScript, and the Web Audio API. Generate white, pink, or red/brown noise directly in your browser — no backend, no external audio files, no dependencies beyond React.

## ✨ Features

- **Three noise types** — White, Pink, and Red/Brown noise
- **Smooth playback** — Fade-in and fade-out on every start/stop to eliminate clicks
- **Real-time controls** — Change noise type and volume while audio is playing
- **Persistent settings** — Last used noise type and volume are saved in localStorage
- **Clean UI** — Dark, minimal, responsive interface that works on desktop and mobile
- **Accessible** — Semantic HTML, ARIA labels, keyboard navigable

## 🛠 Tech stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite 6 |
| Audio engine | Web Audio API + AudioWorklet |
| Styles | Plain CSS (no framework) |
| State persistence | localStorage |

## 🚀 Getting started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

> **Requirements:** A modern browser with AudioWorklet support (Chrome 66+, Firefox 76+, Safari 14.1+).

## 🏗 Architecture

All audio sample generation happens inside an **AudioWorklet** processor running on a dedicated audio thread — completely separate from the React rendering cycle. React is responsible only for UI state and user interaction.

```
src/
├── audio/
│   └── NoiseAudioService.ts      # Web Audio API: context, gain, worklet lifecycle
├── components/
│   ├── NoiseSelector.tsx          # Noise type toggle buttons
│   ├── VolumeSlider.tsx           # Volume range input
│   ├── PlaybackButton.tsx         # Start / Stop button
│   └── StatusPanel.tsx            # Live status readout
├── models/
│   └── NoiseType.ts               # Union type + noise type list
├── storage/
│   └── NoiseSettingsStorageService.ts  # localStorage with validation
├── App.tsx                        # State orchestration
└── index.css                      # CSS variables, layout, components

public/
└── audio/
    └── noise-processor.js         # AudioWorkletProcessor (audio thread)
```

### Noise algorithms

**White noise** — uniformly distributed random samples between -1 and 1.

**Pink noise** — Paul Kellet's IIR filter approximating a 1/f power spectrum. Sounds natural and is commonly used for sleep and focus.

**Red / Brown noise** — leaky integration of white noise (Brownian motion). Deep, rumbling character resembling distant thunder or ocean waves.

## 📄 License

[MIT](LICENSE) — do whatever you want with it.
