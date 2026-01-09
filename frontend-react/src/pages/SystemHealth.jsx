import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Activity, Server, Database, Globe, CheckCircle2 } from 'lucide-react';

const SystemHealth = () => {
    const services = [
        { name: 'API Gateway', status: 'UP', uptime: '99.99%', latency: '45ms', icon: Globe },
        { name: 'Auth Service', status: 'UP', uptime: '100%', latency: '12ms', icon: Server },
        { name: 'User Service', status: 'UP', uptime: '99.98%', latency: '20ms', icon: Users },
        { name: 'Course Service', status: 'UP', uptime: '99.95%', latency: '35ms', icon: Package },
        { name: 'DB Instance', status: 'UP', uptime: '100%', latency: '2ms', icon: Database },
    ];

    return (
        <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
            <Sidebar role="SUPER_ADMIN" />
            <div style={{ flex: 1, padding: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>System Health & Status</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    {services.map((service) => (
                        <div key={service.name} className="card" style={{ background: 'white', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ padding: '16px', background: '#f0fdf4', color: '#16a34a', borderRadius: '12px' }}>
                                <service.icon size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontWeight: '600' }}>{service.name}</h3>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>{service.status}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Uptime</p>
                                        <p style={{ fontSize: '14px', fontWeight: '600' }}>{service.uptime}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Latency</p>
                                        <p style={{ fontSize: '14px', fontWeight: '600' }}>{service.latency}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ marginTop: '32px', background: '#1e293b', color: 'white', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ marginBottom: '16px', color: '#94a3b8' }}>Real-time Error Logs</h3>
                    <div style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                        <p style={{ color: '#94a3b8' }}>[2023-10-27 10:15:22] <span style={{ color: '#10b981' }}>INFO</span>: Discovery Client registered user-service</p>
                        <p style={{ color: '#94a3b8' }}>[2023-10-27 10:20:45] <span style={{ color: '#10b981' }}>INFO</span>: Generating monthly analytics report...</p>
                        <p style={{ color: '#94a3b8' }}>[2023-10-27 10:25:01] <span style={{ color: '#f59e0b' }}>WARN</span>: Thread pool near capacity in course-service</p>
                        <p style={{ color: '#94a3b8' }}>[2023-10-27 10:30:12] <span style={{ color: '#10b981' }}>INFO</span>: 124 users currently active</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Placeholder icons since Imports in markdown can be tricky
const Users = () => <Activity size={24} />;
const Package = () => <Activity size={24} />;

export default SystemHealth;
