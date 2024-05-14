import {configureStore} from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import rootReducers from './reducer';
const persistConfig = {
    key: 'root',
    storage,
    // Optionally, you can whitelist specific reducers to be persisted
    // whitelist: ['userReducer'],
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducers);
  
  const store = configureStore({
    reducer: persistedReducer,
  });
  
  export const persistor = persistStore(store);
  
  export default store;