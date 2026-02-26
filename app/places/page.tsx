'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Loader2, Trash2, MapPin, Edit2, Check, X } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

interface Place {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    created_at: string;
}

const PlacesPage = () => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        category: 'Monumento',
        description: '',
        image: '',
        latitude: '',
        longitude: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editItem, setEditItem] = useState<Partial<Place>>({});

    useEffect(() => {
        fetchPlaces();
    }, []);

    const fetchPlaces = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('places_to_visit')
            .select('*')
            .order('created_at', { ascending: true });

        if (!error && data) {
            setPlaces(data);
        }
        setIsLoading(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.name || !newItem.description) return;

        setIsSaving(true);
        const img = newItem.image || "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=600&auto=format&fit=crop";

        const payload = {
            name: newItem.name,
            category: newItem.category,
            description: newItem.description,
            image: img,
            latitude: newItem.latitude ? parseFloat(newItem.latitude as string) : null,
            longitude: newItem.longitude ? parseFloat(newItem.longitude as string) : null
        };

        const { error } = await supabase
            .from('places_to_visit')
            .insert([payload]);

        if (!error) {
            setNewItem({ name: '', category: 'Monumento', description: '', image: '', latitude: '', longitude: '' });
            setShowForm(false);
            fetchPlaces();
        } else {
            console.error(error);
            alert('Error al guardar: Asegúrate de que la tabla "places_to_visit" existe.');
        }
        setIsSaving(false);
    };

    const handleUpdate = async (id: string) => {
        setIsSaving(true);
        const payload = {
            ...editItem,
            latitude: editItem.latitude ? parseFloat(editItem.latitude as string) : null,
            longitude: editItem.longitude ? parseFloat(editItem.longitude as string) : null
        };

        const { error } = await supabase
            .from('places_to_visit')
            .update(payload)
            .eq('id', id);

        if (!error) {
            setEditingId(null);
            fetchPlaces();
        } else {
            alert('Error al actualizar');
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Quieres eliminar este lugar de la lista?')) {
            const { error } = await supabase
                .from('places_to_visit')
                .delete()
                .eq('id', id);

            if (!error) {
                fetchPlaces();
            }
        }
    };

    const startEditing = (place: Place) => {
        setEditingId(place.id);
        setEditItem(place);
    };

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_austrias_habsburg.png)' }}
            ></div>
            <div className={`content-wrapper ${styles.placesPage}`}>

                <div className={`${styles.header} container`}>
                    <h1 className={styles.title}>Qué <span className="text-gold">Visitar</span></h1>
                    <p>Lugares que no nos podemos perder en esta aventura.</p>
                    <button
                        className="btn-primary"
                        style={{ marginTop: '2rem' }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancelar' : <><Plus size={20} /> Sugerir Lugar</>}
                    </button>
                </div>

                <div className="container">
                    {showForm && (
                        <form className={`${styles.addForm} glass`} onSubmit={handleAdd}>
                            <div className={styles.formGrid}>
                                <input
                                    type="text"
                                    placeholder="Nombre del lugar"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    required
                                />
                                <select
                                    value={newItem.category}
                                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                >
                                    <option value="Monumento">Monumento</option>
                                    <option value="Museo">Museo / Arte</option>
                                    <option value="Parque">Parque / Naturaleza</option>
                                    <option value="Ocio">Ocio / Compras</option>
                                    <option value="Historia">Historia</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Descripción corta"
                                    value={newItem.description}
                                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="URL de Imagen (opcional)"
                                    value={newItem.image}
                                    onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                />
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Latitud (opcional, ej: 40.41)"
                                    value={newItem.latitude}
                                    onChange={e => setNewItem({ ...newItem, latitude: e.target.value })}
                                />
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Longitud (opcional, ej: -3.70)"
                                    value={newItem.longitude}
                                    onChange={e => setNewItem({ ...newItem, longitude: e.target.value })}
                                />
                            </div>
                            <p className={styles.helpText}>💡 Pista: Puedes encontrar las coordenadas en Google Maps al hacer clic derecho en un punto.</p>
                            <button type="submit" className="btn-primary" disabled={isSaving}>
                                {isSaving ? <Loader2 className="animate-spin" /> : 'Añadir a la lista'}
                            </button>
                        </form>
                    )}

                    {isLoading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin mx-auto text-gold" size={40} />
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {places.map((place) => (
                                <div key={place.id} className={`${styles.card} ${editingId === place.id ? styles.editing : ''}`}>
                                    <div className={styles.imageBox}>
                                        <Image
                                            src={place.image}
                                            alt={place.name}
                                            width={600}
                                            height={400}
                                            className={styles.image}
                                            unoptimized={place.image.startsWith('http')}
                                        />
                                        <span className={styles.category}>{place.category}</span>
                                        <div className={styles.adminButtons}>
                                            <button className={styles.editBtn} onClick={() => startEditing(place)} title="Editar"><Edit2 size={16} /></button>
                                            <button className={styles.deleteBtn} onClick={() => handleDelete(place.id)} title="Eliminar"><Trash2 size={16} /></button>
                                        </div>
                                        {place.latitude && (
                                            <div className={styles.mapBadge} title="Disponible en el Mapa">
                                                <MapPin size={12} />
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.cardContent}>
                                        {editingId === place.id ? (
                                            <div className={styles.editForm}>
                                                <input
                                                    type="text"
                                                    value={editItem.name}
                                                    onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                                                    placeholder="Nombre"
                                                />
                                                <textarea
                                                    value={editItem.description}
                                                    onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                                                    placeholder="Descripción"
                                                />
                                                <div className={styles.coordInputs}>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={editItem.latitude ?? ''}
                                                        onChange={e => setEditItem({ ...editItem, latitude: e.target.value })}
                                                        placeholder="Latitud"
                                                    />
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={editItem.longitude ?? ''}
                                                        onChange={e => setEditItem({ ...editItem, longitude: e.target.value })}
                                                        placeholder="Longitud"
                                                    />
                                                </div>
                                                <div className={styles.editActions}>
                                                    <button onClick={() => handleUpdate(place.id)} className={styles.btnSave} disabled={isSaving}>
                                                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <><Check size={16} /> Guardar</>}
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className={styles.btnCancelEdit}><X size={16} /> Cancelar</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h3>{place.name}</h3>
                                                <p>{place.description}</p>
                                                {place.latitude && (
                                                    <div className={styles.coordenadas}>
                                                        <MapPin size={14} className="text-gold" />
                                                        <span>{place.latitude}, {place.longitude}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PlacesPage;
