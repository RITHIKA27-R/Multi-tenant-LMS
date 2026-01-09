import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
    Building2, Users, CheckCircle2, TrendingUp,
    AlertCircle, LifeBuoy, ShieldAlert, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area
} from 'recharts';

const tenantGrowthData = [
    { month: 'Jan', tenants: 5 },
    { month: 'Feb', tenants: 12 },
    { month: 'Mar', tenants: 18 },
    { month: 'Apr', tenants: 25 },
    { month: 'May', tenants: 32 },
    { month: 'Jun', tenants: 45 },
    { month: 'Jul', tenants: 50 },
];

const activeUserData = [
    { day: 'Mon', users: 120 },
    { day: 'Tue', users: 100 },
    { day: 'Wed', users: 150 },
    { day: 'Thu', users: 80 },
    { day: 'Fri', users: 200 },
    { day: 'Sat', users: 90 },
    { day: 'Sun', users: 70 },
];

const SuperAdminDashboard = () => {
    const { token, logout } = useAuth();
    const [stats, setStats] = useState({
        totalTenants: 12,
        totalUsers: 450,
        activeTenants: 10,
        pendingTickets: 3
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:8080/super-admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, [token]);

    const statCards = [
        { name: 'Total Tenants', value: stats.totalTenants, icon: Building2, color: '#6366f1' },
        { name: 'Total Users', value: stats.totalUsers, icon: Users, color: '#10b981' },
        { name: 'Active Tenants', value: stats.activeTenants, icon: CheckCircle2, color: '#f59e0b' },
        { name: 'Support Tickets', value: stats.pendingTickets, icon: LifeBuoy, color: '#ef4444' },
    ];

    return (
        <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
            <Sidebar role="SUPER_ADMIN" />

            <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b' }}>Super Admin Overview</h1>
                        <p style={{ color: '#64748b' }}>Platform growth & usage monitoring</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn" style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }}>
                            Download Report
                        </button>
                        <button onClick={logout} className="btn" style={{ background: '#ef4444', color: 'white' }}>
                            Logout
                        </button>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                    {statCards.map((stat, i) => (
                        <motion.div
                            key={stat.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="card"
                            style={{
                                padding: '24px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                display: 'flex', alignItems: 'center', gap: '20px'
                            }}
                        >
                            <div style={{ padding: '12px', background: `${stat.color}15`, borderRadius: '12px', color: stat.color }}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{stat.name}</p>
                                <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1e293b' }}>{stat.value}</h2>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    {/* Tenant Growth Graph */}
                    <div className="card" style={{ padding: '24px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#334155' }}>Tenant Growth</h3>
                            <TrendingUp size={20} color="#6366f1" />
                        </div>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={tenantGrowthData}>
                                    <defs>
                                        <linearGradient id="colorTenantsDash" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="tenants" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTenantsDash)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Actions & Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="card" style={{ padding: '24px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Quick Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button style={{ padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <ShieldAlert size={18} color="#ef4444" />
                                    <span style={{ fontWeight: '500' }}>Security Audit</span>
                                </button>
                                <button style={{ padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <Activity size={18} color="#10b981" />
                                    <span style={{ fontWeight: '500' }}>System Health Check</span>
                                </button>
                                <button style={{ padding: '12px', background: '#ecfdf5', border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#059669', marginTop: '10px' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>All systems operational</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Active Graph - Full Width below */}
                <div className="card" style={{ padding: '24px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '20px' }}>User Active Trends (Weekly)</h3>
                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activeUserData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
