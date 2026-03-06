'use client';

import { useState, useEffect } from 'react';
import { Coffee, Sun, Moon, MapPin, Bus, Shield, Accessibility, Clock, CalendarDays, ExternalLink, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ItineraryItem {
    id: string;
    date_str: string;
    event_name: string;
    event_time: string;
    time_block?: string;
    meeting_point?: string;
    plan_b?: string;
    accessibility_notes?: string;
    reservation_details?: string;
}

const TodayOperationalMode = () => {
    const [todayPlan, setTodayPlan] = useState<ItineraryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTodayPlan();
    }, []);

    const getTodayStr = () => {
        const now = new Date();
        const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
        return `${now.getDate()} ${months[now.getMonth()]}`;
    };

    const fetchTodayPlan = async () => {
        try {
            const { data, error } = await supabase
                .from('itinerary')
                .select('*')
                .eq('date_str', getTodayStr());

            if (data) setTodayPlan(data);
        } catch (e) {
            console.error("Error fetching today's plan", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center opacity-50">Cargando modo operativo...</div>;

    if (todayPlan.length === 0) {
        return (
            <div className="glass p-6 text-center">
                <div className="inline-flex p-3 bg-red-50 rounded-full mb-4">
                    <CalendarDays className="text-madrid-red" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">No hay plan hoy</h3>
                <p className="text-gray-500 text-sm">¡Día libre para explorar! Si tienes algo en mente, añádelo al calendario.</p>
            </div>
        );
    }

    return (
        <section className="glass-premium p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-madrid-red/10 rounded-xl">
                        <Clock className="text-madrid-red" size={20} />
                    </div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">MODO OPERATIVO</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-madrid-red opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-madrid-red"></span>
                    </span>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">En Vivo</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {todayPlan.map((item) => (
                    <div key={item.id} className="glass-premium border-l-[6px] border-madrid-red group hover:scale-[1.01] transition-all">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-madrid-red uppercase tracking-wider">
                                    {item.time_block === 'Mañana' && <Coffee size={14} />}
                                    {item.time_block === 'Tarde' && <Sun size={14} />}
                                    {item.time_block === 'Noche' && <Moon size={14} />}
                                    {item.time_block || 'Plan'} — {item.event_time}
                                </div>
                            </div>

                            <h3 className="text-xl font-black mb-4 leading-tight">{item.event_name}</h3>

                            <div className="grid grid-cols-1 gap-3">
                                {item.meeting_point && (
                                    <div className="flex items-start gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                        <MapPin size={18} className="text-blue-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Punto de Reunión</p>
                                            <p className="text-sm font-bold text-white">{item.meeting_point}</p>
                                        </div>
                                    </div>
                                )}

                                {item.reservation_details && (
                                    <div className="flex items-start gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                        <ExternalLink size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Reserva / Info</p>
                                            <p className="text-sm font-bold text-white">{item.reservation_details}</p>
                                        </div>
                                    </div>
                                )}

                                {item.plan_b && (
                                    <div className="flex items-start gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border-dashed border border-white/20">
                                        <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Plan B (Si llueve)</p>
                                            <p className="text-sm font-bold text-white">{item.plan_b}</p>
                                        </div>
                                    </div>
                                )}

                                {item.accessibility_notes && (
                                    <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-white/5 rounded-lg w-fit border border-white/5">
                                        <Accessibility size={14} className="text-gray-500" />
                                        <span className="text-[11px] font-medium text-gray-600">{item.accessibility_notes}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TodayOperationalMode;
