import React from 'react';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';

const LearnerNotifications = () => {
    const notifications = [
        { id: 1, type: 'success', title: 'Enrollment Confirmed', message: 'You have successfully enrolled in "Advanced React Patterns".', date: '2 hours ago', unread: true },
        { id: 2, type: 'warning', title: 'Assignment Due Soon', message: 'Your "Java Final Project" is due in 24 hours.', date: 'Yesterday', unread: false },
        { id: 3, type: 'info', title: 'New Course Announcement', message: 'Check out our new "DevOps for Beginners" course!', date: '2 days ago', unread: false },
        { id: 4, type: 'success', title: 'Assessment Results', message: 'You passed "Java Basics Quiz" with 85% score.', date: '3 days ago', unread: false },
    ];

    const getIcon = (type) => {
        if (type === 'success') return <CheckCircle size={20} color="#38a169" />;
        if (type === 'warning') return <AlertTriangle size={20} color="#dd6b20" />;
        return <Info size={20} color="#3182ce" />;
    };

    const getBg = (type) => {
        if (type === 'success') return '#f0fff4';
        if (type === 'warning') return '#fffaf0';
        return '#ebf8ff';
    };

    return (
        <div>
            <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Notifications</h3>
                    <span className="badge badge-secondary">4 Total</span>
                </div>
                {notifications.map(n => (
                    <div key={n.id} style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: n.unread ? '#fafafa' : 'white', display: 'flex', gap: '15px' }}>
                        <div style={{ padding: '10px', borderRadius: '50%', background: getBg(n.type), height: 'fit-content' }}>
                            {getIcon(n.type)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <strong style={{ color: n.unread ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{n.title}</strong>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{n.date}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>{n.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearnerNotifications;
