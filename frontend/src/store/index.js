import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import userReducer from "./user/slice";
import feedReducer from "./feed/slice";
import connectionReducer from "./connections/slice";
import requestReducer from "./requests/slice";
import savedReducer from "./saved/slice";
import uiReducer from "./ui/slice";

const rootReducer = combineReducers({
  user: userReducer,
  feed: feedReducer,
  connections: connectionReducer,
  requests: requestReducer,
  saved: savedReducer,
  ui: uiReducer,
});

// Any localhost app on this origin shares localStorage, so a rehydrated user
// may have been written by a different project with a different state shape.
// Only accept a real identity — id (Postgres auth routes) or _id (legacy
// /profile/view) — anything else rehydrates as null so the AppShell auth
// gate re-fetches /auth/me instead of trusting garbage.
const validUserOnly = createTransform(
  null,
  (persisted) => (persisted && (persisted.id || persisted._id) ? persisted : null),
  { whitelist: ["user"] }
);

// Only the auth identity survives a reload. Server lists (feed/connections/
// requests) stay memory-only so they can never show stale data on refresh.
// key is app-specific (not "root") so other localhost projects using
// redux-persist can never collide with ours.
const persistedReducer = persistReducer(
  { key: "merge-me", storage, whitelist: ["user"], transforms: [validUserOnly] },
  rootReducer
);

const appStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist dispatches non-serializable internal actions — exempt them
      // so the serializable-state check doesn't warn on every rehydrate.
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(appStore);
export default appStore;
