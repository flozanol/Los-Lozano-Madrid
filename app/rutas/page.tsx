'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Loader2, Footprints, Trash2, Edit2, Check, X, MapPin, Clock, Star, ChevronRight } from 'lucide-react';
import styles from '../restaurants/page.module.css';
import { supabase } from '@/lib/supabase';

interface Route {
    id: string;
    title: string;
    description: string;
    distance: string;
    time_est: string;
    image_url: string;
    google_maps_url: string;
    stops: string[];
    created_at: string;
}

const RoutesPage = () => {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({
        title: '',
        description: '',
        distance: '',
        time_est: '',
        image_url: '',
        google_maps_url: '',
        stops_str: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editItem, setEditItem] = useState<Partial<Route & { stops_str: string }>>({});

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('routes')
            .select('*')
            .order('created_at', { ascending: true });

        if (!error && data) {
            setRoutes(data);
        }
        setIsLoading(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.title || !newItem.description) return;

        setIsSaving(true);
        const img = newItem.image_url || "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80";
        const stops = newItem.stops_str.split(',').map(s => s.trim()).filter(Boolean);

        const { error } = await supabase
            .from('routes')
            .insert([{
                title: newItem.title,
                description: newItem.description,
                distance: newItem.distance,
                time_est: newItem.time_est,
                image_url: img,
                google_maps_url: newItem.google_maps_url,
                stops: stops
            }]);

        if (!error) {
            setNewItem({ title: '', description: '', distance: '', time_est: '', image_url: '', google_maps_url: '', stops_str: '' });
            setShowForm(false);
            fetchRoutes();
        } else {
            console.error(error);
            alert('Error al guardar ruta');
        }
        setIsSaving(false);
    };

    const handleUpdate = async (id: string) => {
        setIsSaving(true);
        const payload = { ...editItem };
        if (editItem.stops_str !== undefined) {
            payload.stops = editItem.stops_str.split(',').map(s => s.trim()).filter(Boolean);
            delete payload.stops_str;
        }

        const { error } = await supabase
            .from('routes')
            .update(payload)
            .eq('id', id);

        if (!error) {
            setEditingId(null);
            fetchRoutes();
        } else {
            console.error(error);
            alert('Error al actualizar');
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Quieres eliminar esta ruta?')) {
            const { error } = await supabase
                .from('routes')
                .delete()
                .eq('id', id);

            if (!error) {
                fetchRoutes();
            }
        }
    };

    const startEditing = (r: Route) => {
        setEditingId(r.id);
        setEditItem({ ...r, stops_str: r.stops?.join(', ') || '' });
    };

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_rutas.png)', backgroundPosition: 'center' }}
            ></div>
            <div className={`content-wrapper ${styles.restaurantsPage}`}>

                <div className={`${styles.header} container`}>
                    <div className="inline-flex p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-6 border border-white/20">
                        <Footprints className="text-white" size={40} />
                    </div>
                    <h1 className={styles.title}>Rutas <span className="text-madrid-gradient">Caminables</span></h1>
                    <p className="text-xl font-medium opacity-80">Explora Madrid a pie con nuestras rutas diseñadas para la familia.</p>
                    <button
                        className="btn-primary"
                        style={{ marginTop: '2rem' }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancelar' : <><Plus size={20} /> Añadir Ruta</>}
                    </button>
                </div>

                <div className="container">
                    {showForm && (
                        <form className={`${styles.addForm} glass`} onSubmit={handleAdd}>
                            <div className={styles.formGrid}>
                                <input
                                    type="text"
                                    placeholder="Título de la ruta"
                                    value={newItem.title}
                                    onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Distancia (Ej: 3.5 km)"
                                    value={newItem.distance}
                                    onChange={e => setNewItem({ ...newItem, distance: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Tiempo est. (Ej: 2 horas)"
                                    value={newItem.time_est}
                                    onChange={e => setNewItem({ ...newItem, time_est: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="URL de Imagen"
                                    value={newItem.image_url}
                                    onChange={e => setNewItem({ ...newItem, image_url: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Paradas (separadas por comas)"
                                    value={newItem.stops_str}
                                    onChange={e => setNewItem({ ...newItem, stops_str: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Enlace de Google Maps"
                                    value={newItem.google_maps_url}
                                    onChange={e => setNewItem({ ...newItem, google_maps_url: e.target.value })}
                                />
                                <textarea
                                    placeholder="Descripción de la ruta"
                                    value={newItem.description}
                                    className="md:col-span-2 p-4 bg-white/5 border border-white/10 rounded-xl text-white"
                                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={isSaving}>
                                {isSaving ? <Loader2 className="animate-spin" /> : 'Guardar Ruta'}
                            </button>
                        </form>
                    )}

                    {isLoading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin mx-auto text-white" size={40} />
                        </div>
                    ) : (
                        <div className={styles.list}>
                            {routes.map((route) => (
                                <div key={route.id} className={`${styles.item} ${editingId === route.id ? styles.editing : ''}`}>
                                    <div className={styles.itemImageWrapper}>
                                        <Image
                                            src={route.image_url || "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80"}
                                            alt={route.title}
                                            width={400}
                                            height={300}
                                            className={styles.itemImage}
                                            unoptimized={true}
                                        />
                                        <div className={styles.adminButtons}>
                                            <button className={styles.editBtn} onClick={() => startEditing(route)} title="Editar"><Edit2 size={16} /></button>
                                            <button className={styles.deleteBtn} onClick={() => handleDelete(route.id)} title="Eliminar"><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    <div className={styles.itemInfo}>
                                        {editingId === route.id ? (
                                            <div className={styles.editForm}>
                                                <input
                                                    type="text"
                                                    value={editItem.title}
                                                    onChange={e => setEditItem({ ...editItem, title: e.target.value })}
                                                    placeholder="Título"
                                                />
                                                <input
                                                    type="text"
                                                    value={editItem.distance}
                                                    onChange={e => setEditItem({ ...editItem, distance: e.target.value })}
                                                    placeholder="Distancia"
                                                />
                                                <textarea
                                                    value={editItem.description}
                                                    onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                                                    placeholder="Descripción"
                                                />
                                                <input
                                                    type="text"
                                                    value={editItem.google_maps_url}
                                                    onChange={e => setEditItem({ ...editItem, google_maps_url: e.target.value })}
                                                    placeholder="Google Maps URL"
                                                />
                                                <div className={styles.editActions}>
                                                    <button onClick={() => handleUpdate(route.id)} className={styles.btnSave} disabled={isSaving}>
                                                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <><Check size={16} /> Guardar</>}
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className={styles.btnCancelEdit}><X size={16} /> Cancelar</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.itemNameWrapper}>
                                                    <h3>{route.title}</h3>
                                                    <div className="flex gap-2">
                                                        <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/70 flex items-center gap-1">
                                                            <MapPin size={10} /> {route.distance}
                                                        </span>
                                                        <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/70 flex items-center gap-1">
                                                            <Clock size={10} /> {route.time_est}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className={styles.description}>"{route.description}"</p>
                                                <div className="flex flex-wrap gap-2 mt-6">
                                                    {route.stops?.map((stop, i) => (
                                                        <span key={i} className="px-3 py-1 bg-madrid-red/20 text-white rounded-full text-[10px] font-black border border-white/10 flex items-center gap-1 uppercase">
                                                            <span className="w-4 h-4 rounded-full bg-white text-madrid-red flex items-center justify-center text-[8px]">{i + 1}</span>
                                                            {stop}
                                                        </span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className={styles.itemActions}>
                                        <button
                                            className={styles.btnVote}
                                            onClick={() => {
                                                if (route.google_maps_url) {
                                                    window.open(route.google_maps_url, '_blank');
                                                } else {
                                                    alert('No hay enlace de Google Maps para esta ruta');
                                                }
                                            }}
                                        >
                                            <MapPin size={16} /> Ver en Maps
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

export default RoutesPage;
