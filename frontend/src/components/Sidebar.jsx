const AGENTS = [
    { id: 'general', label: 'General', icon: '⚡' },
    { id: 'legal', label: 'Legal', icon: '⚖️' },
    { id: 'compliance', label: 'Comply', icon: '🛡️' },
    { id: 'risk', label: 'Risk', icon: '📊' },
];

export default function Sidebar({
    user,
    isAuthenticated,
    agent,
    setAgent,
    conversations,
    currentConv,
    loadConversation,
    newChat,
    onAuthClick,
    isOpen,
}) {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Brand */}
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">⚖</div>
                <div className="sidebar-brand-text">
                    <span className="sidebar-brand-name">LawPilot</span>
                    <span className="sidebar-brand-tag">AI Legal Intel</span>
                </div>
            </div>

            {/* Agent Picker */}
            <div className="agent-picker">
                <div className="agent-picker-label">Agent Mode</div>
                <div className="agent-grid">
                    {AGENTS.map(a => (
                        <button
                            key={a.id}
                            className={`agent-btn ${agent === a.id ? 'active' : ''}`}
                            onClick={() => setAgent(a.id)}
                        >
                            <span className="agent-btn-icon">{a.icon}</span>
                            {a.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Conversations */}
            <div className="sidebar-section">
                <div className="sidebar-section-title">History</div>
                <div className="conv-list">
                    {conversations.length === 0 && (
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--fs-xs)',
                            color: 'var(--text-muted)',
                            padding: 'var(--space-md) 0',
                            textAlign: 'center',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                        }}>
                            No conversations yet
                        </div>
                    )}
                    {conversations.map(c => (
                        <div
                            key={c.id}
                            className={`conv-item ${currentConv?.id === c.id ? 'active' : ''}`}
                            onClick={() => loadConversation(c.id)}
                        >
                            <div className="conv-item-title">{c.title}</div>
                            <div className="conv-item-meta">
                                {c.message_count || c.messageCount || 0} msgs
                                {c.last_message || c.lastMessage
                                    ? ` · ${(c.last_message || c.lastMessage).substring(0, 30)}…`
                                    : ''}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="sidebar-footer">
                <button className="sidebar-btn sidebar-btn--primary" onClick={newChat}>
                    ＋ New Chat
                </button>
                <button className="sidebar-btn" onClick={onAuthClick}>
                    {isAuthenticated ? (
                        <>
                            <span>👤</span>
                            <span style={{ flex: 1, textAlign: 'left' }}>
                                {user?.full_name || user?.fullName || user?.email || 'Account'}
                            </span>
                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>Sign Out</span>
                        </>
                    ) : (
                        <>
                            <span>🔐</span>
                            Sign In / Register
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}
