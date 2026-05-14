# Getting Started

A single-page guide to running Merge Me locally and the tech stack it uses. For deeper info on each side of the app, see [`frontend/README.md`](frontend/README.md) and [`backend/README.md`](backend/README.md).

## Tech stack

### Backend (`backend/`)
| Layer                | Choice                                    |
| -------------------- | ----------------------------------------- |
| Runtime              | Node.js (18+)                             |
| HTTP server          | Express 5                                 |
| Database             | MongoDB via Mongoose 8                    |
| Authentication       | JSON Web Tokens stored in HTTP cookies    |
| Real-time            | Socket.IO 4                               |
| Payments             | Razorpay SDK + webhook signature checks   |
| Validation           | `validator`                               |
| Dev tooling          | nodemon, dotenv                           |

### Frontend (`frontend/`)
| Layer                | Choice                                    |
| -------------------- | ----------------------------------------- |
| Framework            | React 19                                  |
| Build tool           | Vite 7                                    |
| Routing              | React Router 7                            |
| State                | Redux Toolkit + React Redux               |
| HTTP                 | Axios                                     |
| Real-time            | socket.io-client                          |
| Styling              | Tailwind CSS 4 + daisyUI 5                |
| Icons                | lucide-react                              |
| Lint                 | ESLint                                    |

## Prerequisites

- **Node.js 18+** and npm
- **MongoDB** — either a local `mongod` or a free MongoDB Atlas cluster
- **Razorpay test account** (optional, only if you want to exercise `/payment/*` routes)

## Setup, step by step

### 1. Clone and enter the repo
```bash
git clone <repo-url>
cd merge_me
```

### 2. Configure the backend
```bash
cd backend
cp .env.example .env
```
Edit `backend/.env` and set at minimum:
- `MONGODB_URI` — e.g. `mongodb://localhost:27017/merge_me`
- `JWT_SECRET` — any long random string

Razorpay variables can stay empty if you're not testing payments.

```bash
npm install
npm run dev          # starts on http://localhost:3000 with nodemon
```

You should see:
```
Database connection seccesful ...
Server running on port 3000...
```

### 3. Configure the frontend (in a new terminal)
```bash
cd frontend
cp .env.example .env    # optional — defaults work for local dev
npm install
npm run dev             # starts on http://localhost:5173
```

Vite's dev server proxies `/api/*` to `http://localhost:3000` (see [`frontend/vite.config.js`](frontend/vite.config.js)), so the two services talk to each other automatically.

### 4. Open the app
Visit <http://localhost:5173>. Sign up, log in, and you're in.

## Available scripts

### Backend (`cd backend`)
| Command         | What it does                                |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Start with nodemon (auto-restart on change) |
| `npm start`     | Start with plain `node`                     |

### Frontend (`cd frontend`)
| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Vite dev server with HMR                  |
| `npm run build`   | Production bundle in `frontend/dist/`     |
| `npm run preview` | Serve the production bundle locally       |
| `npm run lint`    | Run ESLint                                |

## Troubleshooting

- **`Error connecting to MongoDB`** — `MONGODB_URI` is wrong, or `mongod` isn't running. Try `mongosh "<your-uri>"` to confirm connectivity.
- **`User not authorized, Please login first`** in the browser console — your auth cookie expired or you cleared cookies; just log in again.
- **`/api/*` requests 404 from the frontend** — the backend isn't running on port 3000, or you changed the proxy target in `vite.config.js`.
- **Razorpay routes erroring** — Razorpay env vars are missing; either fill them in or skip the premium flow during local dev.
