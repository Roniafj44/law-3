import { useState } from 'react';
import { useAuth, useChat, useToast } from './hooks';
import ParticleCanvas from './components/ParticleCanvas';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import AuthModal from './components/AuthModal';
import Toasts from './components/Toasts';
import './index.css';

export default function App() {
    const { user, isAuthenticated, loading, login, register, logout, api } = useAuth();
    const chat = useChat(api, isAuthenticated);
    const { toasts, addToast, removeToast } = useToast();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleAuthClick = () => {
        if (isAuthenticated) {
            logout();
            addToast('Signed Out', 'See you next time!', 'ok');
        } else {
            setShowAuthModal(true);
        }
    };

    const handleLogin = async (email, password) => {
        await login(email, password);
        addToast('Welcome!', 'Signed in successfully', 'ok');
    };

    const handleRegister = async (email, password, name) => {
        await register(email, password, name);
        addToast('Welcome!', 'Account created successfully', 'ok');
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <span className="loading-icon">⚖</span>
                <div className="loading-text">Initializing LawPilot AI</div>
                <div className="loading-bar">
                    <div className="loading-bar-fill" />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-canvas" />
            <ParticleCanvas />
            <div className="scanline-overlay" />

            <div className="app-shell">
                <Sidebar
                    user={user}
                    isAuthenticated={isAuthenticated}
                    agent={chat.agent}
                    setAgent={chat.setAgent}
                    conversations={chat.conversations}
                    currentConv={chat.currentConv}
                    loadConversation={chat.loadConversation}
                    newChat={chat.newChat}
                    onAuthClick={handleAuthClick}
                    isOpen={sidebarOpen}
                />
                <ChatArea
                    messages={chat.messages}
                    agent={chat.agent}
                    sending={chat.sending}
                    onSendMessage={chat.sendMessage}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />
            </div>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onLogin={handleLogin}
                onRegister={handleRegister}
            />
            <Toasts toasts={toasts} onRemove={removeToast} />
        </>
    );
}
