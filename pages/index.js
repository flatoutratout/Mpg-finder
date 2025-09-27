import { useState } from "react";
import Papa from "papaparse";

export default function Home({ vehicles }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const makes = [...new Set(vehicles.map((v) => v.make))].sort();
  const models = [...new Set(vehicles.filter((v) => v.make === make).map((v) => v.model))].sort();
  const years = [...new Set(vehicles.filter((v) => v.make === make && v.model === model).map((v) => v.year))].sort();

  const selected = vehicles.find((v) => v.make === make && v.model === model && v.year === year);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>MPG Finder</h1>

      {/* Dropdowns */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
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

      {/* Vehicle Data Table */}
      {selected && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th style={th}>Make</th>
              <th style={th}>Model</th>
              <th style={th}>Year</th>
              <th style={th}>Fuel</th>
              <th style={th}>City MPG</th>
              <th style={th}>Highway MPG</th>
              <th style={th}>Combined MPG</th>
              <th style={th}>CO₂</th>
              <th style={th}>Cylinders</th>
              <th style={th}>Displacement</th>
              <th style={th}>Drive</th>
              <th style={th}>Range</th>
              <th style={th}>Transmission</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>{selected.make}</td>
              <td style={td}>{selected.model}</td>
              <td style={td}>{selected.year}</td>
              <td style={td}>{selected.fuelType}</td>
              <td style={td}>{selected.cityMPG}</td>
              <td style={td}>{selected.highwayMPG}</td>
              <td style={td}>{selected.combinedMPG}</td>
              <td style={td}>{selected.co2Emissions}</td>
              <td style={td}>{selected.cylinders}</td>
              <td style={td}>{selected.displacement}</td>
              <td style={td}>{selected.drive}</td>
              <td style={td}>{selected.range}</td>
              <td style={td}>{selected.trany}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = { border: "1px solid #ddd", padding: "8px", textAlign: "center" };
const td = { border: "1px solid #ddd", padding: "8px", textAlign: "center" };

export async function getStaticProps() {
  // Fetch vehicles.csv from the public folder
  const res = await fetch("http://localhost:3000/vehicles.csv");
  const csv = await res.text();

  const parsed = Papa.parse(csv, { header: true }).data;

  const vehicles = parsed.map((row) => ({
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
