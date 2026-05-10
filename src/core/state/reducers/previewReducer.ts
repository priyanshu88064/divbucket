import { createSlice } from "@reduxjs/toolkit";

const previewSlice = createSlice({
  name: "preview",
  initialState: {
    isOpen: false,
    pageSrc: "",
  },
  reducers: {
    preview: (state, { payload }: { payload: { pageSrc: string } }) => {
      state.pageSrc = payload.pageSrc;
      state.isOpen = true;
    },
    closePreview: (state) => {
      state.isOpen = false;
      state.pageSrc = "";
    },
  },
});

export const { preview, closePreview } = previewSlice.actions;
export default previewSlice.reducer;
