import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const pass = process.env.UPLOAD_PASSPHRASE || 'letmein123';
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'parse error' });
    if (!fields.pass || fields.pass !== pass) return res.status(403).json({ error: 'forbidden' });
    const file = files.csv;
    const data = fs.readFileSync(file.path, 'utf8');
    fs.writeFileSync(path.join(process.cwd(),'data','mpg-sample.csv'), data);
    return res.json({ ok: true, rows: data.split('\n').length - 1 });
  });
}
