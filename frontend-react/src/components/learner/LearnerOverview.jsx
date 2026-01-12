import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LearnerOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        enrolled: 0,
        inProgress: 0,
        completed: 0,
        upcomingAssessments: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        // Read enrolled courses from local storage (simulation of backend)
        const enrolledIds = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');

        // Count stats based on simulated enrollment
        // Note: In a real app, this would come from a dashboard summary API
        setStats({
            enrolled: enrolledIds.length,
            inProgress: enrolledIds.length > 0 ? enrolledIds.length : 0, // Assuming all enrolled are in progress for demo
            completed: 0,
            upcomingAssessments: 0
        });

        // Set activity based on enrollment
        if (enrolledIds.length === 0) {
            setRecentActivity([]);
        } else {
            // Mock some activity if they have courses
            setRecentActivity([
                { id: 1, text: 'Enrolled in a new course', time: 'Just now' }
            ]);
        }
    }, []);

    if (stats.enrolled === 0) {
        return (
            <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                    <div className="card" style={{ padding: '24px' }}>
                        <BookOpen color="var(--text-secondary)" style={{ marginBottom: '10px', opacity: 0.5 }} />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Enrolled Courses</p>
                        <h2 style={{ color: 'var(--text-secondary)' }}>0</h2>
                    </div>
                    <div className="card" style={{ padding: '24px' }}>
                        <Clock color="var(--text-secondary)" style={{ marginBottom: '10px', opacity: 0.5 }} />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>In Progress</p>
                        <h2 style={{ color: 'var(--text-secondary)' }}>0</h2>
                    </div>
                    <div className="card" style={{ padding: '24px' }}>
                        <CheckCircle color="var(--text-secondary)" style={{ marginBottom: '10px', opacity: 0.5 }} />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Completed</p>
                        <h2 style={{ color: 'var(--text-secondary)' }}>0</h2>
                    </div>
                    <div className="card" style={{ padding: '24px' }}>
                        <Calendar color="var(--text-secondary)" style={{ marginBottom: '10px', opacity: 0.5 }} />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Upcoming Assessments</p>
                        <h2 style={{ color: 'var(--text-secondary)' }}>0</h2>
                    </div>
                </div>

                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '10px' }}>Welcome to your learning dashboard!</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>You haven't enrolled in any courses yet.</p>
                    <a href="/learner/catalog" className="btn btn-primary">Browse Course Catalog</a>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <BookOpen color="#667eea" style={{ marginBottom: '10px' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Enrolled Courses</p>
                    <h2>{stats.enrolled}</h2>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <Clock color="#ed8936" style={{ marginBottom: '10px' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>In Progress</p>
                    <h2>{stats.inProgress}</h2>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <CheckCircle color="#48bb78" style={{ marginBottom: '10px' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Completed</p>
                    <h2>{stats.completed}</h2>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <Calendar color="#f56565" style={{ marginBottom: '10px' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Upcoming Assessments</p>
                    <h2>{stats.upcomingAssessments}</h2>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Recent Activity</h3>
                <div style={{ fontSize: '14px' }}>
                    {recentActivity.map((activity, index) => (
                        <div key={index} style={{ padding: '15px 0', borderBottom: index < recentActivity.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <strong>{activity.text}</strong>
                            <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0', fontSize: '12px' }}>{activity.time}</p>
                        </div>
                    ))}
                    {recentActivity.length === 0 && (
                        <p style={{ color: 'var(--text-secondary)' }}>No recent activity.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearnerOverview;
