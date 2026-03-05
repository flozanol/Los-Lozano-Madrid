'use client';

import { useState, useEffect } from 'react';
import { Target, CheckCircle2, Circle, Trophy, Loader2, Plus, Trash2, Sparkles, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const MissionsPage = () => {
    const [missions, setMissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [newPoints, setNewPoints] = useState('10');
    const [isSaving, setIsSaving] = useState(false);

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

        if (!error) fetchMissions();
    };

    const handleAddMission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        setIsSaving(true);
        const { error } = await supabase
            .from('missions')
            .insert([{ task: newTask.trim(), points: parseInt(newPoints), completed: false }]);

        if (!error) {
            setNewTask('');
            setNewPoints('10');
            setShowAddForm(false);
            fetchMissions();
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta misión?')) return;
        const { error } = await supabase.from('missions').delete().eq('id', id);
        if (!error) fetchMissions();
    };

    const totalPoints = missions.reduce((acc, m) => acc + (m.completed ? m.points : 0), 0);
    const possiblePoints = missions.reduce((acc, m) => acc + m.points, 0);
    const progress = possiblePoints > 0 ? (totalPoints / possiblePoints) * 100 : 0;

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
                            <Target className="text-white" size={48} />
                        </div>
                        <h1 className="text-5xl font-black mb-4 text-white drop-shadow-2xl">MISIONES DEL <span className="text-madrid-gradient">VIAJE</span></h1>
                        <p className="text-gray-100 max-w-xl mx-auto font-medium drop-shadow-md">Pequeños retos para grandes viajeros. ¿Cuántos puntos lograrán los Lozano?</p>
                    </header>

                    <div className="max-w-3xl mx-auto">
                        {/* Progress Card */}
                        <div className="glass p-8 mb-12 shadow-2xl relative overflow-hidden border-b-8 border-madrid-red text-gray-900">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Trophy size={120} />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="text-center md:text-left">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Puntos Totales</p>
                                    <h2 className="text-6xl font-black text-madrid-red">{totalPoints}<span className="text-lg text-gray-400 ml-2">/ {possiblePoints}</span></h2>
                                </div>
                                <div className="flex-1 w-full max-w-md">
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-xs font-black uppercase text-gray-500">Progreso del viaje</p>
                                        <p className="text-lg font-black text-madrid-red">{Math.round(progress)}%</p>
                                    </div>
                                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner p-1">
                                        <div
                                            className="h-full bg-gradient-to-r from-madrid-red to-amber-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-white drop-shadow-md flex items-center gap-3">
                                Lista de Retos <Sparkles size={20} className="text-gold" />
                            </h3>
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="p-3 bg-white/90 text-madrid-red rounded-xl shadow-lg hover:scale-110 transition-transform font-black text-xs flex items-center gap-2"
                            >
                                <Plus size={18} /> AÑADIR RETO
                            </button>
                        </div>

                        {showAddForm && (
                            <form onSubmit={handleAddMission} className="glass p-8 mb-12 animate-in slide-in-from-top duration-500 border-t-4 border-gold">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={newTask}
                                            onChange={(e) => setNewTask(e.target.value)}
                                            placeholder="Descripción del reto..."
                                            className="w-full p-4 pl-12 rounded-2xl border-none focus:ring-2 focus:ring-madrid-red font-bold text-gray-900"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={newPoints}
                                        onChange={(e) => setNewPoints(e.target.value)}
                                        placeholder="Pts"
                                        className="w-24 p-4 rounded-2xl border-none focus:ring-2 focus:ring-madrid-red font-bold text-gray-900 text-center"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-madrid-red text-white px-8 py-4 rounded-2xl font-black hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" /> : 'AÑADIR'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {loading ? (
                            <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-white" size={48} /></div>
                        ) : (
                            <div className="space-y-4">
                                {missions.map((m) => (
                                    <div
                                        key={m.id}
                                        onClick={() => toggleMission(m.id, m.completed)}
                                        className={`glass p-6 md:p-8 flex items-center justify-between cursor-pointer transition-all duration-500 shadow-xl group border-l-8 ${m.completed ? 'opacity-70 border-emerald-500 bg-white/95 scale-95' : 'border-madrid-red bg-white/95 hover:scale-[1.02] hover:border-gold'
                                            }`}
                                    >
                                        <div className="flex items-center gap-6">
                                            {m.completed ? (
                                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl shadow-inner">
                                                    <CheckCircle2 size={32} />
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-red-50 text-madrid-red rounded-2xl shadow-sm group-hover:bg-red-100 transition-colors">
                                                    <Circle size={32} />
                                                </div>
                                            )}
                                            <div>
                                                <p className={`text-xl font-black tracking-tight transition-all ${m.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                                    {m.task}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Star size={12} className={m.completed ? 'text-gray-300' : 'text-gold fill-gold'} />
                                                    <span className={`text-xs font-black uppercase tracking-widest ${m.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {m.points} puntos
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}
                                            className="p-2 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {missions.length === 0 && (
                                    <div className="glass p-12 text-center text-white/50 italic font-medium">
                                        No hay misiones activas. ¡Crea el primer reto!
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

export default MissionsPage;
