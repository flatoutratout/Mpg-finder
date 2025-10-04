import { useState, useEffect } from "react";
import Papa from "papaparse";
import DataTable from "react-data-table-component";
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const BATCH_SIZE = 10;

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

  // Columns
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
    .filter((v) => (!makeFilter || v.make === makeFilter))
    .filter((v) => (!modelFilter || v.model === modelFilter))
    .filter((v) => (!yearFilter || v.year === yearFilter))
    .filter((v) => {
      if (!search) return true;
      const lower = search.toLowerCase();
      return (
        v.make?.toLowerCase().includes(lower) ||
        v.model?.toLowerCase().includes(lower) ||
        v.year?.toString().includes(lower)
      );
    });

  const visibleData = filteredData.slice(0, visibleCount);

  const makes = [...new Set(vehicles.map((v) => v.make))].sort();
  const models = [...new Set(vehicles.filter((v) => !makeFilter || v.make === makeFilter).map((v) => v.model))].sort();
  const years = [...new Set(filteredData.map((v) => v.year))].sort();

  const handleLoadMore = () => setVisibleCount((prev) => prev + BATCH_SIZE);

  // JSON-LD sitemap (ItemList)
  const siteUrl = "https://www.mpgfinder.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": vehicles.map((v, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `${siteUrl}/cars/${makeSlug(v)}`,
      "name": `${v.make} ${v.model} (${v.year})`
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <Head>
        <title>MPG Finder – Compare Fuel Efficiency & CO₂</title>
        <meta name="description" content="Find and compare MPG, CO₂ emissions, and fuel efficiency data for thousands of vehicles. Search by make, model, and year." />
        <meta name="keywords" content="MPG, fuel efficiency, CO2, car comparison, vehicle emissions, gas mileage" />
        <link rel="canonical" href={siteUrl} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-center p-6 shadow-md bg-white">
        <div className="flex items-center space-x-4">
          <Image src="/logo.png" alt="MPG Finder Logo" width={300} height={300} />
          <h1 className="text-4xl font-extrabold text-gray-800">MPG Finder</h1>
        </div>
      </header>

      {/* Intro Content */}
      <section className="max-w-7xl mx-auto mt-6 p-6 bg-white shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Welcome to MPG Finder</h2>
        <p className="mb-4">
          Compare fuel efficiency, CO₂ emissions, and performance data for thousands of vehicles. Use the filters to find cars that match your needs.
        </p>
      </section>

      {/* Filters */}
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
          columns={columns}
          data={visibleData}
          pagination={false}
          highlightOnHover
          striped
          responsive
          dense={false}
        />
        <p className="text-sm text-gray-500 mt-2">
          Showing {Math.min(visibleCount, filteredData.length)} of {filteredData.length} matching vehicles
        </p>
        {visibleCount < filteredData.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Load More
            </button>
          </div>
        )}
      </main>

      {/* Closing Content */}
      <section className="max-w-7xl mx-auto mt-6 p-6 bg-white shadow-xl rounded-xl">
        <h3 className="text-xl font-bold mb-2">Why Fuel Efficiency Matters</h3>
        <p>
          Choosing vehicles with higher MPG reduces fuel costs and environmental impact. MPG Finder helps you make informed decisions by comparing multiple models quickly and easily.
        </p>
      </section>
    </div>
  );
}

function makeSlug(v) {
  return `${v.make?.toLowerCase().replace(/\s+/g,'-')}-${v.model?.toLowerCase().replace(/\s+/g,'-')}-${v.year}`;
}
