import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const TestResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, total } = location.state || { score: 0, total: 0 };

    // Calculate percentage
    const percentage = Math.round((score / 100) * 100); // Mock score is directly percentage-like in previous step
    // Actually, backend returns score (0-100).

    return (
        <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
            <div className="card" style={{ padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    width: '80px', height: '80px',
                    background: percentage >= 70 ? '#def7ec' : '#fde8e8',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '24px'
                }}>
                    {percentage >= 70 ? <CheckCircle size={40} color="green" /> : <AlertTriangle size={40} color="red" />}
                </div>

                <h1 style={{ marginBottom: '8px' }}>Test Completed</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>You have successfully submitted your assessment.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', marginBottom: '40px' }}>
                    <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Score</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{percentage}%</div>
                    </div>
                    <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Status</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: percentage >= 70 ? 'green' : 'red' }}>
                            {percentage >= 70 ? 'Passed' : 'Failed'}
                        </div>
                    </div>
                </div>

                <button className="btn btn-primary" onClick={() => navigate('/learner/assessments')}>Back to Assessments</button>
            </div>
        </div>
    );
};

export default TestResult;
