import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { fetchTenants, createTenant, updateTenant, deleteTenant } from '../store/slices/superAdminSlice';
import { Plus, Search, Building2, UserPlus, ShieldAlert, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TenantList = () => {
    const dispatch = useDispatch();
    const { token } = useAuth();
    const { tenants } = useSelector(state => state.superAdmin);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [newTenant, setNewTenant] = useState({ name: '', identifier: '', planType: 'FREE' });
    const [editingTenant, setEditingTenant] = useState(null);

    useEffect(() => {
        dispatch(fetchTenants(token));
    }, [dispatch, token]);

    const handleCreate = (e) => {
        e.preventDefault();
        dispatch(createTenant({ tenantData: newTenant, token }));
        setShowAdd(false);
        setNewTenant({ name: '', identifier: '', planType: 'FREE' });
    };

    const handleEdit = (tenant) => {
        setEditingTenant(tenant);
        setShowEdit(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const { id, name, planType } = editingTenant;
        dispatch(updateTenant({ id, tenantData: { name, planType }, token }));
        setShowEdit(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this tenant permanently? This action cannot be undone.")) {
            try {
                await dispatch(deleteTenant({ id, token })).unwrap();
                // Success is handled by the reducer removing the item from the state
            } catch (err) {
                console.error("Failed to delete tenant:", err);
                alert("Failed to delete tenant. Please try again.\nError: " + (err.message || err));
            }
        }
    };

    return (
        <div style={{ display: 'flex', background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <Sidebar role="SUPER_ADMIN" />

            <div style={{ flex: 1, padding: '40px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px' }}>Tenant Management</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Manage all organizations on the platform</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                        <Plus size={18} /> Add New Tenant
                    </button>
                </header>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--bg-primary)', textAlign: 'left' }}>
                            <tr>
                                <th style={{ padding: '15px 24px', color: 'var(--text-secondary)' }}>Organization Name</th>
                                <th style={{ padding: '15px 24px', color: 'var(--text-secondary)' }}>Identifier</th>
                                <th style={{ padding: '15px 24px', color: 'var(--text-secondary)' }}>Plan</th>
                                <th style={{ padding: '15px 24px', color: 'var(--text-secondary)' }}>Status</th>
                                <th style={{ padding: '15px 24px', color: 'var(--text-secondary)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '15px 24px', fontWeight: '500' }}>{t.name}</td>
                                    <td style={{ padding: '15px 24px' }}><code>{t.identifier}</code></td>
                                    <td style={{ padding: '15px 24px' }}><span className="badge badge-primary">{t.planType || 'FREE'}</span></td>
                                    <td style={{ padding: '15px 24px' }}>Active</td>
                                    <td style={{ padding: '15px 24px' }}>
                                        <button
                                            className="btn"
                                            style={{ fontSize: '12px', padding: '5px 10px', marginRight: '5px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                            onClick={() => handleEdit(t)}
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            className="btn"
                                            style={{ fontSize: '12px', padding: '5px 10px', background: '#fff5f5', color: 'var(--error)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                            onClick={() => handleDelete(t.id)}
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showAdd && (
                    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ width: '450px', padding: '30px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                            <h2 style={{ marginBottom: '20px' }}>Onboard New Tenant</h2>
                            <form onSubmit={handleCreate}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Organization Name</label>
                                    <input type="text" value={newTenant.name} onChange={e => setNewTenant({ ...newTenant, name: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none' }} placeholder="e.g. Acme Corp" />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Subdomain / Identifier</label>
                                    <input type="text" value={newTenant.identifier} onChange={e => setNewTenant({ ...newTenant, identifier: e.target.value.toLowerCase() })} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none' }} placeholder="e.g. acme" />
                                </div>
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Plan Type</label>
                                    <select value={newTenant.planType} onChange={e => setNewTenant({ ...newTenant, planType: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'white', outline: 'none' }}>
                                        <option value="FREE">Free</option>
                                        <option value="PRO">Pro</option>
                                        <option value="ENTERPRISE">Enterprise</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>Create Tenant</button>
                                    <button type="button" className="btn" style={{ flex: 1, padding: '12px' }} onClick={() => setShowAdd(false)}>Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {showEdit && editingTenant && (
                    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ width: '450px', padding: '30px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                            <h2 style={{ marginBottom: '20px' }}>Edit Tenant</h2>
                            <form onSubmit={handleUpdate}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Organization Name</label>
                                    <input type="text" value={editingTenant.name} onChange={e => setEditingTenant({ ...editingTenant, name: e.target.value })} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none' }} />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Subdomain / Identifier (Read Only)</label>
                                    <input type="text" value={editingTenant.identifier} disabled style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f8fafc', color: '#94a3b8' }} />
                                </div>
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Plan Type</label>
                                    <select value={editingTenant.planType} onChange={e => setEditingTenant({ ...editingTenant, planType: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'white', outline: 'none' }}>
                                        <option value="FREE">Free</option>
                                        <option value="PRO">Pro</option>
                                        <option value="ENTERPRISE">Enterprise</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>Save Changes</button>
                                    <button type="button" className="btn" style={{ flex: 1, padding: '12px' }} onClick={() => setShowEdit(false)}>Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TenantList;
