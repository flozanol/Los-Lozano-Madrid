'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Plus, Loader2, ThumbsUp, Trash2, Edit2, Check, X, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const RankingPage = () => {
    const categories = ['Tapas', 'Bares', 'Cafés', 'Experiencias'];
    const [selectedCategory, setSelectedCategory] = useState('Tapas');
    const [rankings, setRankings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchRankings();
    }, [selectedCategory]);

    const fetchRankings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('rankings')
            .select('*')
            .eq('category', selectedCategory)
            .order('votes', { ascending: false });

        if (!error && data) setRankings(data);
        setLoading(false);
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
            setShowAddForm(false);
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
                style={{ backgroundImage: 'url(/madrid_skyline.webp)', backgroundPosition: 'center' }}
            ></div>
            <div className="content-wrapper">
                <div className="container">
                    <header className="mb-12 text-center">
                        <div className="inline-flex p-5 bg-white/20 backdrop-blur-xl rounded-full mb-6 border border-white/30 shadow-2xl">
                            <Trophy className="text-gold animate-bounce" size={48} />
                        </div>
                        <h1 className="text-5xl font-black mb-4 text-white drop-shadow-2xl">RANKING <span className="text-madrid-gradient">LOZANO</span></h1>
                        <p className="text-gray-100 max-w-xl mx-auto font-medium drop-shadow-md">La voz de la familia. Vota por lo mejor de Madrid y decidamos el ganador del viaje.</p>
                    </header>

                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-lg ${selectedCategory === cat
                                        ? 'bg-madrid-red text-white scale-110'
                                        : 'bg-white/80 text-gray-500 hover:bg-white hover:text-madrid-red'
                                    }`}
                            >
                                {cat.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-white drop-shadow-md flex items-center gap-3">
                                {selectedCategory} <Sparkles size={20} className="text-gold" />
                            </h2>
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="p-3 bg-white/90 text-madrid-red rounded-xl shadow-lg hover:scale-110 transition-transform font-black text-xs flex items-center gap-2"
                            >
                                <Plus size={18} /> AÑADIR OPCIÓN
                            </button>
                        </div>

                        {showAddForm && (
                            <form onSubmit={handleAddItem} className="glass p-6 mb-8 animate-in slide-in-from-top duration-500">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        placeholder={`Nombre de ${selectedCategory}...`}
                                        className="flex-1 p-4 rounded-xl border-none focus:ring-2 focus:ring-madrid-red font-bold"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-madrid-red text-white px-8 rounded-xl font-black hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" /> : 'AÑADIR'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {loading ? (
                            <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-white" size={40} /></div>
                        ) : (
                            <div className="space-y-4">
                                {rankings.map((item, idx) => (
                                    <div key={item.id} className="glass p-6 flex items-center justify-between group hover:bg-white/95 transition-all shadow-xl border-l-8 border-madrid-red">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl shadow-inner ${idx === 0 ? 'bg-gold/20 text-gold scale-125' :
                                                    idx === 1 ? 'bg-silver/20 text-silver' :
                                                        'bg-gray-100 text-gray-400'
                                                }`}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900">{item.item_name}</h3>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} className={i < 5 - idx ? 'text-gold fill-gold' : 'text-gray-200'} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right mr-4">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Votos</p>
                                                <p className="text-2xl font-black text-madrid-red">{item.votes}</p>
                                            </div>
                                            <button
                                                onClick={() => handleVote(item.id, item.votes)}
                                                className="p-4 bg-red-50 text-madrid-red rounded-2xl hover:bg-madrid-red hover:text-white transition-all shadow-md active:scale-95"
                                            >
                                                <ThumbsUp size={24} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {rankings.length === 0 && (
                                    <div className="glass p-12 text-center text-white/70 italic font-medium">
                                        No hay opciones en esta categoría. ¡Sé el primero en añadir una!
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

export default RankingPage;
