'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ChatAssistant.module.css';

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            const data = await response.json();

            if (data.choices && data.choices[0]?.message?.content) {
                setMessages(prev => [...prev, data.choices[0].message]);
            } else {
                const errorMessage = data.error || '¡Vaya! Parece que Chulapo se ha quedado sin palabras. Inténtalo de nuevo en un momento.';
                setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
            }
        } catch (error) {
            console.error('Error in chat:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: '¡Oye! He tenido un pequeño mareo castizo. ¿Podrías repetirme eso?' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.chatWrapper}>
            {/* Botón Flotante */}
            <button
                className={`${styles.floatingButton} ${isOpen ? styles.hidden : ''}`}
                onClick={() => setIsOpen(true)}
                aria-label="Hablar con Chulapo"
            >
                <span>🤖</span>
                <span className={styles.btnText}>Chulapo</span>
            </button>

            {/* Ventana de Chat */}
            <div className={`${styles.chatWindow} ${isOpen ? styles.active : ''} glass`}>
                <div className={styles.chatHeader}>
                    <div className={styles.headerInfo}>
                        <span className={styles.avatar}>🤖</span>
                        <div>
                            <h3>Chulapo</h3>
                            <p>Asistente de los Lozano</p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
                </div>

                <div className={styles.messagesList}>
                    {messages.length === 0 && (
                        <div className={styles.welcome}>
                            <p>¡Hala! Soy <strong>Chulapo</strong>, vuestro guía personal. Preguntadme lo que queráis sobre Madrid.</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.assistant}`}>
                            <div className={styles.messageContent}>{msg.content}</div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className={`${styles.message} ${styles.assistant}`}>
                            <div className={styles.typing}><span>.</span><span>.</span><span>.</span></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className={styles.chatInput}>
                    <input
                        type="text"
                        placeholder="Escribe aquí..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? '...' : '➤'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatAssistant;
