import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
    MessageSquare, Clock, CheckCircle2, AlertCircle, Plus,
    Filter, Search, X, Send, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { API_BASE_URL } from '../config';

const SupportTickets = () => {
    const { token } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'MEDIUM',
        tenantId: '',
        createdBy: ''
    });

    useEffect(() => {
        fetchTickets();
    }, [token]);

    useEffect(() => {
        let filtered = tickets;

        // Filter by status
        if (filterStatus !== 'ALL') {
            filtered = filtered.filter(t => t.status === filterStatus);
        }

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter(t =>
                t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredTickets(filtered);
    }, [tickets, filterStatus, searchQuery]);

    const fetchTickets = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/super-admin/tickets`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setTickets(data);
        } catch (err) {
            console.error('Failed to fetch tickets', err);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_BASE_URL}/super-admin/tickets`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            fetchTickets();
            setShowCreateModal(false);
            setFormData({ subject: '', description: '', priority: 'MEDIUM', tenantId: '', createdBy: '' });
        } catch (err) {
            console.error('Failed to create ticket', err);
        }
    };

    const handleStatusUpdate = async (ticketId, newStatus) => {
        try {
            await fetch(`${API_BASE_URL}/super-admin/tickets/${ticketId}/status?status=${newStatus}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchTickets();
            setSelectedTicket(null);
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            OPEN: { bg: '#fee2e2', color: '#991b1b', icon: AlertCircle },
            IN_PROGRESS: { bg: '#fef3c7', color: '#92400e', icon: Clock },
            RESOLVED: { bg: '#d1fae5', color: '#065f46', icon: CheckCircle2 }
        };
        const style = styles[status] || styles.OPEN;
        const Icon = style.icon;

        return (
            <span style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                background: style.bg,
                color: style.color,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
            }}>
                <Icon size={14} />
                {status.replace('_', ' ')}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            HIGH: '#ef4444',
            MEDIUM: '#f59e0b',
            LOW: '#10b981'
        };

        return (
            <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: colors[priority],
                display: 'inline-block'
            }} />
        );
    };

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'OPEN').length,
        inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED').length
    };

    return (
        <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
            <Sidebar role="SUPER_ADMIN" />
            <div style={{ flex: 1, padding: '32px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color: '#1e293b' }}>
                            Support Tickets
                        </h1>
                        <p style={{ color: '#64748b', margin: '8px 0 0 0' }}>
                            Manage and respond to tenant support requests
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={18} /> New Ticket
                    </button>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                    {[
                        { label: 'Total Tickets', value: stats.total, color: '#6366f1', icon: MessageSquare },
                        { label: 'Open', value: stats.open, color: '#ef4444', icon: AlertCircle },
                        { label: 'In Progress', value: stats.inProgress, color: '#f59e0b', icon: Clock },
                        { label: 'Resolved', value: stats.resolved, color: '#10b981', icon: CheckCircle2 }
                    ].map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="card"
                                style={{
                                    background: 'white',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: `${stat.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Icon size={24} color={stat.color} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{stat.label}</p>
                                    <h3 style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0 0 0' }}>{stat.value}</h3>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center'
                }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 40px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: filterStatus === status ? '#6366f1' : '#f1f5f9',
                                    color: filterStatus === status ? 'white' : '#64748b',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {status.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tickets Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {filteredTickets.map((ticket, idx) => (
                        <motion.div
                            key={ticket.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="card"
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '24px',
                                cursor: 'pointer',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.2s'
                            }}
                            whileHover={{ boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.2)' }}
                            onClick={() => setSelectedTicket(ticket)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1' }}>
                                    #TKT-{String(ticket.id).padStart(4, '0')}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {getPriorityBadge(ticket.priority)}
                                    {getStatusBadge(ticket.status)}
                                </div>
                            </div>

                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1e293b' }}>
                                {ticket.subject}
                            </h3>

                            <p style={{
                                color: '#64748b',
                                fontSize: '14px',
                                marginBottom: '20px',
                                lineHeight: '1.6',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical'
                            }}>
                                {ticket.description}
                            </p>

                            <div style={{
                                borderTop: '1px solid #f1f5f9',
                                paddingTop: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                    By: <strong>{ticket.createdBy}</strong>
                                </div>
                                <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredTickets.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '100px',
                        color: '#94a3b8',
                        background: 'white',
                        borderRadius: '16px'
                    }}>
                        <MessageSquare size={64} style={{ marginBottom: '20px', opacity: 0.2 }} />
                        <h3>No tickets found</h3>
                        <p>Try adjusting your filters or create a new ticket</p>
                    </div>
                )}

                {/* Create Ticket Modal */}
                <AnimatePresence>
                    {showCreateModal && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000,
                                backdropFilter: 'blur(4px)'
                            }}
                            onClick={() => setShowCreateModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="card"
                                style={{
                                    width: '550px',
                                    background: 'white',
                                    borderRadius: '24px',
                                    padding: '32px',
                                    position: 'relative'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '8px'
                                    }}
                                >
                                    <X size={20} color="#64748b" />
                                </button>

                                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
                                    Create New Ticket
                                </h2>

                                <form onSubmit={handleCreateTicket}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            required
                                            placeholder="Brief description of the issue"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                            rows={4}
                                            placeholder="Detailed description of the issue"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '14px',
                                                fontFamily: 'inherit',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                                                Priority
                                            </label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <option value="LOW">Low</option>
                                                <option value="MEDIUM">Medium</option>
                                                <option value="HIGH">High</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                                                Tenant ID
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.tenantId}
                                                onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                                                required
                                                placeholder="1"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '32px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                                            Reported By (Email)
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.createdBy}
                                            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                                            required
                                            placeholder="reporter@example.com"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            <Send size={16} /> Create Ticket
                                        </button>
                                        <button
                                            type="button"
                                            className="btn"
                                            style={{ flex: 1, background: '#f1f5f9', color: '#64748b' }}
                                            onClick={() => setShowCreateModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Ticket Details Modal */}
                <AnimatePresence>
                    {selectedTicket && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000,
                                backdropFilter: 'blur(4px)'
                            }}
                            onClick={() => setSelectedTicket(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="card"
                                style={{
                                    width: '600px',
                                    background: 'white',
                                    borderRadius: '24px',
                                    padding: '32px',
                                    position: 'relative',
                                    maxHeight: '80vh',
                                    overflowY: 'auto'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '8px'
                                    }}
                                >
                                    <X size={20} color="#64748b" />
                                </button>

                                <div style={{ marginBottom: '24px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1' }}>
                                        #TKT-{String(selectedTicket.id).padStart(4, '0')}
                                    </span>
                                    <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '12px 0', color: '#1e293b' }}>
                                        {selectedTicket.subject}
                                    </h2>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        {getStatusBadge(selectedTicket.status)}
                                        <span style={{ fontSize: '14px', color: '#64748b' }}>
                                            Priority: <strong style={{ color: selectedTicket.priority === 'HIGH' ? '#ef4444' : '#64748b' }}>
                                                {selectedTicket.priority}
                                            </strong>
                                        </span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '32px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '12px' }}>Description</h4>
                                    <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '15px' }}>
                                        {selectedTicket.description}
                                    </p>
                                </div>

                                <div style={{ marginBottom: '32px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                                        <div>
                                            <span style={{ color: '#94a3b8' }}>Reported By:</span><br />
                                            <strong>{selectedTicket.createdBy}</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: '#94a3b8' }}>Tenant ID:</span><br />
                                            <strong>{selectedTicket.tenantId}</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: '#94a3b8' }}>Created:</span><br />
                                            <strong>{new Date(selectedTicket.createdAt).toLocaleString()}</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: '#94a3b8' }}>Status:</span><br />
                                            <strong>{selectedTicket.status.replace('_', ' ')}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '12px' }}>
                                        Update Status
                                    </h4>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {['OPEN', 'IN_PROGRESS', 'RESOLVED'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusUpdate(selectedTicket.id, status)}
                                                disabled={selectedTicket.status === status}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    background: selectedTicket.status === status ? '#e2e8f0' : '#f1f5f9',
                                                    color: selectedTicket.status === status ? '#94a3b8' : '#475569',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    cursor: selectedTicket.status === status ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {status.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SupportTickets;
