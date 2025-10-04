import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Ads from '../../components/Ads';

export default function VehiclePage({ vehicle }) {
  if (!vehicle) {
    return <div className="p-6">Vehicle not found</div>;
  }

  const title = `${vehicle.make} ${vehicle.model} (${vehicle.year}) – MPG & Specs`;
  const description = `Check MPG, CO₂ emissions, and estimated range for the ${vehicle.year} ${vehicle.make} ${vehicle.model}. Compare fuel efficiency and performance data.`;
  const siteUrl = `https://www.mpgfinder.com/cars/${makeSlug(vehicle)}`;

  // JSON-LD structured data for the vehicle
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${vehicle.make} ${vehicle.model}`,
    "description": description,
    "brand": vehicle.make,
    "category": "Vehicle",
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "MPG", "value": vehicle.mpg || 'N/A' },
      { "@type": "PropertyValue", "name": "CO2_g_km", "value": vehicle.co2 || 'N/A' },
      { "@type": "PropertyValue", "name": "Range_miles", "value": vehicle.range_miles || 'N/A' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* SEO */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <main className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
        <h1 className="text-2xl font-bold mb-4">{vehicle.make} {vehicle.model} ({vehicle.year})</h1>

        <dl className="grid grid-cols-2 gap-4">
          <div><dt className="font-medium">Fuel</dt><dd>{vehicle.fuel}</dd></div>
          <div><dt className="font-medium">MPG</dt><dd>{vehicle.mpg || '—'}</dd></div>
          <div><dt className="font-medium">CO₂ g/km</dt><dd>{vehicle.co2 || '—'}</dd></div>
          <div><dt className="font-medium">Range (miles)</dt><dd>{vehicle.range_miles || '—'}</dd></div>
        </dl>

        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Insurance / Savings Estimate</h3>
          <p className="text-sm mb-3">Compare insurance quotes for this model. Example affiliate link:</p>
          <a
            href={`https://example-affiliate.com/quote?make=${encodeURIComponent(vehicle.make)}&model=${encodeURIComponent(vehicle.model)}&year=${vehicle.year}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Get Quotes
          </a>
        </div>

        <div className="mt-6">
          <Ads slot="inline-article" />
        </div>
      </main>
    </div>
  );
}

// Pre-rendering with fallback for large datasets
export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const slug = params.slug;
  const file = path.join(process.cwd(), 'data', 'mpg-sample.csv');
  const csv = fs.readFileSync(file, 'utf8');
  const rows = csvToJson(csv);
  const vehicle = rows.find(v => makeSlug(v) === slug) || null;

  if (!vehicle) {
    return { notFound: true, revalidate: 10 };
  }

  return { props: { vehicle }, revalidate: 60 * 60 * 24 };
}

// Helper functions
function csvToJson(csv) {
  const lines = csv.split('\n').filter(Boolean);
  const headers = lines.shift().split(',');
  return lines.map(l => {
    const cols = l.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      const val = cols[i];
      obj[h] = val === '' ? null : (isNumeric(val) ? Number(val) : val);
    });
    return obj;
  });
}

function isNumeric(n) {
  return !isNaN(n) && n !== '';
}

function makeSlug(v) {
  return `${v.make.toLowerCase().replace(/\s+/g,'-')}-${v.model.toLowerCase().replace(/\s+/g,'-')}-${v.year}`;
}
