# Merge Me — Backend

Node.js + Express + MongoDB API powering the Merge Me client. Provides authentication, profile/feed/connection flows, real-time chat over Socket.IO, and Razorpay-backed premium membership.

## Prerequisites

- Node.js 18+
- A MongoDB instance (local or Atlas)
- A Razorpay account if you want to exercise the payment routes

## Setup

```bash
cd backend
cp .env.example .env       # fill in real values
npm install
npm run dev                # nodemon on src/app.js
# or
npm start                  # node src/app.js
```

The server listens on `PORT` (default `3000`).

## Environment variables

See [`.env.example`](.env.example). Required:

| Variable                   | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| `PORT`                     | HTTP port (default `3000`)               |
| `NODE_ENV`                 | `development` or `production`            |
| `MONGODB_URI`              | Mongo connection string                  |
| `JWT_SECRET`               | Secret used to sign auth tokens          |
| `RAZORPAY_KEY_ID`          | Razorpay public key                      |
| `RAZORPAY_KEY_SECRET`      | Razorpay private key                     |
| `RAZORPAY_WEBHOOK_SECRET`  | Used to verify webhook signatures        |

## Folder map

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

## API summary

See [`apiList.md`](apiList.md) for the full endpoint inventory. Razorpay specifics live in [`roazorpay.md`](roazorpay.md).

## License

ISC — see `package.json`.
