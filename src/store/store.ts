import { configureStore } from "@reduxjs/toolkit";
import treeReducer from "./reducers/treeReducer";
import focusReducer from "./reducers/focusReducer";

const store = configureStore({
  devTools: true,
  reducer: {
    treeReducer,
    focusReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
