import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeFeed: (state, action) => {
      const newUser = state.filter((res) => res._id !== action.payload);
      return newUser;
    },
  },
});
export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
