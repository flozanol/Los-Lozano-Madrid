'use client';

import { useState, useEffect } from 'react';
import { Send, User, MessageSquare, Loader2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

interface Message {
    id: string;
    content: string;
    user_name: string;
    created_at: string;
}

const SocialPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [userName, setUserName] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setMessages(data);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !userName.trim() || isSending) return;

        setIsSending(true);
        const { error } = await supabase
            .from('messages')
            .insert([{ content: input, user_name: userName }]);

        if (error) {
            alert('Error al enviar: Asegúrate de configurar la tabla "messages" en Supabase.');
        } else {
            setInput('');
            fetchMessages(); // Refresh list
        }
        setIsSending(false);
    };

    return (
        <div className={styles.socialPage}>
            <div className="container">
                <header className={styles.header}>
                    <h1>Mural <span className="text-gold">Familiar</span></h1>
                    <p>Dejad vuestros recados y planes para el grupo.</p>
                </header>

                <div className={styles.content}>
                    <form onSubmit={handleSubmit} className={`${styles.inputCard} glass`}>
                        <div className={styles.formGroup}>
                            <div className={styles.inputWrapper}>
                                <User size={18} className={styles.icon} />
                                <input
                                    type="text"
                                    placeholder="Tu nombre..."
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.inputWrapper}>
                                <MessageSquare size={18} className={styles.icon} />
                                <textarea
                                    placeholder="¿Qué quieres decir a la familia?..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className={styles.textarea}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" disabled={isSending}>
                            {isSending ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                            Enviar al Mural
                        </button>
                    </form>

                    <div className={styles.messagesList}>
                        {isLoading ? (
                            <div className="text-center py-10">
                                <Loader2 className="animate-spin mx-auto text-gold" size={40} />
                            </div>
                        ) : (
                            messages.map((m) => (
                                <div key={m.id} className={`${styles.messageCard} glass`}>
                                    <div className={styles.messageHeader}>
                                        <span className={styles.userName}>{m.user_name}</span>
                                        <span className={styles.date}>{new Date(m.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className={styles.messageBody}>{m.content}</p>
                                </div>
                            ))
                        )}
                        {!isLoading && messages.length === 0 && (
                            <p className="text-center opacity-50 py-10">El mural está vacío. ¡Sed los primeros en escribir!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialPage;
