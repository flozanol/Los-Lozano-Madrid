'use client';

import { useState, useEffect } from 'react';
import { ClipboardCheck, CheckCircle2, Circle, Loader2, Plane, Ticket, Hotel, Train, Plus, Trash2, FileText } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

const PARTICIPANTS = [
    'Abuela Rosy', 'Fede', 'Marimar', 'Ale', 'Majo', 'Alo', 'Veros',
    'Mariela', 'Rafa', 'Ceci', 'Andrés', 'Luis', 'Elvira'
];

interface DocType {
    id: string;
    name: string;
}

interface ChecklistState {
    [docId: string]: {
        [person: string]: boolean;
    };
}

export default function ChecklistPage() {
    const [docTypes, setDocTypes] = useState<DocType[]>([]);
    const [state, setState] = useState<ChecklistState>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showDocForm, setShowDocForm] = useState(false);
    const [newDocName, setNewDocName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);

        // 1. Fetch Doc Types
        const { data: typesData, error: typesError } = await supabase
            .from('checklist_types')
            .select('*')
            .order('created_at', { ascending: true });

        // If table doesn't exist yet, we'll try to create it or alert the user
        if (typesError) {
            console.error(typesError);
            alert('Error: Asegúrate de crear la tabla "checklist_types" (id uuid, name text) en Supabase.');
            setIsLoading(false);
            return;
        }

        const currentTypes = typesData as DocType[];
        setDocTypes(currentTypes);

        // 2. Fetch Completion States
        const { data: completionData } = await supabase
            .from('checklist')
            .select('*');

        const newState: ChecklistState = {};
        currentTypes.forEach(doc => newState[doc.id] = {});

        if (completionData) {
            completionData.forEach((entry: any) => {
                if (newState[entry.doc_id]) {
                    newState[entry.doc_id][entry.person_name] = entry.is_completed;
                }
            });
        }

        setState(newState);
        setIsLoading(false);
    };

    const handleAddDocType = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDocName) return;

        setIsSaving(true);
        const { error } = await supabase
            .from('checklist_types')
            .insert([{ name: newDocName }]);

        if (!error) {
            setNewDocName('');
            setShowDocForm(false);
            fetchData();
        } else {
            alert('Error al añadir documento.');
        }
        setIsSaving(false);
    };

    const handleDeleteDocType = async (id: string, name: string) => {
        if (confirm(`¿Eliminar "${name}" y todos sus registros de estado?`)) {
            // First delete completion states
            await supabase.from('checklist').delete().eq('doc_id', id);
            // Then delete the type
            const { error } = await supabase.from('checklist_types').delete().eq('id', id);

            if (!error) fetchData();
        }
    };

    const toggleCheck = async (docId: string, person: string) => {
        const currentValue = state[docId]?.[person] || false;
        const newValue = !currentValue;

        setState(prev => ({
            ...prev,
            [docId]: { ...prev[docId], [person]: newValue }
        }));

        const { error } = await supabase
            .from('checklist')
            .upsert({
                doc_id: docId,
                person_name: person,
                is_completed: newValue
            }, { onConflict: 'doc_id, person_name' });

        if (error) {
            setState(prev => ({
                ...prev,
                [docId]: { ...prev[docId], [person]: currentValue }
            }));
        }
    };

    const getIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('vuelo') || n.includes('avión')) return <Plane size={24} />;
        if (n.includes('hotel') || n.includes('reserva')) return <Hotel size={24} />;
        if (n.includes('entrada') || n.includes('ticket')) return <Ticket size={24} />;
        if (n.includes('tren')) return <Train size={24} />;
        return <FileText size={24} />;
    };

    return (
        <>
            <div className="section-bg" style={{ backgroundImage: 'url(/madrid_palace.png)' }}></div>
            <div className={`content-wrapper ${styles.checklistPage}`}>
                <div className="container">
                    <header className={styles.header}>
                        <h1 className="text-madrid-gradient">Checklist de <span className="text-madrid-red">Documentos</span></h1>
                        <p>Gestiona y marca los documentos necesarios para cada familiar.</p>

                        <button className="btn-primary mt-10" onClick={() => setShowDocForm(!showDocForm)}>
                            {showDocForm ? 'Cerrar' : <><Plus size={20} /> Gestionar Documentos</>}
                        </button>
                    </header>

                    {showDocForm && (
                        <div className={`${styles.manageSection} glass`}>
                            <h3>Añadir Nuevo Tipo de Documento</h3>
                            <form onSubmit={handleAddDocType} className={styles.docForm}>
                                <input
                                    type="text"
                                    placeholder="Ej: Seguro de Viaje, eSIM, etc."
                                    value={newDocName}
                                    onChange={e => setNewDocName(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn-primary" disabled={isSaving}>
                                    {isSaving ? <Loader2 className="animate-spin" /> : 'Añadir'}
                                </button>
                            </form>

                            <div className={styles.docTypeList}>
                                {docTypes.map(doc => (
                                    <div key={doc.id} className={styles.docTypeItem}>
                                        <span>{doc.name}</span>
                                        <button onClick={() => handleDeleteDocType(doc.id, doc.name)} className={styles.btnDeleteDoc}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin mx-auto text-madrid-red" size={40} />
                        </div>
                    ) : (
                        <div className={styles.docsGrid}>
                            {docTypes.map((doc) => (
                                <section key={doc.id} className={`${styles.docSection} glass`}>
                                    <div className={styles.docHeader}>
                                        <div className={styles.docIcon}>
                                            {getIcon(doc.name)}
                                        </div>
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
