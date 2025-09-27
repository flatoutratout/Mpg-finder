import { useState } from 'react';
export default function Admin() {
  const [file, setFile] = useState(null);
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');
  async function upload(e) {
    e.preventDefault();
    if (!file) return setMsg('Choose a CSV first');
    const fd = new FormData();
    fd.append('csv', file);
    fd.append('pass', pass);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const j = await res.json();
    if (j.ok) setMsg('Uploaded ' + j.rows + ' rows');
    else setMsg('Error: ' + (j.error || 'unknown'));
  }
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin — Upload CSV</h1>
      <form onSubmit={upload} className="space-y-3">
        <input type="file" accept=".csv" onChange={e=>setFile(e.target.files[0])} />
        <input type="password" placeholder="passphrase" value={pass} onChange={e=>setPass(e.target.value)} className="p-2 border rounded w-full" />
        <button className="px-3 py-2 bg-blue-600 text-white rounded">Upload</button>
      </form>
      <div className="mt-4 text-sm">{msg}</div>
    </div>
  );
}
