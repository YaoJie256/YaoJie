import { test } from "node:test";
import assert from "node:assert/strict";
import app from "../server.js";

function listen() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

test("GET /api/health returns ok", async () => {
  const server = await listen();
  const { port } = server.address();
  try {
    const res = await fetch(`http://localhost:${port}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, "ok");
  } finally {
    server.close();
  }
});

test("POST then GET /api/messages persists a message", async () => {
  const server = await listen();
  const { port } = server.address();
  try {
    const created = await fetch(`http://localhost:${port}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "hello world" }),
    });
    assert.equal(created.status, 201);
    const message = await created.json();
    assert.equal(message.text, "hello world");

    const listRes = await fetch(`http://localhost:${port}/api/messages`);
    const messages = await listRes.json();
    assert.ok(messages.some((m) => m.text === "hello world"));
  } finally {
    server.close();
  }
});

test("POST /api/messages rejects empty text", async () => {
  const server = await listen();
  const { port } = server.address();
  try {
    const res = await fetch(`http://localhost:${port}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "   " }),
    });
    assert.equal(res.status, 400);
  } finally {
    server.close();
  }
});
