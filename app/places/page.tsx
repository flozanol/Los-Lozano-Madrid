'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Loader2, MapPin } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

interface Place {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    created_at: string;
}

const PlacesPage = () => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', category: 'Monumento', description: '', image: '' });
    const [isSaving, setIsSaving] = useState(false);

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

        const { error } = await supabase
            .from('places_to_visit')
            .insert([{ ...newItem, image: img }]);

        if (!error) {
            setNewItem({ name: '', category: 'Monumento', description: '', image: '' });
            setShowForm(false);
            fetchPlaces();
        } else {
            console.error(error);
            alert('Error al guardar: Crea la tabla "places_to_visit" en tu editor SQL de Supabase con el campo "description".');
        }
        setIsSaving(false);
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
                            </div>
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
                                <div key={place.id} className={styles.card}>
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
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h3>{place.name}</h3>
                                        <p>{place.description}</p>
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
