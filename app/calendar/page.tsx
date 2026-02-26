'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Trash2, Plus, Loader2, User, Users, Pencil, CheckCircle } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

const PARTICIPANTS = [
    'Abuela Rosy', 'Fede', 'Marimar', 'Ale', 'Majo', 'Alo', 'Veros',
    'Mariela', 'Rafa', 'Ceci', 'Andrés', 'Luis', 'Elvira'
];

interface ItineraryItem {
    id: string;
    date_str: string;
    event_name: string;
    event_time: string;
    created_by: string;
    participants: string;
    confirmed_participants?: string; // Comma separated list
    created_at: string;
}

const CalendarPage = () => {
    const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        day: '',
        month: 'MAR',
        event: '',
        time: 'Libre',
        created_by: '',
        participants: 'Toda la familia'
    });
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchItinerary();
    }, []);

    const fetchItinerary = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('itinerary')
            .select('*');

        if (!error && data) {
            const monthMap: Record<string, number> = {
                'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3, 'MAY': 4, 'JUN': 5,
                'JUL': 6, 'AGO': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11
            };

            const sorted = (data as ItineraryItem[]).sort((a, b) => {
                const [dayA, monA] = a.date_str.split(' ');
                const [dayB, monB] = b.date_str.split(' ');

                const monthA = monthMap[monA] ?? 0;
                const monthB = monthMap[monB] ?? 0;

                if (monthA !== monthB) return monthA - monthB;

                const dA = parseInt(dayA);
                const dB = parseInt(dayB);
                if (dA !== dB) return dA - dB;

                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            });
            setItinerary(sorted);
        }
        setIsLoading(false);
    };

    const startEditing = (item: ItineraryItem) => {
        const [day, month] = item.date_str.split(' ');
        setNewEvent({
            day: day,
            month: month,
            event: item.event_name,
            time: item.event_time,
            created_by: item.created_by,
            participants: item.participants
        });
        setEditingId(item.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingId(null);
        setNewEvent({
            day: '',
            month: 'MAR',
            event: '',
            time: 'Libre',
            created_by: '',
            participants: 'Toda la familia'
        });
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEvent.day || !newEvent.event) return;

        setIsSaving(true);

        const payload = {
            date_str: `${newEvent.day} ${newEvent.month}`,
            event_name: newEvent.event,
            event_time: newEvent.time,
            created_by: newEvent.created_by,
            participants: newEvent.participants
        };

        let error;
        if (editingId) {
            const { error: updateError } = await supabase
                .from('itinerary')
                .update(payload)
                .eq('id', editingId);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('itinerary')
                .insert([payload]);
            error = insertError;
        }

        if (!error) {
            setNewEvent({
                day: '',
                month: 'MAR',
                event: '',
                time: 'Libre',
                created_by: '',
                participants: 'Toda la familia'
            });
            setShowForm(false);
            setEditingId(null);
            fetchItinerary();
        } else {
            console.error(error);
            alert('Error al guardar: Asegúrate de actualizar la tabla "itinerary" en Supabase.');
        }
        setIsSaving(false);
    };

    const deleteItem = async (id: string) => {
        if (confirm('¿Seguro que quieres quitar esto del plan?')) {
            const { error } = await supabase
                .from('itinerary')
                .delete()
                .eq('id', id);

            if (!error) {
                fetchItinerary();
            }
        }
    };

    const toggleConfirmation = async (item: ItineraryItem, name: string) => {
        const confirmed = item.confirmed_participants ? item.confirmed_participants.split(',').filter(n => n.trim() !== '') : [];
        let newConfirmed;

        if (confirmed.includes(name)) {
            newConfirmed = confirmed.filter(n => n !== name);
        } else {
            newConfirmed = [...confirmed, name];
        }

        const { error } = await supabase
            .from('itinerary')
            .update({ confirmed_participants: newConfirmed.join(',') })
            .eq('id', item.id);

        if (!error) {
            // Optimistic update
            setItinerary(prev => prev.map(it => it.id === item.id ? { ...it, confirmed_participants: newConfirmed.join(',') } : it));
        } else {
            console.error(error);
            alert('Error: Asegúrate de añadir la columna "confirmed_participants" (tipo texto) en la tabla "itinerary" de Supabase.');
        }
    };

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_xix_century.png)' }}
            ></div>
            <div className={`content-wrapper ${styles.calendarPage}`}>
                <div className="container">
                    <header className={styles.header}>
                        <h1>Itinerario <span className="text-gold">Familiar</span></h1>
                        <p>Día a día en nuestro viaje a Madrid.</p>
                        <button className="btn-primary" onClick={editingId ? cancelForm : () => setShowForm(!showForm)}>
                            {showForm ? 'Cancelar' : <><Plus size={20} /> Añadir al Plan</>}
                        </button>
                    </header>
                </div>

                {showForm && (
                    <form className={`${styles.addForm} glass container`} onSubmit={handleAddEvent}>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Día</label>
                                <input
                                    type="number"
                                    placeholder="28"
                                    value={newEvent.day}
                                    onChange={e => setNewEvent({ ...newEvent, day: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mes</label>
                                <select value={newEvent.month} onChange={e => setNewEvent({ ...newEvent, month: e.target.value })}>
                                    <option value="MAR">Marzo</option>
                                    <option value="ABR">Abril</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Evento</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Cena en Gran Vía"
                                    value={newEvent.event}
                                    onChange={e => setNewEvent({ ...newEvent, event: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Hora / Estado</label>
                                <input
                                    type="text"
                                    placeholder="Ej. 20:30 o Libre"
                                    value={newEvent.time}
                                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Quién lo propone</label>
                                <input
                                    type="text"
                                    placeholder="Tu nombre"
                                    value={newEvent.created_by}
                                    onChange={e => setNewEvent({ ...newEvent, created_by: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Quiénes van</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Todos, o Solo adultos"
                                    value={newEvent.participants}
                                    onChange={e => setNewEvent({ ...newEvent, participants: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" disabled={isSaving}>
                            {isSaving ? <Loader2 className="animate-spin" /> : (editingId ? 'Actualizar Evento' : 'Confirmar Evento')}
                        </button>
                    </form>
                )}

                <div className={`${styles.calendarContainer} container`}>
                    {isLoading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin mx-auto text-gold" size={40} />
                        </div>
                    ) : (
                        <div className={styles.itineraryList}>
                            {itinerary.reduce((acc: { date: string, items: ItineraryItem[] }[], item) => {
                                const lastGroup = acc[acc.length - 1];
                                if (lastGroup && lastGroup.date === item.date_str) {
                                    lastGroup.items.push(item);
                                } else {
                                    acc.push({ date: item.date_str, items: [item] });
                                }
                                return acc;
                            }, []).map((group) => (
                                <div key={group.date} className={styles.daySection}>
                                    <div className={styles.dayHeader}>
                                        <div className={styles.dayLabel}>
                                            <CalendarIcon size={18} />
                                            <span>{group.date}</span>
                                        </div>
                                    </div>
                                    <div className={styles.dayItems}>
                                        {group.items.map((item) => (
                                            <div key={item.id} className={`${styles.itineraryCard} glass`}>
                                                <div className={styles.eventInfo}>
                                                    <div className={styles.eventHeader}>
                                                        <h3>{item.event_name}</h3>
                                                        <div className={styles.timeTag}>
                                                            <Clock size={14} />
                                                            <span>{item.event_time}</span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.cardFooter}>
                                                        <div className={styles.author}>
                                                            <User size={14} />
                                                            <span>Propone: <strong>{item.created_by || 'Lozano'}</strong></span>
                                                        </div>
                                                        <div className={styles.participants}>
                                                            <Users size={14} />
                                                            <span>Van: <strong>{item.participants || 'Toda la familia'}</strong></span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.confirmationSection}>
                                                        <p className={styles.confTitle}>Confirmados:</p>
                                                        <div className={styles.participantList}>
                                                            {PARTICIPANTS.map(name => {
                                                                const isConfirmed = item.confirmed_participants?.split(',').includes(name);
                                                                return (
                                                                    <button
                                                                        key={name}
                                                                        className={`${styles.confBadge} ${isConfirmed ? styles.confirmed : ''}`}
                                                                        onClick={() => toggleConfirmation(item, name)}
                                                                    >
                                                                        {isConfirmed && <CheckCircle size={10} />}
                                                                        {name}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.cardActions}>
                                                    <button
                                                        className={styles.editBtn}
                                                        onClick={() => startEditing(item)}
                                                        title="Editar"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        className={styles.deleteBtn}
                                                        onClick={() => deleteItem(item.id)}
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {itinerary.length === 0 && (
                                <p className="text-center opacity-50 py-10">Todavía no hemos planeado nada. ¡Añade tu primera idea!</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CalendarPage;
