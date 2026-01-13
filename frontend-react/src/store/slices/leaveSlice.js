import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const API_BASE = `${API_BASE_URL}/leaves`;

export const applyForLeave = createAsyncThunk(
    'leave/apply',
    async ({ leaveData, token }) => {
        const response = await axios.post(`${API_BASE}/apply`, leaveData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    }
);

export const fetchMyLeaves = createAsyncThunk(
    'leave/fetchMy',
    async ({ username, token }) => {
        const response = await axios.get(`${API_BASE}/my-requests?username=${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    }
);

export const fetchPendingLeaves = createAsyncThunk(
    'leave/fetchPending',
    async (token) => {
        const response = await axios.get(`${API_BASE}/admin/pending`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    }
);

export const approveLeave = createAsyncThunk(
    'leave/approve',
    async ({ id, token }) => {
        const response = await axios.put(`${API_BASE}/admin/approve/${id}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    }
);

const leaveSlice = createSlice({
    name: 'leave',
    initialState: {
        myLeaves: [],
        pendingLeaves: [],
        loading: false
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyLeaves.fulfilled, (state, action) => {
                state.myLeaves = action.payload;
            })
            .addCase(fetchPendingLeaves.fulfilled, (state, action) => {
                state.pendingLeaves = action.payload;
            })
            .addCase(applyForLeave.fulfilled, (state, action) => {
                state.myLeaves.push(action.payload);
            })
            .addCase(approveLeave.fulfilled, (state, action) => {
                state.pendingLeaves = state.pendingLeaves.filter(l => l.id !== action.payload.id);
            });
    }
});

export default leaveSlice.reducer;
