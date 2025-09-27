import { useState } from "react";
import fs from "fs";
import path from "path";

// Simple CSV to JSON parser
function csvToJson(csv) {
  const [headerLine, ...lines] = csv.split("\n").filter(Boolean);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    const entry = {};
    headers.forEach((h, i) => {
      entry[h] = values[i];
    });
    return entry;
  });
}

export default function Home({ vehicles }) {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Dropdown options
  const makes = [...new Set(vehicles.map((v) => v.make))].sort();
  const models = selectedMake
    ? [...new Set(vehicles.filter((v) => v.make === selectedMake).map((v) => v.model))].sort()
    : [];
  const years = selectedModel
    ? [...new Set(
        vehicles
          .filter((v) => v.make === selectedMake && v.model === selectedModel)
          .map((v) => v.year)
      )].sort()
    : [];

  // Filter data
  const filtered = vehicles.filter(
    (v) =>
      (!selectedMake || v.make === selectedMake) &&
      (!selectedModel || v.model === selectedModel) &&
      (!selectedYear || v.year === selectedYear)
  );

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h1 style={{ marginBottom: "1rem" }}>MPG Finder</h1>

      {/* Dropdowns */}
      <div style={{ marginBottom: "2rem" }}>
        <select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)}>
          <option value="">Select Make</option>
          {makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>

        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={!selectedMake}
          style={{ marginLeft: "1rem" }}
        >
          <option value="">Select Model</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          disabled={!selectedModel}
          style={{ marginLeft: "1rem" }}
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Make</th>
                <th style={thStyle}>Model</th>
                <th style={thStyle}>Year</th>
                <th style={thStyle}>Fuel Type</th>
                <th style={thStyle}>City MPG</th>
                <th style={thStyle}>Highway MPG</th>
                <th style={thStyle}>Combined MPG</th>
                <th style={thStyle}>CO₂ Emissions</th>
                <th style={thStyle}>Cylinders</th>
                <th style={thStyle}>Displacement</th>
                <th style={thStyle}>Drive</th>
                <th style={thStyle}>Range</th>
                <th style={thStyle}>Transmission</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((car, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{car.make}</td>
                  <td style={tdStyle}>{car.model}</td>
                  <td style={tdStyle}>{car.year}</td>
                  <td style={tdStyle}>{car.fuelType}</td>
                  <td style={tdStyle}>
                    {car.city08 ? `${Math.round(car.city08)} MPG` : "N/A"}
                  </td>
                  <td style={tdStyle}>
                    {car.highway08 ? `${Math.round(car.highway08)} MPG` : "N/A"}
                  </td>
                  <td style={tdStyle}>
                    {car.cmb08 ? `${Math.round(car.cmb08)} MPG` : "N/A"}
                  </td>
                  <td style={tdStyle}>
                    {car.co2TailpipeGpm ? `${Math.round(car.co2TailpipeGpm)} g/mi` : "N/A"}
                  </td>
                  <td style={tdStyle}>{car.cylinders || "N/A"}</td>
                  <td style={tdStyle}>{car.displ ? `${car.displ} L` : "N/A"}</td>
                  <td style={tdStyle}>{car.drive || "N/A"}</td>
                  <td style={tdStyle}>{car.range ? `${car.range} mi` : "N/A"}</td>
                  <td style={tdStyle}>{car.trany || "N/A"}</td>
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
const tableStyle = {
  borderCollapse: "collapse",
  margin: "1rem 0",
  fontSize: "0.9rem",
  minWidth: "80%",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f0f0f0",
  textAlign: "center",
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};

// Load CSV
export async function getStaticProps() {
  const file = path.join(process.cwd(), "data", "vehicles.csv");
  const csv = fs.readFileSync(file, "utf8");
  const rows = csvToJson(csv);
  return { props: { vehicles: rows } };
}
