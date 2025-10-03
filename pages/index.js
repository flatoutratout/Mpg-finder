import { useState, useEffect } from "react";
import Papa from "papaparse";
import DataTable from "react-data-table-component";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const BATCH_SIZE = 10;

  const [makeFilter, setMakeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    async function loadCSV() {
      const res = await fetch("/vehicles.csv");
      const text = await res.text();
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
      setVehicles(parsed);
    }
    loadCSV();
  }, []);

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
    { name: "Turbocharger", selector: row => (row.tCharger ? "Yes" : "No"), sortable: true },
    { name: "Supercharger", selector: row => (row.sCharger ? "Yes" : "No"), sortable: true },
  ];

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* Intro */}
      <section className="max-w-7xl mx-auto mt-6 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Welcome to MPG Finder</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Compare fuel efficiency, CO₂ emissions, and performance data for thousands of vehicles. Use the filters to find cars that match your needs and see how they perform in city and highway conditions.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Perfect for eco-conscious drivers, automotive enthusiasts, or anyone looking to make informed decisions about fuel efficiency and environmental impact.
        </p>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mt-6 flex flex-wrap gap-4 items-center justify-center p-4">
        {/* Make */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 dark:text-gray-300">Make</label>
          <select
            value={makeFilter}
            onChange={e => { setMakeFilter(e.target.value); setModelFilter(""); }}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Makes</option>
            {makes.map((make, idx) => <option key={idx} value={make}>{make}</option>)}
          </select>
        </div>

        {/* Model */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 dark:text-gray-300">Model</label>
          <select
            value={modelFilter}
            onChange={e => setModelFilter(e.target.value)}
            disabled={models.length === 0}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Models</option>
            {models.map((model, idx) => <option key={idx} value={model}>{model}</option>)}
          </select>
        </div>

        {/* Year */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 dark:text-gray-300">Year</label>
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Years</option>
            {years.map((year, idx) => <option key={idx} value={year}>{year}</option>)}
          </select>
        </div>

        {/* Search */}
        <div className="flex flex-col flex-1 min-w-[200px]">
          <label className="mb-1 text-gray-700 dark:text-gray-300">Search</label>
          <input
            type="text"
            placeholder="Type make, model, or year..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* DataTable */}
      <main className="max-w-7xl mx-auto mt-6 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
        <DataTable
          columns={columns}
          data={visibleData}
          pagination={false}
          highlightOnHover
          striped
          responsive
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Showing {Math.min(visibleCount, filteredData.length)} of {filteredData.length} matching vehicles
        </p>
        {visibleCount < filteredData.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setVisibleCount(prev => prev + BATCH_SIZE)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Load More
            </button>
          </div>
        )}
      </main>

      {/* Closing Content */}
      <section className="max-w-7xl mx-auto mt-6 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Why Fuel Efficiency Matters</h3>
        <p className="text-gray-700 dark:text-gray-300">
          Choosing vehicles with higher MPG reduces fuel costs and environmental impact.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          Explore different makes and models to find the best combination of performance, comfort, and efficiency.
        </p>
      </section>

    </div>
  );
}
