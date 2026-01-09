import React from 'react';

const ReportsAnalytics = () => {
    // Mock data for charts
    const enrollmentData = [
        { course: 'Java Basics', enrolled: 45, completed: 30 },
        { course: 'React Native', enrolled: 28, completed: 12 },
        { course: 'Spring Boot', enrolled: 35, completed: 25 },
        { course: 'UI/UX Design', enrolled: 50, completed: 10 },
    ];

    const learnerProgress = [
        { name: 'John Doe', course: 'Java Basics', progress: 75 },
        { name: 'Sarah Smith', course: 'React Native', progress: 40 },
        { name: 'Mike Ross', course: 'Spring Boot', progress: 90 },
        { name: 'Rachel Zane', course: 'UI/UX Design', progress: 20 },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
                <h3>Course Enrollment & Completion</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '300px', gap: '40px', padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
                    {enrollmentData.map((d, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', height: '100%', justifyContent: 'flex-end' }}>
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end', height: '100%', width: '100%', justifyContent: 'center' }}>
                                <div style={{ width: '30px', height: `${(d.enrolled / 60) * 100}%`, background: '#667eea', borderRadius: '4px 4px 0 0', position: 'relative' }} title={`Enrolled: ${d.enrolled}`}></div>
                                <div style={{ width: '30px', height: `${(d.completed / 60) * 100}%`, background: '#48bb78', borderRadius: '4px 4px 0 0', position: 'relative' }} title={`Completed: ${d.completed}`}></div>
                            </div>
                            <span style={{ fontSize: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>{d.course}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', background: '#667eea', borderRadius: '2px' }}></div><span style={{ fontSize: '12px' }}>Enrolled</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', background: '#48bb78', borderRadius: '2px' }}></div><span style={{ fontSize: '12px' }}>Completed</span></div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <h3>Learner Progress</h3>
                <div style={{ marginTop: '20px' }}>
                    {learnerProgress.map((l, i) => (
                        <div key={i} style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                <div><strong>{l.name}</strong> <span style={{ color: 'var(--text-secondary)' }}>- {l.course}</span></div>
                                <span style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>{l.progress}%</span>
                            </div>
                            <div style={{ height: '8px', background: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${l.progress}%`, background: 'var(--primary)', borderRadius: '4px', transition: 'width 1s ease' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
