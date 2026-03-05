'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, ThumbsUp, Coffee, Beer, Utensils, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const categories = [
    { id: 'Tapas', icon: Utensils, label: 'Mejor Tapa' },
    { id: 'Bares', icon: Beer, label: 'Mejor Bar' },
    { id: 'Cafés', icon: Coffee, label: 'Mejor Café' },
    { id: 'Experiencias', icon: Sparkles, label: 'Experiencia TOP' },
];

const RankingPage = () => {
    const [rankings, setRankings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Tapas');

    useEffect(() => {
        fetchRankings();
    }, []);

    const fetchRankings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('rankings')
            .select('*')
            .order('votes', { ascending: false });

        if (!error && data) setRankings(data);
        setLoading(false);
    };

    const handleVote = async (id: string, currentVotes: number) => {
        const { error } = await supabase
            .from('rankings')
            .update({ votes: currentVotes + 1 })
            .eq('id', id);

        if (!error) {
            setRankings(prev => prev.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r).sort((a, b) => b.votes - a.votes));
        }
    };

    const currentRankings = rankings.filter(r => r.category === activeCategory);

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_skyline.webp)', backgroundPosition: 'top' }}
            ></div>
            <div className="content-wrapper">
                <div className="container">
                    <header className="mb-12 text-center text-white">
                        <Trophy className="mx-auto mb-4 text-amber-400" size={56} />
                        <h1 className="text-4xl font-black mb-4">RANKING <span className="text-gold">LOZANO</span></h1>
                        <p className="text-gray-200">Votación familiar diaria. El honor está en juego.</p>
                    </header>

                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all ${activeCategory === cat.id
                                        ? 'bg-madrid-red text-white shadow-xl scale-105'
                                        : 'glass text-gray-600 hover:bg-white/80'
                                    }`}
                            >
                                <cat.icon size={20} />
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-2xl mx-auto space-y-4">
                        {loading ? (
                            <div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-white" size={32} /></div>
                        ) : currentRankings.length === 0 ? (
                            <div className="glass p-12 text-center opacity-70">Aún no hay nominados en esta categoría.</div>
                        ) : (
                            currentRankings.map((item, idx) => (
                                <div key={item.id} className="glass p-6 flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl ${idx === 0 ? 'bg-amber-400 text-white shadow-lg' :
                                                idx === 1 ? 'bg-gray-300 text-white' :
                                                    idx === 2 ? 'bg-amber-700 text-white' : 'bg-white/40 text-gray-500'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black">{item.item_name}</h3>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                                    {item.votes} VOTOS
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleVote(item.id, item.votes)}
                                        className="p-4 bg-red-50 text-madrid-red rounded-2xl hover:bg-madrid-red hover:text-white transition-all transform hover:scale-110 active:scale-95"
                                    >
                                        <ThumbsUp size={24} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RankingPage;
