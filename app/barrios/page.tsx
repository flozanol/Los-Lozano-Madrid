'use client';

import { useState, useEffect } from 'react';
import { MapPin, Info, Camera, ShoppingBag, Utensils, Star, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const NeighborhoodsPage = () => {
    const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNeighborhoods();
    }, []);

    const fetchNeighborhoods = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('barrios')
            .select('*')
            .order('name', { ascending: true });

        if (!error && data) {
            setNeighborhoods(data);
        }
        setLoading(false);
    };

    const getIcon = (vibe: string) => {
        const v = vibe?.toLowerCase() || '';
        if (v.includes('lujo') || v.includes('elegante')) return ShoppingBag;
        if (v.includes('alternativo') || v.includes('moderno')) return Camera;
        if (v.includes('tapas') || v.includes('castizo')) return Utensils;
        if (v.includes('verde') || v.includes('parque')) return MapPin;
        return Info;
    };

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_skyline.webp)', backgroundPosition: 'bottom' }}
            ></div>
            <div className="content-wrapper">
                <div className="container">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl font-black mb-4 text-white drop-shadow-lg">BARRIOS DE <span className="text-madrid-gradient">MADRID</span></h1>
                        <p className="text-gray-100 max-w-xl mx-auto font-medium drop-shadow">Guía dinámica de los barrios más icónicos. Los Lozano exploran el alma de la ciudad.</p>
                    </header>

                    {loading ? (
                        <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-white" size={48} /></div>
                    ) : neighborhoods.length === 0 ? (
                        <div className="glass p-12 text-center text-white font-bold opacity-70">
                            Todavía no hay barrios registrados. ¡Añádelos en la base de datos!
                        </div>
                    ) : (
                        <div className="flex flex-col gap-10">
                            {neighborhoods.map((n) => {
                                const Icon = getIcon(n.vibe);
                                return (
                                    <section key={n.id} className="glass overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-2xl">
                                        <div className="md:flex">
                                            {/* Image Side */}
                                            <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
                                                {n.image_url ? (
                                                    <img src={n.image_url} alt={n.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                                                ) : (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-madrid-red to-amber-500 flex items-center justify-center">
                                                        <Sparkles className="text-white/30" size={64} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/20"></div>
                                            </div>

                                            {/* Content Side */}
                                            <div className="p-8 md:w-2/3 bg-white/95">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="p-3 bg-red-50 text-madrid-red rounded-2xl shadow-sm">
                                                        <Icon size={24} />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{n.name}</h2>
                                                        <span className="text-xs font-black text-madrid-red uppercase tracking-widest">{n.vibe || 'MADRID VIBE'}</span>
                                                    </div>
                                                </div>

                                                <p className="text-gray-700 mb-8 leading-relaxed font-medium text-lg">
                                                    {n.description}
                                                </p>

                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {n.what_to_do?.map((todo: string, i: number) => (
                                                        <span key={i} className="px-4 py-2 bg-madrid-red/5 text-madrid-red rounded-full text-xs font-black border border-red-100 flex items-center gap-1">
                                                            <Star size={10} className="fill-madrid-red" />
                                                            {todo}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NeighborhoodsPage;
