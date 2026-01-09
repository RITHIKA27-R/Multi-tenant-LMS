import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TenantDashboardHome from '../components/tenant/TenantDashboardHome';
import UserManagement from '../components/tenant/UserManagement';
import CourseManagement from '../components/tenant/CourseManagement';
import AssessmentManagement from '../components/tenant/AssessmentManagement';
import ReportsAnalytics from '../components/tenant/ReportsAnalytics';
import TenantSettings from '../components/tenant/TenantSettings';
import TenantSupport from '../components/tenant/TenantSupport';
import TenantProfile from '../components/tenant/TenantProfile';

const AdminPanel = () => {
    const { logout } = useAuth();
    const location = useLocation();

    // Mapping for header titles
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('users')) return 'User Management';
        if (path.includes('courses')) return 'Course Management';
        if (path.includes('assessments')) return 'Assessments';
        if (path.includes('reports')) return 'Reports & Analytics';
        if (path.includes('settings')) return 'Settings';
        if (path.includes('support')) return 'Support';
        if (path.includes('profile')) return 'My Profile';
        return 'Dashboard';
    };

    return (
        <div style={{ display: 'flex', background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <Sidebar role="TENANT_ADMIN" />

            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', margin: 0 }}>{getPageTitle()}</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>Manage your organization</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button className="btn" style={{ border: '1px solid var(--border)' }} onClick={logout}>Logout</button>
                    </div>
                </header>

                <Routes>
                    <Route path="dashboard" element={<TenantDashboardHome />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="courses" element={<CourseManagement />} />
                    <Route path="assessments" element={<AssessmentManagement />} />
                    <Route path="reports" element={<ReportsAnalytics />} />
                    <Route path="settings" element={<TenantSettings />} />
                    <Route path="support" element={<TenantSupport />} />
                    <Route path="profile" element={<TenantProfile />} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminPanel;
