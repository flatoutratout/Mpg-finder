import { useState } from "react";
import fs from "fs";
import path from "path";

// Convert CSV text into JSON
function csvToJson(csv) {
  const lines = csv.split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    let obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i] ? values[i].trim() : "";
    });
    return obj;
  });
}

export default function Home({ vehicles }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const makes = [...new Set(vehicles.map((v) => v.make))].sort();
  const models = [...new Set(vehicles.filter((v) => v.make === make).map((v) => v.model))].sort();
  const years = [...new Set(vehicles.filter((v) => v.make === make && v.model === model).map((v) => v.year))].sort();

  const filtered = vehicles.filter(
    (v) => v.make === make && v.model === model && v.year === year
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "center" }}>
      <h1 style={{ marginBottom: "20px" }}>🚗 MPG Finder</h1>

      {/* Dropdowns */}
      <div style={{ marginBottom: "20px" }}>
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

      {/* Vehicle Details */}
      {filtered.length > 0 && (
        <div>
          <h2>Vehicle Details</h2>
          <table style={{ margin: "0 auto", borderCollapse: "collapse", width: "90%" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={th}>Make</th>
                <th style={th}>Model</th>
                <th style={th}>Year</th>
                <th style={th}>Fuel Type</th>
                <th style={th}>City MPG</th>
                <th style={th}>Highway MPG</th>
                <th style={th}>Combined MPG</th>
                <th style={th}>CO₂ Emissions (g/mi)</th>
                <th style={th}>Cylinders</th>
                <th style={th}>Displacement (L)</th>
                <th style={th}>Drive</th>
                <th style={th}>Range</th>
                <th style={th}>Transmission</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={td}>{v.make}</td>
                  <td style={td}>{v.model}</td>
                  <td style={td}>{v.year}</td>
                  <td style={td}>{v.fuelType}</td>
                  <td style={td}>{v.city08}</td>
                  <td style={td}>{v.highway08}</td>
                  <td style={td}>{v.comb08}</td>
                  <td style={td}>{v.co2}</td>
                  <td style={td}>{v.cylinders}</td>
                  <td style={td}>{v.displ}</td>
                  <td style={td}>{v.drive}</td>
                  <td style={td}>{v.rangeA}</td>
                  <td style={td}>{v.trany}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Table styles
const th = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };
const td = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };

// Load CSV at build time
export async function getStaticProps() {
  const file = path.join(process.cwd(), "data", "vehicles.csv");
  const csv = fs.readFileSync(file, "utf8");
  const rows = csvToJson(csv);
  return { props: { vehicles: rows } };
}
