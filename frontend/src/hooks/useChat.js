import { useState, useCallback, useEffect } from 'react';

export function useChat(api, isAuthenticated) {
    const [conversations, setConversations] = useState([]);
    const [currentConv, setCurrentConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [agent, setAgent] = useState('general');
    const [sending, setSending] = useState(false);

    const loadConversations = useCallback(async () => {
        if (!isAuthenticated || !api) return;
        try {
            const data = await api('/chat/conversations');
            setConversations(data);
        } catch (e) {
            console.error('Failed to load conversations:', e);
        }
    }, [api, isAuthenticated]);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    const loadConversation = useCallback(async (id) => {
        if (!api) return;
        try {
            const data = await api(`/chat/conversations/${id}`);
            setCurrentConv(data);
            setMessages(data.messages || []);
            if (data.agentType || data.agent_type) {
                setAgent(data.agentType || data.agent_type);
            }
        } catch (e) {
            console.error('Failed to load conversation:', e);
        }
    }, [api]);

    const sendMessage = useCallback(async (content) => {
        if (!content.trim() || sending) return;
        setSending(true);

        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: content.trim(),
            agent_type: agent,
            agentType: agent,
            created_at: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMsg]);

        try {
            if (isAuthenticated && api) {
                const data = await api('/chat/messages', {
                    method: 'POST',
                    body: JSON.stringify({
                        content: content.trim(),
                        conversation_id: currentConv?.id || null,
                        conversationId: currentConv?.id || null,
                        agent_type: agent,
                        agentType: agent,
                    }),
                });
                setMessages(prev => [...prev, data]);
                if (data.conversationId || data.conversation_id) {
                    const cid = data.conversationId || data.conversation_id;
                    if (!currentConv) {
                        loadConversation(cid);
                    }
                    loadConversations();
                }
            } else {
                // Demo mode
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        role: 'assistant',
                        content: getDemoResponse(content.trim(), agent),
                        agent_type: agent,
                        agentType: agent,
                        created_at: new Date().toISOString(),
                        createdAt: new Date().toISOString(),
                        tokens_used: 0,
                        tokensUsed: 0,
                    }]);
                    setSending(false);
                }, 1200);
                return;
            }
        } catch (e) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: `**Error:** ${e.message}. Please try again.`,
                agent_type: agent,
                created_at: new Date().toISOString(),
            }]);
        } finally {
            setSending(false);
        }
    }, [agent, api, currentConv, isAuthenticated, sending, loadConversation, loadConversations]);

    const newChat = useCallback(() => {
        setCurrentConv(null);
        setMessages([]);
    }, []);

    return {
        conversations,
        currentConv,
        messages,
        agent,
        setAgent,
        sending,
        sendMessage,
        loadConversation,
        newChat,
    };
}

function getDemoResponse(msg, agent) {
    const agentLabels = {
        general: 'General Assistant',
        legal: 'Legal Expert',
        compliance: 'Compliance Agent',
        risk: 'Risk Analyst',
    };
    const label = agentLabels[agent] || agentLabels.general;
    return `**${label} (Demo Mode)**\n\nI received your query: *"${msg.substring(0, 60)}${msg.length > 60 ? '…' : ''}"*\n\nTo get AI-powered responses with full Indian legal analysis, please:\n\n1. **Sign up** for a free account\n2. **Configure** your OpenAI API key in the backend\n3. **Ask anything** about Indian law, compliance, or business risk\n\n> This is a demonstration response. The full system provides detailed legal analysis with section citations, compliance checklists, and risk scoring.`;
}
