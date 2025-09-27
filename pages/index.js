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

  useEffect(() => {
    Papa.parse("/vehicles.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const rows = results.data.filter((row) => row.make && row.model && row.year);
        setVehicles(rows);

        const uniqueMakes = [...new Set(rows.map((v) => v.make))].sort();
        setMakes(uniqueMakes);
      },
    });
  }, []);

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

  useEffect(() => {
    if (selectedModel) {
      const uniqueYears = [
        ...new Set(
          vehicles
            .filter((v) => v.make === selectedMake && v.model === selectedModel)
            .map((v) => v.year)
        ),
      ].sort((a, b) => b - a);
      setYears(uniqueYears);
      setSelectedYear("");
      setSelectedVehicle(null);
    }
  }, [selectedModel, selectedMake, vehicles]);

  useEffect(() => {
    if (selectedYear) {
      const vehicle = vehicles.find(
        (v) => v.make === selectedMake && v.model === selectedModel && v.year === selectedYear
      );
      setSelectedVehicle(vehicle || null);
    }
  }, [selectedYear, selectedMake, selectedModel, vehicles]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🚗 MPG Finder
        </h1>

        {/* Dropdowns */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
          <select
            className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
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

          <select
            className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
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

          <select
            className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
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
          <div className="bg-gray-50 border rounded-xl shadow-inner p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedVehicle).map(([key, value]) => (
                <div
                  key={key}
                  className="p-3 bg-white rounded-lg shadow-sm border"
                >
                  <p className="text-sm text-gray-500 uppercase">{key}</p>
                  <p className="text-lg font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
