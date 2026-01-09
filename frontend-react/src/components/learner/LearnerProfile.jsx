import React, { useState } from 'react';
import { User, Bell, Lock, Key, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LearnerProfile = () => {
    const { user, token } = useAuth();
    const [notifications, setNotifications] = useState({
        announcements: true,
        reminders: true,
        results: true
    });

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        // Validation
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/users/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldPassword: passwordForm.oldPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            if (response.ok) {
                setPasswordSuccess('Password changed successfully!');
                setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => {
                    setShowPasswordModal(false);
                    setPasswordSuccess('');
                }, 2000);
            } else {
                const error = await response.text();
                setPasswordError(error || 'Failed to change password. Please check your old password.');
            }
        } catch (error) {
            setPasswordError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px' }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <User size={30} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '20px', margin: 0 }}>{user?.username || 'Learner'}</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Student</p>
                    </div>
                </div>

                <div className="form-group">
                    <label>Full Name</label>
                    <input className="input-field" defaultValue={user?.username} />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input className="input-field" defaultValue="learner@example.com" disabled />
                </div>
                <button className="btn btn-primary">Save Changes</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <Bell size={20} color="var(--primary-dark)" />
                        <h3 style={{ margin: 0 }}>Notification Preferences</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                            <span>Announcements</span>
                            <input type="checkbox" checked={notifications.announcements} onChange={e => setNotifications({ ...notifications, announcements: e.target.checked })} />
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                            <span>Assignment Reminders</span>
                            <input type="checkbox" checked={notifications.reminders} onChange={e => setNotifications({ ...notifications, reminders: e.target.checked })} />
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                            <span>Assessment Results</span>
                            <input type="checkbox" checked={notifications.results} onChange={e => setNotifications({ ...notifications, results: e.target.checked })} />
                        </label>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <Lock size={20} color="var(--error)" />
                        <h3 style={{ margin: 0 }}>Security</h3>
                    </div>
                    <button
                        className="btn"
                        style={{ width: '100%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        onClick={() => setShowPasswordModal(true)}
                    >
                        <Key size={16} /> Change Password
                    </button>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '450px', padding: '32px', position: 'relative' }}>
                        <button
                            onClick={() => setShowPasswordModal(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{ marginBottom: '24px' }}>Change Password</h2>

                        {passwordError && (
                            <div style={{
                                padding: '12px',
                                background: '#fee',
                                border: '1px solid #fcc',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#c00'
                            }}>
                                <AlertCircle size={18} />
                                {passwordError}
                            </div>
                        )}

                        {passwordSuccess && (
                            <div style={{
                                padding: '12px',
                                background: '#efe',
                                border: '1px solid #cfc',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#0a0'
                            }}>
                                <CheckCircle size={18} />
                                {passwordSuccess}
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange}>
                            <div className="form-group">
                                <label>Old Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={passwordForm.oldPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={passwordForm.newPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={passwordForm.confirmPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setShowPasswordModal(false)}
                                    style={{ flex: 1, border: '1px solid var(--border)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                    style={{ flex: 1 }}
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>

                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '16px', textAlign: 'center' }}>
                            If you forgot your password, contact your tenant admin for a reset.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearnerProfile;
