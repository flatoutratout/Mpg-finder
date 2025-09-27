import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { useState } from "react";
import DataTable from "react-data-table-component";

export default function Home({ vehicles }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuel, setFuel] = useState("");

  // unique filter values
  const makes = [...new Set(vehicles.map(v => v.make))];
  const models = [...new Set(vehicles.filter(v => !make || v.make === make).map(v => v.model))];
  const years = [...new Set(vehicles.filter(v => !make || v.make === make).map(v => v.year))];
  const fuels = [...new Set(vehicles.map(v => v.fuelType))];

  // filtered data
  const filtered = vehicles.filter(v =>
    (!make || v.make === make) &&
    (!model || v.model === model) &&
    (!year || v.year === year) &&
    (!fuel || v.fuelType === fuel)
  );

  // columns for the table
  const columns = [
    { name: "Make", selector: row => row.make, sortable: true },
    { name: "Model", selector: row => row.model, sortable: true },
    { name: "Year", selector: row => row.year, sortable: true },
    { name: "Fuel", selector: row => row.fuelType, sortable: true },
    { name: "City MPG", selector: row => row.cityMPG, sortable: true },
    { name: "Highway MPG", selector: row => row.highwayMPG, sortable: true },
    { name: "Combined MPG", selector: row => row.combinedMPG, sortable: true },
    { name: "CO₂ (g/km)", selector: row => row.co2Emissions, sortable: true },
    { name: "Range (miles)", selector: row => row.range, sortable: true },
    { name: "Cylinders", selector: row => row.cylinders, sortable: true },
    { name: "Displacement", selector: row => row.displacement, sortable: true },
    { name: "Drive", selector: row => row.drive, sortable: true },
    { name: "Transmission", selector: row => row.trany, sortable: true },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>🚗 MPG Finder</h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", justifyContent: "center" }}>
        <select value={make} onChange={e => setMake(e.target.value)}>
          <option value="">Any Make</option>
          {makes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <select value={model} onChange={e => setModel(e.target.value)}>
          <option value="">Any Model</option>
          {models.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <select value={year} onChange={e => setYear(e.target.value)}>
          <option value="">Any Year</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select value={fuel} onChange={e => setFuel(e.target.value)}>
          <option value="">Any Fuel</option>
          {fuels.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filtered}
        pagination
        highlightOnHover
        striped
        defaultSortFieldId={3}
      />
    </div>
  );
}

export async function getStaticProps() {
  const file = path.join(process.cwd(), "data", "vehicles.csv");
  const csv = fs.readFileSync(file, "utf8");
  const parsed = Papa.parse(csv, { header: true }).data;

  // Normalize column names to match our selectors
  const vehicles = parsed.map(row => ({
    make: row.make,
    model: row.model,
    year: row.year,
    fuelType: row.fuelType,
    cityMPG: row.city08 || row.cityA08 || "",
    highwayMPG: row.highway08 || row.highwayA08 || "",
    combinedMPG: row.comb08 || row.combA08 || "",
    co2Emissions: row.co2 || "",
    cylinders: row.cylinders || "",
    displacement: row.displ || "",
    drive: row.drive || "",
    range: row.range || "",
    trany: row.trany || "",
  }));

  return { props: { vehicles } };
}
