import { useState, useEffect } from "react";
import Papa from "papaparse";
import path from "path";

// Convert CSV text into JSON rows
function csvToJson(csv) {
  return Papa.parse(csv, { header: true }).data;
}

export default function Home({}) {
  const [vehicles, setVehicles] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch("/vehicles.csv")
      .then((res) => res.text())
      .then((csv) => {
        const rows = csvToJson(csv);
        setVehicles(rows);
      });
  }, []);

  useEffect(() => {
    if (!selectedMake || !selectedModel || !selectedYear) {
      setFiltered([]);
      return;
    }
    const match = vehicles.filter(
      (v) =>
        v.make === selectedMake &&
        v.model === selectedModel &&
        v.year === selectedYear
    );
    setFiltered(match);
  }, [selectedMake, selectedModel, selectedYear, vehicles]);

  const makes = [...new Set(vehicles.map((v) => v.make))].sort();
  const models = [...new Set(vehicles.filter((v) => v.make === selectedMake).map((v) => v.model))].sort();
  const years = [...new Set(vehicles.filter((v) => v.model === selectedModel).map((v) => v.year))].sort();

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">MPG Finder</h1>

      {/* Dropdowns */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedMake}
          onChange={(e) => setSelectedMake(e.target.value)}
          className="p-2 border rounded"
        >
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
          className="p-2 border rounded"
          disabled={!selectedMake}
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
          className="p-2 border rounded"
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

      {/* Vehicle Info */}
      {filtered.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-3 py-2">Make</th>
                <th className="border border-gray-200 px-3 py-2">Model</th>
                <th className="border border-gray-200 px-3 py-2">Year</th>
                <th className="border border-gray-200 px-3 py-2">Fuel</th>
                <th className="border border-gray-200 px-3 py-2">City MPG</th>
                <th className="border border-gray-200 px-3 py-2">Highway MPG</th>
                <th className="border border-gray-200 px-3 py-2">Combined MPG</th>
                <th className="border border-gray-200 px-3 py-2">CO₂</th>
                <th className="border border-gray-200 px-3 py-2">Cylinders</th>
                <th className="border border-gray-200 px-3 py-2">Displacement</th>
                <th className="border border-gray-200 px-3 py-2">Drive</th>
                <th className="border border-gray-200 px-3 py-2">Range</th>
                <th className="border border-gray-200 px-3 py-2">Transmission</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">{v.make}</td>
                  <td className="border border-gray-200 px-3 py-2">{v.model}</td>
                  <td className="border border-gray-200 px-3 py-2">{v.year}</td>
                  <td className="border border-gray-200 px-3 py-2">{v.fuelType}</td>
                  <td className="border border-gray-200 px-3 py-2">{v.cityMPG}</td>
                  <td className="border border-gray-200 px-3 py-2">{v.highwayMPG}</td>
                  <td className="border border-gray-200 px-3 py-2">{v.combinedMPG}</td>
                  <td className="border border-gray-200 px-3 py-2">{v.co2Emissions}</td>
                  <td className="border border-gray-200 px-3 py-2">{v.cylinders}</td>
                  <td className="border border-gray-200 px-3 py-2">{v.displacement}</td>
                  <td className="border border-gray-200 px-3 py-2">{v.drive}</td>
                  <td className="border border-gray-200 px-3 py-2">{v.range}</td>
                  <td className="border border-gray-200 px-3 py-2">{v.trany}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
