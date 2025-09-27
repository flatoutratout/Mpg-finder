import fs from 'fs';
import path from 'path';
import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import VehicleTable from '../components/VehicleTable';

export default function Home({ vehicles }) {
  const [query, setQuery] = useState('');
  const [fuel, setFuel] = useState('Any');
  const [make, setMake] = useState('Any');

  const makes = useMemo(() => ['Any', ...Array.from(new Set(vehicles.map(v => v.make))).sort()], [vehicles]);
  const fuels = useMemo(() => ['Any', ...Array.from(new Set(vehicles.map(v => v.fuel))).sort()], [vehicles]);

  const filtered = vehicles.filter(v => {
    const q = query.trim().toLowerCase();
    if (q && !(v.make + ' ' + v.model).toLowerCase().includes(q)) return false;
    if (fuel !== 'Any' && v.fuel !== fuel) return false;
    if (make !== 'Any' && v.make !== make) return false;
    return true;
  });

  return (
    <Layout meta={{ title: 'MPG Finder — Vehicle MPG Database', description: 'Search MPG, CO2 and range for thousands of vehicle models.' }}>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">MPG Finder</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input value={query} onChange={e => setQuery(e.target.value)} className="p-2 border rounded" placeholder="Search make or model" />
          <select value={fuel} onChange={e => setFuel(e.target.value)} className="p-2 border rounded">{fuels.map(f => <option key={f} value={f}>{f}</option>)}</select>
          <select value={make} onChange={e => setMake(e.target.value)} className="p-2 border rounded">{makes.map(m => <option key={m} value={m}>{m}</option>)}</select>
        </div>

        <VehicleTable vehicles={filtered} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const file = path.join(process.cwd(), 'data', 'mpg-sample.csv');
  const csv = fs.readFileSync(file, 'utf8');
  const rows = csvToJson(csv);
  return { props: { vehicles: rows } };
}

function csvToJson(csv) {
  const lines = csv.split('\n').filter(Boolean);
  const headers = lines.shift().split(',');
  return lines.map(l => {
    const cols = l.split(',');
    const obj = {};
    headers.forEach((h, i) => { obj[h] = isNumeric(cols[i]) ? Number(cols[i]) : cols[i]; });
    return obj;
  });
}
function isNumeric(n){ return !isNaN(n) && n !== '' }
