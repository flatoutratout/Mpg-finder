// components/VehicleTable.js
export default function VehicleTable({ vehicle }) {
  if (!vehicle) return null;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">
        {vehicle.Make} {vehicle.Model} ({vehicle.Year})
      </h2>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <tbody>
            {Object.entries(vehicle).map(([key, value]) => (
              <tr key={key} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-semibold text-gray-700 capitalize">
                  {key.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-2 text-gray-600">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
