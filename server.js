import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

// In-memory store for demo messages. Not persisted across restarts.
const messages = [];
let nextId = 1;

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/messages", (_req, res) => {
  res.json(messages);
});

app.post("/api/messages", (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text) {
    return res.status(400).json({ error: "text is required" });
  }
  const message = { id: nextId++, text, createdAt: new Date().toISOString() };
  messages.push(message);
  res.status(201).json(message);
});

const PORT = Number(process.env.PORT) || 3000;

// Only listen when run directly, so tests can import the app.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`YaoJie server listening on http://localhost:${PORT}`);
  });
}

export default app;
