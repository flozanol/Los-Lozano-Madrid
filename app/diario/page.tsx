'use client';

import { useState, useEffect } from 'react';
import { BookOpen, PenTool, User, Calendar, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DiaryPage = () => {
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
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

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote || !author) return;

        setIsSaving(true);
        const now = new Date();
        const dateStr = `${now.getDate()} ${['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'][now.getMonth()]}`;

        const { error } = await supabase
            .from('diary_entries')
            .insert([{ content: newNote, author, date_str: dateStr }]);

        if (!error) {
            setNewNote('');
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
                <div className="container max-w-2xl">
                    <header className="mb-12 text-center text-white">
                        <BookOpen className="mx-auto mb-4 text-madrid-red" size={56} />
                        <h1 className="text-4xl font-black mb-4">DIARIO <span className="text-gold">DEL VIAJE</span></h1>
                        <p className="text-gray-200">Nuestras vivencias en Madrid para el recuerdo.</p>
                    </header>

                    <form onSubmit={handlePost} className="glass p-6 mb-12 border-b-4 border-madrid-red">
                        <div className="mb-4">
                            <label className="text-xs font-black uppercase text-gray-500 mb-2 block">¿Quién escribe?</label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="Tu nombre"
                                className="w-full bg-white/50 border-none rounded-xl p-4 font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-madrid-red"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="text-xs font-black uppercase text-gray-500 mb-2 block">Lo que vivimos hoy...</label>
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Escribe aquí tu relato del día..."
                                className="w-full bg-white/50 border-none rounded-xl p-4 min-h-[150px] font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-madrid-red"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full btn-primary justify-center gap-3"
                        >
                            {isSaving ? <Loader2 className="animate-spin" /> : <><PenTool size={20} /> GUARDAR RECUERDO</>}
                        </button>
                    </form>

                    <div className="space-y-8">
                        {loading ? (
                            <div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-white" size={32} /></div>
                        ) : entries.length === 0 ? (
                            <div className="glass p-12 text-center opacity-70">Aún no hay recuerdos guardados. ¡Sé el primero!</div>
                        ) : (
                            entries.map((entry) => (
                                <div key={entry.id} className="relative">
                                    <div className="absolute -left-3 top-6 w-6 h-6 bg-madrid-red rounded-full border-4 border-white z-10"></div>
                                    <div className="glass p-8 ml-4 border-l-4 border-madrid-red">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-red-50 text-madrid-red rounded-lg">
                                                    <User size={16} />
                                                </div>
                                                <span className="font-black text-sm uppercase tracking-tight">{entry.author}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                <Calendar size={14} />
                                                {entry.date_str}
                                            </div>
                                        </div>
                                        <p className="text-lg leading-relaxed text-gray-700 italic font-medium">"{entry.content}"</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DiaryPage;
