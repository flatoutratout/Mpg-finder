import { useState } from "react";
import DataTable from "react-data-table-component";
import Papa from "papaparse";

export default function Home({ vehicles }) {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const makes = [...new Set(vehicles.map((v) => v.make))].sort();
  const models = [...new Set(vehicles.filter((v) => v.make === selectedMake).map((v) => v.model))].sort();
  const years = [...new Set(vehicles.filter((v) => v.model === selectedModel).map((v) => v.year))].sort();

  const filtered = vehicles.filter(
    (v) =>
      (!selectedMake || v.make === selectedMake) &&
      (!selectedModel || v.model === selectedModel) &&
      (!selectedYear || v.year === selectedYear)
  );

  const columns = [
    { name: "Make", selector: (row) => row.make, sortable: true },
    { name: "Model", selector: (row) => row.model, sortable: true },
    { name: "Year", selector: (row) => row.year, sortable: true },
    { name: "Fuel", selector: (row) => row.fuelType },
    { name: "City MPG", selector: (row) => row.cityMPG },
    { name: "Highway MPG", selector: (row) => row.highwayMPG },
    { name: "Combined MPG", selector: (row) => row.combinedMPG },
    { name: "CO₂ Emissions", selector: (row) => row.co2Emissions },
    { name: "Cylinders", selector: (row) => row.cylinders },
    { name: "Displacement", selector: (row) => row.displacement },
    { name: "Drive", selector: (row) => row.drive },
    { name: "Range", selector: (row) => row.range },
    { name: "Transmission", selector: (row) => row.trany },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">MPG Finder</h1>

      <div className="flex gap-4 mb-8">
        <select
          value={selectedMake}
          onChange={(e) => {
            setSelectedMake(e.target.value);
            setSelectedModel("");
            setSelectedYear("");
          }}
          className="border p-2 rounded"
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
          onChange={(e) => {
            setSelectedModel(e.target.value);
            setSelectedYear("");
          }}
          className="border p-2 rounded"
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
          className="border p-2 rounded"
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full max-w-6xl bg-white shadow rounded-lg p-6">
        <DataTable columns={columns} data={filtered} pagination highlightOnHover striped />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  // Load CSV from public folder
  const res = await fetch("http://localhost:3000/vehicles.csv");
  const csv = await res.text();

  const parsed = Papa.parse(csv, { header: true }).data;

  // Clean & normalize data to avoid undefined
  const vehicles = parsed
    .filter((row) => row.make && row.model && row.year) // skip empty rows
    .map((row) => ({
      make: row.make || null,
      model: row.model || null,
      year: row.year || null,
      fuelType: row.fuelType || null,
      cityMPG: row.city08 || row.cityA08 || null,
      highwayMPG: row.highway08 || row.highwayA08 || null,
      combinedMPG: row.comb08 || row.combA08 || null,
      co2Emissions: row.co2 || null,
      cylinders: row.cylinders || null,
      displacement: row.displ || null,
      drive: row.drive || null,
      range: row.range || null,
      trany: row.trany || null,
    }));

  return { props: { vehicles } };
}
