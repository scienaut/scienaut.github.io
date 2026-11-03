import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
const server = createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const relative = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
    const target = resolve(root, `.${relative}`);
    if (target !== root && !target.startsWith(root + sep)) { res.writeHead(403).end('Forbidden'); return; }
    const content = await readFile(target);
    res.writeHead(200, {'Content-Type':types[extname(target)] || 'application/octet-stream','Cache-Control':'no-store'}).end(content);
  } catch { res.writeHead(404).end('Not found'); }
});
const port = Number(process.env.PORT || 8000);
server.listen(port, '127.0.0.1', () => console.log(`Open Conveyor Calculator: http://127.0.0.1:${port}`));
