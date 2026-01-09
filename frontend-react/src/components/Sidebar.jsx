import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Activity, Users, FileText, Lock,
    Settings, LifeBuoy, LogOut, Home, BookOpen
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role }) => {
    const location = useLocation();

    const superAdminLinks = [
        { name: 'Dashboard', icon: Home, path: '/super-admin/dashboard' },
        { name: 'Tenants', icon: FileText, path: '/super-admin/tenants' },
        { name: 'Tenant Admins', icon: Users, path: '/super-admin/admins' },
        { name: 'Platform Analytics', icon: Activity, path: '/super-admin/analytics' },
        { name: 'Subscriptions & Plans', icon: FileText, path: '/super-admin/plans' },
        { name: 'Security', icon: Lock, path: '/super-admin/security' },
        { name: 'System Health', icon: Activity, path: '/super-admin/health' },
        { name: 'Support', icon: LifeBuoy, path: '/super-admin/support' },
        { name: 'Settings', icon: Settings, path: '/super-admin/settings' },
    ];

    const tenantAdminLinks = [
        { name: 'Dashboard', icon: Home, path: '/tenant-admin/dashboard' },
        { name: 'Users', icon: Users, path: '/tenant-admin/users' },
        { name: 'Courses', icon: FileText, path: '/tenant-admin/courses' },
        { name: 'Assessments', icon: FileText, path: '/tenant-admin/assessments' },
        { name: 'Reports', icon: Activity, path: '/tenant-admin/reports' },
        { name: 'Support', icon: LifeBuoy, path: '/tenant-admin/support' },
        { name: 'Settings', icon: Settings, path: '/tenant-admin/settings' },
        { name: 'Profile', icon: Users, path: '/tenant-admin/profile' },
    ];

    const learnerLinks = [
        { name: 'Dashboard', icon: Home, path: '/learner/dashboard' },
        { name: 'Course Catalog', icon: BookOpen, path: '/learner/catalog' },
        { name: 'My Courses', icon: BookOpen, path: '/learner/my-courses' },
        { name: 'Progress Tracking', icon: Activity, path: '/learner/progress' },
        { name: 'Assessments', icon: FileText, path: '/learner/assessments' },
        { name: 'Certificates', icon: FileText, path: '/learner/certificates' },
        { name: 'Notifications', icon: BookOpen, path: '/learner/notifications' },
        { name: 'Profile & Settings', icon: Settings, path: '/learner/profile' },
    ];

    let links = [];
    if (role === 'SUPER_ADMIN') links = superAdminLinks;
    else if (role === 'TENANT_ADMIN') links = tenantAdminLinks;
    else links = learnerLinks;

    return (
        <div className="sidebar" style={{ width: '260px', background: 'white', height: '100vh', borderRight: '1px solid var(--border)' }}>
            <div style={{ padding: '30px', fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                LMS Platinum
            </div>
            <nav style={{ padding: '0 15px' }}>
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px',
                            borderRadius: '10px', marginBottom: '5px', textDecoration: 'none',
                            color: location.pathname === link.path ? 'white' : 'var(--text-secondary)',
                            background: location.pathname === link.path ? 'var(--primary)' : 'transparent',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <link.icon size={20} />
                        <span style={{ fontWeight: '500' }}>{link.name}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
