import React from 'react';
import Sidebar from '../components/Sidebar';
import { Settings, Lock, Mail, Palette, Globe } from 'lucide-react';

const PlatformSettings = () => {
    return (
        <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
            <Sidebar role="SUPER_ADMIN" />
            <div style={{ flex: 1, padding: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>Global Platform Settings</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '800px' }}>
                    <div className="card" style={{ background: 'white', borderRadius: '16px', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <Lock size={20} color="#6366f1" />
                            <h3 style={{ fontWeight: '600' }}>Security Rules</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontWeight: '500' }}>Failed Login Lockout</p>
                                    <p style={{ fontSize: '13px', color: '#64748b' }}>Lock account after 5 consecutive failed attempts</p>
                                </div>
                                <input type="checkbox" defaultChecked style={{ width: '40px', height: '20px' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontWeight: '500' }}>Session Timeout</p>
                                    <p style={{ fontSize: '13px', color: '#64748b' }}>Automatically logout inactive users after (minutes)</p>
                                </div>
                                <input type="number" defaultValue={60} style={{ width: '80px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ background: 'white', borderRadius: '16px', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <Palette size={20} color="#10b981" />
                            <h3 style={{ fontWeight: '600' }}>Default Branding</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ fontSize: '13px', color: '#64748b' }}>Primary Theme Color</label>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                    <input type="color" defaultValue="#6366f1" style={{ width: '40px', height: '40px', border: 'none', background: 'none' }} />
                                    <input type="text" defaultValue="#6366f1" style={{ flex: 1, padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', color: '#64748b' }}>Platform Name</label>
                                <input type="text" defaultValue="LMS Platinum" style={{ width: '100%', marginTop: '8px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn" style={{ background: '#6366f1', color: 'white', padding: '12px 32px' }}>
                            Save Platform Configuration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformSettings;
