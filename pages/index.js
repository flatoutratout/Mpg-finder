import { useState, useEffect } from "react";
import Papa from "papaparse";
import DataTable from "react-data-table-component";
import Image from "next/image";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const BATCH_SIZE = 10;

  const [makeFilter, setMakeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // Load CSV
  useEffect(() => {
    async function loadCSV() {
      const res = await fetch("/vehicles.csv");
      const text = await res.text();
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
      setVehicles(parsed);
    }
    loadCSV();
  }, []);

  // Full columns restored
  const columns = [
    { name: "Make", selector: row => row.make, sortable: true },
    { name: "Model", selector: row => row.model, sortable: true },
    { name: "Year", selector: row => row.year, sortable: true },
    { name: "Transmission", selector: row => row.trany, sortable: true },
    { name: "Cylinders", selector: row => row.cylinders, sortable: true },
    { name: "Displ (L)", selector: row => row.displ, sortable: true },
    { name: "Drive", selector: row => row.drive, sortable: true },
    { name: "City MPG", selector: row => row.city08, sortable: true },
    { name: "Highway MPG", selector: row => row.highway08, sortable: true },
    { name: "Combined MPG", selector: row => row.comb08, sortable: true },
    { name: "CO₂ (g/mi)", selector: row => row.co2, sortable: true },
    { name: "Fuel Type", selector: row => row.fuelType1, sortable: true },
    { name: "Turbocharger", selector: row => row.tCharger ? "Yes" : "No", sortable: true },
    { name: "Supercharger", selector: row => row.sCharger ? "Yes" : "No", sortable: true },
  ];

  // Filtered dataset
  const filteredData = vehicles
    .filter(v => !makeFilter || v.make === makeFilter)
    .filter(v => !modelFilter || v.model === modelFilter)
    .filter(v => !yearFilter || v.year === yearFilter)
    .filter(v => {
      if (!search) return true;
      const lower = search.toLowerCase();
      return (
        v.make?.toLowerCase().includes(lower) ||
        v.model?.toLowerCase().includes(lower) ||
        v.year?.toString().includes(lower)
      );
    });

  const visibleData = filteredData.slice(0, visibleCount);
  const makes = [...new Set(vehicles.map(v => v.make))].sort();
  const models = [...new Set(vehicles.filter(v => !makeFilter || v.make === makeFilter).map(v => v.model))].sort();
  const years = [...new Set(filteredData.map(v => v.year))].sort();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#4169E1" }}>
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-white shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Image src="/logo.png" alt="MPG Finder Logo" width={120} height={50} />
          <h1 className="text-2xl font-bold text-blue-900">MPG Finder</h1>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mt-6 flex flex-wrap gap-4 items-end justify-center p-4">
        <div className="flex flex-col">
          <label>Make</label>
          <select
            value={makeFilter}
            onChange={e => { setMakeFilter(e.target.value); setModelFilter(""); }}
            className="p-2 border rounded"
          >
            <option value="">All Makes</option>
            {makes.map((m,i) => <option key={i} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label>Model</label>
          <select
            value={modelFilter}
            onChange={e => setModelFilter(e.target.value)}
            disabled={models.length === 0}
            className="p-2 border rounded"
          >
            <option value="">All Models</option>
            {models.map((m,i) => <option key={i} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label>Year</label>
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Years</option>
            {years.map((y,i) => <option key={i} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="flex flex-col flex-1 min-w-[200px]">
          <label>Search</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Type make, model, or year..."
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* DataTable */}
      <div className="max-w-7xl mx-auto mt-6 p-4 bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={visibleData}
          pagination={false}
          highlightOnHover
          striped
          responsive
        />
        <p className="text-sm text-gray-700 mt-2">
          Showing {Math.min(visibleCount, filteredData.length)} of {filteredData.length} matching vehicles
        </p>
        {visibleCount < filteredData.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setVisibleCount(prev => prev + BATCH_SIZE)}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-white mt-12">
        <p>© {new Date().getFullYear()} MPG Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}
