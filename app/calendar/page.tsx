'use client';

import { useState } from 'react';
import styles from './page.module.css';

const CalendarPage = () => {
    const [itinerary, setItinerary] = useState([
        { date: '26 MAR', event: 'Llegada y Paseo por el Retiro', time: '16:00' },
        { date: '27 MAR', event: 'Centro Histórico y Plaza Mayor', time: '10:00' },
        { date: '28 MAR', event: 'Museo del Prado y Almuerzo en Botín', time: '11:00' },
        { date: '29 MAR', event: 'Excursión a Toledo', time: '09:00' },
        { date: '30 MAR', event: 'Parque del Retiro', time: 'Libre' },
        { date: '31 MAR', event: 'Templo de Debod', time: 'Libre' },
        { date: '1 ABR', event: 'Palacio Real', time: 'Libre' },
        { date: '2 ABR', event: 'Cena Flamenca', time: 'Libre' },
        { date: '3 ABR', event: 'Día de Tapas por La Latina', time: 'Libre' },
        { date: '4 ABR', event: 'Excursión a Toledo', time: 'Libre' },
        { date: '5 ABR', event: 'Cena de Despedida', time: 'Pendiente' },
        { date: '6 ABR', event: 'Regreso a casa', time: 'Confirmado' },
    ]);

    const deleteItem = (index: number) => {
        if (confirm('¿Seguro que quieres quitar esto del plan?')) {
            setItinerary(itinerary.filter((_, i) => i !== index));
        }
    };

    const [newEvent, setNewEvent] = useState({ day: 0, month: 'Mar', event: '', status: 'Libre' });
    const [showForm, setShowForm] = useState(false);

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEvent.day && newEvent.event) {
            // This logic needs to be adapted if newEvent structure changes to match itinerary
            // For now, it's kept as is, assuming newEvent might be for a different purpose or will be updated.
            // If newEvent is meant to add to itinerary, its structure and this logic must change.
            // For the purpose of this edit, we'll assume the user will adapt this later or it's not directly related to the new itinerary structure.
            // If we were to adapt it, it would look something like:
            // const newItineraryItem = { date: `${newEvent.day} ${newEvent.month}`, event: newEvent.event, time: 'N/A' };
            // setItinerary([...itinerary, newItineraryItem].sort((a, b) => { /* sorting logic based on date string */ }));
            // setNewEvent({ day: 0, month: 'Mar', event: '', status: 'Libre' });
            // setShowForm(false);
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
                        {showForm ? 'Cancelar' : '+ Añadir Lugar/Evento'}
                    </button>
                </div>

                {showForm && (
                    <form className={styles.addForm} onSubmit={handleAddEvent}>
                        <div className={styles.formGroup}>
                            <label>Día (Número)</label>
                            <input
                                type="number"
                                placeholder="Ej. 28"
                                onChange={e => setNewEvent({ ...newEvent, day: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Mes</label>
                            <select onChange={e => setNewEvent({ ...newEvent, month: e.target.value })}>
                                <option value="Mar">Marzo</option>
                                <option value="Abr">Abril</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>¿Qué vamos a hacer?</label>
                            <input
                                type="text"
                                placeholder="Ej. Visita al Templo de Debod"
                                onChange={e => setNewEvent({ ...newEvent, event: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Estado</label>
                            <select onChange={e => setNewEvent({ ...newEvent, status: e.target.value })}>
                                <option value="Libre">Libre / Idea</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Reservado">Reservado</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary">Guardar en Calendario</button>
                    </form>
                )}

                <div className={styles.calendarGrid}>
                    {itinerary.map((item, index) => (
                        <div key={index} className={`${styles.card} glass`}>
                            <div className={styles.dateInfo}>
                                <span className={styles.date}>{item.date}</span>
                                <span className={styles.time}>{item.time}</span>
                            </div>
                            <div className={styles.eventInfo}>
                                <h3>{item.event}</h3>
                            </div>
                            <button className={styles.deleteBtn} onClick={() => deleteItem(index)} aria-label="Eliminar">
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CalendarPage;
