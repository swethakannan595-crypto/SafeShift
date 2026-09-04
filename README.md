# SafeShift — Multi-Modal Worker Safety Monitor

**A browser-based computer vision system for real-time workplace safety monitoring.**

SafeShift uses an 8-class Teachable Machine image classifier running on TensorFlow.js to detect PPE, ID badge, and posture compliance from a live camera feed — entirely client-side, with real-time alerting and incident logging.

🔗 **Live Demo:** [sunny-bombolone-3513db.netlify.app](https://sunny-bombolone-3513db.netlify.app/)

---

## Overview

Workplace safety incidents often stem from delayed detection — a missed hard hat, an unnoticed badge violation, a moment of risky posture that goes unmonitored. SafeShift addresses this by running lightweight AI inference directly in the browser, making real-time safety monitoring accessible without heavy backend infrastructure.

## Features

- 🪖 **Helmet Detection** — flags missing PPE headgear
- 😷 **Mask Detection** — monitors mask compliance
- 🪪 **ID Badge Verification** — detects missing or unworn badges
- 🧍 **Posture Monitoring** — flags incorrect/risky posture
- 🚨 **Severity-Tiered Alerts** — Warning / Risk / Emergency classification
- 📋 **Incident Logging** — timestamped event log with filtering (All / Warn / Risk / Emergency)
- 📤 **CSV Export** — download incident history for reporting/audit
- 💾 **Local Persistence** — incident data saved via `localStorage`
- 🎥 **Shared Camera Feed** — a single camera stream powers all four detection panels

## How It Works

1. A Teachable Machine model URL is loaded into the app (8-class image classifier: *with/without helmet, with/without mask, with/without ID, correct/incorrect pose*).
2. The browser camera feed is passed through the TensorFlow.js runtime for real-time inference.
3. Predictions are routed to the relevant safety panel (helmet, mask, ID, posture).
4. Alerts are triggered based on classification results and severity thresholds.
5. Events are logged, timestamped, and stored locally, with CSV export available.

> **Note:** Distress/audio monitoring is represented as a demo sensor in the current build, since the supplied model does not include an audio class.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| AI/ML | TensorFlow.js, Teachable Machine |
| Storage | Browser `localStorage` |
| Hosting | Netlify |

## Getting Started

### Prerequisites
- A modern web browser with camera access (Chrome/Edge/Firefox recommended)
- A trained Teachable Machine image classification model (8-class, see model schema above) hosted and accessible via URL

### Running Locally
```bash
# Clone the repository
git clone https://github.com/<your-username>/safeshift.git
cd safeshift

# Serve locally (any static server works)
npx serve .
```

Then open the local server URL in your browser, paste your Teachable Machine model URL into the app, click **Load Model**, and **Start Camera** to begin monitoring.

## Model Schema

The system expects an **8-class Teachable Machine image classifier** trained on:

```
with helmet       | without helmet
with mask         | without mask
with id           | without id
correct pose      | incorrect pose
```

## Roadmap

- [ ] Improve detection accuracy with a more robust/custom-trained model
- [ ] Add true audio-based distress detection
- [ ] Multi-camera / multi-station support
- [ ] Backend integration for centralized incident reporting

## Limitations

- Runs in **demo mode** until a valid model URL is supplied
- Currently supports a single shared camera feed per session
- Detection accuracy is dependent on the quality of the underlying Teachable Machine model

## License

*(Add your license here — e.g., MIT, Apache 2.0)*

## Author

Built by **Swetha K** — feel free to connect or reach out with feedback and suggestions.
