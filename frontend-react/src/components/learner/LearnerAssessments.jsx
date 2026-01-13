import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Clock, Play } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const LearnerAssessments = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState([]);

    useEffect(() => {
        // Fetch available assessments (mocking response structure)
        // In real app: fetch('/assessments')
        setAssessments([
            { id: 1, title: 'Java Basics Quiz', course: 'Java Basics', duration: 30, totalQuestions: 15, status: 'PENDING' },
            { id: 2, title: 'React Final Skills', course: 'Advanced React', duration: 60, totalQuestions: 25, status: 'COMPLETED', score: '85%' },
        ]);
    }, []);

    const handleStart = async (testId) => {
        try {
            // Simulate API call or real call
            // const res = await fetch(`${API_BASE_URL}/assessments/${testId}/start`, {
            //    method: 'POST', 
            //    headers: { 'Authorization': `Bearer ${token}` }
            // });
            // const attempt = await res.json();

            // Mock attempt creation
            const attemptId = Date.now();
            navigate(`/learner/test/${attemptId}`);
        } catch (error) {
            console.error("Failed to start test", error);
        }
    };

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--bg-primary)', textAlign: 'left' }}>
                    <tr>
                        <th style={{ padding: '15px 24px' }}>Assessment</th>
                        <th style={{ padding: '15px 24px' }}>Course</th>
                        <th style={{ padding: '15px 24px' }}>Duration</th>
                        <th style={{ padding: '15px 24px' }}>Questions</th>
                        <th style={{ padding: '15px 24px' }}>Status</th>
                        <th style={{ padding: '15px 24px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {assessments.map(a => (
                        <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '15px 24px', fontWeight: '500' }}>{a.title}</td>
                            <td style={{ padding: '15px 24px' }}>{a.course}</td>
                            <td style={{ padding: '15px 24px' }}>{a.duration} min</td>
                            <td style={{ padding: '15px 24px' }}>{a.totalQuestions}</td>
                            <td style={{ padding: '15px 24px' }}>
                                {a.status === 'COMPLETED' ?
                                    <span className="badge" style={{ background: '#def7ec', color: '#03543f' }}>Score: {a.score}</span> :
                                    <span className="badge" style={{ background: '#e1effe', color: '#1e429f' }}>Ready</span>
                                }
                            </td>
                            <td style={{ padding: '15px 24px' }}>
                                {a.status !== 'COMPLETED' ? (
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '6px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        onClick={() => handleStart(a.id)}
                                    >
                                        <Play size={14} /> Start Test
                                    </button>
                                ) : (
                                    <button className="btn" disabled style={{ padding: '6px 12px', fontSize: '13px', opacity: 0.5 }}>Completed</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LearnerAssessments;
