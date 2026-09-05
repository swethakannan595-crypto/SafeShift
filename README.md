# SafeShift — Multi-Modal Worker Safety Monitor

**A browser-based computer vision system for real-time workplace safety monitoring.**

SafeShift uses an 8-class Teachable Machine image classifier running on TensorFlow.js to detect PPE, ID badge, and posture compliance from a live camera feed — entirely client-side, with real-time alerting and incident logging.

🔗 **Live Demo:** [sunny-bombolone-3513db.netlify.app](https://sunny-bombolone-3513db.netlify.app/)

---

<img width="1630" height="964" alt="image" src="https://github.com/user-attachments/assets/9adcfd5a-3133-435c-b9e3-2b76292c6eef" />


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

      <img width="1630" height="964" alt="image" src="https://github.com/user-attachments/assets/160c9fba-4bae-4083-9691-301c90179d97" />


> **Note:** Distress/audio monitoring is represented as a demo sensor in the current build, since the supplied model does not include audio class.

<img width="900" height="250" alt="image" src="https://github.com/user-attachments/assets/1c05dadd-9243-4ecc-8a56-a76764921b9d" />


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
git clone https://github.com/swethakannan595-crypto/SafeShift/
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

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.


## Author

Built by **Swetha K** — feel free to connect or reach out with feedback and suggestions.
