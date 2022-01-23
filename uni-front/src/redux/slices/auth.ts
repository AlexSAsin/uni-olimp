import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Taxios } from '@simplesmiler/taxios';
import Axios from 'axios';
import jwtDecode from 'jwt-decode';
import { apiUrl } from 'utils/consts';

// Types

export type TokenType = {
  id: number;
  login: string;
  roleName: 'admin' | 'user';
  iat: number;
};

export type authState = {
  status: string;
  jwt: string | null;
  user: TokenType | null;
};

// Init state

const initialState = {
  status: 'idle',
  jwt: localStorage.getItem('jwt'),
  user: localStorage.getItem('jwt')
    ? jwtDecode<TokenType>(localStorage.getItem('jwt') || '')
    : null,
} as authState;

// Thunk functions

const taxios = new Taxios<Swagger>(Axios.create({ baseURL: apiUrl }));

export const authorizate = createAsyncThunk(
  'auth/login',
  async (user: { login: string; password: string }, api) => {
    try {
      const response = await taxios.post('/authorization/login', {
        login: user.login,
        password: user.password,
      });
      return response.data.token;
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  return '';
});

// Slice

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authorizate.pending, (state: authState) => {
        state.status = 'loading';
      })
      .addCase(authorizate.fulfilled, (state: authState, action) => {
        state.status = 'idle';

        let jwt = action.payload;
        state.user = jwtDecode<TokenType>(jwt);
        state.jwt = jwt;
        localStorage.setItem('jwt', jwt);
      })
      .addCase(authorizate.rejected, (state: authState) => {
        state.status = 'idle';
      });
    builder
      .addCase(logout.pending, (state: authState) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state: authState) => {
        state.status = 'idle';

        state.user = null;
        state.jwt = null;
        localStorage.removeItem('jwt');
      });
  },
});

export default authSlice.reducer;
