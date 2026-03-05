'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Send, User, Loader2, Sparkles, Quote, History, Trash2, Edit2, Check, X } from 'lucide-react';
import styles from '../restaurants/page.module.css';
import { supabase } from '@/lib/supabase';

const DiaryPage = () => {
    const [entries, setEntries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newContent, setNewContent] = useState('');
    const [author, setAuthor] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('diary_entries')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setEntries(data);
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newContent.trim() || !author.trim()) return;

        setIsSaving(true);
        const now = new Date();
        const dateStr = `${now.getDate()} ${now.toLocaleString('es-ES', { month: 'short' }).toUpperCase()}`;

        const { error } = await supabase
            .from('diary_entries')
            .insert([{ content: newContent.trim(), author: author.trim(), date_str: dateStr }]);

        if (!error) {
            setNewContent('');
            fetchEntries();
        }
        setIsSaving(false);
    };

    const handleUpdate = async (id: string) => {
        setIsSaving(true);
        const { error } = await supabase
            .from('diary_entries')
            .update({ content: editContent })
            .eq('id', id);

        if (!error) {
            setEditingId(null);
            fetchEntries();
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Borrar este recuerdo del diario?')) return;
        const { error } = await supabase.from('diary_entries').delete().eq('id', id);
        if (!error) fetchEntries();
    };

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_diario.png)', backgroundPosition: 'center' }}
            ></div>
            <div className={`content-wrapper ${styles.restaurantsPage}`}>

                <div className={`${styles.header} container`}>
                    <div className="inline-flex p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-6 border border-white/20">
                        <BookOpen className="text-white" size={40} />
                    </div>
                    <h1 className={styles.title}>Diario del <span className="text-madrid-gradient">Viaje</span></h1>
                    <p className="text-lg opacity-90">Momentos, risas y anécdotas para el recuerdo familiar.</p>
                </div>

                <div className="container max-w-3xl">
                    <form onSubmit={handleSubmit} className={`${styles.addForm} glass mb-16 p-8`}>
                        <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-white/80 uppercase tracking-widest">
                            <Sparkles size={18} className="text-white" /> Escribir un recuerdo
                        </h2>
                        <textarea
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            placeholder="¿Qué pasó hoy?..."
                            className="w-full h-32 p-4 rounded-2xl bg-white/5 border border-white/10 text-white mb-4 italic"
                            required
                        />
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="Tu nombre"
                                    className="w-full p-4 pl-12 rounded-2xl bg-white/5 border border-white/10 text-white font-bold"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="btn-primary py-4 px-8"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                PUBLICAR
                            </button>
                        </div>
                    </form>

                    <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block"></div>

                        {isLoading ? (
                            <div className="text-center py-20">
                                <Loader2 className="animate-spin mx-auto text-white" size={40} />
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {entries.map((entry) => (
                                    <div key={entry.id} className="relative md:pl-20">
                                        <div className="absolute left-4 md:left-6 top-0 w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center font-black text-[10px] shadow-xl z-10 border border-white/20">
                                            {entry.date_str}
                                        </div>
                                        <div className="glass p-8 relative overflow-hidden group hover:bg-white/5 transition-all border border-white/5 rounded-3xl">
                                            <Quote className="absolute -right-4 -top-4 text-white/5 group-hover:text-white/10 transition-colors" size={100} />

                                            {editingId === entry.id ? (
                                                <div className="mb-6 relative z-10">
                                                    <textarea
                                                        value={editContent}
                                                        onChange={e => setEditContent(e.target.value)}
                                                        className="w-full p-4 bg-white/10 text-white rounded-xl border border-white/20 italic"
                                                    />
                                                    <div className="flex gap-2 mt-2">
                                                        <button onClick={() => handleUpdate(entry.id)} className="p-2 bg-emerald-500 text-white rounded-lg flex items-center gap-1 text-xs font-bold"><Check size={14} /> GUARDAR</button>
                                                        <button onClick={() => setEditingId(null)} className="p-2 bg-red-500 text-white rounded-lg flex items-center gap-1 text-xs font-bold"><X size={14} /> CANCELAR</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xl font-bold text-white/90 leading-relaxed mb-6 relative z-10">
                                                    "{entry.content}"
                                                </p>
                                            )}

                                            <div className="flex justify-between items-center relative z-10">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                                        <User size={14} className="text-white/60" />
                                                    </div>
                                                    <span className="font-black text-xs uppercase tracking-widest text-white/60">{entry.author}</span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => { setEditingId(entry.id); setEditContent(entry.content); }} className="p-2 text-white/20 hover:text-white transition-colors">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete(entry.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <span className="text-[10px] font-bold text-white/20 flex items-center gap-1">
                                                        <History size={12} /> RECIENTE
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {entries.length === 0 && (
                                    <div className="glass p-12 text-center text-white/40 italic font-medium border-dashed border-2 border-white/10">
                                        Aún no hay entradas en el diario. <br />
                                        ¡Sé el primero en escribir algo!
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DiaryPage;

