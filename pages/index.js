import { useState } from "react";
import Papa from "papaparse";

export async function getStaticProps() {
  const res = await fetch("http://localhost:3000/vehicles.csv"); // CSV in /public
  const csv = await res.text();
  const parsed = Papa.parse(csv, { header: true }).data;

  // Normalize and only keep useful fields
  const vehicles = parsed.map((row) => ({
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

export default function Home({ vehicles }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [search, setSearch] = useState("");

  // Filtered data
  const filtered = vehicles.filter((v) => {
    const matchesDropdowns =
      (!make || v.make === make) &&
      (!model || v.model === model) &&
      (!year || v.year === year);

    const matchesSearch =
      !search ||
      `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(search.toLowerCase());

    return matchesDropdowns && matchesSearch;
  });

  // Unique dropdown values
  const makes = [...new Set(vehicles.map((v) => v.make))];
  const models = [...new Set(vehicles.filter((v) => v.make === make).map((v) => v.model))];
  const years = [...new Set(vehicles.filter((v) => v.model === model).map((v) => v.year))];

  return (
    <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🚗 MPG Finder</h1>

      {/* Search + Dropdowns */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search make, model, or year..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "0.5rem", minWidth: "200px" }}
        />

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

      {/* Results Table */}
      {filtered.length > 0 ? (
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Vehicle Details</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ background: "#f4f4f4" }}>
              <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Year</th>
                <th>Fuel</th>
                <th>City MPG</th>
                <th>Highway MPG</th>
                <th>Combined MPG</th>
                <th>CO₂</th>
                <th>Cyl</th>
                <th>Displ</th>
                <th>Drive</th>
                <th>Range</th>
                <th>Transmission</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
                  <td>{v.make}</td>
                  <td>{v.model}</td>
                  <td>{v.year}</td>
                  <td>{v.fuelType}</td>
                  <td>{v.cityMPG}</td>
                  <td>{v.highwayMPG}</td>
                  <td>{v.combinedMPG}</td>
                  <td>{v.co2Emissions}</td>
                  <td>{v.cylinders}</td>
                  <td>{v.displacement}</td>
                  <td>{v.drive}</td>
                  <td>{v.range}</td>
                  <td>{v.trany}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>No results found.</p>
      )}
    </div>
  );
}
