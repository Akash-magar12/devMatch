import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/useSlice";
import feedSlice from "../slices/feedSlice";
import ConnectionSlice from "../slices/ConnectionSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    feed: feedSlice,
    connection: ConnectionSlice,
  },
});

export default store;
