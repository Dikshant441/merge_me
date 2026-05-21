# Merge Me

A full-stack MERN application with authentication, profile/feed/connection flows, real-time chat over Socket.IO, and Razorpay-backed premium membership.

This repo contains two apps:
- **`backend/`** — Node.js + Express + MongoDB API
- **`frontend/`** — React 19 + Vite client

---

## Tech stack

### Backend (`backend/`)
| Layer            | Choice                                  |
| ---------------- | --------------------------------------- |
| Runtime          | Node.js (18+)                           |
| HTTP server      | Express 5                               |
| Database         | MongoDB via Mongoose 8                  |
| Authentication   | JSON Web Tokens stored in HTTP cookies  |
| Real-time        | Socket.IO 4                             |
| Payments         | Razorpay SDK + webhook signature checks |
| Validation       | `validator`                             |
| Dev tooling      | nodemon, dotenv                         |

### Frontend (`frontend/`)
| Layer       | Choice                       |
| ----------- | ---------------------------- |
| Framework   | React 19                     |
| Build tool  | Vite 7                       |
| Routing     | React Router 7               |
| State       | Redux Toolkit + React Redux  |
| HTTP        | Axios                        |
| Real-time   | socket.io-client             |
| Styling     | Tailwind CSS 4 + daisyUI 5   |
| Icons       | lucide-react                 |
| Lint        | ESLint                       |

---

## Prerequisites

