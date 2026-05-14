import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/slice";
import feedReducer from "./feed/slice";
import connectionReducer from "./connections/slice";
import requestReducer from "./requests/slice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestReducer,
  },
});

export default appStore;
