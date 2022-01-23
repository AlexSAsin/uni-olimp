import { configureStore } from '@reduxjs/toolkit';
// import { createStore } from 'redux';

import auth from './slices/auth';
import posts from './slices/posts';
import alerts from './slices/alerts';

export const store = configureStore({
  reducer: {
    auth: auth,
    posts: posts,
    alerts: alerts,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
