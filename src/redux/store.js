import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducers from "./reducer";

const persistConfig = {
  key: "root",
  storage,
  // whitelist: ['userReducer'], // Optionally persist specific reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Ignore this action for serialization checks
      },
    }),
});

export const persistor = persistStore(store);
export default store;
