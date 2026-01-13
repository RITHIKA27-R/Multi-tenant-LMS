import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Globe, Lock, Users, AlertTriangle, Plus, Trash2, Search, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

import { API_BASE_URL } from '../config';

const Security = () => {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('audit');
    const [auditLogs, setAuditLogs] = useState([]);
    const [ipRestrictions, setIpRestrictions] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newIp, setNewIp] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            if (activeTab === 'audit') {
                const res = await fetch(`${API_BASE_URL}/security/audit-logs`, { headers });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        const sorted = data.sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime));
                        setAuditLogs(sorted);
                    }
                }
            } else if (activeTab === 'ip') {
                const res = await fetch(`${API_BASE_URL}/security/ip-restrictions`, { headers });
                if (res.ok) setIpRestrictions(await res.json());
            } else if (activeTab === 'roles') {
                const res = await fetch(`${API_BASE_URL}/security/permissions`, { headers });
                if (res.ok) setPermissions(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch security data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddIp = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/security/ip-restrictions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ipAddress: newIp, isAllowed: true, description: 'Manual Entry' })
            });
            if (res.ok) {
                setNewIp('');
                fetchData();
            }
        } catch (error) {
            console.error("Failed to add IP", error);
        }
    };

    const handleDeleteIp = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/security/ip-restrictions/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error("Failed to delete IP", error);
        }
    };

    const tabs = [
        { id: 'audit', label: 'Login Audit Logs', icon: Activity },
        { id: 'ip', label: 'IP Restrictions', icon: Globe },
        { id: 'roles', label: 'Role Permissions', icon: Lock },
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    // Enhanced Search Logic
    const filteredLogs = auditLogs.filter(log => {
        const term = searchTerm.toLowerCase();
        return (
            log.email?.toLowerCase().includes(term) ||
            log.status?.toLowerCase().includes(term) ||
            log.ipAddress?.includes(term) ||
            log.tenantId?.toLowerCase().includes(term)
        );
    });

    return (
        <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
            <Sidebar role="SUPER_ADMIN" />

            <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: '#6366f1' }}>
                                <Shield size={32} />
                            </div>
                            Security Center
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                            Protect the LMS from unauthorized access, misuse, and data breaches across all tenants.
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                        {[
                            { title: 'Failed Logins (24h)', value: '12', color: '#ef4444', icon: AlertTriangle },
                            { title: 'Active IP Rules', value: ipRestrictions.length.toString(), color: '#10b981', icon: Globe },
                            { title: 'Total Audit Logs', value: auditLogs.length.toString(), color: '#3b82f6', icon: Activity },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="card"
                                style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}
                            >
                                <div style={{ padding: '12px', borderRadius: '12px', background: `${stat.color}20`, color: stat.color }}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>{stat.title}</div>
                                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{stat.value}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '1px' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '12px 24px',
                                    background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                                    color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                                    border: 'none', borderRadius: '12px', cursor: 'pointer',
                                    fontSize: '14px', fontWeight: '500', transition: 'all 0.2s',
                                    position: 'relative', top: '1px'
                                }}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'audit' && (
                                <div className="card">
                                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Recent Login Activity</h3>
                                        <div style={{ position: 'relative' }}>
                                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', translateY: '-50%', color: 'var(--text-secondary)' }} />
                                            <input
                                                type="text"
                                                placeholder="Search logs..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                    <th style={{ padding: '16px' }}>User</th>
                                                    <th style={{ padding: '16px' }}>Status</th>
                                                    <th style={{ padding: '16px' }}>IP Address</th>
                                                    <th style={{ padding: '16px' }}>Time</th>
                                                    <th style={{ padding: '16px' }}>Tenant ID</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredLogs.map((log, i) => (
                                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                                        <td style={{ padding: '16px', fontWeight: '500' }}>{log.email}</td>
                                                        <td style={{ padding: '16px' }}>
                                                            <span style={{
                                                                padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                                                background: log.status === 'SUCCESS' ? '#dcfce7' : '#fee2e2',
                                                                color: log.status === 'SUCCESS' ? '#166534' : '#991b1b'
                                                            }}>
                                                                {log.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '16px', fontFamily: 'monospace' }}>{log.ipAddress || 'N/A'}</td>
                                                        <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                                                            {new Date(log.loginTime).toLocaleString()}
                                                        </td>
                                                        <td style={{ padding: '16px' }}>{log.tenantId || 'Global'}</td>
                                                    </tr>
                                                ))}
                                                {filteredLogs.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                            No audit logs found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ip' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                                    <div className="card">
                                        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Allowed IP Addresses</h3>
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Only users from these IPs can access the platform (if rules exist).</p>
                                        </div>
                                        <div style={{ padding: '24px' }}>
                                            {ipRestrictions.map(ip => (
                                                <div key={ip.id} style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '12px'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ padding: '8px', borderRadius: '8px', background: '#dcfce7', color: '#166534' }}>
                                                            <Check size={16} />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>{ip.ipAddress}</div>
                                                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{ip.description}</div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteIp(ip.id)}
                                                        style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#991b1b', cursor: 'pointer' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            {ipRestrictions.length === 0 && (
                                                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                                                    <Globe size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                                                    <p>No IP restrictions active. Global access allowed.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card" style={{ height: 'fit-content' }}>
                                        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Add New Rule</h3>
                                        </div>
                                        <form onSubmit={handleAddIp} style={{ padding: '24px' }}>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>IP Address</label>
                                                <input
                                                    type="text"
                                                    placeholder="192.168.1.1"
                                                    value={newIp}
                                                    onChange={(e) => setNewIp(e.target.value)}
                                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                                                    required
                                                />
                                            </div>
                                            <div style={{ marginBottom: '24px' }}>
                                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Description</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Office HQ"
                                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                                <Plus size={16} />
                                                Add Rule
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'roles' && (
                                <div className="card">
                                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Role Permissions Matrix</h3>
                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Define detailed access controls for each role.</p>
                                    </div>
                                    <div style={{ padding: '24px' }}>
                                        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px', color: '#92400e', marginBottom: '24px' }}>
                                            <AlertTriangle size={20} />
                                            <div>
                                                <strong>Note:</strong> Modifying Super Admin permissions is restricted for security reasons.
                                            </div>
                                        </div>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                                                    <th style={{ padding: '12px' }}>Module</th>
                                                    <th style={{ padding: '12px' }}>Role</th>
                                                    <th style={{ padding: '12px', textAlign: 'center' }}>Create</th>
                                                    <th style={{ padding: '12px', textAlign: 'center' }}>Read</th>
                                                    <th style={{ padding: '12px', textAlign: 'center' }}>Update</th>
                                                    <th style={{ padding: '12px', textAlign: 'center' }}>Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Mock Data for Visualization */}
                                                {['Users', 'Courses', 'Assessments', 'Reports'].map(module => (
                                                    ['TENANT_ADMIN', 'LEARNER'].map(role => (
                                                        <tr key={`${module}-${role}`} style={{ borderBottom: '1px solid var(--border)' }}>
                                                            <td style={{ padding: '16px', fontWeight: '500' }}>{module}</td>
                                                            <td style={{ padding: '16px' }}>
                                                                <span style={{
                                                                    padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                                                                    background: role === 'TENANT_ADMIN' ? '#e0e7ff' : '#f3f4f6',
                                                                    color: role === 'TENANT_ADMIN' ? '#4338ca' : '#374151'
                                                                }}>
                                                                    {role}
                                                                </span>
                                                            </td>
                                                            {['C', 'R', 'U', 'D'].map((action, i) => (
                                                                <td key={i} style={{ padding: '16px', textAlign: 'center' }}>
                                                                    <input type="checkbox" defaultChecked={role === 'TENANT_ADMIN' || (role === 'LEARNER' && action === 'R')} />
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Security;
