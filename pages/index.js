import { useState, useEffect } from "react";
import Papa from "papaparse";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    Papa.parse("/vehicles.csv", {
      download: true,
      header: true,
      complete: (results) => {
        // Normalize keys to lowercase
        const normalized = results.data.map((row) => {
          const obj = {};
          Object.keys(row).forEach((key) => {
            obj[key.trim().toLowerCase()] = row[key]?.trim();
          });
          return obj;
        });
        setVehicles(normalized);
      },
    });
  }, []);

  // Dropdown values
  const makes = [...new Set(vehicles.map((v) => v.make))].filter(Boolean).sort();
  const models = [
    ...new Set(vehicles.filter((v) => v.make === selectedMake).map((v) => v.model)),
  ].filter(Boolean).sort();
  const years = [
    ...new Set(
      vehicles
        .filter((v) => v.make === selectedMake && v.model === selectedModel)
        .map((v) => v.year)
    ),
  ].filter(Boolean).sort((a, b) => b - a);

  // Selected vehicle(s)
  const selectedVehicle = vehicles.find(
    (v) =>
      v.make === selectedMake &&
      v.model === selectedModel &&
      v.year === selectedYear
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* Make dropdown */}
      <select
        value={selectedMake}
        onChange={(e) => {
          setSelectedMake(e.target.value);
          setSelectedModel("");
          setSelectedYear("");
        }}
      >
        <option value="">Select Make</option>
        {makes.map((make, idx) => (
          <option key={idx} value={make}>
            {make}
          </option>
        ))}
      </select>

      {/* Model dropdown */}
      <select
        value={selectedModel}
        onChange={(e) => {
          setSelectedModel(e.target.value);
          setSelectedYear("");
        }}
      >
        <option value="">Select Model</option>
        {models.map((model, idx) => (
          <option key={idx} value={model}>
            {model}
          </option>
        ))}
      </select>

      {/* Year dropdown */}
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        <option value="">Select Year</option>
        {years.map((year, idx) => (
          <option key={idx} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* Vehicle details */}
      {selectedVehicle && (
        <div style={{ marginTop: "30px" }}>
          <h2>
            {selectedVehicle.year} {selectedVehicle.make}{" "}
            {selectedVehicle.model}
          </h2>
          <table border="1" cellPadding="8" style={{ marginTop: "10px" }}>
            <tbody>
              {Object.entries(selectedVehicle).map(([key, value]) => (
                <tr key={key}>
                  <td style={{ fontWeight: "bold", textTransform: "capitalize" }}>
                    {key}
                  </td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
