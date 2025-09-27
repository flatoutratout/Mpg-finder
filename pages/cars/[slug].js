import fs from 'fs';
import path from 'path';
import Layout from '../../components/Layout';
import Ads from '../../components/Ads';

export default function VehiclePage({ vehicle }) {
  if (!vehicle) return <Layout><div className="p-6">Not found</div></Layout>
  const title = `${vehicle.make} ${vehicle.model} (${vehicle.year}) – MPG & specs`;
  const description = `MPG, CO2 and range for the ${vehicle.year} ${vehicle.make} ${vehicle.model}.`;
  const url = '';
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
    <Layout meta={{ title, description, url, jsonLd }}>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold">{vehicle.make} {vehicle.model} ({vehicle.year})</h1>
        <dl className="mt-4 space-y-2">
          <dt className="font-medium">Fuel</dt><dd>{vehicle.fuel}</dd>
          <dt className="font-medium">MPG</dt><dd>{vehicle.mpg || '—'}</dd>
          <dt className="font-medium">CO₂ g/km</dt><dd>{vehicle.co2 || '—'}</dd>
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
    </Layout>
  );
}

export async function getStaticPaths() {
  // For large datasets, pre-render no paths and use on-demand SSG with fallback: 'blocking'.
  // This keeps build times fast while still producing static pages when first requested.
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
  return { props: { vehicle }, revalidate: 60 * 60 * 24 }; // revalidate daily
}

function csvToJson(csv){ const lines = csv.split('\n').filter(Boolean); const headers = lines.shift().split(','); return lines.map(l=>{ const cols = l.split(','); const o={}; headers.forEach((h,i)=>{ const val = cols[i]; o[h] = val === '' ? null : (isNumeric(val) ? Number(val) : val); }); return o; }) }
function isNumeric(n){ return !isNaN(n) && n !== '' }
function makeSlug(v){ return `${v.make.toLowerCase().replace(/\s+/g,'-')}-${v.model.toLowerCase().replace(/\s+/g,'-')}-${v.year}` }
