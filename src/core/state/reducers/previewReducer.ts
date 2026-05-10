import { createSlice } from "@reduxjs/toolkit";
import type { CanvasViewportPreset } from "@core/types/canvas";

interface PreviewState {
  isOpen: boolean;
  pageId: number | null;
  viewportPreset: CanvasViewportPreset | null;
}

const initialState: PreviewState = {
  isOpen: false,
  pageId: null,
  viewportPreset: null,
};

const previewSlice = createSlice({
  name: "preview",
  initialState,
  reducers: {
    preview: (
      state,
      {
        payload,
      }: {
        payload: { pageId: number; viewportPreset?: CanvasViewportPreset | null };
      },
    ) => {
      state.pageId = payload.pageId;
      state.viewportPreset = payload.viewportPreset || null;
      state.isOpen = true;
    },
    closePreview: (state) => {
      state.isOpen = false;
      state.pageId = null;
      state.viewportPreset = null;
    },
  },
});

export const { preview, closePreview } = previewSlice.actions;
export default previewSlice.reducer;
