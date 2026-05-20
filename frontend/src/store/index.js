import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/slice";
import feedReducer from "./feed/slice";
import connectionReducer from "./connections/slice";
import requestReducer from "./requests/slice";
import uiReducer from "./ui/slice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestReducer,
    ui: uiReducer,
  },
});

export default appStore;
