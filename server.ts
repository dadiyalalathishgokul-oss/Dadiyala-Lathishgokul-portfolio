import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const PYTHON_PORT = Number(process.env.PYTHON_BACKEND_PORT || 8001);
const PYTHON_URL = `http://127.0.0.1:${PYTHON_PORT}/api/contact`;

let pythonProcess: ChildProcess | null = null;
let isShuttingDown = false;

function startPythonBackend(): void {
  if (isShuttingDown) {
    return;
  }
  const scriptPath = path.resolve(__dirname, 'api', 'contact.py');
  const child = spawn('python3', [scriptPath, '--port', String(PYTHON_PORT)], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
  });

  child.stdout?.on('data', (chunk: Buffer) => {
    process.stdout.write(`[python] ${chunk.toString()}`);
  });

  child.stderr?.on('data', (chunk: Buffer) => {
    process.stderr.write(`[python] ${chunk.toString()}`);
  });

  child.on('exit', (code) => {
    if (!isShuttingDown) {
      console.error(`[python] backend exited with code ${code}; restarting in 1s...`);
      setTimeout(startPythonBackend, 1000);
    }
  });

  pythonProcess = child;
}

function stopPythonBackend(): void {
  isShuttingDown = true;
  if (pythonProcess && !pythonProcess.killed) {
    pythonProcess.kill('SIGTERM');
  }
}

process.on('SIGINT', () => {
  stopPythonBackend();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopPythonBackend();
  process.exit(0);
});

async function createApp(): Promise<void> {
  startPythonBackend();

  const app = express();
  app.use(express.raw({ type: '*/*', limit: '128kb' }));

  // Proxy /api/contact directly to the Python backend
  app.all('/api/contact', async (req, res) => {
    try {
      const headers: Record<string, string> = {};
      if (typeof req.headers['content-type'] === 'string') {
        headers['content-type'] = req.headers['content-type'];
      }

      const hasBody = req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS';
      const bodyBuffer =
        hasBody && Buffer.isBuffer(req.body) && req.body.length > 0 ? new Uint8Array(req.body) : undefined;

      const upstream = await fetch(PYTHON_URL, {
        method: req.method,
        headers,
        body: bodyBuffer,
      });

      const responseText = await upstream.text();
      res.status(upstream.status);
      const contentType = upstream.headers.get('content-type');
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }
      res.send(responseText);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Python backend unavailable';
      res.status(502).json({
        ok: false,
        code: 'PYTHON_PROXY_ERROR',
        message: `Could not reach Python backend: ${message}`,
      });
    }
  });

  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'));

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://localhost:${PORT}`);
  });
}

createApp().catch((err) => {
  console.error('Failed to start server:', err);
  stopPythonBackend();
  process.exit(1);
});
