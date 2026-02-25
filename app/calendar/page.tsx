'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Trash2, Plus, Loader2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

interface ItineraryItem {
    id: string;
    date_str: string;
    event_name: string;
    event_time: string;
    created_at: string;
}

const CalendarPage = () => {
    const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState({ day: '', month: 'MAR', event: '', time: 'Libre' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchItinerary();
    }, []);

    const fetchItinerary = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('itinerary')
            .select('*')
            .order('created_at', { ascending: true });

        if (!error && data) {
            setItinerary(data);
        }
        setIsLoading(false);
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEvent.day || !newEvent.event) return;

        setIsSaving(true);
        const { error } = await supabase
            .from('itinerary')
            .insert([
                {
                    date_str: `${newEvent.day} ${newEvent.month}`,
                    event_name: newEvent.event,
                    event_time: newEvent.time
                }
            ]);

        if (!error) {
            setNewEvent({ day: '', month: 'MAR', event: '', time: 'Libre' });
            setShowForm(false);
            fetchItinerary();
        } else {
            alert('Error al guardar: Asegúrate de crear la tabla "itinerary" en Supabase.');
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
                    </header>
                    <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancelar' : <><Plus size={20} /> Añadir al Plan</>}
                    </button>
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
                        </div>
                        <button type="submit" className="btn-primary" disabled={isSaving}>
                            {isSaving ? <Loader2 className="animate-spin" /> : 'Confirmar Evento'}
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
                            {itinerary.map((item) => (
                                <div key={item.id} className={`${styles.itineraryCard} glass`}>
                                    <div className={styles.dateBadge}>
                                        <CalendarIcon size={16} />
                                        <span>{item.date_str}</span>
                                    </div>
                                    <div className={styles.eventInfo}>
                                        <h3>{item.event_name}</h3>
                                        <div className={styles.timeTag}>
                                            <Clock size={14} />
                                            <span>{item.event_time}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => deleteItem(item.id)}
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
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
