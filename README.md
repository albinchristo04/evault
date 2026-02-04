# EVaultHub ⚽

Live Football Scores Website - Real-time match updates from leagues worldwide.

🌐 **Live Site:** [evaulthub.com](https://evaulthub.com)

---

## Features

- 🔴 **Live Scores** - Real-time match updates every 10 minutes
- 🌍 **Global Coverage** - 50+ football leagues worldwide
- 🎨 **Premium Design** - Dark theme with modern UI
- 📱 **Responsive** - Works on all devices
- ⚡ **Fast** - Vite-powered React app
- 💰 **AdSense Ready** - Monetization support

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + Vite |
| **Styling** | Vanilla CSS (Custom Design System) |
| **Data** | Flashscore Scraper (Playwright) |
| **Hosting** | Cloudflare Pages |
| **Automation** | GitHub Actions (10-min cron) |

---

## Project Structure

```
evault/
├── .github/workflows/     # GitHub Actions
│   ├── scrape.yml         # Auto-scrape every 10 min
│   └── deploy.yml         # Deploy to Cloudflare
├── public/
│   ├── data/
│   │   └── scores.json    # Live scores data
│   └── favicon.svg
├── scraper/
│   ├── index.js           # Flashscore scraper
│   └── package.json
├── src/
│   ├── components/        # React components
│   ├── styles/            # CSS files
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Run Scraper (Optional)

```bash
cd scraper
npm install
npx playwright install chromium
node index.js
```

### 4. Build for Production

```bash
npm run build
```

---

## GitHub Actions Setup

### Required Secrets

For deployment, add these secrets to your GitHub repository:

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |

### Workflows

1. **`scrape.yml`** - Runs every 10 minutes to update scores
2. **`deploy.yml`** - Deploys to Cloudflare Pages on push

---

## AdSense Integration

To add your AdSense code:

1. Replace `ca-pub-XXXXXXXXXXXXXXXX` in `index.html` with your publisher ID
2. Update `AdBanner.jsx` with your ad slot codes

---

## Data Source

Scores are scraped from [Flashscore](https://flashscore.com) using Playwright.

⚠️ **Legal Notice:** This scraper is for educational/personal use only. Scraping may violate Flashscore's Terms of Service. Use responsibly.

---

## License

MIT © 2026 EVaultHub

---

Made with ⚽ by EVaultHub Team
