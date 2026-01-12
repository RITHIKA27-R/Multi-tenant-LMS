import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, BookOpen } from 'lucide-react';

const MOCK_ALL_COURSES = [
    { id: 1, title: 'Java Basics', progress: 10, nextLesson: 'Introduction' },
    { id: 2, title: 'Advanced React', progress: 0, nextLesson: 'Getting Started' },
    { id: 3, title: 'UI/UX Design Principles', progress: 5, nextLesson: 'Design Thinking' },
    { id: 4, title: 'Spring Boot Mastery', progress: 0, nextLesson: 'Why Spring Boot?' },
    { id: 5, title: 'HTML & CSS Fundamentals', progress: 0, nextLesson: 'HTML Basics' },
];

const MyCourses = () => {
    const navigate = useNavigate();
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    useEffect(() => {
        // In a real app, we would fetch from API. 
        // Here we simulate by checking localStorage which was set in CourseDetails.
        const enrolledIds = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');

        // Filter mock courses
        const myCourses = MOCK_ALL_COURSES.filter(c => enrolledIds.includes(c.id));
        setEnrolledCourses(myCourses);
    }, []);

    if (enrolledCourses.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                <BookOpen size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <h3>No courses started yet</h3>
                <p style={{ maxWidth: '400px', margin: '10px auto 20px' }}>
                    Explore the course catalog and start enrolling in courses to see them here.
                </p>
                <button className="btn btn-primary" onClick={() => navigate('/learner/catalog')}>Browse Catalog</button>
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ marginBottom: '24px' }}>My Learning</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {enrolledCourses.map(c => (
                    <div key={c.id} className="card" style={{ padding: '20px' }}>
                        <h3 style={{ marginBottom: '10px' }}>{c.title}</h3>

                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                                <span>Progress</span>
                                <span>{c.progress}%</span>
                            </div>
                            <div style={{ height: '6px', background: '#edf2f7', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${c.progress}%`, background: 'var(--primary)', height: '100%' }}></div>
                            </div>
                        </div>

                        <div style={{ padding: '12px', background: '#ebf4ff', borderRadius: '8px', marginBottom: '15px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Up Next:</p>
                            <div style={{ fontWeight: '500', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <PlayCircle size={14} /> {c.nextLesson}
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            onClick={() => navigate(`/course/${c.id}/learn`)}
                        >
                            Continue Learning
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyCourses;
