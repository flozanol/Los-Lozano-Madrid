'use client';

import { useState, useEffect } from 'react';
import { UtensilsCrossed, Star, MapPin, ChevronRight, Info, Heart, Loader2, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const RinconGatoPage = () => {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('local_restaurants')
            .select('*')
            .order('name', { ascending: true });

        if (!error && data) setRestaurants(data);
        setLoading(false);
    };

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_skyline.webp)', backgroundPosition: 'center' }}
            ></div>
            <div className="content-wrapper">
                <div className="container">
                    <header className="mb-12 text-center text-white">
                        <div className="inline-flex p-4 bg-white/20 backdrop-blur-md rounded-3xl mb-6 border border-white/30">
                            <UtensilsCrossed className="text-gold" size={48} />
                        </div>
                        <h1 className="text-5xl font-black mb-4 tracking-tight drop-shadow-xl">RINCÓN DEL <span className="text-madrid-gradient">GATO</span></h1>
                        <p className="text-gray-100 max-w-2xl mx-auto text-lg font-medium drop-shadow">
                            Donde comen los madrileños (los de verdad). Olvida los menús turísticos y descubre el Madrid auténtico.
                        </p>
                    </header>

                    {loading ? (
                        <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-white" size={48} /></div>
                    ) : restaurants.length === 0 ? (
                        <div className="glass p-12 text-center text-white font-bold opacity-70">
                            Todavía no hay rincones secretos. ¡Añádelos en la base de datos!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {restaurants.map((res) => (
                                <section key={res.id} className="glass overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl">
                                    {/* Image Header */}
                                    <div className="relative h-48 overflow-hidden">
                                        {res.image_url ? (
                                            <img src={res.image_url} alt={res.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-madrid-red to-amber-500"></div>
                                        )}
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all"></div>
                                        <div className="absolute bottom-4 left-4">
                                            <span className="px-3 py-1 bg-white/95 text-madrid-red rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                {res.vibe || 'AUTÉNTICO'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-white/95">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-red-50 text-madrid-red rounded-2xl group-hover:bg-madrid-red group-hover:text-white transition-colors">
                                                    <Heart size={24} />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black text-gray-900">{res.name}</h2>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <MapPin size={12} className="text-gray-400" />
                                                        <span className="text-xs font-bold text-gray-500 uppercase">{res.area}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                {[...Array(res.price?.length || 1)].map((_, i) => (
                                                    <DollarSign key={i} size={16} className="text-emerald-600" />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <p className="text-xs font-black text-madrid-red uppercase tracking-widest mb-1">Especialidad</p>
                                            <p className="text-lg font-bold text-gray-800">{res.specialty}</p>
                                        </div>

                                        <p className="text-gray-600 leading-relaxed mb-8 italic font-medium">
                                            "{res.description}"
                                        </p>

                                        {res.map_url && (
                                            <a
                                                href={res.map_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-4 bg-gray-50 rounded-2xl font-black text-sm text-gray-500 hover:bg-madrid-red hover:text-white transition-all flex justify-between items-center px-6 no-underline"
                                            >
                                                VER MAPA
                                                <ChevronRight size={18} />
                                            </a>
                                        )}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}

                    <footer className="mt-20 glass p-8 text-center border-dashed border-2 border-white/30">
                        <Info className="mx-auto mb-4 text-white/50" size={32} />
                        <p className="text-white/80 font-medium">
                            ¿Conoces algún sitio que sea secreto de los gatos? <br />
                            ¡Cuéntaselo a la familia en el Chat!
                        </p>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default RinconGatoPage;
