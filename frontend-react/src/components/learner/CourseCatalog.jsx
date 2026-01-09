import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen } from 'lucide-react';

const CourseCatalog = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        // Mock data
        setCourses([
            { id: 1, title: 'Java Basics', category: 'Programming', level: 'Beginner', duration: '4 Weeks', instructor: 'Bob Smith', image: '#667eea' },
            { id: 2, title: 'Advanced React', category: 'Frontend', level: 'Advanced', duration: '6 Weeks', instructor: 'Alice Doe', image: '#ed8936' },
            { id: 3, title: 'UI/UX Design Principles', category: 'Design', level: 'Beginner', duration: '3 Weeks', instructor: 'John Lee', image: '#48bb78' },
            { id: 4, title: 'Spring Boot Mastery', category: 'Programming', level: 'Intermediate', duration: '8 Weeks', instructor: 'Bob Smith', image: '#f56565' },
        ]);
    }, []);

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
                    <div key={c.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '140px', background: c.image, opacity: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={40} color={c.image} />
                        </div>
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span className="badge badge-secondary">{c.category}</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.level}</span>
                            </div>
                            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{c.title}</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '15px' }}>Instructor: {c.instructor} • {c.duration}</p>
                            <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => navigate(`/course/${c.id}`)}>View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseCatalog;
