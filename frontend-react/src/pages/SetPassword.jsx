import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { KeyRound, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) return alert("Passwords don't match");

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/auth/set-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card login-card">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div className="icon-badge"><KeyRound size={32} /></div>
                    <h1>Set Your Password</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome to the LMS. Please secure your account.</p>
                </div>

                {!success ? (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label>New Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <div style={{ marginBottom: '32px' }}>
                            <label>Confirm Password</label>
                            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Processing...' : 'Activate Account'}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', color: '#48bb78' }}>
                        <CheckCircle2 size={48} style={{ margin: '0 auto 16px' }} />
                        <h3>Account Activated!</h3>
                        <p>You will be redirected to the login page shortly.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default SetPassword;
