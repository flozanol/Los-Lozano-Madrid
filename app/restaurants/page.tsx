'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Loader2, Utensils, Trash2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

interface Restaurant {
    id: string;
    name: string;
    specialty: string;
    description: string;
    rating: string;
    image: string;
    created_at: string;
}

const RestaurantsPage = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', specialty: '', description: '', rating: '⭐⭐⭐⭐⭐', image: '' });
    const [isSaving, setIsSaving] = useState(false);

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

        const { error } = await supabase
            .from('restaurants')
            .insert([{ ...newItem, image: img }]);

        if (!error) {
            setNewItem({ name: '', specialty: '', description: '', rating: '⭐⭐⭐⭐⭐', image: '' });
            setShowForm(false);
            fetchRestaurants();
        } else {
            console.error(error);
            alert('Error al guardar: Asegúrate de que la tabla "restaurants" existe.');
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

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_royalty_borbones.png)' }}
            ></div>
            <div className={`content-wrapper ${styles.restaurantsPage}`}>

                <div className={`${styles.header} container`}>
                    <h1 className={styles.title}>Dónde <span className="text-gold">Comer</span></h1>
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
                            </div>
                            <button type="submit" className="btn-primary" disabled={isSaving}>
                                {isSaving ? <Loader2 className="animate-spin" /> : 'Añadir Restaurante'}
                            </button>
                        </form>
                    )}

                    {isLoading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin mx-auto text-gold" size={40} />
                        </div>
                    ) : (
                        <div className={styles.list}>
                            {restaurants.map((rest) => (
                                <div key={rest.id} className={styles.item}>
                                    <div className={styles.itemImageWrapper}>
                                        <Image
                                            src={rest.image}
                                            alt={rest.name}
                                            width={400}
                                            height={300}
                                            className={styles.itemImage}
                                            unoptimized={rest.image.startsWith('http')}
                                        />
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(rest.id)}
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <div className={styles.itemNameWrapper}>
                                            <h3>{rest.name}</h3>
                                            <span className={styles.rating}>{rest.rating}</span>
                                        </div>
                                        <p className={styles.specialty}><strong>Especialidad:</strong> {rest.specialty}</p>
                                        <p className={styles.description}>{rest.description}</p>
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
