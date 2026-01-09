import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, CheckCircle, Lock, Menu, FileText } from 'lucide-react';

const MOCK_LESSONS = [
    { id: 1, title: 'Introduction', duration: '5:00', type: 'video', isCompleted: true },
    { id: 2, title: 'Setup Environment', duration: '10:00', type: 'video', isCompleted: true },
    { id: 3, title: 'Variables & Data Types', duration: '15:00', type: 'video', isCompleted: false },
    { id: 4, title: 'Control Flow', duration: '20:00', type: 'video', isCompleted: false },
    { id: 5, title: 'Functions', duration: '12:00', type: 'video', isCompleted: false },
    { id: 6, title: 'Object Oriented Programming', duration: '25:00', type: 'video', isCompleted: false },
    { id: 7, title: 'Reading Material: Best Practices', duration: '10 min read', type: 'text', isCompleted: false },
];

const CoursePlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeLesson, setActiveLesson] = useState(MOCK_LESSONS[2]); // Default to first uncompleted

    return (
        <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ height: '60px', background: '#1a202c', color: 'white', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => navigate('/learner/my-courses')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '5px', borderRadius: '4px', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#2d3748'} onMouseLeave={e => e.target.style.background = 'none'}>
                        <ArrowLeft size={20} /> Back
                    </button>
                    <div style={{ height: '24px', width: '1px', background: '#4a5568' }}></div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>Java Basics</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '14px', color: '#a0aec0' }}>Progress: 28%</span>
                    <div style={{ width: '150px', height: '6px', background: '#2d3748', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '28%', height: '100%', background: '#48bb78' }}></div>
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Main Content Area */}
                <div style={{ flex: 1, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {activeLesson.type === 'video' ? (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', background: 'radial-gradient(circle, #2d3748 0%, #000000 100%)' }}>
                            <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '20px' }}>
                                <PlayCircle size={40} fill="white" stroke="none" />
                            </div>
                            <h2 style={{ marginTop: '0', fontWeight: 500 }}>{activeLesson.title}</h2>
                            <p style={{ color: '#a0aec0', marginTop: '5px' }}>Video Player Simulation</p>
                        </div>
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: 'white', color: '#1a202c', padding: '60px', overflowY: 'auto' }}>
                            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                                <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>{activeLesson.title}</h1>
                                <p style={{ lineHeight: '1.8', fontSize: '18px', color: '#4a5568' }}>
                                    This is a placeholder for reading material. In a real application, the course content would be rendered here.
                                    Students can read through the documentation, study code snippets, and review key concepts.
                                </p>
                                <div style={{ padding: '20px', background: '#f7fafc', borderLeft: '4px solid #3182ce', marginTop: '30px', borderRadius: '4px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#2b6cb0' }}>Key Takeaway</h4>
                                    <p style={{ margin: 0 }}>Always format your code consistently and follow the style guide of the project you are working on.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Playlist */}
                <div style={{ width: '350px', background: 'white', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', background: '#f8f9fa' }}>
                        <h3 style={{ fontSize: '16px', margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>Course Content</h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '5px 0 0 0' }}>{MOCK_LESSONS.length} Lessons • 2h 15m Total</p>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {MOCK_LESSONS.map((lesson, index) => (
                            <div
                                key={lesson.id}
                                onClick={() => setActiveLesson(lesson)}
                                style={{
                                    padding: '16px 20px',
                                    borderBottom: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    background: activeLesson.id === lesson.id ? '#ebf8ff' : 'white',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    borderLeft: activeLesson.id === lesson.id ? '4px solid var(--primary)' : '4px solid transparent'
                                }}
                            >
                                <div style={{ marginTop: '2px' }}>
                                    {lesson.isCompleted ? (
                                        <CheckCircle size={18} color="green" fill="#e6fffa" />
                                    ) : (
                                        activeLesson.id === lesson.id ?
                                            <PlayCircle size={18} color="var(--primary)" /> :
                                            <div style={{ width: '18px', height: '18px', border: '2px solid #cbd5e0', borderRadius: '50%' }}></div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 500, color: activeLesson.id === lesson.id ? 'var(--primary-dark)' : 'var(--text-primary)', lineHeight: '1.4' }}>
                                        {lesson.title}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {lesson.type === 'text' ? <FileText size={12} /> : <PlayCircle size={12} />}
                                        {lesson.duration}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;
