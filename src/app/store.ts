import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth";
import { authApi } from "@/features/auth/authApi";
import storage from "redux-persist/lib/storage";
import blogReducer from '../features/blog/blog';
import { blogApi } from "@/features/blog/blogApi";
import {adminApi} from '@/features/admin/adminApi'
import {
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
  FLUSH,
  PAUSE,
} from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated", "accessToken"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  blog:blogReducer,
  [authApi.reducerPath]: authApi.reducer,
  [blogApi.reducerPath]:blogApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer 
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware, blogApi.middleware, adminApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
