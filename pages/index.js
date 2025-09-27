import { useState, useEffect } from "react";
import Papa from "papaparse";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Load and clean CSV data
  useEffect(() => {
    Papa.parse("/vehicles.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleaned = results.data.map((row) => {
          const cleanedRow = {};
          Object.keys(row).forEach((key) => {
            cleanedRow[key.trim()] = row[key]?.trim();
          });
          return cleanedRow;
        });
        setVehicles(cleaned);

        // Debugging info
        console.log("Loaded vehicles:", cleaned.length);
        console.log(
          "Sample makes:",
          [...new Set(cleaned.map((v) => v.make))].slice(0, 20)
        );
      },
    });
  }, []);

  // Dropdown options
  const makes = [...new Set(vehicles.map((v) => v.make))].filter(Boolean);

  const models = [
    ...new Set(
      vehicles
        .filter(
          (v) => v.make?.toLowerCase() === selectedMake.toLowerCase()
        )
        .map((v) => v.model)
    ),
  ].filter(Boolean);

  const years = [
    ...new Set(
      vehicles
        .filter(
          (v) =>
            v.make?.toLowerCase() === selectedMake.toLowerCase() &&
            v.model?.toLowerCase() === selectedModel.toLowerCase()
        )
        .map((v) => v.year)
    ),
  ].filter(Boolean);

  const selectedVehicle = vehicles.find(
    (v) =>
      v.make?.toLowerCase() === selectedMake.toLowerCase() &&
      v.model?.toLowerCase() === selectedModel.toLowerCase() &&
      v.year?.toString() === selectedYear
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>MPG Finder</h1>

      {/* Make dropdown */}
      <div>
        <label>Make: </label>
        <select
          value={selectedMake}
          onChange={(e) => {
            setSelectedMake(e.target.value);
            setSelectedModel("");
            setSelectedYear("");
          }}
        >
          <option value="">Select Make</option>
          {makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </div>

      {/* Model dropdown */}
      {selectedMake && (
        <div>
          <label>Model: </label>
          <select
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setSelectedYear("");
            }}
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Year dropdown */}
      {selectedModel && (
        <div>
          <label>Year: </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display MPG */}
      {selectedVehicle && (
        <div style={{ marginTop: "1rem" }}>
          <h2>
            {selectedVehicle.make} {selectedVehicle.model}{" "}
            {selectedVehicle.year}
          </h2>
          <p>City MPG: {selectedVehicle.city_mpg}</p>
          <p>Highway MPG: {selectedVehicle.highway_mpg}</p>
          <p>Combined MPG: {selectedVehicle.combined_mpg}</p>
        </div>
      )}
    </div>
  );
}
