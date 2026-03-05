'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Loader2, UtensilsCrossed, Trash2, Edit2, Check, X, MapPin, DollarSign, Heart } from 'lucide-react';
import styles from '../restaurants/page.module.css';
import { supabase } from '@/lib/supabase';

interface LocalRestaurant {
    id: string;
    name: string;
    specialty: string;
    description: string;
    vibe: string;
    price: string;
    area: string;
    image_url: string;
    map_url: string;
    created_at: string;
}

const RinconGatoPage = () => {
    const [restaurants, setRestaurants] = useState<LocalRestaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        specialty: '',
        description: '',
        vibe: 'AUTÉNTICO',
        price: '€€',
        area: '',
        image_url: '',
        map_url: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editItem, setEditItem] = useState<Partial<LocalRestaurant>>({});

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('local_restaurants')
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
        const img = newItem.image_url || "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80";

        const { error } = await supabase
            .from('local_restaurants')
            .insert([{ ...newItem, image_url: img }]);

        if (!error) {
            setNewItem({
                name: '',
                specialty: '',
                description: '',
                vibe: 'AUTÉNTICO',
                price: '€€',
                area: '',
                image_url: '',
                map_url: ''
            });
            setShowForm(false);
            fetchRestaurants();
        } else {
            console.error(error);
            alert('Error al guardar en local_restaurants');
        }
        setIsSaving(false);
    };

    const handleUpdate = async (id: string) => {
        setIsSaving(true);
        const { error } = await supabase
            .from('local_restaurants')
            .update(editItem)
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
        if (confirm('¿Quieres eliminar este rincón de la lista?')) {
            const { error } = await supabase
                .from('local_restaurants')
                .delete()
                .eq('id', id);

            if (!error) {
                fetchRestaurants();
            }
        }
    };

    const startEditing = (rest: LocalRestaurant) => {
        setEditingId(rest.id);
        setEditItem(rest);
    };

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_rincon_gato.png)', backgroundPosition: 'center' }}
            ></div>
            <div className={`content-wrapper ${styles.restaurantsPage}`}>

                <div className={`${styles.header} container`}>
                    <div className="inline-flex p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-6 border border-white/20">
                        <UtensilsCrossed className="text-white" size={40} />
                    </div>
                    <h1 className={styles.title}>Rincón del <span className="text-madrid-gradient">Gato</span></h1>
                    <p className="text-lg opacity-90">Selección de templos gastronómicos locales, fuera del radar turístico.</p>
                    <button
                        className="btn-primary"
                        style={{ marginTop: '2rem' }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancelar' : <><Plus size={20} /> Añadir Rincón</>}
                    </button>
                </div>

                <div className="container">
                    {showForm && (
                        <form className={`${styles.addForm} glass`} onSubmit={handleAdd}>
                            <div className={styles.formGrid}>
                                <input
                                    type="text"
                                    placeholder="Nombre del rincón"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Zona (Ej: La Latina)"
                                    value={newItem.area}
                                    onChange={e => setNewItem({ ...newItem, area: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Especialidad (Ej: Tortilla)"
                                    value={newItem.specialty}
                                    onChange={e => setNewItem({ ...newItem, specialty: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Vibe (Ej: Castizo)"
                                    value={newItem.vibe}
                                    onChange={e => setNewItem({ ...newItem, vibe: e.target.value })}
                                />
                                <select
                                    value={newItem.price}
                                    onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                >
                                    <option value="€">Barato (€)</option>
                                    <option value="€€">Medio (€€)</option>
                                    <option value="€€€">Caro (€€€)</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="URL de Imagen"
                                    value={newItem.image_url}
                                    onChange={e => setNewItem({ ...newItem, image_url: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="URL de Google Maps"
                                    value={newItem.map_url}
                                    onChange={e => setNewItem({ ...newItem, map_url: e.target.value })}
                                />
                                <textarea
                                    placeholder="Descripción corta"
                                    value={newItem.description}
                                    className="md:col-span-2 p-4 bg-white/5 border border-white/10 rounded-xl text-white"
                                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={isSaving}>
                                {isSaving ? <Loader2 className="animate-spin" /> : 'Guardar Rincón'}
                            </button>
                        </form>
                    )}

                    {isLoading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin mx-auto text-white" size={40} />
                        </div>
                    ) : (
                        <div className={styles.list}>
                            {restaurants.map((rest) => (
                                <div key={rest.id} className={`${styles.item} ${editingId === rest.id ? styles.editing : ''}`}>
                                    <div className={styles.itemImageWrapper}>
                                        <Image
                                            src={rest.image_url || "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"}
                                            alt={rest.name}
                                            width={400}
                                            height={300}
                                            className={styles.itemImage}
                                            unoptimized={true}
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
                                                    value={editItem.area}
                                                    onChange={e => setEditItem({ ...editItem, area: e.target.value })}
                                                    placeholder="Zona"
                                                />
                                                <textarea
                                                    value={editItem.description}
                                                    onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                                                    placeholder="Descripción"
                                                />
                                                <div className={styles.editActions}>
                                                    <button onClick={() => handleUpdate(rest.id)} className={styles.btnSave} disabled={isSaving}>
                                                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <><Check size={16} /> Guardar</>}
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className={styles.btnCancelEdit}><X size={16} /> Cancelar</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.itemNameWrapper}>
                                                    <h3>{rest.name}</h3>
                                                    <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/70">
                                                        {rest.vibe}
                                                    </span>
                                                </div>
                                                <p className={styles.specialty}>
                                                    <strong>Especialidad:</strong> {rest.specialty}
                                                    <span className="ml-4 text-emerald-400">{rest.price}</span>
                                                </p>
                                                <p className={styles.description}>"{rest.description}"</p>
                                                <div className={styles.coordenadas}>
                                                    <MapPin size={14} />
                                                    <span>{rest.area}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className={styles.itemActions}>
                                        {rest.map_url ? (
                                            <a href={rest.map_url} target="_blank" className={styles.btnVote} style={{ textDecoration: 'none' }}>
                                                <MapPin size={16} /> Ver en Mapa
                                            </a>
                                        ) : (
                                            <button className={styles.btnVote} disabled opacity-50>
                                                <Heart size={16} /> Auténtico
                                            </button>
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

export default RinconGatoPage;

