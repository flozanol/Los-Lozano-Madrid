'use client';

import { useState } from 'react';
import styles from './page.module.css';

const CalendarPage = () => {
    const [events, setEvents] = useState([
        { day: 26, month: "Mar", event: "Llegada y Check-in", status: "Reservado" },
        { day: 27, month: "Mar", event: "Centro Histórico", status: "Pendiente" },
        { day: 28, month: "Mar", event: "Tour Madrid de los Austrias", status: "Pendiente" },
        { day: 29, month: "Mar", event: "Museo del Prado", status: "Libre" },
        { day: 30, month: "Mar", event: "Parque del Retiro", status: "Libre" },
        { day: 31, month: "Mar", event: "Templo de Debod", status: "Libre" },
        { day: 1, month: "Abr", event: "Palacio Real", status: "Libre" },
        { day: 2, month: "Abr", event: "Cena Flamenca", status: "Libre" },
        { day: 3, month: "Abr", event: "Día de Tapas por La Latina", status: "Libre" },
        { day: 4, month: "Abr", event: "Excursión a Toledo", status: "Libre" },
        { day: 5, month: "Abr", event: "Cena de Despedida", status: "Pendiente" },
        { day: 6, month: "Abr", event: "Regreso a casa", status: "Confirmado" },
    ]);


    const [newEvent, setNewEvent] = useState({ day: 0, month: 'Mar', event: '', status: 'Libre' });
    const [showForm, setShowForm] = useState(false);

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEvent.day && newEvent.event) {
            setEvents([...events, newEvent].sort((a, b) => {
                if (a.month === b.month) return a.day - b.day;
                return a.month === 'Mar' ? -1 : 1;
            }));
            setNewEvent({ day: 0, month: 'Mar', event: '', status: 'Libre' });
            setShowForm(false);
        }
    };

    return (
        <div className={styles.calendarPage}>
            <div className="container">
                <div className={styles.header}>
                    <h1 className={styles.title}>Itinerario del <span className="text-gold">Viaje</span></h1>
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
                    {events.map((item, index) => (
                        <div key={index} className={`${styles.dayCard} ${styles[item.status.toLowerCase()]}`}>
                            <div className={styles.dateSide}>
                                <span className={styles.dayNum}>{item.day}</span>
                                <span className={styles.monthName}>{item.month}</span>
                            </div>
                            <div className={styles.eventSide}>
                                <h3>{item.event}</h3>
                                <span className={styles.badge}>{item.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
