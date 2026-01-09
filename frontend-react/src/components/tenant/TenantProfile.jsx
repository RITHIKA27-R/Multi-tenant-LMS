import React, { useState } from 'react';
import { User, Mail, Lock, Key, Save, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TenantProfile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '', // Email is usually read-only
    });

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div className="card" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <User size={40} />
                        </div>
                        <div>
                            <h2 style={{ margin: '0 0 5px 0' }}>{user?.username}</h2>
                            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Tenant Administrator</p>
                        </div>
                    </div>
                    <button className="btn" style={{ border: '1px solid var(--border)' }} onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-field" style={{ display: 'flex', alignItems: 'center', background: isEditing ? 'white' : '#f7fafc' }}>
                            <User size={18} style={{ color: 'var(--text-secondary)', marginRight: '10px' }} />
                            <input
                                value={formData.username}
                                disabled={!isEditing}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-field" style={{ display: 'flex', alignItems: 'center', background: '#f7fafc' }}>
                            <Mail size={18} style={{ color: 'var(--text-secondary)', marginRight: '10px' }} />
                            <input
                                value={formData.email}
                                disabled
                                style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', color: 'var(--text-secondary)' }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <div className="input-field" style={{ display: 'flex', alignItems: 'center', background: '#f7fafc' }}>
                            <Shield size={18} style={{ color: 'var(--text-secondary)', marginRight: '10px' }} />
                            <input
                                value="TENANT_ADMIN"
                                disabled
                                style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', color: 'var(--text-secondary)' }}
                            />
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary"><Save size={16} style={{ marginRight: '8px' }} /> Save Changes</button>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Lock size={20} color="var(--primary-dark)" />
                        <h3 style={{ margin: 0 }}>Security</h3>
                    </div>

                    <div className="form-group">
                        <label>Current Password</label>
                        <input type="password" class="input-field" placeholder="••••••••" />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" class="input-field" placeholder="Enter new password" />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        <Key size={16} style={{ marginRight: '8px' }} /> Update Password
                    </button>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '15px' }}>Account Info</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '5px 0' }}>Tenant ID: {user?.tenantId}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '5px 0' }}>Last Login: {new Date().toLocaleDateString()}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '5px 0' }}>Status: <span style={{ color: '#48bb78', fontWeight: 'bold' }}>Active</span></p>
                </div>
            </div>
        </div>
    );
};

export default TenantProfile;
