import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TenantDashboardHome = () => {
    const { token, user } = useAuth();
    const [stats, setStats] = useState({
        learners: 0,
        courses: 0,
        active: 0,
        completion: '0%'
    });
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        // Mock data fetch - replace with real API calls later
        // In real app, fetch from /stats endpoints
        setStats({
            learners: 24,
            courses: 8,
            active: 12,
            completion: '78%'
        });

        setRecentActivity([
            { id: 1, text: 'John Doe enrolled in "Java Basics"', time: '2 mins ago' },
            { id: 2, text: 'Sarah Smith completed "React Native"', time: '1 hour ago' },
            { id: 3, text: 'New Assessment "Spring Boot Quiz" created', time: '4 hours ago' },
            { id: 4, text: 'New user "Mike Ross" added', time: 'Yesterday' }
        ]);
    }, []);

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <Users color="#667eea" style={{ marginBottom: '10px' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Learners</p>
                    <h2>{stats.learners}</h2>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <BookOpen color="#48bb78" style={{ marginBottom: '10px' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Courses</p>
                    <h2>{stats.courses}</h2>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <CheckCircle2 color="#ed8936" style={{ marginBottom: '10px' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Completion Rate</p>
                    <h2>{stats.completion}</h2>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <Clock color="#9f7aea" style={{ marginBottom: '10px' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Active Users</p>
                    <h2>{stats.active}</h2>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Recent Activities</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {recentActivity.map(activity => (
                        <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                            <span>{activity.text}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TenantDashboardHome;
