# MergeMe Project Understanding

## What this project is

MergeMe is a small MERN-style matching/networking app:

- users sign up and log in
- authenticated users see a feed of other users
- they can mark profiles as `interested` or `ignored`
- incoming requests can be `accepted` or `rejected`
- accepted requests become connections
- users can edit their profile
- there is an early premium/payment flow using Razorpay

The UI branding currently mixes `MergeMe` and `DevMatch`, but the product behavior is consistent: it is a developer-focused connection/matchmaking app.

## Repo layout

```text
merge_me/
├── backend/   # Express + MongoDB API
├── frontend/  # React + Vite client
└── PROJECT_UNDERSTANDING.md
```

## Tech stack

### Frontend

- React 19
- React Router 7
- Redux Toolkit
- Axios
- Vite
- Tailwind CSS 4 + DaisyUI
- Lucide icons

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT auth in cookies
- bcrypt for password hashing
- Razorpay for payment order creation

## How the app works end-to-end

### Auth flow

1. User signs up with `first_name`, `last_name`, `email`, `password`.
2. Backend validates input, hashes password, saves the user, creates a JWT, and stores it in a `token` cookie.
3. User can also log in with email/password.
4. The frontend `Body` component loads the current session via `GET /profile/view`.
5. If that request fails with `401`, the frontend redirects to `/login`.

### Social flow

1. Feed page fetches `GET /feed`.
2. Backend excludes:
   - the logged-in user
   - anyone already involved in a request/connection with the logged-in user
3. The frontend shows the first user card only.
4. Clicking `Interested` or `Ignore` sends `POST /request/send/:status/:touserId`.
5. The card is removed from the local feed state.
6. Incoming interested requests appear in `GET /user/requests/received`.
7. Accepting or rejecting calls `POST /request/review/:status/:requestId`.
8. Accepted requests appear in `GET /user/connections`.

### Profile flow

1. Profile page reads the logged-in user from Redux.
2. Edit form updates profile data through `PATCH /profile/edit`.
3. Updated user data is written back to Redux.
4. The right-side preview uses the same `UserCard` component as the feed.

### Payment flow

1. Premium page posts `membershipType` to `POST /payment/create`.
2. Backend creates a Razorpay order and stores a `Payment` document.
3. Backend returns order details plus `key_id`.
4. Frontend opens Razorpay Checkout using `window.Razorpay`.
5. There is no payment verification callback implemented yet.

## Frontend architecture

### Routing

Main route tree:

- `/login`
- `/signup`
- `/`
- `/profile`
- `/connections`
- `/requests`
- `/premium`

`Body` is the layout route. It wraps:

- `Navbar`
- page `Outlet`
- `Footer`

### Global state

Redux store slices:

- `user`: logged-in user
- `feed`: feed users array
- `connections`: accepted connections
- `requests`: received requests

The state layer is intentionally small and mostly page-oriented.

### API access

Frontend uses `BASEURL = "/api"` and Vite proxies `/api/*` to `http://localhost:3000`.

That means:

- frontend dev server runs on `5173`
- backend should run on `3000`
- cookies are sent using `withCredentials: true`

## Backend architecture

### Entry point

`backend/src/app.js`:

- loads env vars
- configures CORS + JSON + cookies
- mounts routers
- connects to MongoDB
- starts Express only after DB connection succeeds

### Middleware

`userAuth`:

- reads `token` from cookies
- verifies JWT using `JWT_SECRET`
- loads the user document
- attaches it as `req.user`

### Models

#### User

Fields:

- `first_name`
- `last_name`
- `email`
- `password`
- `age`
- `gender`
- `photoURL`
- `about`
- `skills`

Methods:

- `getJWT()`
- `validationPassword()`

#### ConnectionRequest

Fields:

- `fromUserId`
- `toUserId`
- `status`

Status enum:

- `ignored`
- `interested`
- `accepted`
- `rejected`

Rules:

- compound index on `fromUserId + toUserId`
- pre-save guard prevents sending requests to yourself

#### Payment

Fields include:

- `userId`
- `paymentId`
- `orderId`
- `status`
- `amount`
- `currency`
- `receipt`
- `notes`

This is currently used only to persist order creation metadata.

## API map

### Public

- `POST /signup`
- `POST /login`
- `POST /logout`

### Authenticated

- `GET /profile/view`
- `PATCH /profile/edit`
- `POST /request/send/:status/:touserId`
- `POST /request/review/:status/:requestId`
- `GET /user/requests/received`
- `GET /user/connections`
- `GET /feed`
- `POST /payment/create`

## Environment requirements

Backend requires:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

Frontend currently assumes:

- Vite proxy is available in development
- Razorpay checkout script is loaded in the browser environment

## Current strengths

- clear separation between frontend and backend
- backend routes match frontend flows reasonably well
- core matching lifecycle is already implemented
- feed filtering logic is simple and understandable
- profile editing is already wired end-to-end
- payment order creation has a usable starting point

## Current gaps and risks

### Product gaps

- no payment verification or webhook handling
- no premium membership persistence on user records
- no messaging feature despite premium page copy suggesting it
- no onboarding or profile completeness flow
- no pagination/infinite loading on the frontend feed
- no tests in either frontend or backend

### Data/API inconsistencies

- frontend navbar reads `firstName`, `lastName`, and `emailId`, but backend returns `first_name`, `last_name`, and `email`
- payment `notes` written by the backend use `first_name`/`last_name`, while the frontend reads `firstName`/`lastName`
- profile API docs mention `change-password`, but that route does not exist
- naming/branding is inconsistent between `MergeMe` and `DevMatch`

### Code quality issues already visible

- frontend lint fails
- several `useEffect` hooks depend on local async functions without handling dependencies cleanly
- navbar uses state updates inside an effect in a way React lint rejects
- premium page imports `Infinity`, which conflicts with the global name
- logout clears `user` and `connections`, but does not intentionally reset every slice in a consistent way
- backend startup is tightly coupled to live MongoDB availability, which makes local offline validation harder

## What is already buildable

Assuming valid env vars and reachable MongoDB:

- user signup/login/logout
- session fetch through cookie auth
- profile view/edit
- browse feed users
- send interest/ignore actions
- review incoming requests
- list connections
- create Razorpay orders

## Recommended build order from here

### Phase 1: stabilize the foundation

- fix frontend lint errors
- normalize frontend/backend field naming
- add a `.env.example` for both apps
- add basic error and loading states across pages

### Phase 2: complete premium properly

- add payment verification endpoint
- store membership on the user model
- gate premium capabilities from actual backend state
- surface membership status in the UI

### Phase 3: improve core product

- better feed UX and pagination
- request/connection caching cleanup
- searchable/filterable profiles
- profile validation on edit, not just allowed-field checks

### Phase 4: add reliability

- backend route tests
- frontend component/integration tests
- seeded local development data
- deployment config and environment docs

## Suggested shared working model

When we build together, we should treat the project as five layers:

1. data model
2. API contract
3. frontend state
4. page/component UX
5. deployment/runtime concerns

For any feature we add, we should decide changes in that order. That will keep this repo from drifting into inconsistent frontend/backend assumptions.
