import React, { useState } from 'react';
import { Save, Shield, Bell, Lock } from 'lucide-react';

const TenantSettings = () => {
    const [branding, setBranding] = useState({
        primaryColor: '#667eea',
        logoUrl: '',
        orgName: 'My Organization'
    });

    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        courseUpdates: true,
        newSignups: false
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ padding: '10px', background: '#ebf4ff', borderRadius: '8px', color: '#667eea' }}>
                        <Shield size={20} />
                    </div>
                    <h3 style={{ margin: 0 }}>Tenant Branding</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group">
                        <label>Organization Name</label>
                        <input className="input-field" value={branding.orgName} onChange={(e) => setBranding({ ...branding, orgName: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Logo URL</label>
                        <input className="input-field" value={branding.logoUrl} placeholder="https://..." onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Primary Brand Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <input type="color" value={branding.primaryColor} onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })} style={{ height: '40px', width: '60px', borderRadius: '8px', border: '1px solid var(--border)', padding: '2px' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{branding.primaryColor}</span>
                    </div>
                </div>
                <button className="btn btn-primary" style={{ marginTop: '10px' }}><Save size={16} style={{ marginRight: '8px' }} /> Save Changes</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ padding: '10px', background: '#f0fff4', borderRadius: '8px', color: '#48bb78' }}>
                            <Bell size={20} />
                        </div>
                        <h3 style={{ margin: 0 }}>Notification Preferences</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label htmlFor="emailAlerts" style={{ margin: 0 }}>Email Alerts</label>
                            <input type="checkbox" id="emailAlerts" checked={notifications.emailAlerts} onChange={e => setNotifications({ ...notifications, emailAlerts: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label htmlFor="courseUpdates" style={{ margin: 0 }}>Course Completion Updates</label>
                            <input type="checkbox" id="courseUpdates" checked={notifications.courseUpdates} onChange={e => setNotifications({ ...notifications, courseUpdates: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label htmlFor="newSignups" style={{ margin: 0 }}>New User Signups</label>
                            <input type="checkbox" id="newSignups" checked={notifications.newSignups} onChange={e => setNotifications({ ...notifications, newSignups: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ padding: '10px', background: '#fff5f5', borderRadius: '8px', color: '#f56565' }}>
                            <Lock size={20} />
                        </div>
                        <h3 style={{ margin: 0 }}>Security Control</h3>
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <input type="checkbox" id="session-timeout" style={{ width: '18px', height: '18px' }} />
                        <label htmlFor="session-timeout" style={{ margin: 0 }}>Enforce Session Timeout (30 mins)</label>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <input type="checkbox" id="password-change" defaultChecked style={{ width: '18px', height: '18px' }} />
                        <label htmlFor="password-change" style={{ margin: 0 }}>Allow Users to Change Password</label>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" id="new-device-alert" checked style={{ width: '18px', height: '18px' }} />
                        <label htmlFor="new-device-alert" style={{ margin: 0 }}>Alert on New Device Login</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantSettings;
