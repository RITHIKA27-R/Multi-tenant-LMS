import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTenants = createAsyncThunk('superAdmin/fetchTenants', async (token) => {
    const response = await axios.get('http://localhost:8080/tenants', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
});

export const createTenant = createAsyncThunk('superAdmin/createTenant', async ({ tenantData, token }) => {
    const response = await axios.post('http://localhost:8080/tenants', tenantData, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
});

export const updateTenant = createAsyncThunk('superAdmin/updateTenant', async ({ id, tenantData, token }) => {
    const response = await axios.put(`http://localhost:8080/tenants/${id}`, tenantData, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
});

export const deleteTenant = createAsyncThunk('superAdmin/deleteTenant', async ({ id, token }) => {
    await axios.delete(`http://localhost:8080/tenants/${id}`, {
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
