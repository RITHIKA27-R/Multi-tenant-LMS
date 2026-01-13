import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Shield, UserX, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

import { API_BASE_URL } from '../config';

const TenantAdminManagement = () => {
    const { token } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [showInvite, setShowInvite] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', tenantId: '' });

    useEffect(() => {
        fetch(`${API_BASE_URL}/super-admin/admins`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setAdmins(data));

        fetch(`${API_BASE_URL}/tenants`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setTenants(data));
    }, [token]);

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/tenants/${inviteData.tenantId}/invite-admin`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: inviteData.email })
            });
            if (res.ok) {
                setShowInvite(false);
                // Refresh list
                const refreshed = await fetch(`${API_BASE_URL}/super-admin/admins`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAdmins(await refreshed.json());
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await fetch(`${API_BASE_URL}/super-admin/admins/${id}/status?status=${status}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const updatedUser = await res.json();
                setAdmins(admins.map(a => a.id === updatedUser.id ? updatedUser : a));
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    return (
        <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
            <Sidebar role="SUPER_ADMIN" />
            <div style={{ flex: 1, padding: '32px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Tenant Admin Management</h1>
                        <p style={{ color: '#64748b' }}>Manage administrators for each organization</p>
                    </div>
                    <button className="btn" style={{ background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowInvite(true)}>
                        <UserPlus size={18} />
                        Invite Tenant Admin
                    </button>
                </header>

                <div className="card" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc', textAlign: 'left' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', color: '#64748b' }}>Admin User</th>
                                <th style={{ padding: '16px 24px', color: '#64748b' }}>Organization</th>
                                <th style={{ padding: '16px 24px', color: '#64748b' }}>Status</th>
                                <th style={{ padding: '16px 24px', color: '#64748b' }}>Last Login</th>
                                <th style={{ padding: '16px 24px', color: '#64748b' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#e0e7ff', color: '#6366f1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {admin.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{admin.username}</div>
                                                <div style={{ fontSize: '13px', color: '#64748b' }}>{admin.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        {tenants.find(t => t.id === admin.tenantId)?.name || 'N/A'}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                            background: admin.status === 'ACTIVE' ? '#ecfdf5' : '#fff1f2',
                                            color: admin.status === 'ACTIVE' ? '#059669' : '#e11d48'
                                        }}>
                                            {admin.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '14px' }}>
                                        {admin.lastLoginTime ? new Date(admin.lastLoginTime).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                title="Activate Admin"
                                                onClick={() => handleStatusUpdate(admin.id, 'ACTIVE')}
                                                style={{ padding: '8px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '8px', cursor: 'pointer' }}
                                            >
                                                <RefreshCcw size={16} color="#059669" />
                                            </button>
                                            <button
                                                title="Disable Admin"
                                                onClick={() => handleStatusUpdate(admin.id, admin.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED')}
                                                style={{ padding: '8px', border: '1px solid #fee2e2', background: '#fff1f2', borderRadius: '8px', cursor: 'pointer' }}
                                            >
                                                <UserX size={16} color={admin.status === 'LOCKED' ? '#64748b' : '#ef4444'} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showInvite && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ width: '450px', padding: '32px', background: 'white', borderRadius: '24px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Invite Tenant Admin</h2>
                            <form onSubmit={handleInvite}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#1e293b' }}>Admin Email</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input
                                            type="email"
                                            value={inviteData.email}
                                            onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
                                            required
                                            placeholder="admin@organization.com"
                                            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '32px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#1e293b' }}>Assign Organization</label>
                                    <div style={{ position: 'relative' }}>
                                        <Shield size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <select
                                            value={inviteData.tenantId}
                                            onChange={e => setInviteData({ ...inviteData, tenantId: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', appearance: 'none', background: 'white' }}
                                        >
                                            <option value="">Select a tenant...</option>
                                            {tenants.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="submit" className="btn" style={{ flex: 1, background: '#6366f1', color: 'white' }}>Send Invitation</button>
                                    <button type="button" className="btn" style={{ flex: 1, background: '#f1f5f9', color: '#64748b' }} onClick={() => setShowInvite(false)}>Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TenantAdminManagement;
