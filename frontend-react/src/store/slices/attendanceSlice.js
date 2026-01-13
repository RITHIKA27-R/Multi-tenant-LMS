import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const API_BASE = `${API_BASE_URL}/attendance`;

export const fetchAttendanceHistory = createAsyncThunk(
    'attendance/fetchHistory',
    async ({ username, token }) => {
        const response = await axios.get(`${API_BASE}/history?username=${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    }
);

export const markClockIn = createAsyncThunk(
    'attendance/markIn',
    async ({ username, token }) => {
        const response = await axios.post(`${API_BASE}/mark-in`, { username }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    }
);

export const markClockOut = createAsyncThunk(
    'attendance/markOut',
    async ({ username, token }) => {
        const response = await axios.post(`${API_BASE}/mark-out`, { username }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    }
);

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
        records: [],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
                state.records = action.payload;
            })
            .addCase(markClockIn.fulfilled, (state, action) => {
                state.records.unshift(action.payload);
            })
            .addCase(markClockOut.fulfilled, (state, action) => {
                const index = state.records.findIndex(r => r.id === action.payload.id);
                if (index !== -1) state.records[index] = action.payload;
            });
    }
});

export default attendanceSlice.reducer;
