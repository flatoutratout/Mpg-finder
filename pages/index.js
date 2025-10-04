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
    { name: "City MPG", selector: row => row.city08, sortable: true },
    { name: "Highway MPG", selector: row => row.highway08, sortable: true },
    { name: "Combined MPG", selector: row => row.comb08, sortable: true },
  ];

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

  return (
    <div className="max-w-7xl mx-auto mt-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center items-end">
        <div className="flex flex-col">
          <label>Make</label>
          <select value={makeFilter} onChange={e => { setMakeFilter(e.target.value); setModelFilter(""); }}>
            <option value="">All Makes</option>
            {makes.map((m,i) => <option key={i} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label>Model</label>
          <select value={modelFilter} onChange={e => setModelFilter(e.target.value)} disabled={models.length===0}>
            <option value="">All Models</option>
            {models.map((m,i) => <option key={i} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label>Year</label>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            <option value="">All Years</option>
            {years.map((y,i) => <option key={i} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label>Search</label>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={visibleData}
        pagination={false}
        highlightOnHover
        striped
        responsive
      />

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
  );
}
