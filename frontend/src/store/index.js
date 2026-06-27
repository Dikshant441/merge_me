import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
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
import uiReducer from "./ui/slice";

const rootReducer = combineReducers({
  user: userReducer,
  feed: feedReducer,
  connections: connectionReducer,
  requests: requestReducer,
  ui: uiReducer,
});

// Only the auth identity survives a reload. Server lists (feed/connections/
// requests) stay memory-only so they can never show stale data on refresh.
const persistedReducer = persistReducer(
  { key: "root", storage, whitelist: ["user"] },
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
