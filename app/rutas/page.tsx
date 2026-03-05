'use client';

import { useState, useEffect } from 'react';
import { Footprints, Clock, MapPin, Star, ChevronRight, Info, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const RoutesPage = () => {
    const [routes, setRoutes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('routes')
            .select('*')
            .order('title', { ascending: true });

        if (!error && data) setRoutes(data);
        setLoading(false);
    };

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_skyline.webp)', backgroundPosition: 'top' }}
            ></div>
            <div className="content-wrapper">
                <div className="container">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl font-black mb-4 text-white drop-shadow-lg tracking-tight">RUTAS <span className="text-madrid-gradient">CAMINABLES</span></h1>
                        <p className="text-gray-100 max-w-xl mx-auto font-medium drop-shadow">Explora Madrid a pie. Rutas diseñadas para descubrir cada rincón paso a paso.</p>
                    </header>

                    {loading ? (
                        <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-white" size={48} /></div>
                    ) : routes.length === 0 ? (
                        <div className="glass p-12 text-center text-white font-bold opacity-70">
                            Todavía no hay rutas registradas. ¡Añádelas en la base de datos!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-12">
                            {routes.map((route) => (
                                <section key={route.id} className="glass overflow-hidden transition-all duration-500 hover:scale-[1.01] shadow-2xl">
                                    <div className="md:flex">
                                        {/* Image Side */}
                                        <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                                            {route.image_url ? (
                                                <img src={route.image_url} alt={route.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-madrid-red to-orange-400 flex items-center justify-center">
                                                    <Footprints className="text-white/30" size={80} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/20"></div>
                                            <div className="absolute top-6 left-6 flex gap-2">
                                                <span className="px-4 py-2 bg-white/95 text-madrid-red rounded-xl text-xs font-black shadow-xl flex items-center gap-2">
                                                    <MapPin size={14} /> {route.distance || '2-3 km'}
                                                </span>
                                                <span className="px-4 py-2 bg-white/95 text-gray-900 rounded-xl text-xs font-black shadow-xl flex items-center gap-2">
                                                    <Clock size={14} /> {route.time_est || '1-2 h'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Side */}
                                        <div className="p-10 md:w-1/2 bg-white/95 flex flex-col justify-center">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-4 bg-red-50 text-madrid-red rounded-2xl shadow-sm">
                                                    <Footprints size={28} />
                                                </div>
                                                <h2 className="text-3xl font-black text-gray-900 leading-tight">{route.title}</h2>
                                            </div>

                                            <p className="text-gray-600 mb-8 leading-relaxed font-medium text-lg italic">
                                                "{route.description}"
                                            </p>

                                            <div className="space-y-4 mb-10">
                                                <p className="text-xs font-black text-madrid-red uppercase tracking-widest">Puntos clave de la ruta</p>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {route.stops?.map((stop: string, i: number) => (
                                                        <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-madrid-red transition-colors">
                                                            <span className="w-8 h-8 rounded-full bg-madrid-red text-white flex items-center justify-center font-black text-sm shadow-md">
                                                                {i + 1}
                                                            </span>
                                                            <span className="font-bold text-gray-800">{stop}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <button className="w-full py-5 bg-madrid-red text-white rounded-2xl font-black text-sm shadow-xl hover:bg-red-700 transition-all flex justify-between items-center px-8">
                                                VER RUTA EN EL MAPA
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}

                    <footer className="mt-20 glass p-10 text-center border-dashed border-2 border-white/30">
                        <Info className="mx-auto mb-6 text-white/50" size={40} />
                        <p className="text-white/90 font-bold text-xl mb-2">¿Listos para caminar?</p>
                        <p className="text-white/70 font-medium">
                            Recomendamos zapato cómodo y muchas ganas de hacer fotos. <br />
                            ¡Madrid se descubre andando!
                        </p>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default RoutesPage;
