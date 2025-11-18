import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserReducer from "./UserReducer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Inlined UI slice for global loading overlay
const initialUi = { loadingCount: 0 };
const uiReducer = (state = initialUi, action) => {
  switch (action.type) {
    case "ui/startLoading":
      return { ...state, loadingCount: state.loadingCount + 1 };
    case "ui/stopLoading":
      return { ...state, loadingCount: Math.max(0, state.loadingCount - 1) };
    case "ui/resetLoading":
      return { ...state, loadingCount: 0 };
    default:
      return state;
  }
};

export const uiStartLoading = () => ({ type: "ui/startLoading" });
export const uiStopLoading = () => ({ type: "ui/stopLoading" });
export const uiResetLoading = () => ({ type: "ui/resetLoading" });

const rootReducer = combineReducers({
  user: UserReducer,
  ui: uiReducer,
});



const persistConfig = {
  key: "root",
  storage,
  blacklist: ["ui"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
