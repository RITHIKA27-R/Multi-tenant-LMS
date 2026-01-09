import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn, Lock, Globe } from 'lucide-react';

const SecurityLogs = () => {
    const { token } = useAuth();
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8081/super-admin/audit-logs', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setLogs(data));
    }, [token]);

    return (
        <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
            <Sidebar role="SUPER_ADMIN" />
            <div style={{ flex: 1, padding: '32px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Security & Audit Logs</h1>
                        <p style={{ color: '#64748b' }}>Monitoring login attempts and system access</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div className="badge" style={{ background: '#fee2e2', color: '#ef4444', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldAlert size={18} />
                            <span>3 Failed Attempts today</span>
                        </div>
                    </div>
                </header>

                <div className="card" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc', textAlign: 'left' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', color: '#64748b' }}>Event</th>
                                <th style={{ padding: '16px 24px', color: '#64748b' }}>User / Email</th>
                                <th style={{ padding: '16px 24px', color: '#64748b' }}>Timestamp</th>
                                <th style={{ padding: '16px 24px', color: '#64748b' }}>IP Address</th>
                                <th style={{ padding: '16px 24px', color: '#64748b' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <LogIn size={18} color={log.status === 'SUCCESS' ? '#10b981' : '#ef4444'} />
                                            <span style={{ fontWeight: '500' }}>User Login</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>{log.email}</td>
                                    <td style={{ padding: '16px 24px' }}>{new Date(log.loginTime).toLocaleString()}</td>
                                    <td style={{ padding: '16px 24px' }}>{log.ipAddress || '192.168.1.1'}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                            background: log.status === 'SUCCESS' ? '#ecfdf5' : '#fff1f2',
                                            color: log.status === 'SUCCESS' ? '#059669' : '#e11d48'
                                        }}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SecurityLogs;
