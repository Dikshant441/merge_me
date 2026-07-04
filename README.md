# Merge Me

A full-stack MERN application with authentication, profile/feed/connection flows, real-time chat over Socket.IO, and Razorpay-backed premium membership.

This repo contains two apps:
- **`backend/`** — Node.js + Express + POstgreSql
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

## Contact

Dikshant Singh — singhdikshant200@gmail.com
