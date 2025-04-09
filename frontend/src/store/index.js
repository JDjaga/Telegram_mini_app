import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import nftReducer from './slices/nftSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nfts: nftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
