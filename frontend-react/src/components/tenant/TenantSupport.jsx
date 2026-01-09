import React, { useState } from 'react';
import { Send, LifeBuoy } from 'lucide-react';

const TenantSupport = () => {
    const [tickets, setTickets] = useState([
        { id: 101, subject: 'Login issue for user', status: 'OPEN', date: '2023-10-25', priority: 'High' },
        { id: 102, subject: 'Course upload failing', status: 'RESOLVED', date: '2023-09-15', priority: 'Medium' },
    ]);
    const [newTicket, setNewTicket] = useState({ subject: '', description: '', priority: 'Medium' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setTickets([{
            id: Date.now(),
            subject: newTicket.subject,
            status: 'OPEN',
            date: new Date().toISOString().split('T')[0],
            priority: newTicket.priority
        }, ...tickets]);
        setNewTicket({ subject: '', description: '', priority: 'Medium' });
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ padding: '10px', background: '#ebf8ff', borderRadius: '8px', color: '#3182ce' }}>
                        <LifeBuoy size={20} />
                    </div>
                    <h3 style={{ margin: 0 }}>Raise a Support Ticket</h3>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                    <div className="form-group">
                        <label>Subject</label>
                        <input className="input-field" value={newTicket.subject} onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })} required placeholder="Brief summary of the issue" />
                    </div>
                    <div className="form-group">
                        <label>Priority</label>
                        <select className="input-field" value={newTicket.priority} onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Issue Description</label>
                        <textarea className="input-field" rows="6" value={newTicket.description} onChange={e => setNewTicket({ ...newTicket, description: e.target.value })} required placeholder="Please describe the issue in detail..."></textarea>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%' }}><Send size={16} style={{ marginRight: '8px' }} /> Submit Ticket</button>
                </form>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <h3>Ticket History</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', borderBottom: '2px solid var(--border)' }}>
                                <th style={{ padding: '12px 8px' }}>ID</th>
                                <th style={{ padding: '12px 8px' }}>Subject</th>
                                <th style={{ padding: '12px 8px' }}>Date</th>
                                <th style={{ padding: '12px 8px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '12px 8px', fontSize: '14px' }}>#{t.id}</td>
                                    <td style={{ padding: '12px 8px', fontSize: '14px' }}>
                                        <div style={{ fontWeight: '500' }}>{t.subject}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Priority: {t.priority}</div>
                                    </td>
                                    <td style={{ padding: '12px 8px', fontSize: '14px' }}>{t.date}</td>
                                    <td style={{ padding: '12px 8px' }}>
                                        <span className={`badge ${t.status === 'OPEN' ? 'badge-primary' : 'badge-secondary'}`}
                                            style={{
                                                background: t.status === 'OPEN' ? '#ebf8ff' : '#f0fff4',
                                                color: t.status === 'OPEN' ? '#2b6cb0' : '#2f855a',
                                                fontSize: '11px'
                                            }}>
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {tickets.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px' }}>No tickets found.</p>}
                </div>
            </div>
        </div>
    );
};

export default TenantSupport;
