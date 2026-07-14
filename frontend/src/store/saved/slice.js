import { createSlice } from "@reduxjs/toolkit";

// Saved Collection state. Memory-only like the other server lists — never
// add "saved" to the redux-persist whitelist; it refetches on load.
//
// items:    full user objects (newest first) for the /saved page + badge
// savedIds: { [userId]: true } set so FeedPage / SwipeCard can O(1)-check
//           the bookmark state of the current card
const initialState = {
  items: [],
  savedIds: {},
};

const savedSlice = createSlice({
  name: "saved",
  initialState,
  reducers: {
    // full refresh from GET /saved
    setSaved: (state, action) => {
      state.items = action.payload;
      state.savedIds = Object.fromEntries(
        action.payload.map((u) => [u._id, true])
      );
    },
    // optimistic add after POST /saved/:id (pass the full user object)
    addSaved: (state, action) => {
      const user = action.payload;
      if (!state.savedIds[user._id]) {
        state.items.unshift(user); // newest first
        state.savedIds[user._id] = true;
      }
    },
    // optimistic remove after DELETE /saved/:id (pass the userId)
    removeSaved: (state, action) => {
      const userId = action.payload;
      state.items = state.items.filter((u) => u._id !== userId);
      delete state.savedIds[userId];
    },
    clearSaved: () => initialState,
  },
});

export const { setSaved, addSaved, removeSaved, clearSaved } =
  savedSlice.actions;

export default savedSlice.reducer;
