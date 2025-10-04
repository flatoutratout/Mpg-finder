// pages/api/vehicles-sitemap.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const file = path.join(process.cwd(), 'data', 'mpg-sample.csv');
  const csv = fs.readFileSync(file, 'utf8');

  const lines = csv.split('\n').filter(Boolean);
  const headers = lines.shift().split(',');

  const vehicles = lines.map(l => {
    const cols = l.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i] || null;
    });
    return obj;
  });

  const siteUrl = 'https://www.mpgfinder.com';

  // JSON-LD structured data for sitemap
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": vehicles.map((v, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `${siteUrl}/cars/${makeSlug(v)}`,
      "name": `${v.make} ${v.model} (${v.year})`
    }))
  };

  res.setHeader('Content-Type', 'application/ld+json');
  res.status(200).send(JSON.stringify(jsonLd, null, 2));
}

// Helper to create slug
function makeSlug(v) {
  return `${v.make.toLowerCase().replace(/\s+/g,'-')}-${v.model.toLowerCase().replace(/\s+/g,'-')}-${v.year}`;
}
