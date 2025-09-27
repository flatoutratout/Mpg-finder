// pages/index.js
import fs from "fs";
import path from "path";
import { useState, useMemo } from "react";

/* --- CSV parsing (naive but matches previous approach) --- */
function isNumeric(n) {
  return n !== null && n !== "" && !isNaN(n);
}
function csvToJson(csv) {
  if (!csv) return [];
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines.shift().split(",").map(h => h.trim());
  return lines.map((line) => {
    const cols = line.split(",").map(c => c.trim());
    const obj = {};
    headers.forEach((h, i) => {
      const val = cols[i] ?? "";
      if (val === "") obj[h] = null;
      else if (isNumeric(val)) obj[h] = Number(val);
      else obj[h] = val;
    });
    return obj;
  });
}

/* --- Page component --- */
export default function Home({ vehicles }) {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const makes = useMemo(
    () => [...new Set(vehicles.map((v) => v.make).filter(Boolean))].sort(),
    [vehicles]
  );
  const models = useMemo(
    () =>
      [...new Set(
        vehicles
          .filter((v) => v.make === selectedMake)
          .map((v) => v.model)
          .filter(Boolean)
      )].sort(),
    [vehicles, selectedMake]
  );
  const years = useMemo(
    () =>
      [...new Set(
        vehicles
          .filter((v) => v.make === selectedMake && v.model === selectedModel)
          .map((v) => v.year)
          .filter(Boolean)
      )].sort(),
    [vehicles, selectedMake, selectedModel]
  );

  const selected = useMemo(
    () => vehicles.find(
      (v) =>
        v.make === selectedMake &&
        v.model === selectedModel &&
        String(v.year) === String(selectedYear)
    ),
    [vehicles, selectedMake, selectedModel, selectedYear]
  );

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">MPG Finder</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={selectedMake}
          onChange={(e) => { setSelectedMake(e.target.value); setSelectedModel(""); setSelectedYear(""); }}
          className="p-2 border rounded"
        >
          <option value="">Select Make</option>
          {makes.map((m, i) => (
            <option key={`${m}-${i}`} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={selectedModel}
          onChange={(e) => { setSelectedModel(e.target.value); setSelectedYear(""); }}
          disabled={!selectedMake}
          className="p-2 border rounded"
        >
          <option value="">Select Model</option>
          {models.map((m, i) => (
            <option key={`${m}-${i}`} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          disabled={!selectedModel}
          className="p-2 border rounded"
        >
          <option value="">Select Year</option>
          {years.map((y, i) => (
            <option key={`${y}-${i}`} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {selected ? (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-3">{selected.make} {selected.model} ({selected.year})</h2>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="font-medium py-1">Fuel</td><td>{selected.fuel || selected.fuelType || "—"}</td></tr>
              <tr><td className="font-medium py-1">MPG (city)</td><td>{selected.cityMPG ?? selected.city_mpg ?? selected.mpg_city ?? "—"}</td></tr>
              <tr><td className="font-medium py-1">MPG (highway)</td><td>{selected.highwayMPG ?? selected.highway_mpg ?? selected.mpg_highway ?? "—"}</td></tr>
              <tr><td className="font-medium py-1">Combined MPG</td><td>{selected.combinedMPG ?? selected.combined_mpg ?? selected.mpg ?? "—"}</td></tr>
              <tr><td className="font-medium py-1">CO₂ g/km</td><td>{selected.co2Emissions ?? selected.co2 ?? "—"}</td></tr>
              <tr><td className="font-medium py-1">Cylinders</td><td>{selected.cylinders ?? "—"}</td></tr>
              <tr><td className="font-medium py-1">Displacement</td><td>{selected.displacement ?? "—"}</td></tr>
              <tr><td className="font-medium py-1">Drive</td><td>{selected.drive ?? "—"}</td></tr>
              <tr><td className="font-medium py-1">Range (miles)</td><td>{selected.range ?? selected.range_miles ?? "—"}</td></tr>
              <tr><td className="font-medium py-1">Transmission</td><td>{selected.trany ?? selected.transmission ?? "—"}</td></tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500">Choose make, model and year to view details.</div>
      )}
    </div>
  );
}

/* --- getStaticProps: tries multiple paths so you can keep CSV in data/ or public/ --- */
export async function getStaticProps() {
  const candidates = [
    path.join(process.cwd(), "data", "vehicles.csv"),
    path.join(process.cwd(), "data", "mpg-sample.csv"),
    path.join(process.cwd(), "public", "vehicles.csv"),
  ];

  let csv = null;
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      csv = fs.readFileSync(p, "utf8");
      break;
    }
  }

  if (!csv) {
    // If you prefer the app to throw at build time instead of silently returning empty,
    // replace the block below with: throw new Error('vehicles.csv missing');
    console.warn("Warning: vehicles.csv not found in data/ or public/. Returning empty list.");
    return { props: { vehicles: [] } };
  }

  const rows = csvToJson(csv);
  return { props: { vehicles: rows } };
}
