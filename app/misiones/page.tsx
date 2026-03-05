'use client';

import { useState, useEffect } from 'react';
import { Target, CheckCircle2, Circle, Trophy, Star, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const MissionsPage = () => {
    const [missions, setMissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('missions')
            .select('*')
            .order('created_at', { ascending: true });

        if (!error && data) setMissions(data);
        setLoading(false);
    };

    const toggleMission = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('missions')
            .update({ completed: !currentStatus })
            .eq('id', id);

        if (!error) {
            setMissions(prev => prev.map(m => m.id === id ? { ...m, completed: !currentStatus } : m));
        }
    };

    const completedCount = missions.filter(m => m.completed).length;
    const progress = missions.length > 0 ? (completedCount / missions.length) * 100 : 0;

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_skyline.webp)', backgroundPosition: 'center' }}
            ></div>
            <div className="content-wrapper">
                <div className="container max-w-3xl">
                    <header className="mb-12 text-center text-white">
                        <Target className="mx-auto mb-4 text-madrid-red" size={56} />
                        <h1 className="text-4xl font-black mb-4">MISIONES <span className="text-gold">DEL VIAJE</span></h1>
                        <p className="text-gray-200">Retos familiares para hacer el viaje inolvidable.</p>
                    </header>

                    <div className="glass p-8 mb-12 border-b-8 border-gold text-center">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500">Progreso Familiar</span>
                            <span className="text-2xl font-black text-madrid-red">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-madrid-red to-amber-400 transition-all duration-1000"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="mt-6 flex justify-center gap-8">
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase text-gray-400">Completadas</p>
                                <p className="text-xl font-black">{completedCount}</p>
                            </div>
                            <div className="text-center border-x border-gray-100 px-8">
                                <p className="text-[10px] font-black uppercase text-gray-400">Pendientes</p>
                                <p className="text-xl font-black">{missions.length - completedCount}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase text-gray-400">Total</p>
                                <p className="text-xl font-black">{missions.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loading ? (
                            <div className="col-span-2 text-center py-12"><Loader2 className="animate-spin mx-auto text-white" size={32} /></div>
                        ) : missions.length === 0 ? (
                            <div className="col-span-2 glass p-12 text-center opacity-70">No hay misiones activas. ¡Propón una al grupo!</div>
                        ) : (
                            missions.map((mission) => (
                                <button
                                    key={mission.id}
                                    onClick={() => toggleMission(mission.id, mission.completed)}
                                    className={`glass p-6 text-left transition-all transform active:scale-95 flex items-start gap-4 ${mission.completed ? 'bg-emerald-50/80 border-emerald-200 opacity-80' : 'hover:border-madrid-red'
                                        }`}
                                >
                                    <div className={`mt-1 shrink-0 ${mission.completed ? 'text-emerald-500' : 'text-gray-300'}`}>
                                        {mission.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className={`font-black mb-1 ${mission.completed ? 'text-emerald-900 line-through' : 'text-gray-900 text-lg'}`}>
                                            {mission.task}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-white rounded-full text-madrid-red border border-red-50">
                                                +{mission.points} PUNTOS
                                            </span>
                                            {mission.points >= 20 && <Trophy size={12} className="text-amber-500" />}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-6 py-3 rounded-2xl font-bold">
                            <Star size={20} className="text-amber-500 fill-amber-500" />
                            Premios al final del viaje para los mejores Lozanos
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MissionsPage;
