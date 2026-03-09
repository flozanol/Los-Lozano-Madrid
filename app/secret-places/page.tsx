'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Loader2, Trash2, MapPin, Edit2, Check, X, Sparkles } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

interface SecretPlace {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    created_at: string;
}

const SecretPlacesPage = () => {
    const [places, setPlaces] = useState<SecretPlace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        category: '🌿 Naturaleza',
        description: '',
        image: '',
        latitude: '',
        longitude: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editItem, setEditItem] = useState<Partial<SecretPlace>>({});

    useEffect(() => {
        fetchPlaces();
    }, []);

    const fetchPlaces = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('secret_places')
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
            .from('secret_places')
            .insert([payload]);

        if (!error) {
            setNewItem({ name: '', category: '🌿 Naturaleza', description: '', image: '', latitude: '', longitude: '' });
            setShowForm(false);
            fetchPlaces();
        } else {
            console.error(error);
            alert('Error al guardar: Asegúrate de que la tabla "secret_places" existe en Supabase.');
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
            .from('secret_places')
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
        if (confirm('¿Quieres eliminar este secreto de la lista?')) {
            const { error } = await supabase
                .from('secret_places')
                .delete()
                .eq('id', id);

            if (!error) {
                fetchPlaces();
            }
        }
    };

    const startEditing = (place: SecretPlace) => {
        setEditingId(place.id);
        setEditItem(place);
    };

    return (
        <>
            <div
                className="section-bg"
                style={{
                    backgroundImage: 'url(/madrid_secret_bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            ></div>
            <div className={`content-wrapper ${styles.placesPage}`}>

                <div className={`${styles.header} container`}>
                    <h1 className={styles.title}><span className="text-madrid-gradient">Secretos</span> de Madrid 🕵️‍♂️</h1>
                    <p className="text-xl font-medium opacity-80">Lugares mágicos y gemas ocultas para explorar en familia.</p>
                    <button
                        className="btn-primary"
                        style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)' }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancelar' : <><Sparkles size={20} /> Revelar Secreto</>}
                    </button>
                </div>

                <div className="container">
                    {showForm && (
                        <form className={`${styles.addForm} glass`} onSubmit={handleAdd}>
                            <div className={styles.formGrid}>
                                <input
                                    type="text"
                                    placeholder="Nombre del secreto"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    required
                                />
                                <select
                                    value={newItem.category}
                                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                >
                                    <option value="🌿 Naturaleza">🌿 Naturaleza</option>
                                    <option value="🌇 Miradores">🌇 Miradores</option>
                                    <option value="🏛️ Historia">🏛️ Historia</option>
                                    <option value="🍷 Bares ocultos">🍷 Bares ocultos</option>
                                    <option value="📚 Cultura">📚 Cultura</option>
                                    <option value="🎬 Experiencias raras">🎬 Experiencias raras</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="¿Por qué es especial?"
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
                                    placeholder="Latitud (opcional)"
                                    value={newItem.latitude}
                                    onChange={e => setNewItem({ ...newItem, latitude: e.target.value })}
                                />
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Longitud (opcional)"
                                    value={newItem.longitude}
                                    onChange={e => setNewItem({ ...newItem, longitude: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={isSaving} style={{ background: '#d97706' }}>
                                {isSaving ? <Loader2 className="animate-spin" /> : 'Guardar Secreto'}
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
                                <div key={place.id} className={`${styles.card} ${editingId === place.id ? styles.editing : ''}`} style={{ borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                                    <div className={styles.imageBox}>
                                        <Image
                                            src={place.image}
                                            alt={place.name}
                                            width={600}
                                            height={400}
                                            className={styles.image}
                                            unoptimized={place.image.startsWith('http')}
                                        />
                                        <span className={styles.category} style={{ background: 'rgba(217, 119, 6, 0.8)' }}>{place.category}</span>
                                        <div className={styles.adminButtons}>
                                            <button className={styles.editBtn} onClick={() => startEditing(place)} title="Editar"><Edit2 size={16} /></button>
                                            <button className={styles.deleteBtn} onClick={() => handleDelete(place.id)} title="Eliminar"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <div className={styles.cardContent}>
                                        {editingId === place.id ? (
                                            <div className={styles.editForm}>
                                                <input
                                                    type="text"
                                                    value={editItem.name}
                                                    onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                                                />
                                                <select
                                                    value={editItem.category}
                                                    onChange={e => setEditItem({ ...editItem, category: e.target.value })}
                                                >
                                                    <option value="🌿 Naturaleza">🌿 Naturaleza</option>
                                                    <option value="🌇 Miradores">🌇 Miradores</option>
                                                    <option value="🏛️ Historia">🏛️ Historia</option>
                                                    <option value="🍷 Bares ocultos">🍷 Bares ocultos</option>
                                                    <option value="📚 Cultura">📚 Cultura</option>
                                                    <option value="🎬 Experiencias raras">🎬 Experiencias raras</option>
                                                </select>
                                                <textarea
                                                    value={editItem.description}
                                                    onChange={e => setEditItem({ ...editItem, description: e.target.value })}
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
                                                    <button onClick={() => handleUpdate(place.id)} className={styles.btnSave} disabled={isSaving} style={{ background: '#d97706' }}>
                                                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <><Check size={16} /> Guardar</>}
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className={styles.btnCancelEdit}><X size={16} /> Cancelar</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 style={{ color: '#92400e' }}>{place.name}</h3>
                                                <p>{place.description}</p>
                                                {place.latitude && (
                                                    <div className={styles.coordenadas} style={{ color: '#d97706', background: 'rgba(245, 158, 11, 0.05)' }}>
                                                        <MapPin size={14} />
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

export default SecretPlacesPage;
