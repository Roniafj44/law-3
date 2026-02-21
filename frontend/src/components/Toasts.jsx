export default function Toasts({ toasts, onRemove }) {
    if (!toasts.length) return null;

    const icons = {
        ok: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast--${t.type || 'ok'}`}>
                    <span className="toast-icon">{icons[t.type] || icons.ok}</span>
                    <div className="toast-body">
                        <div className="toast-title">{t.title}</div>
                        {t.message && <div className="toast-message">{t.message}</div>}
                    </div>
                    <button className="toast-close" onClick={() => onRemove(t.id)}>✕</button>
                </div>
            ))}
        </div>
    );
}
