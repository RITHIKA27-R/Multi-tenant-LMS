import { configureStore } from '@reduxjs/toolkit';
import attendanceReducer from './slices/attendanceSlice';
import leaveReducer from './slices/leaveSlice';
import superAdminReducer from './slices/superAdminSlice';

export const store = configureStore({
    reducer: {
        attendance: attendanceReducer,
        leave: leaveReducer,
        superAdmin: superAdminReducer,
    },
});
