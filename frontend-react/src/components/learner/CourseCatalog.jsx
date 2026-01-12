import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen } from 'lucide-react';
import javaImage from '../../assets/java-course.png';
import reactImage from '../../assets/react-course.png';
import uiuxImage from '../../assets/uiux-course.png';
import springbootImage from '../../assets/springboot-course.png';
import htmlcssImage from '../../assets/htmlcss-course.png';

const CourseCatalog = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [filter, setFilter] = useState('All');
    const [enrolledIds, setEnrolledIds] = useState([]);

    useEffect(() => {
        // Mock data
        setCourses([
            { id: 1, title: 'Java Basics', category: 'Programming', level: 'Beginner', duration: '4 Weeks', instructor: 'Bob Smith', image: javaImage, isImageUrl: true },
            { id: 2, title: 'Advanced React', category: 'Frontend', level: 'Advanced', duration: '6 Weeks', instructor: 'Alice Doe', image: reactImage, isImageUrl: true },
            { id: 3, title: 'UI/UX Design Principles', category: 'Design', level: 'Beginner', duration: '3 Weeks', instructor: 'John Lee', image: uiuxImage, isImageUrl: true },
            { id: 4, title: 'Spring Boot Mastery', category: 'Programming', level: 'Intermediate', duration: '8 Weeks', instructor: 'Bob Smith', image: springbootImage, isImageUrl: true },
            { id: 5, title: 'HTML & CSS Fundamentals', category: 'Frontend', level: 'Beginner', duration: '3 Weeks', instructor: 'Sarah Johnson', image: htmlcssImage, isImageUrl: true },
        ]);

        // Load enrolled courses from local storage
        const storedEnrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        setEnrolledIds(storedEnrolled);
    }, []);

    const handleEnroll = (e, courseId) => {
        e.stopPropagation(); // Prevent navigating to details
        const updatedEnrolled = [...enrolledIds, courseId];
        setEnrolledIds(updatedEnrolled);
        localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolled));
        // Optional: Add a toast notification here
        alert('Successfully enrolled!');
    };

    const isEnrolled = (courseId) => enrolledIds.includes(courseId);

    const filteredCourses = filter === 'All' ? courses : courses.filter(c => c.category === filter);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input className="input-field" style={{ paddingLeft: '40px' }} placeholder="Search courses..." />
                </div>
                <select className="input-field" style={{ width: '200px' }} value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="All">All Categories</option>
                    <option value="Programming">Programming</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Design">Design</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {filteredCourses.map(c => (
                    <div key={c.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => navigate(`/course/${c.id}`)}>
                        {c.isImageUrl ? (
                            <div style={{ height: '140px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a202c' }}>
                                <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ) : (
                            <div style={{ height: '140px', background: c.image, opacity: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <BookOpen size={40} color={c.image} />
                            </div>
                        )}
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span className="badge badge-secondary">{c.category}</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.level}</span>
                            </div>
                            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{c.title}</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '15px' }}>Instructor: {c.instructor} • {c.duration}</p>

                            <div style={{ marginTop: 'auto', display: 'grid', gap: '8px' }}>
                                {isEnrolled(c.id) ? (
                                    <button
                                        className="btn"
                                        style={{ width: '100%', background: '#e2e8f0', color: 'var(--text-primary)', cursor: 'default' }}
                                        onClick={(e) => { e.stopPropagation(); navigate(`/course/${c.id}/learn`); }}
                                    >
                                        Resume Learning
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%' }}
                                        onClick={(e) => handleEnroll(e, c.id)}
                                    >
                                        Enroll Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseCatalog;
