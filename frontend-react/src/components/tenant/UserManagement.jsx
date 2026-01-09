import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Edit, Trash2, Key, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
    const { token, user } = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({ id: null, name: '', email: '', role: 'LEARNER' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Mock fetch - replace with actual API call later
        const mockUsers = [
            { id: 1, name: 'Alice Johnson', email: 'alice@test.com', role: 'LEARNER', status: 'ACTIVE' },
            { id: 2, name: 'Bob Smith', email: 'bob@test.com', role: 'INSTRUCTOR', status: 'ACTIVE' },
            { id: 3, name: 'Charlie Brown', email: 'charlie@test.com', role: 'LEARNER', status: 'INACTIVE' },
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
    }, []);

    useEffect(() => {
        const results = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentUser({ id: null, name: '', email: '', role: 'LEARNER' });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setIsEditing(true);
        setCurrentUser(user);
        setShowModal(true);
    };

    const handleSaveUser = (e) => {
        e.preventDefault();
        if (isEditing) {
            setUsers(users.map(u => (u.id === currentUser.id ? { ...currentUser } : u)));
        } else {
            const newUser = { ...currentUser, id: Date.now(), status: 'PENDING' };
            setUsers([...users, newUser]);
            alert(`Invitation sent to ${newUser.email}`);
        }
        setShowModal(false);
        setCurrentUser({ id: null, name: '', email: '', role: 'LEARNER' });
    };

    const handleDeleteUser = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleResetPassword = (email) => {
        if (window.confirm(`Send password reset link to ${email}?`)) {
            alert(`Password reset link successfully sent to ${email}`);
        }
    };

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <h3 style={{ margin: 0 }}>User Management</h3>
                    <button className="btn btn-primary" onClick={openAddModal}>
                        <UserPlus size={18} style={{ marginRight: '8px' }} /> Add User
                    </button>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="input-field"
                        style={{ paddingLeft: '40px', width: '100%' }}
                    />
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead style={{ background: 'var(--bg-primary)', textAlign: 'left' }}>
                        <tr>
                            <th style={{ padding: '15px 24px', borderBottom: '1px solid var(--border)' }}>Name</th>
                            <th style={{ padding: '15px 24px', borderBottom: '1px solid var(--border)' }}>Email</th>
                            <th style={{ padding: '15px 24px', borderBottom: '1px solid var(--border)' }}>Role</th>
                            <th style={{ padding: '15px 24px', borderBottom: '1px solid var(--border)' }}>Status</th>
                            <th style={{ padding: '15px 24px', borderBottom: '1px solid var(--border)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '15px 24px', fontWeight: '500' }}>{u.name}</td>
                                <td style={{ padding: '15px 24px' }}>{u.email}</td>
                                <td style={{ padding: '15px 24px' }}><span className="badge badge-primary">{u.role}</span></td>
                                <td style={{ padding: '15px 24px' }}>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                                        background: u.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                                        color: u.status === 'ACTIVE' ? '#166534' : '#991b1b'
                                    }}>
                                        {u.status}
                                    </span>
                                </td>
                                <td style={{ padding: '15px 24px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn" style={{ padding: '6px', color: 'var(--primary)', background: '#eff6ff' }} title="Edit" onClick={() => openEditModal(u)}>
                                            <Edit size={16} />
                                        </button>
                                        <button className="btn" style={{ padding: '6px', color: '#dc2626', background: '#fef2f2' }} title="Delete" onClick={() => handleDeleteUser(u.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                        <button className="btn" style={{ padding: '6px', color: '#ca8a04', background: '#fef9c3' }} title="Reset Password" onClick={() => handleResetPassword(u.email)}>
                                            <Key size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                                    No users found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: '450px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px' }}>{isEditing ? 'Edit User' : 'Add New User'}</h3>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveUser}>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Full Name</label>
                                <input
                                    className="input-field"
                                    value={currentUser.name}
                                    onChange={e => setCurrentUser({ ...currentUser, name: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Email Address</label>
                                <input
                                    className="input-field"
                                    type="email"
                                    value={currentUser.email}
                                    onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })}
                                    required
                                    disabled={isEditing} // Often email is immutable or requires special process
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: isEditing ? '#f3f4f6' : 'white' }}
                                    placeholder="e.g. john@company.com"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Role</label>
                                <select
                                    className="input-field"
                                    value={currentUser.role}
                                    onChange={e => setCurrentUser({ ...currentUser, role: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                                >
                                    <option value="LEARNER">Learner</option>
                                    <option value="INSTRUCTOR">Instructor</option>
                                    <option value="TENANT_ADMIN">Admin</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ flex: 1, border: '1px solid var(--border)', padding: '10px', borderRadius: '8px' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                    <Save size={18} />
                                    {isEditing ? 'Save Changes' : 'Send Invitation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
