'use client';

import { useState, useEffect } from 'react';
import { Target, CheckCircle2, Circle, Trophy, Loader2, Plus, Trash2, Sparkles, Star, Edit2, Check, X } from 'lucide-react';
import styles from '../restaurants/page.module.css';
import { supabase } from '@/lib/supabase';

const MissionsPage = () => {
    const [missions, setMissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newPoints, setNewPoints] = useState('10');
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTask, setEditTask] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editPoints, setEditPoints] = useState('');

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('missions')
            .select('*')
            .order('created_at', { ascending: true });

        if (!error && data) setMissions(data);
        setIsLoading(false);
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
            .insert([{
                task: newTask.trim(),
                description: newDescription.trim(),
                points: parseInt(newPoints),
                completed: false
            }]);

        if (!error) {
            setNewTask('');
            setNewDescription('');
            setNewPoints('10');
            setShowForm(false);
            fetchMissions();
        }
        setIsSaving(false);
    };

    const handleUpdate = async (id: string) => {
        setIsSaving(true);
        const { error } = await supabase
            .from('missions')
            .update({
                task: editTask,
                description: editDescription,
                points: parseInt(editPoints)
            })
            .eq('id', id);

        if (!error) {
            setEditingId(null);
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
                style={{ backgroundImage: 'url(/madrid_map_bg.png)', backgroundPosition: 'center' }}
            ></div>
            <div className={`content-wrapper ${styles.restaurantsPage}`}>

                <div className={`${styles.header} container`}>
                    <div className="inline-flex p-4 bg-white/5 backdrop-blur-md rounded-3xl mb-6 border border-white/10">
                        <Target className="text-white" size={40} />
                    </div>
                    <h1 className={styles.title}>Misiones del <span className="text-madrid-gradient">Viaje</span></h1>
                    <p className="text-lg opacity-90">Pequeños retos para grandes viajeros. ¿Cuántos puntos lograrán los Lozano?</p>

                    <button
                        className="btn-primary"
                        style={{ marginTop: '3rem' }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancelar' : <><Plus size={20} /> Añadir Reto</>}
                    </button>
                </div>

                <div className="container max-w-4xl">
                    {/* Progress Card */}
                    <div className="glass p-8 mb-12 relative overflow-hidden border border-white/10 rounded-3xl">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Trophy size={140} className="text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="text-center md:text-left">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Puntos de la Familia</p>
                                <h2 className="text-6xl font-black text-white">{totalPoints}<span className="text-lg text-white/20 ml-2">/ {possiblePoints}</span></h2>
                            </div>
                            <div className="flex-1 w-full max-w-md">
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-xs font-black uppercase text-white/60">Progreso total</p>
                                    <p className="text-xl font-black text-white drop-shadow-lg">{Math.round(progress)}%</p>
                                </div>
                                <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                                    <div
                                        className="h-full bg-madrid-gradient rounded-full transition-all duration-1000 ease-out shadow-lg"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {showForm && (
                        <form className={`${styles.addForm} bg-white/5 backdrop-blur-md p-8 rounded-3xl mb-12 border border-white/10`} onSubmit={handleAddMission}>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Título del reto..."
                                            value={newTask}
                                            onChange={e => setNewTask(e.target.value)}
                                            className="w-full p-4 pl-12 bg-white/5 border border-white/10 rounded-xl text-white font-bold"
                                            required
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={newPoints}
                                        onChange={e => setNewPoints(e.target.value)}
                                        className="w-full md:w-24 p-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-center"
                                        placeholder="Pts"
                                        required
                                    />
                                </div>
                                <textarea
                                    placeholder="Descripción detallada (opcional)..."
                                    value={newDescription}
                                    onChange={e => setNewDescription(e.target.value)}
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium min-h-[100px]"
                                />
                                <button type="submit" className="btn-primary py-4 px-8 self-end" disabled={isSaving}>
                                    {isSaving ? <Loader2 className="animate-spin" /> : 'Añadir Reto'}
                                </button>
                            </div>
                        </form>
                    )}

                    {isLoading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin mx-auto text-white" size={40} />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {missions.map((m) => (
                                <div
                                    key={m.id}
                                    className={`bg-white/5 backdrop-blur-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between transition-all duration-500 border border-white/10 rounded-3xl group ${m.completed ? 'opacity-40 grayscale blur-[1px]' : 'hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-start gap-6 w-full md:flex-1 mb-4 md:mb-0">
                                        <button
                                            onClick={() => toggleMission(m.id, m.completed)}
                                            className={`p-3 mt-1 rounded-2xl transition-all shadow-xl active:scale-95 ${m.completed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-white/20 hover:text-white hover:bg-white/10'}`}
                                        >
                                            {m.completed ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                                        </button>

                                        <div className="flex-1">
                                            {editingId === m.id ? (
                                                <div className="flex flex-col gap-3">
                                                    <input
                                                        type="text"
                                                        value={editTask}
                                                        onChange={e => setEditTask(e.target.value)}
                                                        className="bg-white/10 text-white p-3 rounded-xl text-base font-bold border border-white/20 w-full"
                                                        placeholder="Título"
                                                    />
                                                    <textarea
                                                        value={editDescription}
                                                        onChange={e => setEditDescription(e.target.value)}
                                                        className="bg-white/10 text-white p-3 rounded-xl text-sm font-medium border border-white/20 w-full min-h-[80px]"
                                                        placeholder="Descripción"
                                                    />
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="number"
                                                            value={editPoints}
                                                            onChange={e => setEditPoints(e.target.value)}
                                                            className="bg-white/10 text-white p-3 rounded-xl text-sm font-bold border border-white/20 w-24"
                                                        />
                                                        <button onClick={() => handleUpdate(m.id)} className="p-3 bg-emerald-500 text-white rounded-xl flex items-center gap-1 text-sm font-bold"><Check size={18} /> Guardar</button>
                                                        <button onClick={() => setEditingId(null)} className="p-3 bg-red-500 text-white rounded-xl flex items-center gap-1 text-sm font-bold"><X size={18} /> Cancelar</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className={`text-2xl font-black tracking-tight leading-tight ${m.completed ? 'line-through opacity-50' : 'text-white'}`}>
                                                        {m.task}
                                                    </p>
                                                    {m.description && (
                                                        <p className={`mt-2 text-sm font-medium leading-relaxed ${m.completed ? 'opacity-30' : 'text-white/70'}`}>
                                                            {m.description}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                            <div className="flex items-center gap-2 mt-4">
                                                <Star size={14} className={m.completed ? 'text-white/20' : 'text-amber-400 fill-amber-400'} />
                                                <span className={`text-[11px] font-black uppercase tracking-widest ${m.completed ? 'text-white/20' : 'text-white/40'}`}>
                                                    {m.points} puntos
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                        <button onClick={() => { setEditingId(m.id); setEditTask(m.task); setEditDescription(m.description || ''); setEditPoints(m.points.toString()); }} className="p-2 text-white/20 hover:text-white transition-colors">
                                            <Edit2 size={20} />
                                        </button>
                                        <button onClick={() => handleDelete(m.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {missions.length === 0 && (
                                <div className="glass p-12 text-center text-white/20 font-bold border-dashed border-2 border-white/10">
                                    No hay misiones activas. ¡Crea el primer reto!
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MissionsPage;

