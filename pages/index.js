import { useState, useEffect } from "react";
import Papa from "papaparse";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Step 1: Load CSV once, but only keep lightweight dropdown data
  useEffect(() => {
    Papa.parse("/vehicles.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const rows = results.data.filter((row) => row.make && row.model && row.year);
        setVehicles(rows);

        // Unique makes
        const uniqueMakes = [...new Set(rows.map((v) => v.make))].sort();
        setMakes(uniqueMakes);
      },
    });
  }, []);

  // Step 2: Update models when make changes
  useEffect(() => {
    if (selectedMake) {
      const uniqueModels = [
        ...new Set(vehicles.filter((v) => v.make === selectedMake).map((v) => v.model)),
      ].sort();
      setModels(uniqueModels);
      setSelectedModel("");
      setSelectedYear("");
      setYears([]);
      setSelectedVehicle(null);
    }
  }, [selectedMake, vehicles]);

  // Step 3: Update years when model changes
  useEffect(() => {
    if (selectedModel) {
      const uniqueYears = [
        ...new Set(
          vehicles
            .filter((v) => v.make === selectedMake && v.model === selectedModel)
            .map((v) => v.year)
        ),
      ].sort((a, b) => b - a); // newest first
      setYears(uniqueYears);
      setSelectedYear("");
      setSelectedVehicle(null);
    }
  }, [selectedModel, selectedMake, vehicles]);

  // Step 4: Select vehicle details when year chosen
  useEffect(() => {
    if (selectedYear) {
      const vehicle = vehicles.find(
        (v) => v.make === selectedMake && v.model === selectedModel && v.year === selectedYear
      );
      setSelectedVehicle(vehicle || null);
    }
  }, [selectedYear, selectedMake, selectedModel, vehicles]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">MPG Finder</h1>

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        {/* Make dropdown */}
        <select
          className="p-2 border rounded"
          value={selectedMake}
          onChange={(e) => setSelectedMake(e.target.value)}
        >
          <option value="">Select Make</option>
          {makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>

        {/* Model dropdown */}
        <select
          className="p-2 border rounded"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={!selectedMake}
        >
          <option value="">Select Model</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        {/* Year dropdown */}
        <select
          className="p-2 border rounded"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          disabled={!selectedModel}
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Vehicle details */}
      {selectedVehicle && (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
          </h2>
          <table className="table-auto w-full border-collapse border">
            <tbody>
              {Object.entries(selectedVehicle).map(([key, value]) => (
                <tr key={key} className="border">
                  <td className="p-2 font-medium bg-gray-100 border">{key}</td>
                  <td className="p-2 border">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
