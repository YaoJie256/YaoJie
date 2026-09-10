# YaoJie

A minimal [Express](https://expressjs.com/) starter app that doubles as an end-to-end demonstration of the Cloud Agent development environment. It serves a small message board: a static frontend backed by a JSON API with an in-memory store.

## Requirements

- Node.js >= 20 (the repo is developed against Node 22)
- npm

## Getting started

```bash
npm ci        # install dependencies from package-lock.json
npm start     # start the server on http://localhost:3000
```

Then open http://localhost:3000 and add a message.

During development you can use `npm run dev` to auto-restart on file changes.

## API

| Method | Path            | Description                          |
| ------ | --------------- | ------------------------------------ |
| GET    | `/api/health`   | Health check (`{ status: "ok" }`)    |
| GET    | `/api/messages` | List messages                        |
| POST   | `/api/messages` | Create a message (`{ "text": "…" }`) |

The message store is in-memory and resets on restart.

## Tests

```bash
npm test      # runs the node:test suite in test/
```

## Cloud Agent environment

The `.cursor/environment.json` file configures the Cloud Agent environment:

- `install`: `npm ci` restores dependencies from the lockfile.
- `terminals`: a `dev-server` terminal runs `npm start` so the app is available on port 3000.
