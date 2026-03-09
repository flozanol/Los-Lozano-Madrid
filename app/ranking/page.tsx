'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Plus, Loader2, ThumbsUp, Trash2, Edit2, Check, X, Sparkles, Heart } from 'lucide-react';
import styles from '../restaurants/page.module.css';
import { supabase } from '@/lib/supabase';

const RankingPage = () => {
    const categories = ['Tapas', 'Bares', 'Cafés', 'Experiencias'];
    const [selectedCategory, setSelectedCategory] = useState('Tapas');
    const [rankings, setRankings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchRankings();
    }, [selectedCategory]);

    const fetchRankings = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('rankings')
            .select('*')
            .eq('category', selectedCategory)
            .order('votes', { ascending: false });

        if (!error && data) setRankings(data);
        setIsLoading(false);
    };

    const handleVote = async (id: string, currentVotes: number) => {
        const { error } = await supabase
            .from('rankings')
            .update({ votes: currentVotes + 1 })
            .eq('id', id);

        if (!error) fetchRankings();
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        setIsSaving(true);
        const { error } = await supabase
            .from('rankings')
            .insert([{ category: selectedCategory, item_name: newItemName.trim(), votes: 0 }]);

        if (!error) {
            setNewItemName('');
            setShowForm(false);
            fetchRankings();
        }
        setIsSaving(false);
    };

    const handleUpdate = async (id: string) => {
        setIsSaving(true);
        const { error } = await supabase
            .from('rankings')
            .update({ item_name: editName })
            .eq('id', id);

        if (!error) {
            setEditingId(null);
            fetchRankings();
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este item del ranking?')) return;
        const { error } = await supabase.from('rankings').delete().eq('id', id);
        if (!error) fetchRankings();
    };

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_ranking.png)', backgroundPosition: 'center' }}
            ></div>
            <div className={`content-wrapper ${styles.restaurantsPage}`}>

                <div className={`${styles.header} container`}>
                    <div className="inline-flex p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-6 border border-white/20">
                        <Trophy className="text-white" size={40} />
                    </div>
                    <h1 className={styles.title}>Ranking <span className="text-madrid-gradient">Lozano</span></h1>
                    <p className="text-xl font-medium opacity-80">Vota por tus favoritos y decidamos lo mejor del viaje.</p>

                    <div className="flex flex-wrap justify-center gap-3 mt-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-3 rounded-2xl font-black text-[10px] transition-all tracking-[0.2em] ${selectedCategory === cat
                                    ? 'bg-madrid-red text-white shadow-xl scale-105'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5'
                                    }`}
                            >
                                {cat.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <button
                        className="btn-primary"
                        style={{ marginTop: '3rem' }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancelar' : <><Plus size={20} /> Añadir Opción</>}
                    </button>
                </div>

                <div className="container max-w-4xl">
                    {showForm && (
                        <form className={`${styles.addForm} glass mb-12`} onSubmit={handleAddItem}>
                            <div className="flex flex-col md:flex-row gap-4">
                                <input
                                    type="text"
                                    placeholder={`Nombre de ${selectedCategory} (Ej: La Mallorquina)`}
                                    value={newItemName}
                                    onChange={e => setNewItemName(e.target.value)}
                                    className="flex-1 p-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold"
                                    required
                                />
                                <button type="submit" className="btn-primary py-4 px-8" disabled={isSaving}>
                                    {isSaving ? <Loader2 className="animate-spin" /> : 'Añadir'}
                                </button>
                            </div>
                        </form>
                    )}

                    {isLoading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin mx-auto text-white" size={40} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {rankings.map((item, idx) => (
                                <div key={item.id} className="glass p-6 flex flex-col md:flex-row items-center justify-between group hover:bg-white/10 transition-all border border-white/5 rounded-3xl">
                                    <div className="flex items-center gap-6 w-full md:w-auto mb-4 md:mb-0">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl shadow-inner ${idx === 0 ? 'bg-amber-400 text-black' :
                                            idx === 1 ? 'bg-slate-300 text-black' :
                                                idx === 2 ? 'bg-amber-700 text-white' :
                                                    'bg-white/5 text-white/40'
                                            }`}>
                                            {idx + 1}
                                        </div>

                                        <div className="flex-1">
                                            {editingId === item.id ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={e => setEditName(e.target.value)}
                                                        className="bg-white/10 text-white p-2 rounded-lg text-sm font-bold border border-white/20"
                                                    />
                                                    <button onClick={() => handleUpdate(item.id)} className="p-2 bg-emerald-500 text-white rounded-lg"><Check size={16} /></button>
                                                    <button onClick={() => setEditingId(null)} className="p-2 bg-red-500 text-white rounded-lg"><X size={16} /></button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-black text-white">{item.item_name}</h3>
                                                    {idx === 0 && <Trophy className="text-amber-400" size={18} />}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} className={i < 5 - idx ? 'text-amber-400 fill-amber-400' : 'text-white/10'} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                        <div className="text-center md:text-right mr-4">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Votos de la Familia</p>
                                            <p className="text-3xl font-black text-white drop-shadow-lg">{item.votes}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleVote(item.id, item.votes)}
                                                className="p-4 bg-madrid-gradient text-white rounded-2xl hover:scale-110 transition-all shadow-xl active:scale-95"
                                            >
                                                <ThumbsUp size={24} />
                                            </button>

                                            <div className="flex flex-col gap-1 ml-2">
                                                <button onClick={() => { setEditingId(item.id); setEditName(item.item_name); }} className="p-2 text-white/30 hover:text-white transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-white/30 hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {rankings.length === 0 && (
                                <div className="glass p-12 text-center text-white/40 font-bold border-dashed border-2 border-white/10">
                                    Todavía no hay opciones para {selectedCategory}.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default RankingPage;

