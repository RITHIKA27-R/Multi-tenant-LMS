import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import CourseDetails from './pages/CourseDetails';
import CoursePlayer from './pages/CoursePlayer';
import TakeAssessment from './pages/TakeAssessment';
import TestResult from './pages/TestResult';
import './index.css';

import SuperAdminDashboard from './pages/SuperAdminDashboard';
import TenantList from './pages/TenantList';
import SupportTickets from './pages/SupportTickets';
import PlatformAnalytics from './pages/PlatformAnalytics';
import SubscriptionPlans from './pages/SubscriptionPlans';
import Security from './pages/Security';
import SystemHealth from './pages/SystemHealth';
import PlatformSettings from './pages/PlatformSettings';
import TenantAdminManagement from './pages/TenantAdminManagement';
import SetPassword from './pages/SetPassword';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, token } = useAuth();

    if (!token) return <Navigate to="/login" />;
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        if (user?.role === 'SUPER_ADMIN') return <Navigate to="/super-admin" />;
        if (user?.role === 'TENANT_ADMIN') return <Navigate to="/admin" />;
        return <Navigate to="/dashboard" />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/set-password" element={<SetPassword />} />
                    <Route
                        path="/learner/*"
                        element={
                            <ProtectedRoute allowedRoles={['LEARNER', 'INSTRUCTOR']}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/super-admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                <SuperAdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/super-admin" element={<Navigate to="/super-admin/dashboard" />} />
                    <Route path="/dashboard" element={<Navigate to="/learner/dashboard" />} />
                    <Route
                        path="/super-admin/tenants"
                        element={
                            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                <TenantList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/super-admin/admins"
                        element={
                            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                <TenantAdminManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/super-admin/analytics"
                        element={
                            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                <PlatformAnalytics />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/super-admin/plans"
                        element={
                            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                <SubscriptionPlans />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/super-admin/security"
                        element={
                            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                <Security />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/super-admin/health"
                        element={
                            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                <SystemHealth />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/super-admin/support"
                        element={
                            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                <SupportTickets />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/super-admin/settings"
                        element={
                            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                <PlatformSettings />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tenant-admin/*"
                        element={
                            <ProtectedRoute allowedRoles={['TENANT_ADMIN']}>
                                <AdminPanel />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/admin" element={<Navigate to="/tenant-admin/dashboard" />} />
                    <Route
                        path="/course/:id"
                        element={
                            <ProtectedRoute>
                                <CourseDetails />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/course/:id/learn"
                        element={
                            <ProtectedRoute>
                                <CoursePlayer />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/learner/test/:attemptId"
                        element={
                            <ProtectedRoute>
                                <TakeAssessment />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/learner/test/:attemptId/result"
                        element={
                            <ProtectedRoute>
                                <TestResult />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
