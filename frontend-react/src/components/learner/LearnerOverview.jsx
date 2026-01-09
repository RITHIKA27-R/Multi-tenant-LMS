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

    useEffect(() => {
        // Mock fetch
        setStats({
            enrolled: 4,
            inProgress: 2,
            completed: 1,
            upcomingAssessments: 2
        });
    }, []);

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
                    <div style={{ padding: '15px 0', borderBottom: '1px solid var(--border)' }}>
                        <strong>Enrolled in "Advanced React Patterns"</strong>
                        <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0', fontSize: '12px' }}>2 hours ago</p>
                    </div>
                    <div style={{ padding: '15px 0', borderBottom: '1px solid var(--border)' }}>
                        <strong>Completed Lesson: "React Hooks"</strong>
                        <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0', fontSize: '12px' }}>Yesterday</p>
                    </div>
                    <div style={{ padding: '15px 0' }}>
                        <strong>Assessment Passed: "Java Basics Quiz"</strong>
                        <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0', fontSize: '12px' }}>2 days ago</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnerOverview;
