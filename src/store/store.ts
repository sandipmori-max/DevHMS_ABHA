import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authReducer from "./slices/auth/authSlice";
import themeReducer from "./slices/theme/themeSlice";
import attendanceReducer from "./slices/attendance/attendanceSlice";
import dropdownReducer from "./slices/dropdown/dropdownSlice";
import ajaxReducer from "./slices/ajax/ajaxSlice";
import pageReducer from "./slices/page/pageSlice";
import reloadAppReducer from "./slices/reloadApp/reloadAppSlice";
import syncLocationReducer from "./slices/location/syncLocationSlice";

// Adjust these imports according to your project
import abhaAuthReducer from "../abha/redux/slices/authSlice";
import abhaReducer from "../abha/redux/slices/abhaSlice";
import loaderReducer from "../abha/redux/slices/loaderSlice";

import { baseApi } from "../abha/redux/api/baseApi";

/* ===================== Persist Config ===================== */

const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: [
    "token",
    "isPinLoaded",
    "isAuthenticated",
    "user",
    "appDrawerMenuList",
    "appBottomMenuList",
    "appColorCode",
    "accounts",
    "locationLogs",
    "dashboardBranchId",
    "dashboardTypeId",
    "birthdayUsers",
    "attendanceSecurityLevel",
  ],
};

const themePersistConfig = {
  key: "theme",
  storage: AsyncStorage,
  whitelist: ["mode", "langcode"],
};

const abhaAuthPersistConfig = {
  key: "abhaauth",
  storage: AsyncStorage,
  whitelist: ["publicKey", "appId", "deviceName"],
};

const abhaPersistConfig = {
  key: "abha",
  storage: AsyncStorage,
  whitelist: [
    "activeUser",
    "txnId",
    "tToken",
    "abhaDrProfile",
    "devERPBaseUrl",
  ],
};

/* ===================== Persist Reducers ===================== */

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authReducer
);

const persistedThemeReducer = persistReducer(
  themePersistConfig,
  themeReducer
);

const persistedAbhaAuthReducer = persistReducer(
  abhaAuthPersistConfig,
  abhaAuthReducer
);

const persistedAbhaReducer = persistReducer(
  abhaPersistConfig,
  abhaReducer
);

/* ===================== App Reducer ===================== */

const appReducer = combineReducers({
  auth: persistedAuthReducer,
  theme: persistedThemeReducer,

  attendance: attendanceReducer,
  dropdown: dropdownReducer,
  ajax: ajaxReducer,
  page: pageReducer,
  syncLocation: syncLocationReducer,
  reloadApp: reloadAppReducer,

  abhaauth: persistedAbhaAuthReducer,
  abha: persistedAbhaReducer,
  loader: loaderReducer,

  [baseApi.reducerPath]: baseApi.reducer,
});

/* ===================== Root Reducer ===================== */

const rootReducer = (state: any, action: any) => {
  switch (action.type) {
    case "RESET_APP":
      state = undefined;
      break;

    default:
      break;
  }

  return appReducer(state, action);
};

/* ===================== Store ===================== */

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }).concat(baseApi.middleware),

  devTools: __DEV__,
});

/* ===================== Persistor ===================== */

export const persistor = persistStore(store);

/* ===================== Types ===================== */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;