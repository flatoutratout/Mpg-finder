// components/VehicleTable.js
export default function VehicleTable({ vehicle }) {
  if (!vehicle) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Vehicle Details
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <tbody className="bg-white divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Make</td>
              <td className="px-4 py-2">{vehicle.Make}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Model</td>
              <td className="px-4 py-2">{vehicle.Model}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Year</td>
              <td className="px-4 py-2">{vehicle.Year}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Transmission</td>
              <td className="px-4 py-2">{vehicle.Trany}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Fuel Type</td>
              <td className="px-4 py-2">{vehicle.Fuel}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Cylinders</td>
              <td className="px-4 py-2">{vehicle.Cylinders}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">Drive</td>
              <td className="px-4 py-2">{vehicle.Drive}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">MPG (City)</td>
              <td className="px-4 py-2">{vehicle.CityMPG}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">MPG (Highway)</td>
              <td className="px-4 py-2">{vehicle.HwyMPG}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-700 bg-gray-50">MPG (Combined)</td>
              <td className="px-4 py-2">{vehicle.CombMPG}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
