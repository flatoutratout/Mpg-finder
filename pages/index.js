import { useState } from "react";
import fs from "fs";
import path from "path";
import VehicleTable from "../components/VehicleTable";

function csvToJson(csv) {
  const lines = csv.split("\n").filter(line => line.trim() !== "");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    return headers.reduce((obj, header, i) => {
      obj[header.trim()] = values[i] ? values[i].trim() : "";
      return obj;
    }, {});
  });
}

export default function Home({ vehicles }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const makes = [...new Set(vehicles.map(v => v.Make))];
  const models = [...new Set(vehicles.filter(v => v.Make === make).map(v => v.Model))];
  const years = [...new Set(vehicles.filter(v => v.Make === make && v.Model === model).map(v => v.Year))];

  const selectedVehicle = vehicles.find(
    v => v.Make === make && v.Model === model && v.Year === year
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">MPG Finder</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <select
          className="p-3 border rounded-lg"
          value={make}
          onChange={e => {
            setMake(e.target.value);
            setModel("");
            setYear("");
          }}
        >
          <option value="">Select Make</option>
          {makes.map(m => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          className="p-3 border rounded-lg"
          value={model}
          onChange={e => {
            setModel(e.target.value);
            setYear("");
          }}
          disabled={!make}
        >
          <option value="">Select Model</option>
          {models.map(m => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          className="p-3 border rounded-lg"
          value={year}
          onChange={e => setYear(e.target.value)}
          disabled={!model}
        >
          <option value="">Select Year</option>
          {years.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {selectedVehicle && <VehicleTable vehicle={selectedVehicle} />}
    </div>
  );
}

export async function getStaticProps() {
  const file = path.join(process.cwd(), "public", "vehicles.csv");
  const csv = fs.readFileSync(file, "utf8");
  const rows = csvToJson(csv);
  return { props: { vehicles: rows } };
}
