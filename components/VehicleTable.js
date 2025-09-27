import React, { useState, useMemo } from 'react';
import Link from 'next/link';

function downloadCSV(rows, filename = 'mpg-export.csv') {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(',')]
    .concat(rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(',')))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function VehicleTable({ vehicles }) {
  const [sortBy, setSortBy] = useState({ key: 'mpg', dir: 'desc' });
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const toggleSort = (key) => {
    setSortBy(s => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }));
    setPage(1);
  };

  const sorted = useMemo(() => {
    const out = [...vehicles];
    out.sort((a,b) => {
      let av = a[sortBy.key] ?? 0;
      let bv = b[sortBy.key] ?? 0;
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortBy.dir === 'asc' ? -1 : 1;
      if (av > bv) return sortBy.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return out;
  }, [vehicles, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-gray-600">Showing {vehicles.length} results</div>
        <div className="flex gap-2">
          <button className="px-3 py-2 border rounded" onClick={() => downloadCSV(sorted, 'mpg-full-export.csv')}>Export CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-sm text-gray-700 border-b">
              <th className="p-2">#</th>
              <th className="p-2 cursor-pointer" onClick={() => toggleSort('make')}>Make {sortBy.key === 'make' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
              <th className="p-2 cursor-pointer" onClick={() => toggleSort('model')}>Model {sortBy.key === 'model' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
              <th className="p-2 cursor-pointer" onClick={() => toggleSort('year')}>Year {sortBy.key === 'year' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
              <th className="p-2">Fuel</th>
              <th className="p-2 cursor-pointer" onClick={() => toggleSort('mpg')}>MPG {sortBy.key === 'mpg' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
              <th className="p-2 cursor-pointer" onClick={() => toggleSort('co2')}>CO₂ g/km {sortBy.key === 'co2' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
              <th className="p-2">Range (miles)</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, idx) => (
              <tr key={`${row.make}-${row.model}-${row.year}-${idx}`} className="border-b hover:bg-gray-50">
                <td className="p-2 align-top">{(page - 1) * pageSize + idx + 1}</td>
                <td className="p-2 align-top">{row.make}</td>
                <td className="p-2 align-top">
                  <Link href={`/cars/${encodeURIComponent((row.make + '-' + row.model + '-' + row.year).toLowerCase().replace(/\s+/g,'-'))}`}>
                    <a className="text-blue-600 hover:underline">{row.model}</a>
                  </Link>
                </td>
                <td className="p-2 align-top">{row.year}</td>
                <td className="p-2 align-top">{row.fuel}</td>
                <td className="p-2 align-top">{row.mpg ?? '—'}</td>
                <td className="p-2 align-top">{row.co2 ?? '—'}</td>
                <td className="p-2 align-top">{row.range_miles ?? '—'}</td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">No results</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Page {page} / {totalPages}</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          <button className="px-3 py-1 border rounded" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}
