import { useState, useEffect } from "react";
import Papa from "papaparse";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

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

  // Get unique dropdown values
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

  return (
    <div>
      {/* Make dropdown */}
      <select
        value={selectedMake}
        onChange={(e) => setSelectedMake(e.target.value)}
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
        onChange={(e) => setSelectedModel(e.target.value)}
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
    </div>
  );
}
