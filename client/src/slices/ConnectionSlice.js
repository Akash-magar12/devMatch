import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: [],
  reducers: {
    addConnectionReq: (state, action) => {
      return action.payload;
    },
    addUserConnection: (state, action) => {
      return action.payload;
    },
    removeRequest: (state, action) => {
      return state.filter((req) => req._id !== action.payload);
    },
    removeConnection: (state, action) => {
      return state.filter((req) => req.connectionReqId !== action.payload);
    },
  },
});
export const {
  addConnectionReq,
  addUserConnection,
  removeRequest,
  removeConnection,
} = connectionSlice.actions;
export default connectionSlice.reducer;
