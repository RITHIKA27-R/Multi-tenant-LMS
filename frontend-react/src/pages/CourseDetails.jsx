import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, ChevronRight, ArrowLeft, Clock, User, BarChart, Tag, Lock, CheckCircle, Loader } from 'lucide-react';

const MOCK_COURSES = [
    { id: 1, title: 'Java Basics', category: 'Programming', level: 'Beginner', duration: '4 Weeks', instructor: 'Bob Smith', image: '#667eea', description: 'Learn the fundamentals of Java programming, from variables to object-oriented concepts.' },
    { id: 2, title: 'Advanced React', category: 'Frontend', level: 'Advanced', duration: '6 Weeks', instructor: 'Alice Doe', image: '#ed8936', description: 'Deep dive into React hooks, state management patterns, and performance optimization.' },
    { id: 3, title: 'UI/UX Design Principles', category: 'Design', level: 'Beginner', duration: '3 Weeks', instructor: 'John Lee', image: '#48bb78', description: 'Master the core principles of UI/UX design to create user-friendly interfaces.' },
    { id: 4, title: 'Spring Boot Mastery', category: 'Programming', level: 'Intermediate', duration: '8 Weeks', instructor: 'Bob Smith', image: '#f56565', description: 'Build enterprise-grade applications using the Spring Boot framework.' },
];

const CourseDetails = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [course, setCourse] = useState(null);
    const [assessments, setAssessments] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { 'Authorization': `Bearer ${token}` };
                const [cRes, aRes] = await Promise.all([
                    fetch(`http://localhost:8080/courses/${id}`, { headers }),
                    fetch(`http://localhost:8080/assessments`, { headers })
                ]);

                if (cRes.ok) {
                    setCourse(await cRes.json());
                } else {
                    // Fallback to mock data if API fails or returns 404
                    const mockCourse = MOCK_COURSES.find(c => c.id === parseInt(id));
                    setCourse(mockCourse);
                }

                if (aRes.ok) {
                    const allAss = await aRes.json();
                    setAssessments(allAss.filter(a => a.courseId === parseInt(id)));
                } else {
                    // Mock assessments if API fails
                    setAssessments([
                        { id: 101, title: 'Module 1 Quiz', courseId: parseInt(id) },
                        { id: 102, title: 'Final Project', courseId: parseInt(id) }
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch course data", error);
                // Fallback on error
                const mockCourse = MOCK_COURSES.find(c => c.id === parseInt(id));
                setCourse(mockCourse);
                setAssessments([
                    { id: 101, title: 'Module 1 Quiz', courseId: parseInt(id) },
                    { id: 102, title: 'Final Project', courseId: parseInt(id) }
                ]);
            }
        };
        fetchData();
        // Check if already enrolled (mock)
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        if (enrolledCourses.includes(parseInt(id))) {
            setIsEnrolled(true);
        }
    }, [id, token]);

    const handleEnroll = () => {
        setEnrolling(true);
        // Simulate API call
        setTimeout(() => {
            setEnrolling(false);
            setIsEnrolled(true);
            const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
            if (!enrolledCourses.includes(parseInt(id))) {
                localStorage.setItem('enrolledCourses', JSON.stringify([...enrolledCourses, parseInt(id)]));
            }
        }, 1500);
    };

    if (!course) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
            <button
                className="btn"
                onClick={() => navigate(-1)}
                style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: 0 }}
            >
                <ArrowLeft size={20} /> Back to Catalog
            </button>

            <header className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '32px' }}>
                <div style={{ height: '200px', background: course.image || 'var(--primary)', opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={64} color="white" style={{ opacity: 0.8 }} />
                </div>
                <div style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                        <span className="badge badge-primary">{course.category}</span>
                        <span className="badge badge-secondary">{course.level}</span>
                    </div>
                    <h1 style={{ marginBottom: '16px', fontSize: '32px' }}>{course.title}</h1>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '16px' }}>
                        {course.description || 'No description available.'}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px', paddingTop: '30px', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <User size={20} color="var(--primary)" />
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Instructor</div>
                                <div style={{ fontWeight: 500 }}>{course.instructor || 'Unknown'}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Clock size={20} color="var(--primary)" />
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Duration</div>
                                <div style={{ fontWeight: 500 }}>{course.duration || 'Self-paced'}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <BarChart size={20} color="var(--primary)" />
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Level</div>
                                <div style={{ fontWeight: 500 }}>{course.level}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <section>
                    <h2 style={{ marginBottom: '20px' }}>Course Content</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Introduction</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>Getting started with the course material.</p>
                                </div>
                                {!isEnrolled && <Lock size={20} color="var(--text-secondary)" />}
                            </div>
                            {!isEnrolled && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.6)', cursor: 'not-allowed' }} />}
                        </div>
                        <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Core Concepts</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>Deep dive into the main topics.</p>
                                </div>
                                {!isEnrolled && <Lock size={20} color="var(--text-secondary)" />}
                            </div>
                            {!isEnrolled && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.6)', cursor: 'not-allowed' }} />}
                        </div>
                    </div>

                    <h2 style={{ marginBottom: '20px', marginTop: '40px' }}>Assessments</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {assessments.map(a => (
                            <div
                                key={a.id}
                                className="card"
                                style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: !isEnrolled ? 'not-allowed' : 'pointer', opacity: !isEnrolled ? 0.6 : 1 }}
                                onClick={() => isEnrolled && navigate(`/assessment/${a.id}`)}
                            >
                                <div>
                                    <h3 style={{ fontSize: '18px' }}>{a.title}</h3>
                                    <span className="badge badge-primary" style={{ marginTop: '8px', display: 'inline-block' }}>Status: Pending</span>
                                </div>
                                {isEnrolled ? <ChevronRight size={20} color="var(--text-secondary)" /> : <Lock size={20} color="var(--text-secondary)" />}
                            </div>
                        ))}
                        {assessments.length === 0 && <p>No assessments available for this course.</p>}
                    </div>
                </section>

                <aside>
                    <div className="card" style={{ padding: '24px', position: 'sticky', top: '20px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Enrollment Options</h3>
                        {isEnrolled ? (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: '40px', height: '40px', background: 'var(--success-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <CheckCircle color="green" size={24} />
                                </div>
                                <h4 style={{ marginBottom: '8px' }}>You are enrolled!</h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Continue to access lessons and assessments.</p>
                                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/learner/my-courses')}>Continue Learning</button>
                            </div>
                        ) : (
                            <>
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginBottom: '10px', display: 'flex', justifyContent: 'center', gap: '8px' }}
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                >
                                    {enrolling && <Loader size={18} className="spin" />}
                                    {enrolling ? 'Enrolling...' : 'Start Learning Now'}
                                </button>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                    30-day money-back guarantee
                                </p>
                            </>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CourseDetails;
