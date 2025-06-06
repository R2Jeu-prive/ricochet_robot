const livereload = require('livereload');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');

const mimeTypes = {
    '.html': 'text/html',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.wasm': 'application/wasm',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.json': 'application/json',
    '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
    let filePath = path.join(PUBLIC_DIR, req.url === '/' ? '/index.html' : req.url);
    filePath = filePath.split("?")[0];
    const ext = path.extname(filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404 Not Found');
            return;
        }
        res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'application/octet-stream'});
        res.end(data);
    });
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Static server running at http://localhost:${PORT}/`);
});


livewireServer = livereload.createServer({
    "applyCSSLive" : true
});
livewireServer.watch(__dirname + "/public");
