import { useEffect, useState } from "react";
import Papa from "papaparse";
import DataTable from "react-data-table-component";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [search, setSearch] = useState("");

  // Load CSV client-side
  useEffect(() => {
    async function loadCSV() {
      const response = await fetch("/vehicles.csv");
      const text = await response.text();
      const parsed = Papa.parse(text, { header: true }).data;

      // Normalize field names
      const mapped = parsed.map((row) => ({
        make: row.make || "",
        model: row.model || "",
        year: row.year || "",
        fuelType: row.fuelType || row.fuel || "",
        cityMPG: row.city08 || row.city_mpg || row.cityMPG || "",
        highwayMPG: row.highway08 || row.highway_mpg || row.highwayMPG || "",
        combinedMPG: row.comb08 || row.combined_mpg || row.combinedMPG || "",
        co2Emissions: row.co2 || row.co2Emissions || "",
        cylinders: row.cylinders || "",
        displacement: row.displ || row.displacement || "",
        drive: row.drive || "",
        range: row.range || "",
        trany: row.trany || row.transmission || "",
      }));

      setVehicles(mapped);
      setFilteredVehicles(mapped);
    }
    loadCSV();
  }, []);

  // Dropdown options
  const makes = [...new Set(vehicles.map((v) => v.make))].sort();
  const models = [...new Set(vehicles.filter((v) => v.make === make).map((v) => v.model))].sort();
  const years = [...new Set(vehicles.filter((v) => v.model === model).map((v) => v.year))].sort();

  // Filters
  useEffect(() => {
    let results = vehicles;

    if (make) results = results.filter((v) => v.make === make);
    if (model) results = results.filter((v) => v.model === model);
    if (year) results = results.filter((v) => v.year === year);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (v) =>
          v.make?.toLowerCase().includes(q) ||
          v.model?.toLowerCase().includes(q) ||
          v.year?.toString().includes(q)
      );
    }

    setFilteredVehicles(results);
  }, [make, model, year, search, vehicles]);

  // Table columns
  const columns = [
    { name: "Make", selector: (row) => row.make, sortable: true },
    { name: "Model", selector: (row) => row.model, sortable: true },
    { name: "Year", selector: (row) => row.year, sortable: true },
    { name: "Fuel Type", selector: (row) => row.fuelType },
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
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>MPG Finder</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <select value={make} onChange={(e) => setMake(e.target.value)}>
          <option value="">All Makes</option>
          {makes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
          <option value="">All Models</option>
          {models.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} disabled={!model}>
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search make, model, year..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredVehicles}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
}
