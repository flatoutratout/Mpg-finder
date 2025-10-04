// pages/cars/[slug].js
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Ads from '../../components/Ads';

export default function VehiclePage({ vehicle }) {
  if (!vehicle) {
    return <div className="p-6">Not found</div>;
  }

  const title = `${vehicle.make} ${vehicle.model} (${vehicle.year}) – MPG, CO₂ & Specs`;
  const description = `Fuel economy, emissions, and performance data for the ${vehicle.year} ${vehicle.make} ${vehicle.model}. Compare MPG, CO₂ emissions, range, and fuel type.`;
  const url = `https://www.mpgfinder.com/cars/${makeSlug(vehicle)}`;

  // JSON-LD Product schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": vehicle.make
    },
    "category": "Vehicle",
    "url": url,
    "mpn": makeSlug(vehicle),
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Year", "value": vehicle.year || 'N/A' },
      { "@type": "PropertyValue", "name": "Fuel Type", "value": vehicle.fuelType1 || vehicle.fuel || 'N/A' },
      { "@type": "PropertyValue", "name": "City MPG", "value": vehicle.city08 || 'N/A' },
      { "@type": "PropertyValue", "name": "Highway MPG", "value": vehicle.highway08 || 'N/A' },
      { "@type": "PropertyValue", "name": "Combined MPG", "value": vehicle.comb08 || vehicle.mpg || 'N/A' },
      { "@type": "PropertyValue", "name": "CO₂ (g/mi)", "value": vehicle.co2 || 'N/A' },
      { "@type": "PropertyValue", "name": "Range (miles)", "value": vehicle.range_miles || 'N/A' }
    ]
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold">{vehicle.make} {vehicle.model} ({vehicle.year})</h1>
        <dl className="mt-4 space-y-2">
          <dt className="font-medium">Fuel</dt><dd>{vehicle.fuelType1 || vehicle.fuel || '—'}</dd>
          <dt className="font-medium">City MPG</dt><dd>{vehicle.city08 || '—'}</dd>
          <dt className="font-medium">Highway MPG</dt><dd>{vehicle.highway08 || '—'}</dd>
          <dt className="font-medium">Combined MPG</dt><dd>{vehicle.comb08 || vehicle.mpg || '—'}</dd>
          <dt className="font-medium">CO₂ (g/mi)</dt><dd>{vehicle.co2 || '—'}</dd>
          <dt className="font-medium">Range (miles)</dt><dd>{vehicle.range_miles || '—'}</dd>
        </dl>

        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Quick saving/insurance estimate</h3>
          <p className="text-sm mb-3">Compare insurance quotes for this model. (Example affiliate link)</p>
          <a
            href={`https://example-affiliate.com/quote?make=${encodeURIComponent(vehicle.make)}&model=${encodeURIComponent(vehicle.model)}&year=${vehicle.year}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-yellow-500 text-black rounded"
          >
            Get Quotes (affiliate)
          </a>
        </div>

        <div className="mt-6">
          <Ads slot="inline-article" />
        </div>
      </div>
    </>
  );
}

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

// Helpers
function csvToJson(csv) {
  const lines = csv.split('\n').filter(Boolean);
  const headers = lines.shift().split(',');
  return lines.map(l => {
    const cols = l.split(',');
    const o = {};
    headers.forEach((h, i) => {
      const val = cols[i];
      o[h] = val === '' ? null : (isNumeric(val) ? Number(val) : val);
    });
    return o;
  });
}
function isNumeric(n) { return !isNaN(n) && n !== '' }
function makeSlug(v) {
  return `${v.make.toLowerCase().replace(/\s+/g,'-')}-${v.model.toLowerCase().replace(/\s+/g,'-')}-${v.year}`;
}
