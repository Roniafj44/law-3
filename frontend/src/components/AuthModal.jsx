import { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
    const [tab, setTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (tab === 'login') {
                await onLogin(email, password);
            } else {
                await onRegister(email, password, name);
            }
            onClose();
            setEmail('');
            setPassword('');
            setName('');
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="auth-modal">
                <button className="auth-close" onClick={onClose}>✕</button>

                <div className="auth-header">
                    <span className="auth-icon">⚖</span>
                    <h2 className="auth-title">LawPilot AI</h2>
                </div>

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                        onClick={() => { setTab('login'); setError(''); }}
                    >
                        Sign In
                    </button>
                    <button
                        className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
                        onClick={() => { setTab('register'); setError(''); }}
                    >
                        Register
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {tab === 'register' && (
                        <div className="auth-field">
                            <label className="auth-label">Full Name</label>
                            <input
                                className="auth-input"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="auth-field">
                        <label className="auth-label">Email</label>
                        <input
                            className="auth-input"
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Password</label>
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Processing…' : tab === 'login' ? 'Sign In →' : 'Create Account →'}
                    </button>
                </form>
            </div>
        </div>
    );
}
