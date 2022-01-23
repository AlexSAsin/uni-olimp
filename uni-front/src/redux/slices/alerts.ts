// файлы получаются очень большими, нужно что то делать с иерархией

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Taxios } from '@simplesmiler/taxios';
import Axios from 'axios';

import { store } from 'redux/store';
import { apiUrl } from 'utils/consts';

// Types

export type alertsState = {
  status: string;
  count: number;
  alerts: Swagger.AlertsGet[];
};

// Init state

const initialState: alertsState = {
  status: 'idle',
  count: 0,
  alerts: [],
};

// Thunk functions

const taxios = new Taxios<Swagger>(Axios.create({ baseURL: apiUrl }));

export const alertsGet = createAsyncThunk(
  'alerts/get',
  async (blank: {}, api) => {
    blank;
    try {
      const response = await taxios.get('/alerts', {
        axios: {
          headers: {
            authorization: 'Bearer ' + store.getState().auth.jwt,
          },
        },
      });
      return response.data;
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const alertSetViewed = createAsyncThunk(
  'alerts/viewed',
  async (alert: { id: number }, api) => {
    try {
      const response = await taxios.patch(
        '/alerts/{id}',
        {
          viewed: true,
        },
        {
          params: {
            id: alert.id.toString(),
          },
          axios: {
            headers: {
              authorization: 'Bearer ' + store.getState().auth.jwt,
            },
          },
        },
      );
      return response.data;
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const alertsGetCount = createAsyncThunk(
  'alerts/count',
  async (black: {}, api) => {
    black;
    try {
      const response = await taxios.get('/alerts/count', {
        axios: {
          headers: {
            authorization: 'Bearer ' + store.getState().auth.jwt,
          },
        },
      });
      return response.data;
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

// Slice

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(alertsGet.fulfilled, (state: alertsState, action) => {
      action.payload.forEach((curAlert) => {
        if (state.alerts.find((a) => a.id === curAlert.id) == null)
          state.alerts.push(curAlert);
      });
    });
    builder.addCase(alertSetViewed.fulfilled, (state: alertsState, action) => {
      state.alerts = state.alerts.filter((a) => a.id !== action.meta.arg.id);
    });
    builder.addCase(alertsGetCount.fulfilled, (state: alertsState, action) => {
      state.count = action.payload.count;
    });
  },
});

export default alertsSlice.reducer;
