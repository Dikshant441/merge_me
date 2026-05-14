# Merge Me — Frontend

React 19 + Vite client for the Merge Me application. Uses Redux Toolkit for state, React Router for navigation, Axios for HTTP, Socket.IO for live chat, and Tailwind v4 + daisyUI for styling.

## Prerequisites

- Node.js 18+
- The backend running locally on port `3000` (see [`../backend/README.md`](../backend/README.md)). The Vite dev server proxies `/api/*` to it.

## Setup

```bash
cd frontend
cp .env.example .env       # optional — defaults work for local dev
npm install
npm run dev                # http://localhost:5173
npm run build              # production bundle in dist/
npm run preview            # serve the built bundle
npm run lint               # eslint
```

## Environment variables

See [`.env.example`](.env.example). Currently the app reads the API base URL from `src/constants/index.js` (`BASEURL = "/api"`), which is proxied to the backend by Vite in dev and expected to be served by your reverse proxy in production.

## Folder map

```
frontend/src/
├── main.jsx                                 entry: mounts <App/> into #root
├── components/
│   ├── app/
│   │   ├── App/index.jsx                    Provider + BrowserRouter + Routes
│   │   └── layouts/
│   │       └── MainLayout/index.jsx         Navbar + <Outlet/> + Footer (was Body.jsx)
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
│   ├── connectionDISPLs/slice.js
│   └── requests/slice.js
├── constants/index.js                       BASEURL and other shared constants
├── helpers/socket.js                        createSocketConnection()
├── styles/index.css                         global styles + Tailwind layers
└── assets/
```

## Routes

| Path                | Component                |
| ------------------- | ------------------------ |
| `/`                 | `FeedPage`               |
| `/login` `/signup`  | `LoginPage`              |
| `/profile`          | `ProfilePage`            |
| `/connections`      | `ConnectionsPage`        |
| `/requests`         | `RequestsPage`           |
| `/premium`          | `PremiumPage`            |
| `/chat/:userId`     | `ChatPage`               |

All paths render inside `MainLayout` (Navbar + Outlet + Footer).
