const http = require('http');

const PORT = process.env.PORT || 8080;
const VERSION = process.env.APP_VERSION || '1.0.0';

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', version: VERSION }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #1a1a2e; color: #e0e0e0;">
        <div style="text-align: center;">
          <h1>Push Deploy Test</h1>
          <p>Version: <strong>${VERSION}</strong></p>
          <p>Server time: ${new Date().toISOString()}</p>
        </div>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// trigger build 1772772510
