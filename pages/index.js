import { useState, useEffect } from "react";
import Papa from "papaparse";
import DataTable from "react-data-table-component";
import Image from "next/image";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(200);
  const BATCH_SIZE = 200;

  // Filters
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

  // Filtered dataset
  const filteredData = vehicles
    .filter((v) => (!makeFilter || v["Make"] === makeFilter))
    .filter((v) => (!modelFilter || v["Model"] === modelFilter))
    .filter((v) => (!yearFilter || v["Year"] === yearFilter))
    .filter((v) => {
      if (!search) return true;
      const lower = search.toLowerCase();
      return (
        v["Make"]?.toLowerCase().includes(lower) ||
        v["Model"]?.toLowerCase().includes(lower) ||
        v["Year"]?.toString().includes(lower)
      );
    });

  const visibleData = filteredData.slice(0, visibleCount);

  const makes = [...new Set(vehicles.map((v) => v["Make"]))].sort();
  const models = [...new Set(vehicles.filter((v) => !makeFilter || v["Make"] === makeFilter).map((v) => v["Model"]))].sort();
  const years = [...new Set(filteredData.map((v) => v["Year"]))].sort();

  const handleLoadMore = () => setVisibleCount((prev) => prev + BATCH_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-white to-gray-200">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-center p-6 shadow-md bg-white">
        <div className="flex items-center space-x-4">
          <Image src="/logo.png" alt="MPG Finder Logo" width={350} height={350} />
          <h1 className="text-4xl font-extrabold text-gray-800">MPG Finder</h1>
        </div>
      </header>

      {/* Intro Content for AdSense */}
      <section className="max-w-7xl mx-auto mt-6 p-6 bg-white shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Welcome to MPG Finder</h2>
        <p className="mb-4">
          Compare fuel efficiency, CO₂ emissions, and performance data for thousands of vehicles. Use the filters to find cars that match your needs and see how they perform in city and highway conditions.
        </p>
        <p className="mb-4">
          This tool is perfect for eco-conscious drivers, automotive enthusiasts, or anyone looking to make informed decisions about fuel efficiency and environmental impact.
        </p>
      </section>

      {/* Filters + Search */}
      <div className="max-w-7xl mx-auto mt-6 flex flex-wrap gap-4 items-center justify-center p-4">
        {/* Make Filter */}
        <div className="flex flex-col">
          <label htmlFor="makeFilter" className="text-gray-700 mb-1">Make</label>
          <select
            id="makeFilter"
            name="makeFilter"
            value={makeFilter}
            onChange={(e) => {
              setMakeFilter(e.target.value);
              setModelFilter(""); 
            }}
            className="p-2 border border-gray-300 rounded-lg shadow-sm"
          >
            <option value="">All Makes</option>
            {makes.map((make, idx) => (
              <option key={`make-${idx}`} value={make}>{make}</option>
            ))}
          </select>
        </div>

        {/* Model Filter */}
        <div className="flex flex-col">
          <label htmlFor="modelFilter" className="text-gray-700 mb-1">Model</label>
          <select
            id="modelFilter"
            name="modelFilter"
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            disabled={models.length === 0}
            className="p-2 border border-gray-300 rounded-lg shadow-sm"
          >
            <option value="">All Models</option>
            {models.map((model, idx) => (
              <option key={`model-${idx}`} value={model}>{model}</option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="flex flex-col">
          <label htmlFor="yearFilter" className="text-gray-700 mb-1">Year</label>
          <select
            id="yearFilter"
            name="yearFilter"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm"
          >
            <option value="">All Years</option>
            {years.map((year, idx) => (
              <option key={`year-${idx}`} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex flex-col flex-1 min-w-[200px]">
          <label htmlFor="searchInput" className="text-gray-700 mb-1">Search</label>
          <input
            type="text"
            id="searchInput"
            name="search"
            placeholder="Type make, model, or year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Data Table */}
      <main className="max-w-7xl mx-auto mt-6 p-6 bg-white shadow-xl rounded-xl">
        <DataTable
          columns={vehicles.length > 0 ? Object.keys(vehicles[0]).map(key => ({ name: key, selector: row => row[key], sortable: true })) : []}
          data={vehicles.slice(0, visibleCount)}
          pagination={false}
          highlightOnHover
          striped
          responsive
          dense={false}
        />
        <p className="text-sm text-gray-500 mt-2">
          Showing {Math.min(visibleCount, vehicles.length)} of {vehicles.length} matching vehicles
        </p>
        {visibleCount < vehicles.length && (
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

      {/* Closing Content for AdSense */}
      <section className="max-w-7xl mx-auto mt-6 p-6 bg-white shadow-xl rounded-xl">
        <h3 className="text-xl font-bold mb-2">Why Fuel Efficiency Matters</h3>
        <p>
          Choosing vehicles with higher MPG reduces fuel costs and environmental impact. MPG Finder helps you make informed decisions by comparing multiple models quickly and easily.
        </p>
        <p className="mt-2">
          Explore different makes and models to find the best combination of performance, comfort, and efficiency for your lifestyle.
        </p>
      </section>

    </div>
  );
}
