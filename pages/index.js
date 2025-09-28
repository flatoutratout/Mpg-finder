import { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import DataTable from "react-data-table-component";
import Image from "next/image";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(200);
  const BATCH_SIZE = 200;

  // Filters
  const [makeFilter, setMakeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // Built-in debounce for search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Load CSV and generate columns
  useEffect(() => {
    async function loadCSV() {
      const res = await fetch("/vehicles.csv");
      const text = await res.text();
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
      setVehicles(parsed);

      if (parsed.length > 0) {
        const allKeys = Object.keys(parsed[0]);
        const priority = ["Make", "Model", "Year"];
        const sortedKeys = [
          ...priority.filter((k) => allKeys.includes(k)),
          ...allKeys.filter((k) => !priority.includes(k)).sort(),
        ];

        const csvColumns = sortedKeys.map((key) => ({
          name: key,
          selector: (row) => row[key],
          cell: (row) => highlightText(row[key], debouncedSearch),
          sortable: true,
        }));

        setColumns(csvColumns);
      }
    }
    loadCSV();
  }, [debouncedSearch]);

  // Highlight search matches
  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text?.toString().split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-200">{part}</mark> : part
    );
  }

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return vehicles
      .filter((v) => (!makeFilter || v["Make"]?.trim() === makeFilter))
      .filter((v) => (!modelFilter || v["Model"]?.trim() === modelFilter))
      .filter((v) => (!yearFilter || v["Year"]?.toString() === yearFilter))
      .filter((v) => {
        if (!debouncedSearch) return true;
        const lower = debouncedSearch.toLowerCase();
        return (
          v["Make"]?.toLowerCase().includes(lower) ||
          v["Model"]?.toLowerCase().includes(lower) ||
          v["Year"]?.toString().includes(lower)
        );
      });
  }, [vehicles, makeFilter, modelFilter, yearFilter, debouncedSearch]);

  const visibleData = filteredData.slice(0, visibleCount);

  // Dynamic dropdown options
  const makes = useMemo(() => [...new Set(vehicles.map((v) => v["Make"]?.trim()))].sort(), [vehicles]);
  const models = useMemo(() => [...new Set(vehicles.filter((v) => !makeFilter || v["Make"]?.trim() === makeFilter).map((v) => v["Model"]?.trim()))].sort(), [vehicles, makeFilter]);
  const years = useMemo(() => [...new Set(filteredData.map((v) => v["Year"]))].sort(), [filteredData]);

  const handleLoadMore = () => setVisibleCount((prev) => prev + BATCH_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-white to-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-center p-6 shadow-md bg-white">
        <div className="flex items-center space-x-4">
          <Image src="/logo.png" alt="MPG Finder Logo" width={70} height={70} />
          <h1 className="text-4xl font-extrabold text-gray-800">MPG Finder</h1>
        </div>
      </header>

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

        {/* Typeahead Search */}
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
          Showing {visibleData.length} of {filteredData.length} matching vehicles
        </p>

        {visibleData.length < filteredData.length && (
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
    </div>
  );
}
