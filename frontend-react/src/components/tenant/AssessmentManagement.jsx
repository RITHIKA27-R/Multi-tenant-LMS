import React, { useState } from 'react';
import { Plus, FileText, BarChart, X } from 'lucide-react';

const AssessmentManagement = () => {
    const [assessments, setAssessments] = useState([
        { id: 1, title: 'Java Basics Quiz', course: 'Java Basics', type: 'Quiz', status: 'Active' },
        { id: 2, title: 'React Final Exam', course: 'Advanced React', type: 'Exam', status: 'Draft' },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newAssessment, setNewAssessment] = useState({
        title: '', course: '', type: 'Quiz', numberOfQuestions: 10
    });

    const handleCreate = (e) => {
        e.preventDefault();
        setAssessments([...assessments, { id: Date.now(), ...newAssessment, status: 'Draft' }]);
        setShowModal(false);
        setNewAssessment({ title: '', course: '', type: 'Quiz', numberOfQuestions: 10 });
    };

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Assessments</h3>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} style={{ marginRight: '8px' }} /> Create Assessment
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--bg-primary)', textAlign: 'left' }}>
                    <tr>
                        <th style={{ padding: '15px 24px' }}>Title</th>
                        <th style={{ padding: '15px 24px' }}>Course</th>
                        <th style={{ padding: '15px 24px' }}>Type</th>
                        <th style={{ padding: '15px 24px' }}>Status</th>
                        <th style={{ padding: '15px 24px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assessments.map(a => (
                        <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '15px 24px' }}>{a.title}</td>
                            <td style={{ padding: '15px 24px' }}>{a.course}</td>
                            <td style={{ padding: '15px 24px' }}>{a.type}</td>
                            <td style={{ padding: '15px 24px' }}>
                                <span className={`badge ${a.status === 'Active' ? 'badge-primary' : 'badge-secondary'}`} style={{ background: a.status === 'Active' ? '#c6f6d5' : '#edf2f7', color: a.status === 'Active' ? '#22543d' : '#4a5568' }}>
                                    {a.status}
                                </span>
                            </td>
                            <td style={{ padding: '15px 24px', display: 'flex', gap: '10px' }}>
                                <button className="btn" style={{ padding: '5px' }} title="View Results"><BarChart size={16} /></button>
                                <button className="btn" style={{ padding: '5px' }} title="Edit"><FileText size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '450px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>Create Assessment</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Title</label>
                                <input className="input-field" value={newAssessment.title} onChange={e => setNewAssessment({ ...newAssessment, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Course</label>
                                <select className="input-field" value={newAssessment.course} onChange={e => setNewAssessment({ ...newAssessment, course: e.target.value })}>
                                    <option value="">Select a course...</option>
                                    <option value="Java Basics">Java Basics</option>
                                    <option value="Advanced React">Advanced React</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label>Type</label>
                                    <select className="input-field" value={newAssessment.type} onChange={e => setNewAssessment({ ...newAssessment, type: e.target.value })}>
                                        <option value="Quiz">Quiz</option>
                                        <option value="Exam">Exam</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Questions</label>
                                    <input type="number" className="input-field" value={newAssessment.numberOfQuestions} onChange={e => setNewAssessment({ ...newAssessment, numberOfQuestions: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ border: '1px solid var(--border)' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssessmentManagement;