- **Node.js 18+** and [pnpm](https://pnpm.io/installation) (`npm i -g pnpm`)
- **MongoDB** — either a local `mongod` or a free MongoDB Atlas cluster
- **Razorpay test account** (optional, only if you want to exercise `/payment/*` routes)

---

## Setup

### 1. Clone the repo
```bash
git clone <repo-url>
cd merge_me
```

### 2. Backend
```bash
cd backend
cp .env.example .env
pnpm install
pnpm dev          # starts on http://localhost:3000 with nodemon
```

Edit `backend/.env` and set at minimum:
- `MONGODB_URI` — e.g. `mongodb://localhost:27017/merge_me`
- `JWT_SECRET` — any long random string

Razorpay variables can stay empty if you're not testing payments.

You should see:
```
Database connection seccesful ...
Server running on port 3000...
```

### 3. Frontend (in a new terminal)
```bash
cd frontend
cp .env.example .env    # optional — defaults work for local dev
pnpm install
pnpm dev                # starts on http://localhost:5173
```

Vite's dev server proxies `/api/*` to `http://localhost:3000` (see [`frontend/vite.config.js`](frontend/vite.config.js)), so the two services talk to each other automatically.

### 4. Open the app
Visit <http://localhost:5173>. Sign up, log in, and you're in.

---

## Environment variables

### Backend (`backend/.env`)
See [`backend/.env.example`](backend/.env.example). Required:

| Variable                  | Purpose                            |
| ------------------------- | ---------------------------------- |
| `PORT`                    | HTTP port (default `3000`)         |
| `NODE_ENV`                | `development` or `production`      |
| `MONGODB_URI`             | Mongo connection string            |
| `JWT_SECRET`              | Secret used to sign auth tokens    |
| `RAZORPAY_KEY_ID`         | Razorpay public key                |
| `RAZORPAY_KEY_SECRET`     | Razorpay private key               |
| `RAZORPAY_WEBHOOK_SECRET` | Used to verify webhook signatures  |

### Frontend (`frontend/.env`)
See [`frontend/.env.example`](frontend/.env.example). The app reads the API base URL from `src/constants/index.js` (`BASEURL = "/api"`), proxied to the backend by Vite in dev and expected to be served by your reverse proxy in production.

---

## Available scripts

### Backend (`cd backend`)
| Command       | What it does                                |
| ------------- | ------------------------------------------- |
| `pnpm dev`    | Start with nodemon (auto-restart on change) |
| `pnpm start`  | Start with plain `node`                     |

### Frontend (`cd frontend`)
| Command         | What it does                              |
| --------------- | ----------------------------------------- |
| `pnpm dev`      | Vite dev server with HMR                  |
| `pnpm build`    | Production bundle in `frontend/dist/`     |
| `pnpm preview`  | Serve the production bundle locally       |
| `pnpm lint`     | Run ESLint                                |

---

## Project structure

### Backend
```
backend/src/
├── app.js                       Express app wiring + Socket.IO bootstrap
├── config/
│   └── db.js                    Mongoose connection
├── lib/
│   └── razorpay.js              Razorpay SDK instance
├── middleware/
│   └── auth.js                  JWT cookie → req.user
├── models/
│   ├── chat.js
│   ├── connectionRequest.js
│   ├── payment.js
│   └── user.js
├── routes/
│   ├── authRoutes.js            /signup, /login, /logout
│   ├── chatRoutes.js            /chat/:targetUserId
│   ├── paymentRoutes.js         /payment/create, /payment/webhook, /premium/verify
│   ├── profileRoutes.js         /profile/view, /profile/edit
│   ├── requestRoutes.js         /request/send/..., /request/review/...
│   └── userRoutes.js            /user/connections, /user/requests/received, /feed
├── sockets/
│   └── index.js                 Socket.IO server (joinChat, sendMessage)
├── utils/
│   └── constants.js             Membership pricing, etc.
└── validators/
    └── validation.js            Request body validation helpers
```

See [`backend/apiList.md`](backend/apiList.md) for the full endpoint inventory. Razorpay specifics live in [`backend/roazorpay.md`](backend/roazorpay.md).

### Frontend
```
frontend/src/
├── main.jsx                                 entry: mounts <App/> into #root
├── components/
│   ├── app/
│   │   ├── App/index.jsx                    Provider + BrowserRouter + Routes
│   │   └── layouts/
│   │       └── MainLayout/index.jsx         Navbar + <Outlet/> + Footer
│   ├── pages/                               page-level shells, one per route
│   │   ├── LoginPage/
│   │   ├── FeedPage/
│   │   ├── ProfilePage/
│   │   ├── ConnectionsPage/
│   │   ├── RequestsPage/
│   │   ├── PremiumPage/
│   │   └── ChatPage/
│   ├── features/                            domain UI groups
│   │   ├── feed/UserCard/
│   │   └── profile/EditProfileForm/
│   └── shared/                              reusable cross-feature widgets
│       ├── Navbar/
│       └── Footer/
├── store/                                   Redux Toolkit
│   ├── index.js                             configureStore({ user, feed, connections, requests })
│   ├── user/slice.js
│   ├── feed/slice.js
│   ├── connections/slice.js
│   └── requests/slice.js
├── constants/index.js                       BASEURL and other shared constants
├── helpers/socket.js                        createSocketConnection()
├── styles/index.css                         global styles + Tailwind layers
└── assets/
```

#### Routes

| Path                | Component         |
| ------------------- | ----------------- |
| `/`                 | `FeedPage`        |
| `/login` `/signup`  | `LoginPage`       |
| `/profile`          | `ProfilePage`     |
| `/connections`      | `ConnectionsPage` |
| `/requests`         | `RequestsPage`    |
| `/premium`          | `PremiumPage`     |
| `/chat/:userId`     | `ChatPage`        |

All paths render inside `MainLayout` (Navbar + Outlet + Footer).

---

## Troubleshooting

- **`Error connecting to MongoDB`** — `MONGODB_URI` is wrong, or `mongod` isn't running. Try `mongosh "<your-uri>"` to confirm connectivity.
- **`User not authorized, Please login first`** in the browser console — your auth cookie expired or you cleared cookies; just log in again.
- **`/api/*` requests 404 from the frontend** — the backend isn't running on port 3000, or you changed the proxy target in `vite.config.js`.
- **Razorpay routes erroring** — Razorpay env vars are missing; either fill them in or skip the premium flow during local dev.
- **`Cannot find package 'react-refresh'`** on `pnpm dev` (frontend) — pnpm's strict layout doesn't hoist transitive deps. Already handled by `frontend/.npmrc`; if you ever wipe it, recreate with `public-hoist-pattern[]=*react-refresh*` and reinstall.

---

## License

ISC — see [`backend/package.json`](backend/package.json).
