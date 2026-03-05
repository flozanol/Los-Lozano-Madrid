'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Send, User, Loader2, Sparkles, Quote, History } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DiaryPage = () => {
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newContent, setNewContent] = useState('');
    const [author, setAuthor] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('diary_entries')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setEntries(data);
        setLoading(false);
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

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_skyline.webp)', backgroundPosition: 'center' }}
            ></div>
            <div className="content-wrapper">
                <div className="container">
                    <header className="mb-12 text-center">
                        <div className="inline-flex p-5 bg-white/20 backdrop-blur-xl rounded-2xl mb-6 border border-white/30 shadow-2xl skew-y-3">
                            <BookOpen className="text-white" size={48} />
                        </div>
                        <h1 className="text-5xl font-black mb-4 text-white drop-shadow-2xl italic tracking-tighter">DIARIO DEL <span className="text-madrid-gradient">VIAJE</span></h1>
                        <p className="text-gray-100 max-w-xl mx-auto font-medium drop-shadow-md">Momentos, risas y anécdotas. Que nada se olvide en esta aventura familiar.</p>
                    </header>

                    <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="glass p-8 mb-16 shadow-2xl border-t-4 border-madrid-red">
                            <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-800 uppercase tracking-widest">
                                <Sparkles size={18} className="text-madrid-red" /> Escribir un recuerdo
                            </h2>
                            <textarea
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder="¿Qué pasó hoy?..."
                                className="w-full h-32 p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-madrid-red mb-4 font-medium text-lg text-gray-900"
                                required
                            />
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="Tu nombre"
                                        className="w-full p-4 pl-12 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-madrid-red font-bold text-gray-900"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-madrid-red text-white px-8 rounded-2xl font-black hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                    PUBLICAR
                                </button>
                            </div>
                        </form>

                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/20 hidden md:block"></div>

                            {loading ? (
                                <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-white" size={40} /></div>
                            ) : (
                                <div className="space-y-12">
                                    {entries.map((entry, idx) => (
                                        <div key={entry.id} className="relative md:pl-20">
                                            <div className="absolute left-4 md:left-6 top-0 w-10 md:w-12 h-10 md:h-12 bg-madrid-red text-white rounded-full flex items-center justify-center font-black text-[10px] md:text-xs shadow-xl z-10 border-4 border-white/20">
                                                {entry.date_str}
                                            </div>
                                            <div className="glass p-8 relative overflow-hidden group hover:bg-white/95 transition-all shadow-2xl">
                                                <Quote className="absolute -right-4 -top-4 text-madrid-red/5 group-hover:text-madrid-red/10 transition-colors" size={120} />
                                                <p className="text-xl font-bold text-gray-800 leading-relaxed mb-6 relative z-10 transition-colors group-hover:text-gray-900">
                                                    "{entry.content}"
                                                </p>
                                                <div className="flex justify-between items-center relative z-10">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-madrid-red/10 rounded-full flex items-center justify-center">
                                                            <User size={14} className="text-madrid-red" />
                                                        </div>
                                                        <span className="font-black text-sm uppercase tracking-widest text-madrid-red">{entry.author}</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                        <History size={12} /> RECIENTE
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {entries.length === 0 && (
                                        <div className="glass p-12 text-center text-white/50 italic font-medium">
                                            Aún no hay entradas en el diario. <br />
                                            ¡Sé el primero en escribir algo!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DiaryPage;
