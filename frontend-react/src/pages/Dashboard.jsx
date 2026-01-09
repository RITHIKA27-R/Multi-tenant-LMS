import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LearnerOverview from '../components/learner/LearnerOverview';
import CourseCatalog from '../components/learner/CourseCatalog';
import MyCourses from '../components/learner/MyCourses';
import LearnerAssessments from '../components/learner/LearnerAssessments';
import LearnerProfile from '../components/learner/LearnerProfile';

import LearnerCertificates from '../components/learner/LearnerCertificates';
import LearnerNotifications from '../components/learner/LearnerNotifications';
import LearnerProgress from '../components/learner/LearnerProgress';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('catalog')) return 'Course Catalog';
        if (path.includes('my-courses')) return 'My Learning';
        if (path.includes('assessments')) return 'Assessments & Quizzes';
        if (path.includes('profile')) return 'Profile & Settings';
        if (path.includes('certificates')) return 'My Certificates';
        if (path.includes('notifications')) return 'Notifications';
        if (path.includes('progress')) return 'Progress Tracking';
        return 'Dashboard Overview';
    };

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex' }}>
            <Sidebar role="LEARNER" />

            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', margin: 0 }}>{getPageTitle()}</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>Welcome back, {user?.username}!</p>
                    </div>
                    <button className="btn" onClick={logout} style={{ border: '1px solid var(--border)' }}>Logout</button>
                </header>

                <Routes>
                    <Route path="dashboard" element={<LearnerOverview />} />
                    <Route path="catalog" element={<CourseCatalog />} />
                    <Route path="my-courses" element={<MyCourses />} />
                    <Route path="assessments" element={<LearnerAssessments />} />
                    <Route path="profile" element={<LearnerProfile />} />
                    <Route path="certificates" element={<LearnerCertificates />} />
                    <Route path="notifications" element={<LearnerNotifications />} />
                    <Route path="progress" element={<LearnerProgress />} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;
