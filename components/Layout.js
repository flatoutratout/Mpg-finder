// components/VehicleTable.js
export default function VehicleTable({ vehicle }) {
  if (!vehicle) return null;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {vehicle.Make} {vehicle.Model} ({vehicle.Year})
      </h2>
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full bg-white">
          <tbody>
            {Object.entries(vehicle).map(([key, value], index) => (
              <tr
                key={key}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-indigo-50 transition`}
              >
                <td className="px-4 py-3 font-semibold text-gray-700 capitalize border-r border-gray-200 w-1/3">
                  {key.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-3 text-gray-600">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
