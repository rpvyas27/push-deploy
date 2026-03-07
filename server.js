const http = require('http');
const os = require('os');

const PORT = process.env.PORT || 8080;
const VERSION = '3.1.0';
const START_TIME = new Date().toISOString();
let requestCount = 0;

const server = http.createServer((req, res) => {
  requestCount++;

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', version: VERSION }));
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

  if (req.url === '/api/stats') {
    const uptimeSec = Math.floor(process.uptime());
    const mem = process.memoryUsage();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      requests: requestCount,
      uptime: uptimeSec,
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMemory: Math.round(os.totalmem() / 1024 / 1024) + 'MB',
      freeMemory: Math.round(os.freemem() / 1024 / 1024) + 'MB',
      processMemory: {
        rss: Math.round(mem.rss / 1024 / 1024) + 'MB',
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + 'MB',
      },
    }));
    return;
  }

  const uptimeSec = Math.floor(process.uptime());
  const uptimeStr = uptimeSec >= 3600
    ? `${Math.floor(uptimeSec / 3600)}h ${Math.floor((uptimeSec % 3600) / 60)}m`
    : uptimeSec >= 60
      ? `${Math.floor(uptimeSec / 60)}m ${uptimeSec % 60}s`
      : `${uptimeSec}s`;

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head>
        <title>Push Deploy v${VERSION}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); color: #e0e0e0;">
        <div style="text-align: center; padding: 2.5rem; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; backdrop-filter: blur(10px); background: rgba(255,255,255,0.04); min-width: 320px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
          <div style="font-size: 2.5rem; margin-bottom: 0.25rem;">&#x1f680;</div>
          <h1 style="margin: 0 0 0.25rem 0; font-size: 1.75rem; font-weight: 600;">hello from opsnorth</h1>
          <p style="color: #6e6e8a; margin: 0; font-size: 0.85rem;">v${VERSION} &middot; ${os.hostname()}</p>
          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 1.25rem 0;" />
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; text-align: left; font-size: 0.9rem;">
            <div style="padding: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="color: #6e6e8a; font-size: 0.75rem; margin-bottom: 0.25rem;">Uptime</div>
              <div style="font-weight: 500;">${uptimeStr}</div>
            </div>
            <div style="padding: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="color: #6e6e8a; font-size: 0.75rem; margin-bottom: 0.25rem;">Requests</div>
              <div style="font-weight: 500;">${requestCount}</div>
            </div>
            <div style="padding: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="color: #6e6e8a; font-size: 0.75rem; margin-bottom: 0.25rem;">Memory</div>
              <div style="font-weight: 500;">${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB</div>
            </div>
            <div style="padding: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="color: #6e6e8a; font-size: 0.75rem; margin-bottom: 0.25rem;">Node</div>
              <div style="font-weight: 500;">${process.version}</div>
            </div>
          </div>
          <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; justify-content: center;">
            <a href="/api/info" style="color: #7c7cf5; text-decoration: none; font-size: 0.85rem; padding: 0.4rem 0.8rem; border: 1px solid rgba(124,124,245,0.3); border-radius: 6px;">/api/info</a>
            <a href="/api/stats" style="color: #7cf5a5; text-decoration: none; font-size: 0.85rem; padding: 0.4rem 0.8rem; border: 1px solid rgba(124,245,165,0.3); border-radius: 6px;">/api/stats</a>
          </div>
        </div>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`Push Deploy v${VERSION} running on port ${PORT}`);
});
