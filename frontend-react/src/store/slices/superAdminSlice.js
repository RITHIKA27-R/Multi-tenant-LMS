import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

export const fetchTenants = createAsyncThunk('superAdmin/fetchTenants', async (token) => {
    const response = await axios.get(`${API_BASE_URL}/tenants`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
});

export const createTenant = createAsyncThunk('superAdmin/createTenant', async ({ tenantData, token }) => {
    const response = await axios.post(`${API_BASE_URL}/tenants`, tenantData, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
});

export const updateTenant = createAsyncThunk('superAdmin/updateTenant', async ({ id, tenantData, token }) => {
    const response = await axios.put(`${API_BASE_URL}/tenants/${id}`, tenantData, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
});

export const deleteTenant = createAsyncThunk('superAdmin/deleteTenant', async ({ id, token }) => {
    await axios.delete(`${API_BASE_URL}/tenants/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return id;
});

const superAdminSlice = createSlice({
    name: 'superAdmin',
    initialState: {
        tenants: [],
        analytics: {
            totalUsers: 0,
            activeTenants: 0,
            storageUsage: {}
        },
        loading: false
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTenants.fulfilled, (state, action) => {
                state.tenants = action.payload;
            })
            .addCase(createTenant.fulfilled, (state, action) => {
                state.tenants.push(action.payload);
            })
            .addCase(updateTenant.fulfilled, (state, action) => {
                const index = state.tenants.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.tenants[index] = action.payload;
            })
            .addCase(deleteTenant.fulfilled, (state, action) => {
                state.tenants = state.tenants.filter(t => t.id !== action.payload);
            });
    }
});

export default superAdminSlice.reducer;
