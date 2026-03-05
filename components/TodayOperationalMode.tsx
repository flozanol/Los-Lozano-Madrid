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
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black flex items-center gap-2">
                    <Clock className="text-madrid-red" />
                    HOY — MODO OPERATIVO
                </h2>
                <span className="px-3 py-1 bg-madrid-red text-white text-xs font-bold rounded-full animate-pulse">
                    EN VIVO
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todayPlan.map((item) => (
                    <div key={item.id} className="glass overflow-hidden border-l-4 border-madrid-red">
                        <div className="p-5">
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
                                    <div className="flex items-start gap-3 p-3 bg-white/40 rounded-xl">
                                        <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-bold opacity-60 uppercase">Punto de Reunión</p>
                                            <p className="text-sm font-semibold">{item.meeting_point}</p>
                                        </div>
                                    </div>
                                )}

                                {item.reservation_details && (
                                    <div className="flex items-start gap-3 p-3 bg-white/40 rounded-xl">
                                        <ExternalLink size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-bold opacity-60 uppercase">Reserva / Info</p>
                                            <p className="text-sm font-semibold">{item.reservation_details}</p>
                                        </div>
                                    </div>
                                )}

                                {item.plan_b && (
                                    <div className="flex items-start gap-3 p-3 bg-white/40 rounded-xl border-dashed border-2 border-gray-200">
                                        <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-bold opacity-60 uppercase">Plan B (Si llueve)</p>
                                            <p className="text-sm font-semibold">{item.plan_b}</p>
                                        </div>
                                    </div>
                                )}

                                {item.accessibility_notes && (
                                    <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-gray-100 rounded-lg w-fit">
                                        <Accessibility size={14} className="text-gray-500" />
                                        <span className="text-[11px] font-medium text-gray-600">{item.accessibility_notes}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodayOperationalMode;
