'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Loader2, Utensils, Trash2, Edit2, Check, X, MapPin } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

interface Restaurant {
    id: string;
    name: string;
    specialty: string;
    description: string;
    rating: string;
    image: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    created_at: string;
}

const RestaurantsPage = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', specialty: '', description: '', rating: '⭐⭐⭐⭐⭐', image: '', latitude: '', longitude: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editItem, setEditItem] = useState<Partial<Restaurant>>({});

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('restaurants')
            .select('*')
            .order('created_at', { ascending: true });

        if (!error && data) {
            setRestaurants(data);
        }
        setIsLoading(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.name || !newItem.description) return;

        setIsSaving(true);
        const img = newItem.image || "https://images.unsplash.com/photo-1515516969-d41f71df9138?auto=format&fit=crop&w=600&q=80";

        const payload = {
            ...newItem,
            image: img,
            latitude: newItem.latitude ? parseFloat(newItem.latitude as string) : null,
            longitude: newItem.longitude ? parseFloat(newItem.longitude as string) : null
        };

        const { error } = await supabase
            .from('restaurants')
            .insert([payload]);

        if (!error) {
            setNewItem({ name: '', specialty: '', description: '', rating: '⭐⭐⭐⭐⭐', image: '', latitude: '', longitude: '' });
            setShowForm(false);
            fetchRestaurants();
        } else {
            console.error(error);
            alert('Error al guardar: Asegúrate de que la tabla "restaurants" existe y tiene columnas latitude/longitude.');
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
            .from('restaurants')
            .update(payload)
            .eq('id', id);

        if (!error) {
            setEditingId(null);
            fetchRestaurants();
        } else {
            console.error(error);
            alert('Error al actualizar');
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Quieres eliminar este restaurante de la lista?')) {
            const { error } = await supabase
                .from('restaurants')
                .delete()
                .eq('id', id);

            if (!error) {
                fetchRestaurants();
            }
        }
    };

    const startEditing = (rest: Restaurant) => {
        setEditingId(rest.id);
        setEditItem(rest);
    };

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_royalty_borbones.png)' }}
            ></div>
            <div className={`content-wrapper ${styles.restaurantsPage}`}>

                <div className={`${styles.header} container`}>
                    <h1 className={styles.title}>Dónde <span className="text-madrid-gradient">Comer</span></h1>
                    <p>Selección de templos gastronómicos para disfrutar en familia.</p>
                    <button
                        className="btn-primary"
                        style={{ marginTop: '2rem' }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancelar' : <><Plus size={20} /> Añadir Restaurante</>}
                    </button>
                </div>

                <div className="container">
                    {showForm && (
                        <form className={`${styles.addForm} glass`} onSubmit={handleAdd}>
                            <div className={styles.formGrid}>
                                <input
                                    type="text"
                                    placeholder="Nombre del restaurante"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Especialidad (Ej: Cochinillo)"
                                    value={newItem.specialty}
                                    onChange={e => setNewItem({ ...newItem, specialty: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Descripción"
                                    value={newItem.description}
                                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                    required
                                />
                                <select
                                    value={newItem.rating}
                                    onChange={e => setNewItem({ ...newItem, rating: e.target.value })}
                                >
                                    <option value="⭐⭐⭐⭐⭐">5 Estrellas</option>
                                    <option value="⭐⭐⭐⭐">4 Estrellas</option>
                                    <option value="⭐⭐⭐">3 Estrellas</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="URL de Imagen (opcional)"
                                    value={newItem.image}
                                    onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                />
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Latitud (ej: 40.41)"
                                    value={newItem.latitude}
                                    onChange={e => setNewItem({ ...newItem, latitude: e.target.value })}
                                />
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Longitud (ej: -3.70)"
                                    value={newItem.longitude}
                                    onChange={e => setNewItem({ ...newItem, longitude: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={isSaving}>
                                {isSaving ? <Loader2 className="animate-spin" /> : 'Añadir Restaurante'}
                            </button>
                        </form>
                    )}

                    {isLoading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin mx-auto text-madrid-red" size={40} />
                        </div>
                    ) : (
                        <div className={styles.list}>
                            {restaurants.map((rest) => (
                                <div key={rest.id} className={`${styles.item} ${editingId === rest.id ? styles.editing : ''}`}>
                                    <div className={styles.itemImageWrapper}>
                                        <Image
                                            src={rest.image}
                                            alt={rest.name}
                                            width={400}
                                            height={300}
                                            className={styles.itemImage}
                                            unoptimized={rest.image.startsWith('http')}
                                        />
                                        <div className={styles.adminButtons}>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => startEditing(rest)}
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete(rest.id)}
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.itemInfo}>
                                        {editingId === rest.id ? (
                                            <div className={styles.editForm}>
                                                <input
                                                    type="text"
                                                    value={editItem.name}
                                                    onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                                                    placeholder="Nombre"
                                                />
                                                <input
                                                    type="text"
                                                    value={editItem.specialty}
                                                    onChange={e => setEditItem({ ...editItem, specialty: e.target.value })}
                                                    placeholder="Especialidad"
                                                />
                                                <textarea
                                                    value={editItem.description}
                                                    onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                                                    placeholder="Descripción"
                                                />
                                                <div className={styles.coordInputs}>
                                                    <div className={styles.inputWithIcon}>
                                                        <MapPin size={14} />
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            value={editItem.latitude ?? ''}
                                                            onChange={e => setEditItem({ ...editItem, latitude: e.target.value })}
                                                            placeholder="Latitud"
                                                        />
                                                    </div>
                                                    <div className={styles.inputWithIcon}>
                                                        <MapPin size={14} />
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            value={editItem.longitude ?? ''}
                                                            onChange={e => setEditItem({ ...editItem, longitude: e.target.value })}
                                                            placeholder="Longitud"
                                                        />
                                                    </div>
                                                </div>
                                                <div className={styles.editActions}>
                                                    <button onClick={() => handleUpdate(rest.id)} className={styles.btnSave} disabled={isSaving}>
                                                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <><Check size={16} /> Guardar Cambios</>}
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className={styles.btnCancelEdit}><X size={16} /> Cancelar</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.itemNameWrapper}>
                                                    <h3>{rest.name}</h3>
                                                    <span className={styles.rating}>{rest.rating}</span>
                                                </div>
                                                <p className={styles.specialty}><strong>Especialidad:</strong> {rest.specialty}</p>
                                                <p className={styles.description}>{rest.description}</p>
                                                {rest.latitude && (
                                                    <div className={styles.coordenadas}>
                                                        <MapPin size={14} className="text-madrid-red" />
                                                        <span>{rest.latitude}, {rest.longitude}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className={styles.itemActions}>
                                        <button className={styles.btnVote}>
                                            <Utensils size={16} /> Lo quiero probar
                                        </button>
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

export default RestaurantsPage;
