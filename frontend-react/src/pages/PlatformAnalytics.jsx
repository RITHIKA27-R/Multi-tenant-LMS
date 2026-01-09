import React from 'react';
import Sidebar from '../components/Sidebar';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line, AreaChart, Area
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

const PlatformAnalytics = () => {
    return (
        <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
            <Sidebar role="SUPER_ADMIN" />
            <div style={{ flex: 1, padding: '32px' }}>
                <header style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Platform Analytics</h1>
                    <p style={{ color: '#64748b', marginTop: '4px' }}>Insights into system growth and user engagement</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                    {/* Tenant Growth Graph */}
                    <div className="card" style={{ padding: '24px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <h3 style={{ marginBottom: '20px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Tenant Growth Trend
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Organizations joined over time</p>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={tenantGrowthData}>
                                    <defs>
                                        <linearGradient id="colorTenants" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="tenants" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTenants)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Active User Graph */}
                    <div className="card" style={{ padding: '24px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <h3 style={{ marginBottom: '20px', color: '#334155' }}>User Activity Breakdown</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Daily active user distribution</p>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={activeUserData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Additional Insights Card */}
                <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', borderRadius: '20px', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '20px' }}>Global Growth Summary</h3>
                            <p style={{ opacity: 0.8, fontSize: '14px', marginTop: '4px' }}>Platform performance compared to previous month</p>
                        </div>
                        <div style={{ display: 'flex', gap: '40px' }}>
                            <div>
                                <p style={{ opacity: 0.7, margin: 0, fontSize: '12px', textTransform: 'uppercase' }}>New Tenants</p>
                                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>+12.5%</p>
                            </div>
                            <div>
                                <p style={{ opacity: 0.7, margin: 0, fontSize: '12px', textTransform: 'uppercase' }}>Active Users</p>
                                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>+8.2%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformAnalytics;
