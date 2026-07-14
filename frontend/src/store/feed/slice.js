import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => action.payload,
    removeFeed: (state, action) => {
      const newFeed = state.filter((user) => user._id !== action.payload);
      return newFeed;
    },
    // Soft ignore: move the card to the END of the deck instead of dropping
    // it — mirrors the backend, which requeues ignored users after fresh ones.
    requeueFeed: (state, action) => {
      const user = state.find((u) => u._id === action.payload);
      if (!user) return state;
      return [...state.filter((u) => u._id !== action.payload), user];
    },
  },
});

export const { addFeed, removeFeed, requeueFeed } = feedSlice.actions;
export default feedSlice.reducer;
