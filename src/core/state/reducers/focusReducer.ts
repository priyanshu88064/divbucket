import { createSlice } from "@reduxjs/toolkit";

const focusSlice = createSlice({
  name: "focus",
  initialState: {
    tab: "00",
  },
  reducers: {
    changeTab: (state, { payload }) => {
      state.tab = payload.tab;
    },
  },
});

export const { changeTab } = focusSlice.actions;

export default focusSlice.reducer;
