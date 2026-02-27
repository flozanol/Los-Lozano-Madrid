'use client';

import { useState, useEffect } from 'react';
import { ClipboardCheck, CheckCircle2, Circle, Loader2, Plane, Ticket, Hotel, Train } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

const PARTICIPANTS = [
    'Abuela Rosy', 'Fede', 'Marimar', 'Ale', 'Majo', 'Alo', 'Veros',
    'Mariela', 'Rafa', 'Ceci', 'Andrés', 'Luis', 'Elvira'
];

const REQUIRED_DOCS = [
    { id: 'vuelo', name: 'Boleto de Avión', icon: Plane },
    { id: 'hotel', name: 'Reserva de Hotel', icon: Hotel },
    { id: 'museo', name: 'Entradas Museo / Tour', icon: Ticket },
    { id: 'tren', name: 'Reserva de Tren / Bus', icon: Train },
];

interface ChecklistState {
    [docId: string]: {
        [person: string]: boolean;
    };
}

export default function ChecklistPage() {
    const [state, setState] = useState<ChecklistState>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchChecklist();
    }, []);

    const fetchChecklist = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('checklist')
            .select('*');

        if (!error && data) {
            const newState: ChecklistState = {};
            REQUIRED_DOCS.forEach(doc => newState[doc.id] = {});

            data.forEach((entry: any) => {
                if (newState[entry.doc_id]) {
                    newState[entry.doc_id][entry.person_name] = entry.is_completed;
                }
            });
            setState(newState);
        }
        setIsLoading(false);
    };

    const toggleCheck = async (docId: string, person: string) => {
        const currentValue = state[docId]?.[person] || false;
        const newValue = !currentValue;

        // Optimistic update
        setState(prev => ({
            ...prev,
            [docId]: { ...prev[docId], [person]: newValue }
        }));

        // Persist to Supabase using upsert
        const { error } = await supabase
            .from('checklist')
            .upsert({
                doc_id: docId,
                person_name: person,
                is_completed: newValue
            }, { onConflict: 'doc_id, person_name' });

        if (error) {
            console.error(error);
            alert('Error: Asegúrate de crear la tabla "checklist" en Supabase con columnas id (uuid), doc_id (text), person_name (text), is_completed (boolean).');
            // Revert on error
            setState(prev => ({
                ...prev,
                [docId]: { ...prev[docId], [person]: currentValue }
            }));
        }
    };

    return (
        <>
            <div className="section-bg" style={{ backgroundImage: 'url(/madrid_palace.png)' }}></div>
            <div className={`content-wrapper ${styles.checklistPage}`}>
                <div className="container">
                    <header className={styles.header}>
                        <h1 className="text-madrid-gradient">Checklist de <span className="text-gold">Documentos</span></h1>
                        <p>Asegurémonos de que todos tenemos lo necesario para el viaje.</p>
                    </header>

                    {isLoading ? (
                        <Loader2 className="animate-spin mx-auto text-gold" size={40} />
                    ) : (
                        <div className={styles.docsGrid}>
                            {REQUIRED_DOCS.map((doc) => (
                                <section key={doc.id} className={`${styles.docSection} glass`}>
                                    <div className={styles.docHeader}>
                                        <doc.icon size={24} className={styles.docIcon} />
                                        <h2>{doc.name}</h2>
                                    </div>
                                    <div className={styles.peopleGrid}>
                                        {PARTICIPANTS.map((person) => {
                                            const isDone = state[doc.id]?.[person] || false;
                                            return (
                                                <button
                                                    key={person}
                                                    className={`${styles.personCard} ${isDone ? styles.done : ''}`}
                                                    onClick={() => toggleCheck(doc.id, person)}
                                                >
                                                    {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                                    <span>{person}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
