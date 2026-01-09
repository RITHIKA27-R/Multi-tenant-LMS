import React from 'react';
import { CheckCircle, Circle, PlayCircle } from 'lucide-react';

const LearnerProgress = () => {
    // Detailed progress for a specific active course (Mock)
    const activeCourse = {
        title: "Java Basics",
        progress: 75,
        totalLessons: 12,
        completedLessons: 9,
        modules: [
            {
                name: "Module 1: Introduction",
                lessons: [
                    { title: "Setup Environment", status: "completed", type: "video" },
                    { title: "Hello World", status: "completed", type: "video" },
                    { title: "Variables & Types", status: "completed", type: "assignment" }
                ]
            },
            {
                name: "Module 2: OOP Concepts",
                lessons: [
                    { title: "Classes & Objects", status: "completed", type: "video" },
                    { title: "Inheritance", status: "in-progress", type: "video" },
                    { title: "Polymorphism", status: "pending", type: "assignment" }
                ]
            }
        ]
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            <div className="card" style={{ padding: '24px' }}>
                <h2 style={{ marginBottom: '20px' }}>{activeCourse.title} - Progress</h2>

                <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong>Course Completion</strong>
                        <strong>{activeCourse.progress}%</strong>
                    </div>
                    <div style={{ height: '10px', background: '#f0f0f0', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${activeCourse.progress}%`, background: 'var(--primary)', height: '100%', transition: 'width 1s' }}></div>
                    </div>
                    <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {activeCourse.completedLessons} of {activeCourse.totalLessons} lessons completed
                    </p>
                </div>

                <h3>Course Content</h3>
                <div style={{ marginTop: '15px' }}>
                    {activeCourse.modules.map((mod, i) => (
                        <div key={i} style={{ marginBottom: '20px' }}>
                            <h4 style={{ background: '#f7fafc', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>{mod.name}</h4>
                            {mod.lessons.map((lesson, j) => (
                                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 10px', borderBottom: '1px solid #f0f0f0' }}>
                                    {lesson.status === 'completed' && <CheckCircle size={18} color="#48bb78" />}
                                    {lesson.status === 'in-progress' && <PlayCircle size={18} color="#ed8936" />}
                                    {lesson.status === 'pending' && <Circle size={18} color="#cbd5e0" />}

                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontSize: '14px', fontWeight: lesson.status === 'in-progress' ? '600' : '400', color: lesson.status === 'pending' ? '#a0aec0' : 'inherit' }}>
                                            {lesson.title}
                                        </span>
                                        <span style={{ fontSize: '11px', color: '#a0aec0', display: 'block', textTransform: 'capitalize' }}>{lesson.type}</span>
                                    </div>
                                    {lesson.status === 'in-progress' && <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '12px' }}>Resume</button>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                    <h3>Pending Tasks</h3>
                    <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <li style={{ marginBottom: '10px' }}>Submit "Polymorphism" assignment</li>
                        <li>Watch "Inheritance" video</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LearnerProgress;
