import { configureStore } from "@reduxjs/toolkit";
import treeReducer from "./reducers/treeReducer";
import focusReducer from "./reducers/focusReducer";
import previewReducer from "./reducers/previewReducer";
import workbenchReducer, {
  type WorkbenchState,
} from "./reducers/workbenchReducer";

const WORKBENCH_STORAGE_KEY = "divbucket.workbench.v1";

const parseWorkbenchState = (raw: string | null): WorkbenchState | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<WorkbenchState>;
    if (!parsed || typeof parsed !== "object") return null;
    if (
      typeof parsed.leftDockOpen !== "boolean" ||
      typeof parsed.leftDockWidth !== "number" ||
      (parsed.leftDockTool !== "add" && parsed.leftDockTool !== "navigator") ||
      typeof parsed.rightDockOpen !== "boolean" ||
      typeof parsed.rightDockWidth !== "number" ||
      (parsed.rightInspectorTab !== "styles" &&
        parsed.rightInspectorTab !== "settings")
    ) {
      return null;
    }
    return {
      ...(parsed as WorkbenchState),
      debugPanelOpen: parsed.debugPanelOpen === true,
    };
  } catch {
    return null;
  }
};

const readWorkbenchState = () => {
  if (typeof window === "undefined") return undefined;
  return parseWorkbenchState(localStorage.getItem(WORKBENCH_STORAGE_KEY));
};

const preloadedWorkbenchState = readWorkbenchState();

const store = configureStore({
  devTools: true,
  preloadedState: preloadedWorkbenchState
    ? { workbenchReducer: preloadedWorkbenchState }
    : undefined,
  reducer: {
    treeReducer,
    focusReducer,
    previewReducer,
    workbenchReducer,
  },
});

if (typeof window !== "undefined") {
  let previous = "";
  store.subscribe(() => {
    const current = JSON.stringify(store.getState().workbenchReducer);
    if (current === previous) return;
    previous = current;
    localStorage.setItem(WORKBENCH_STORAGE_KEY, current);
  });
}

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
