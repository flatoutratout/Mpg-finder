import { useState, useEffect } from "react";
import Papa from "papaparse";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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

  // Unique dropdown values
  const makes = [...new Set(vehicles.map((v) => v.make))].filter(Boolean);
  const models = [
    ...new Set(
      vehicles.filter((v) => v.make === selectedMake).map((v) => v.model)
    ),
  ].filter(Boolean);
  const years = [
    ...new Set(
      vehicles
        .filter((v) => v.make === selectedMake && v.model === selectedModel)
        .map((v) => v.year)
    ),
  ].filter(Boolean);

  // Handle selection
  useEffect(() => {
    if (selectedMake && selectedModel && selectedYear) {
      const match = vehicles.find(
        (v) =>
          v.make === selectedMake &&
          v.model === selectedModel &&
          v.year === selectedYear
      );
      setSelectedVehicle(match || null);
    } else {
      setSelectedVehicle(null);
    }
  }, [selectedMake, selectedModel, selectedYear, vehicles]);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>MPG Finder</h1>

      {/* Make dropdown */}
      <label htmlFor="make">Make: </label>
      <select
        id="make"
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
      <label htmlFor="model" style={{ marginLeft: "1rem" }}>
        Model:{" "}
      </label>
      <select
        id="model"
        value={selectedModel}
        onChange={(e) => {
          setSelectedModel(e.target.value);
          setSelectedYear("");
        }}
        disabled={!selectedMake}
      >
        <option value="">Select Model</option>
        {models.map((model, idx) => (
          <option key={idx} value={model}>
            {model}
          </option>
        ))}
      </select>

      {/* Year dropdown */}
      <label htmlFor="year" style={{ marginLeft: "1rem" }}>
        Year:{" "}
      </label>
      <select
        id="year"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        disabled={!selectedModel}
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
        <div style={{ marginTop: "2rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
          <h2>
            {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
          </h2>
          <p><strong>Displacement:</strong> {selectedVehicle.displ}</p>
          <p><strong>Cylinders:</strong> {selectedVehicle.cylinders}</p>
          <p><strong>Transmission:</strong> {selectedVehicle.trany}</p>
          <p><strong>Fuel Type:</strong> {selectedVehicle.fuelType}</p>
          <p><strong>City MPG:</strong> {selectedVehicle.city08}</p>
          <p><strong>Highway MPG:</strong> {selectedVehicle.highway08}</p>
          <p><strong>Combined MPG:</strong> {selectedVehicle.comb08}</p>
        </div>
      )}
    </div>
  );
}
