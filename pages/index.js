import { useState } from "react";
import dynamic from "next/dynamic";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

// ✅ Import DataTable dynamically (client only, no SSR)
const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});

export default function Home({ vehicles }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  // Extract unique dropdown values
  const makes = [...new Set(vehicles.map((v) => v.make))].sort();
  const models = [...new Set(vehicles.filter((v) => v.make === make).map((v) => v.model))].sort();
  const years = [...new Set(vehicles.filter((v) => v.make === make && v.model === model).map((v) => v.year))].sort();

  const filtered = vehicles.filter(
    (v) =>
      (!make || v.make === make) &&
      (!model || v.model === model) &&
      (!year || v.year === year)
  );

  const columns = [
    { name: "Make", selector: (row) => row.make, sortable: true },
    { name: "Model", selector: (row) => row.model, sortable: true },
    { name: "Year", selector: (row) => row.year, sortable: true },
    { name: "Fuel Type", selector: (row) => row.fuelType },
    { name: "City MPG", selector: (row) => row.cityMPG },
    { name: "Highway MPG", selector: (row) => row.highwayMPG },
    { name: "Combined MPG", selector: (row) => row.combinedMPG },
    { name: "CO₂ Emissions", selector: (row) => row.co2Emissions },
    { name: "Cylinders", selector: (row) => row.cylinders },
    { name: "Displacement", selector: (row) => row.displacement },
    { name: "Drive", selector: (row) => row.drive },
    { name: "Range", selector: (row) => row.range },
    { name: "Transmission", selector: (row) => row.trany },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>MPG Finder</h1>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "2rem" }}>
        <select value={make} onChange={(e) => setMake(e.target.value)}>
          <option value="">Select Make</option>
          {makes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
          <option value="">Select Model</option>
          {models.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} disabled={!model}>
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* ✅ Client-only DataTable (no hydration error) */}
      <DataTable
        columns={columns}
        data={filtered}
        pagination
        highlightOnHover
        striped
        dense
      />
    </div>
  );
}

export async function getStaticProps() {
  const file = path.join(process.cwd(), "public", "vehicles.csv");
  const csv = fs.readFileSync(file, "utf8");

  const parsed = Papa.parse(csv, { header: true }).data;

  const vehicles = parsed
    .filter((row) => row.make && row.model && row.year)
    .map((row) => ({
      make: row.make || null,
      model: row.model || null,
      year: row.year || null,
      fuelType: row.fuelType || null,
      cityMPG: row.city08 || row.cityA08 || null,
      highwayMPG: row.highway08 || row.highwayA08 || null,
      combinedMPG: row.comb08 || row.combA08 || null,
      co2Emissions: row.co2 || null,
      cylinders: row.cylinders || null,
      displacement: row.displ || null,
      drive: row.drive || null,
      range: row.range || null,
      trany: row.trany || null,
    }));

  return { props: { vehicles } };
}
