import { createSlice } from "@reduxjs/toolkit";

export type LeftDockTool = "add" | "navigator";
export type RightInspectorTab = "styles" | "settings";

export type WorkbenchState = {
  leftDockOpen: boolean;
  leftDockWidth: number;
  leftDockTool: LeftDockTool;
  rightDockOpen: boolean;
  rightDockWidth: number;
  rightInspectorTab: RightInspectorTab;
  debugPanelOpen: boolean;
};

const LEFT_DOCK_MIN_WIDTH = 248;
const LEFT_DOCK_MAX_WIDTH = 360;
const RIGHT_DOCK_MIN_WIDTH = 280;
const RIGHT_DOCK_MAX_WIDTH = 420;

const clampWidth = ({
  width,
  min,
  max,
}: {
  width: number;
  min: number;
  max: number;
}) => Math.min(max, Math.max(min, width));

const initialState: WorkbenchState = {
  leftDockOpen: true,
  leftDockWidth: 296,
  leftDockTool: "add",
  rightDockOpen: true,
  rightDockWidth: 350,
  rightInspectorTab: "styles",
  debugPanelOpen: false,
};

const workbenchSlice = createSlice({
  name: "workbench",
  initialState,
  reducers: {
    hydrateWorkbenchState: (state, { payload }: { payload: WorkbenchState }) => {
      state.leftDockOpen = payload.leftDockOpen;
      state.leftDockWidth = clampWidth({
        width: payload.leftDockWidth,
        min: LEFT_DOCK_MIN_WIDTH,
        max: LEFT_DOCK_MAX_WIDTH,
      });
      state.leftDockTool = payload.leftDockTool;
      state.rightDockOpen = payload.rightDockOpen;
      state.rightDockWidth = clampWidth({
        width: payload.rightDockWidth,
        min: RIGHT_DOCK_MIN_WIDTH,
        max: RIGHT_DOCK_MAX_WIDTH,
      });
      state.rightInspectorTab = payload.rightInspectorTab;
      state.debugPanelOpen = payload.debugPanelOpen;
    },
    toggleLeftDockOpen: (state) => {
      state.leftDockOpen = !state.leftDockOpen;
    },
    setLeftDockOpen: (state, { payload }: { payload: { isOpen: boolean } }) => {
      state.leftDockOpen = payload.isOpen;
    },
    setLeftDockWidth: (state, { payload }: { payload: { width: number } }) => {
      state.leftDockWidth = clampWidth({
        width: payload.width,
        min: LEFT_DOCK_MIN_WIDTH,
        max: LEFT_DOCK_MAX_WIDTH,
      });
    },
    setLeftDockTool: (state, { payload }: { payload: { tool: LeftDockTool } }) => {
      state.leftDockTool = payload.tool;
      state.leftDockOpen = true;
    },
    toggleRightDockOpen: (state) => {
      state.rightDockOpen = !state.rightDockOpen;
    },
    setRightDockOpen: (
      state,
      { payload }: { payload: { isOpen: boolean } },
    ) => {
      state.rightDockOpen = payload.isOpen;
    },
    setRightDockWidth: (state, { payload }: { payload: { width: number } }) => {
      state.rightDockWidth = clampWidth({
        width: payload.width,
        min: RIGHT_DOCK_MIN_WIDTH,
        max: RIGHT_DOCK_MAX_WIDTH,
      });
    },
    setRightInspectorTab: (
      state,
      { payload }: { payload: { tab: RightInspectorTab } },
    ) => {
      state.rightInspectorTab = payload.tab;
      state.rightDockOpen = true;
    },
    toggleDebugPanelOpen: (state) => {
      state.debugPanelOpen = !state.debugPanelOpen;
    },
    setDebugPanelOpen: (
      state,
      { payload }: { payload: { isOpen: boolean } },
    ) => {
      state.debugPanelOpen = payload.isOpen;
    },
  },
});

export const {
  hydrateWorkbenchState,
  toggleLeftDockOpen,
  setLeftDockOpen,
  setLeftDockWidth,
  setLeftDockTool,
  toggleRightDockOpen,
  setRightDockOpen,
  setRightDockWidth,
  setRightInspectorTab,
  toggleDebugPanelOpen,
  setDebugPanelOpen,
} = workbenchSlice.actions;

export {
  LEFT_DOCK_MIN_WIDTH,
  LEFT_DOCK_MAX_WIDTH,
  RIGHT_DOCK_MIN_WIDTH,
  RIGHT_DOCK_MAX_WIDTH,
};

export default workbenchSlice.reducer;
