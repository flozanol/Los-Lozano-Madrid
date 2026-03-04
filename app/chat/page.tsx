'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import styles from './page.module.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '¡Hola familia Lozano! Soy vuestro guía personal para Madrid. ¿En qué os puedo ayudar hoy? ¿Dudas sobre el clima, algún restaurante o qué ver el día 28?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) }),
            });

            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, familia. He tenido un pequeño despiste madrileño. ¿Podéis repetir la pregunta?' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.chatPage}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <Sparkles className={styles.sparkleIcon} />
                    </div>
                    <h1>Guía IA <span className="text-gold">Madrileño</span></h1>
                    <p>Pregúntame lo que quieras sobre nuestro viaje.</p>
                </header>

                <div className={`${styles.chatBox} glass`}>
                    <div className={styles.messages}>
                        {messages.map((m, i) => (
                            <div key={i} className={`${styles.messageWrapper} ${styles[m.role]}`}>
                                <div className={styles.avatar}>
                                    {m.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                                </div>
                                <div className={styles.messageContent}>
                                    <p>{m.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className={`${styles.messageWrapper} ${styles.assistant}`}>
                                <div className={styles.avatar}>
                                    <Bot size={20} />
                                </div>
                                <div className={styles.loadingDots}>
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className={styles.inputArea}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escribe tu duda aquí..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}>
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
