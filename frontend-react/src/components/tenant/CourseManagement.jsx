import React, { useState } from 'react';
import { Plus, Upload, BookOpen, Eye, EyeOff, Edit, Trash } from 'lucide-react';

const CourseManagement = () => {
    const [courses, setCourses] = useState([
        { id: 1, title: 'Java Basics', category: 'Programming', level: 'Beginner', instructor: 'Bob Smith', status: 'PUBLISHED' },
        { id: 2, title: 'Advanced React', category: 'Frontend', level: 'Advanced', instructor: 'Bob Smith', status: 'DRAFT' },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [newCourse, setNewCourse] = useState({
        title: '', description: '', category: '', level: 'Beginner', instructor: '', duration: ''
    });

    const togglePublish = (id) => {
        setCourses(courses.map(c => c.id === id ? { ...c, status: c.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' } : c));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            setCourses(courses.filter(c => c.id !== id));
        }
    };

    const handleEdit = (course) => {
        setNewCourse({
            title: course.title,
            description: course.description || '',
            category: course.category,
            level: course.level,
            instructor: course.instructor,
            duration: course.duration || ''
        });
        setIsEditing(true);
        setCurrentId(course.id);
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            setCourses(courses.map(c => c.id === currentId ? { ...c, ...newCourse } : c));
        } else {
            setCourses([...courses, { id: Date.now(), ...newCourse, status: 'DRAFT' }]);
        }
        setShowModal(false);
        setNewCourse({ title: '', description: '', category: '', level: 'Beginner', instructor: '', duration: '' });
        setIsEditing(false);
        setCurrentId(null);
    };

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Course Management</h3>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} style={{ marginRight: '8px' }} /> Create Course
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--bg-primary)', textAlign: 'left' }}>
                    <tr>
                        <th style={{ padding: '15px 24px' }}>Title</th>
                        <th style={{ padding: '15px 24px' }}>Category</th>
                        <th style={{ padding: '15px 24px' }}>Level</th>
                        <th style={{ padding: '15px 24px' }}>Instructor</th>
                        <th style={{ padding: '15px 24px' }}>Status</th>
                        <th style={{ padding: '15px 24px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '15px 24px' }}>{c.title}</td>
                            <td style={{ padding: '15px 24px' }}>{c.category}</td>
                            <td style={{ padding: '15px 24px' }}>{c.level}</td>
                            <td style={{ padding: '15px 24px' }}>{c.instructor}</td>
                            <td style={{ padding: '15px 24px' }}>
                                <span className={`badge ${c.status === 'PUBLISHED' ? 'badge-primary' : 'badge-secondary'}`} style={{ background: c.status === 'PUBLISHED' ? '#c6f6d5' : '#edf2f7', color: c.status === 'PUBLISHED' ? '#22543d' : '#4a5568' }}>
                                    {c.status}
                                </span>
                            </td>
                            <td style={{ padding: '15px 24px', display: 'flex', gap: '10px' }}>
                                <button className="btn" style={{ padding: '5px' }} title="Edit Course" onClick={() => handleEdit(c)}>
                                    <Edit size={16} />
                                </button>
                                <button className="btn" style={{ padding: '5px', color: 'red' }} title="Delete Course" onClick={() => handleDelete(c.id)}>
                                    <Trash size={16} />
                                </button>
                                <button className="btn" style={{ padding: '5px' }} title="Toggle Publish" onClick={() => togglePublish(c.id)}>
                                    {c.status === 'PUBLISHED' ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button className="btn" style={{ padding: '5px' }} title="Upload Materials"><Upload size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '500px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3>{isEditing ? 'Edit Course' : 'Create New Course'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Course Title</label>
                                <input className="input-field" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="input-field" value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label>Category</label>
                                    <input className="input-field" value={newCourse.category} onChange={e => setNewCourse({ ...newCourse, category: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <input className="input-field" value={newCourse.duration} onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })} placeholder="e.g. 5 weeks" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label>Level</label>
                                    <select className="input-field" value={newCourse.level} onChange={e => setNewCourse({ ...newCourse, level: e.target.value })}>
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Instructor</label>
                                    <input className="input-field" value={newCourse.instructor} onChange={e => setNewCourse({ ...newCourse, instructor: e.target.value })} placeholder="Instructor Name" />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="btn" onClick={() => { setShowModal(false); setIsEditing(false); setCurrentId(null); setNewCourse({ title: '', description: '', category: '', level: 'Beginner', instructor: '', duration: '' }); }} style={{ border: '1px solid var(--border)' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{isEditing ? 'Update Course' : 'Create Course'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagement;
