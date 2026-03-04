'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Star, Beer, Plus, Loader2, Edit2, Trash2, Check, X } from 'lucide-react';
import styles from './page.module.css';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface TapaPlace {
    id: string;
    name: string;
    description: string;
    address: string;
    rating: number;
    tags: string[];
    image: string;
    route: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
}

export default function TapasPage() {
    const [tapas, setTapas] = useState<TapaPlace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [newPlace, setNewPlace] = useState({
        name: '',
        description: '',
        address: '',
        rating: 4.5,
        tags: '', // Will be comma-separated input
        image: '',
        route: '',
        latitude: '',
        longitude: ''
    });

    const [editPlace, setEditPlace] = useState<Partial<TapaPlace>>({});

    useEffect(() => {
        fetchTapas();
    }, []);

    const fetchTapas = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('tapas')
            .select('*')
            .order('created_at', { ascending: true });

        if (!error && data) {
            setTapas(data);
        } else if (error) {
            console.error('Error fetching tapas:', error);
        }
        setIsLoading(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const payload = {
            ...newPlace,
            tags: newPlace.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
            image: newPlace.image || 'https://images.unsplash.com/photo-1534604973900-c41ab4c5e63a?auto=format&fit=crop&q=80&w=800',
            latitude: newPlace.latitude ? parseFloat(newPlace.latitude as string) : null,
            longitude: newPlace.longitude ? parseFloat(newPlace.longitude as string) : null
        };

        const { error } = await supabase.from('tapas').insert([payload]);

        if (!error) {
            setNewPlace({ name: '', description: '', address: '', rating: 4.5, tags: '', image: '', route: '', latitude: '', longitude: '' });
            setShowAddForm(false);
            fetchTapas();
        } else {
            console.error('Error adding tapa:', error);
            alert('Error al añadir. Asegúrate de que la tabla "tapas" existe.');
        }
        setIsSaving(false);
    };

    const handleUpdate = async (id: string) => {
        setIsSaving(true);

        const payload = {
            ...editPlace,
            tags: typeof editPlace.tags === 'string'
                ? (editPlace.tags as string).split(',').map(t => t.trim()).filter(t => t !== '')
                : editPlace.tags,
            latitude: editPlace.latitude ? parseFloat(editPlace.latitude as string) : null,
            longitude: editPlace.longitude ? parseFloat(editPlace.longitude as string) : null
        };

        const { error } = await supabase.from('tapas').update(payload).eq('id', id);

        if (!error) {
            setEditingId(null);
            fetchTapas();
        } else {
            console.error('Error updating tapa:', error);
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Eliminar este sitio de tapeo?')) {
            const { error } = await supabase.from('tapas').delete().eq('id', id);
            if (!error) fetchTapas();
        }
    };

    const startEditing = (place: TapaPlace) => {
        setEditingId(place.id);
        setEditPlace({
            ...place,
            tags: Array.isArray(place.tags) ? place.tags.join(', ') : place.tags
        } as any);
    };

    return (
        <>
            <div className="section-bg" style={{ backgroundImage: 'url(/madrid_tapas_bg.png)' }}></div>
            <div className={`content-wrapper ${styles.tapasPage}`}>
                <div className="container">
                    <header className={styles.header}>
                        <h1 className="text-madrid-gradient">Tapeo y <span className="text-gold">Cañas</span></h1>
                        <p>Madrid se disfruta bocado a bocado. Aquí los mejores sitios cerca de nosotros.</p>
                        <div className={styles.adminActions}>
                            <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                                {showAddForm ? 'Cancelar' : <><Plus size={20} /> Añadir Lugar</>}
                            </button>
                        </div>
                    </header>

                    {showAddForm && (
                        <div className={`${styles.addForm} glass`}>
                            <h3>Nuevo Lugar de Tapas</h3>
                            <form onSubmit={handleAdd} className={styles.formGrid}>
                                <input
                                    placeholder="Nombre"
                                    value={newPlace.name}
                                    onChange={e => setNewPlace({ ...newPlace, name: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Descripción"
                                    value={newPlace.description}
                                    onChange={e => setNewPlace({ ...newPlace, description: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Dirección"
                                    value={newPlace.address}
                                    onChange={e => setNewPlace({ ...newPlace, address: e.target.value })}
                                />
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="Rating (ex: 4.8)"
                                    value={newPlace.rating}
                                    onChange={e => setNewPlace({ ...newPlace, rating: parseFloat(e.target.value) })}
                                />
                                <input
                                    placeholder="Etiquetas (separadas por coma)"
                                    value={newPlace.tags}
                                    onChange={e => setNewPlace({ ...newPlace, tags: e.target.value })}
                                />
                                <input
                                    placeholder="URL Imagen"
                                    value={newPlace.image}
                                    onChange={e => setNewPlace({ ...newPlace, image: e.target.value })}
                                />
                                <input
                                    placeholder="Link Google Maps"
                                    value={newPlace.route}
                                    onChange={e => setNewPlace({ ...newPlace, route: e.target.value })}
                                />
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Latitud (ej: 40.41)"
                                    value={newPlace.latitude}
                                    onChange={e => setNewPlace({ ...newPlace, latitude: e.target.value })}
                                />
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Longitud (ej: -3.70)"
                                    value={newPlace.longitude}
                                    onChange={e => setNewPlace({ ...newPlace, longitude: e.target.value })}
                                />
                                <button type="submit" className="btn-primary" disabled={isSaving}>
                                    {isSaving ? <Loader2 className="animate-spin" /> : 'Guardar'}
                                </button>
                            </form>
                        </div>
                    )}

                    <div className={styles.grid}>
                        {isLoading ? (
                            <div className="text-center py-20 col-span-full">
                                <Loader2 className="animate-spin mx-auto text-madrid-red" size={40} />
                            </div>
                        ) : (
                            tapas.map((place) => (
                                <div key={place.id} className={`${styles.card} glass`}>
                                    <div className={styles.imageBox}>
                                        <Image src={place.image} alt={place.name} fill className={styles.image} unoptimized />
                                        <div className={styles.overlay}>
                                            <div className={styles.tags}>
                                                {place.tags && place.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                                            </div>
                                        </div>
                                        <div className={styles.cardButtons}>
                                            <button className={styles.editBtn} onClick={() => startEditing(place)}><Edit2 size={16} /></button>
                                            <button className={styles.deleteBtn} onClick={() => handleDelete(place.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    <div className={styles.content}>
                                        {editingId === place.id ? (
                                            <div className={styles.editForm}>
                                                <input
                                                    value={editPlace.name}
                                                    onChange={e => setEditPlace({ ...editPlace, name: e.target.value })}
                                                    placeholder="Nombre"
                                                />
                                                <textarea
                                                    value={editPlace.description}
                                                    onChange={e => setEditPlace({ ...editPlace, description: e.target.value })}
                                                    placeholder="Descripción"
                                                />
                                                <input
                                                    value={editPlace.address}
                                                    onChange={e => setEditPlace({ ...editPlace, address: e.target.value })}
                                                    placeholder="Dirección"
                                                />
                                                <input
                                                    value={editPlace.tags as any}
                                                    onChange={e => setEditPlace({ ...editPlace, tags: e.target.value as any })}
                                                    placeholder="Etiquetas (coma)"
                                                />
                                                <input
                                                    value={editPlace.route}
                                                    onChange={e => setEditPlace({ ...editPlace, route: e.target.value })}
                                                    placeholder="Ruta Maps"
                                                />
                                                <div className={styles.coordInputs}>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={editPlace.latitude ?? ''}
                                                        onChange={e => setEditPlace({ ...editPlace, latitude: e.target.value })}
                                                        placeholder="Latitud"
                                                    />
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={editPlace.longitude ?? ''}
                                                        onChange={e => setEditPlace({ ...editPlace, longitude: e.target.value })}
                                                        placeholder="Longitud"
                                                    />
                                                </div>
                                                <div className={styles.editActions}>
                                                    <button className={styles.btnSave} onClick={() => handleUpdate(place.id)} disabled={isSaving}>
                                                        {isSaving ? <Loader2 className="animate-spin" /> : <><Check size={16} /> Guardar</>}
                                                    </button>
                                                    <button className={styles.btnCancel} onClick={() => setEditingId(null)}><X size={16} /> Cancelar</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.titleRow}>
                                                    <h3>{place.name}</h3>
                                                    <div className={styles.rating}>
                                                        <Star size={14} fill="currentColor" />
                                                        <span>{place.rating}</span>
                                                    </div>
                                                </div>
                                                <p className={styles.description}>{place.description}</p>
                                                <div className={styles.footer}>
                                                    <div className={styles.address}>
                                                        <MapPin size={14} />
                                                        <span>{place.address}</span>
                                                    </div>
                                                    {place.route && (
                                                        <a href={place.route} target="_blank" rel="noopener noreferrer" className="btn-primary-blue">
                                                            <Navigation size={18} /> Ruta a pie
                                                        </a>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className={`${styles.infoCard} glass`}>
                        <div className={styles.infoIcon}>
                            <Beer size={32} />
                        </div>
                        <div className={styles.infoText}>
                            <h3>Tip Familiar: "Ir de cañas"</h3>
                            <p>En Madrid, si pides una caña, suele venir con una tapa gratis. ¡Aprovechad el Barrio de La Latina los domingos!</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
