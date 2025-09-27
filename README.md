# MPG Finder

Next.js static site that lists vehicle MPG and specs.

## Run locally

1. Install deps: `npm install`
2. Run dev: `npm run dev`
3. Open http://localhost:3000

## Notes
- Data file is `data/mpg-sample.csv`. Replace with your CSV or use /admin to upload.
- Set `UPLOAD_PASSPHRASE` env var for security.


## Deployment & AdSense

- Recommended deployment: Vercel (free hobby tier). Connect your GitHub repo and push the project.
- Set environment variable `UPLOAD_PASSPHRASE` in Vercel dashboard.
- AdSense: create an account and paste your AdSense snippet into `components/Ads.js` or into a Layout slot.
  - Start with one inline ad per article and one leaderboard on index pages.
  - Consider lazy-loading ads for performance.


## Affiliate links

- The vehicle page includes an example affiliate CTA. Replace `https://example-affiliate.com/...` with your real affiliate partner URL.
- Consider A/B testing placements and calls-to-action after you get traffic.

