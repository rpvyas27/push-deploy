const http = require('http');

const PORT = process.env.PORT || 8080;
const VERSION = '2.0.0';
const START_TIME = new Date().toISOString();

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', version: VERSION, uptime: process.uptime() }));
    return;
  }

  if (req.url === '/api/info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      version: VERSION,
      startedAt: START_TIME,
      uptime: Math.floor(process.uptime()),
      node: process.version,
      memory: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
    }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head><title>Push Deploy</title></head>
      <body style="font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); color: #e0e0e0;">
        <div style="text-align: center; padding: 2rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; backdrop-filter: blur(10px); background: rgba(255,255,255,0.05);">
          <h1 style="margin: 0 0 0.5rem 0; font-size: 2rem;">Push Deploy</h1>
          <p style="color: #8b8ba7; margin: 0.25rem 0;">v${VERSION}</p>
          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1rem 0;" />
          <p>Server time: <strong>${new Date().toISOString()}</strong></p>
          <p>Uptime: <strong>${Math.floor(process.uptime())}s</strong></p>
          <p style="margin-top: 1rem;"><a href="/api/info" style="color: #7c7cf5; text-decoration: none;">GET /api/info</a></p>
        </div>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`Push Deploy v${VERSION} running on port ${PORT}`);
});
