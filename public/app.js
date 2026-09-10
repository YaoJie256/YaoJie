const form = document.getElementById("message-form");
const input = document.getElementById("message-input");
const list = document.getElementById("messages");
const health = document.getElementById("health");

function render(messages) {
  list.innerHTML = "";
  if (messages.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No messages yet. Add the first one!";
    list.appendChild(empty);
    return;
  }
  for (const message of messages) {
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = message.text;
    const meta = document.createElement("span");
    meta.className = "meta";
    meta.textContent = `#${message.id} · ${new Date(message.createdAt).toLocaleString()}`;
    li.append(text, meta);
    list.appendChild(li);
  }
}

async function loadMessages() {
  const res = await fetch("/api/messages");
  render(await res.json());
}

async function checkHealth() {
  try {
    const res = await fetch("/api/health");
    if (!res.ok) throw new Error("bad status");
    await res.json();
    health.textContent = "server healthy";
    health.classList.add("ok");
  } catch {
    health.textContent = "server unreachable";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (res.ok) {
    input.value = "";
    await loadMessages();
  }
});

checkHealth();
loadMessages();
