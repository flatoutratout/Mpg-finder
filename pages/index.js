import { useState, useEffect } from "react";
import Papa from "papaparse";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Load vehicles.csv from public/
  useEffect(() => {
    Papa.parse("/vehicles.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setVehicles(results.data);
      },
    });
  }, []);

  // Dropdown values
  const makes = [...new Set(vehicles.map((v) => v.make))].filter(Boolean);
  const models = [
    ...new Set(vehicles.filter((v) => v.make === selectedMake).map((v) => v.model)),
  ].filter(Boolean);
  const years = [
    ...new Set(
      vehicles
        .filter((v) => v.make === selectedMake && v.model === selectedModel)
        .map((v) => v.year)
    ),
  ].filter(Boolean);

  // Filter results
  useEffect(() => {
    if (selectedMake && selectedModel && selectedYear) {
      const results = vehicles.filter(
        (v) =>
          v.make === selectedMake &&
          v.model === selectedModel &&
          v.year === selectedYear
      );
      setFilteredData(results);
    } else {
      setFilteredData([]);
    }
  }, [selectedMake, selectedModel, selectedYear, vehicles]);

  return (
    <div style={{ maxWidth: "1200px", margin: "2rem auto", textAlign: "center" }}>
      <h1 style={{ marginBottom: "2rem" }}>MPG Finder</h1>

      {/* Dropdowns */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)}>
          <option value="">Select Make</option>
          {makes.map((make, idx) => (
            <option key={`make-${idx}`} value={make}>
              {make}
            </option>
          ))}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
          <option value="">Select Model</option>
          {models.map((model, idx) => (
            <option key={`model-${idx}`} value={model}>
              {model}
            </option>
          ))}
        </select>

        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">Select Year</option>
          {years.map((year, idx) => (
            <option key={`year-${idx}`} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Results Table */}
      {filteredData.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "2rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
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
            {filteredData.map((car, idx) => (
              <tr
                key={idx}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #ddd",
                  backgroundColor: idx % 2 === 0 ? "#fafafa" : "#fff",
                }}
              >
                <td style={tdStyle}>{car.make}</td>
                <td style={tdStyle}>{car.model}</td>
                <td style={tdStyle}>{car.year}</td>
                <td style={tdStyle}>{car.fuelType}</td>
                <td style={tdStyle}>{car.cityMPG}</td>
                <td style={tdStyle}>{car.highwayMPG}</td>
                <td style={tdStyle}>{car.combinedMPG}</td>
                <td style={tdStyle}>{car.co2Emissions}</td>
                <td style={tdStyle}>{car.cylinders}</td>
                <td style={tdStyle}>{car.displacement}</td>
                <td style={tdStyle}>{car.drive}</td>
                <td style={tdStyle}>{car.range}</td>
                <td style={tdStyle}>{car.trany}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  padding: "10px",
  borderBottom: "2px solid #ccc",
};

const tdStyle = {
  padding: "10px",
};
