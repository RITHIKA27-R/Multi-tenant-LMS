import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: username, password }) // Changed username to email
            });

            if (!response.ok) throw new Error('Invalid credentials');

            const token = await response.text();
            login(token, username);

            // Redirect based on role (parsed in AuthContext)
            setTimeout(() => {
                const storedToken = localStorage.getItem('token');
                const base64Url = storedToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));

                if (payload.role === 'SUPER_ADMIN') navigate('/super-admin/dashboard');
                else if (payload.role === 'TENANT_ADMIN') navigate('/tenant-admin/dashboard');
                else navigate('/learner/dashboard');
            }, 100);
        } catch (err) {
            console.error('Login error:', err);
            if (err.message === 'Invalid credentials') {
                setError('Invalid credentials. Please try again.');
            } else {
                setError('Connection error. Please ensure the backend services (port 8080/8081) are running.');
            }
        }
    };

    const fillDemo = (u) => {
        setUsername(u);
        setPassword('password');
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card login-card"
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px', height: '64px', background: 'var(--primary)',
                        borderRadius: '16px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 16px', color: 'white'
                    }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to your learning portal</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="tenant@gmail.com"
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <div style={{ marginBottom: '32px' }}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        <LogIn size={20} />
                        <span>Sign In</span>
                    </button>
                </form>

                {error && (
                    <div style={{ marginTop: '20px', padding: '12px', background: '#fff5f5', borderLeft: '4px solid var(--error)', color: 'var(--error)', borderRadius: '8px' }}>
                        {error}
                    </div>
                )
                }

                <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '16px' }}>Demo Accounts</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        <div onClick={() => { setUsername('superadmin@lms.com'); setPassword('superpassword'); }} className="demo-account" style={{ fontSize: '11px', padding: '10px' }}>
                            <strong>Super Admin</strong><br />
                            superadmin@lms.com
                        </div>
                        <div onClick={() => { setUsername('tenant@gmail.com'); setPassword('password'); }} className="demo-account" style={{ fontSize: '11px', padding: '10px' }}>
                            <strong>Tenant Admin</strong><br />
                            tenant@gmail.com
                        </div>
                        <div onClick={() => { setUsername('learner@lms.com'); setPassword('password'); }} className="demo-account" style={{ fontSize: '11px', padding: '10px' }}>
                            <strong>Learner</strong><br />
                            learner@lms.com
                        </div>
                    </div>
                </div>
            </motion.div >
        </div >
    );
};

export default Login;
