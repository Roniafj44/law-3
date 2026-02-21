import { useState, useRef, useEffect } from 'react';

const AGENT_LABELS = {
    general: { label: 'General', icon: '⚡' },
    legal: { label: 'Legal Expert', icon: '⚖️' },
    compliance: { label: 'Compliance', icon: '🛡️' },
    risk: { label: 'Risk Analyst', icon: '📊' },
};

const FEATURES = [
    { icon: '⚖️', title: 'Legal Analysis', desc: 'Indian Contract Act, Companies Act, IP laws with section citations' },
    { icon: '🛡️', title: 'Compliance', desc: 'GST, IT Act, DPDP, RBI, SEBI checks with deadlines' },
    { icon: '📊', title: 'Risk Scoring', desc: 'AI-powered risk assessment with 0-100 scoring' },
    { icon: '📄', title: 'Doc Review', desc: 'Analyze contracts, NDAs, and policy documents' },
];

const TICKER_ITEMS = [
    'Companies Act 2013', 'GST Compliance', 'DPDP Act', 'Contract Law',
    'SEBI Regulations', 'IP Protection', 'FEMA Rules', 'IT Act 2000',
    'Risk Assessment', 'NDA Review', 'Employment Law', 'RBI Guidelines',
];

function formatContent(content) {
    if (!content) return '';
    // Basic markdown-ish rendering
    return content
        .split('\n')
        .map((line, i) => {
            // Headers
            if (line.startsWith('### ')) return `<h4 key="${i}" style="margin:8px 0 4px;font-family:var(--font-display);font-size:var(--fs-sm)">${line.slice(4)}</h4>`;
            if (line.startsWith('## ')) return `<h3 key="${i}" style="margin:10px 0 4px;font-family:var(--font-display);font-size:var(--fs-base)">${line.slice(3)}</h3>`;
            // Bold
            line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            // Italic
            line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
            // Inline code
            line = line.replace(/`(.+?)`/g, '<code>$1</code>');
            // Blockquote
            if (line.startsWith('> ')) return `<blockquote style="border-left:3px solid var(--green-subtle);padding:4px 12px;margin:4px 0;color:var(--text-dim);font-style:italic">${line.slice(2)}</blockquote>`;
            // List items
            if (/^\d+\.\s/.test(line)) return `<div style="padding-left:12px;margin:2px 0">• ${line.replace(/^\d+\.\s/, '')}</div>`;
            if (line.startsWith('- ')) return `<div style="padding-left:12px;margin:2px 0">• ${line.slice(2)}</div>`;
            // Empty lines
            if (!line.trim()) return '<br/>';
            return `<p>${line}</p>`;
        })
        .join('');
}

export default function ChatArea({
    messages,
    agent,
    sending,
    onSendMessage,
    onToggleSidebar,
}) {
    const [input, setInput] = useState('');
    const listRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const agentInfo = AGENT_LABELS[agent] || AGENT_LABELS.general;
    const hasMessages = messages.length > 0;

    return (
        <main className="chat-area">
            {/* Header */}
            <div className="chat-header">
                <div className="chat-header-left">
                    <button className="chat-header-btn menu-btn" onClick={onToggleSidebar}>☰</button>
                    <span className="chat-header-title">
                        {agentInfo.icon} {agentInfo.label}
                    </span>
                    <span className="chat-header-badge">
                        {hasMessages ? `${messages.length} msgs` : 'Ready'}
                    </span>
                </div>
                <div className="chat-header-right">
                    <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--fs-xs)',
                        color: 'var(--text-muted)',
                        letterSpacing: '1px',
                    }}>
                        v2.0
                    </span>
                </div>
            </div>

            {/* Messages or Welcome */}
            {hasMessages ? (
                <div className="message-list" ref={listRef}>
                    {messages.map((msg, idx) => {
                        const role = msg.role;
                        const isUser = role === 'user';
                        return (
                            <div
                                key={msg.id || idx}
                                className={`message message--${isUser ? 'user' : 'assistant'}`}
                                style={{ animationDelay: `${Math.min(idx * 0.05, 0.3)}s` }}
                            >
                                <div className="message-avatar">
                                    {isUser ? '👤' : agentInfo.icon}
                                </div>
                                <div className="message-body">
                                    <div
                                        className="message-content"
                                        dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                                    />
                                    <span className="message-time">
                                        {new Date(msg.created_at || msg.createdAt || Date.now())
                                            .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {sending && (
                        <div className="message message--assistant">
                            <div className="message-avatar">{agentInfo.icon}</div>
                            <div className="typing-indicator">
                                <div className="typing-dot" />
                                <div className="typing-dot" />
                                <div className="typing-dot" />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="welcome">
                    <div className="welcome-hero">
                        <span className="welcome-icon">⚖</span>
                        <h1 className="welcome-title">
                            Law<span className="welcome-title-accent">Pilot</span> AI
                        </h1>
                        <p className="welcome-subtitle">
                            AI-powered legal intelligence for Indian businesses.
                            Ask about laws, check compliance, or assess risks.
                        </p>
                    </div>

                    <div className="welcome-features">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="feature-card" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                                <span className="feature-icon">{f.icon}</span>
                                <div className="feature-title">{f.title}</div>
                                <div className="feature-desc">{f.desc}</div>
                            </div>
                        ))}
                    </div>

                    <div className="welcome-ticker">
                        <div className="welcome-ticker-inner">
                            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                                <span key={i}>
                                    <span className="ticker-item">{item}</span>
                                    <span className="ticker-dot"> ● </span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="chat-input-area">
                <div className="chat-input-wrap">
                    <textarea
                        ref={inputRef}
                        className="chat-input"
                        placeholder={`Ask ${agentInfo.label.toLowerCase()} anything…`}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        disabled={sending}
                    />
                    <button
                        className="chat-send-btn"
                        onClick={handleSend}
                        disabled={!input.trim() || sending}
                        title="Send message"
                    >
                        {sending ? '◌' : '→'}
                    </button>
                </div>
                <div className="chat-input-hint">
                    LawPilot AI · Not a substitute for professional legal advice
                </div>
            </div>
        </main>
    );
}
