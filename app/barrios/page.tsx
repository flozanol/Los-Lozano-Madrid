'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Loader2, MapPin, Trash2, Edit2, Check, X, Star, Camera, ShoppingBag, Utensils, Info, Sparkles, Heart } from 'lucide-react';
import styles from '../restaurants/page.module.css';
import { supabase } from '@/lib/supabase';

interface Neighborhood {
    id: string;
    name: string;
    vibe: string;
    description: string;
    image_url: string;
    what_to_do: string[];
    is_favorite: boolean;
    created_at: string;
}

const NeighborhoodsPage = () => {
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        vibe: '',
        description: '',
        image_url: '',
        what_to_do_str: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editItem, setEditItem] = useState<Partial<Neighborhood & { what_to_do_str: string }>>({});

    useEffect(() => {
        fetchNeighborhoods();
    }, []);

    const fetchNeighborhoods = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('barrios')
            .select('*')
            .order('created_at', { ascending: true });

        if (!error && data) {
            setNeighborhoods(data);
        }
        setIsLoading(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.name || !newItem.description) return;

        setIsSaving(true);
        const img = newItem.image_url || "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80";
        const what_to_do = newItem.what_to_do_str.split(',').map(s => s.trim()).filter(Boolean);

        const { error } = await supabase
            .from('barrios')
            .insert([{
                name: newItem.name,
                vibe: newItem.vibe,
                description: newItem.description,
                image_url: img,
                what_to_do: what_to_do
            }]);

        if (!error) {
            setNewItem({ name: '', vibe: '', description: '', image_url: '', what_to_do_str: '' });
            setShowForm(false);
            fetchNeighborhoods();
        } else {
            console.error(error);
            alert('Error al guardar barrio');
        }
        setIsSaving(false);
    };

    const handleUpdate = async (id: string) => {
        setIsSaving(true);
        const payload = { ...editItem };
        if (editItem.what_to_do_str !== undefined) {
            payload.what_to_do = editItem.what_to_do_str.split(',').map(s => s.trim()).filter(Boolean);
            delete payload.what_to_do_str;
        }

        const { error } = await supabase
            .from('barrios')
            .update(payload)
            .eq('id', id);

        if (!error) {
            setEditingId(null);
            fetchNeighborhoods();
        } else {
            console.error(error);
            alert('Error al actualizar');
        }
        setIsSaving(false);
    };

    const toggleFavorite = async (n: Neighborhood) => {
        const newStatus = !n.is_favorite;
        setNeighborhoods(neighborhoods.map(item => item.id === n.id ? { ...item, is_favorite: newStatus } : item));

        const { error } = await supabase
            .from('barrios')
            .update({ is_favorite: newStatus })
            .eq('id', n.id);

        if (error) {
            setNeighborhoods(neighborhoods.map(item => item.id === n.id ? { ...item, is_favorite: !newStatus } : item));
            alert('Error: Añade "is_favorite" (booleano) a la tabla "barrios".');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Quieres eliminar este barrio?')) {
            const { error } = await supabase
                .from('barrios')
                .delete()
                .eq('id', id);

            if (!error) {
                fetchNeighborhoods();
            }
        }
    };

    const startEditing = (n: Neighborhood) => {
        setEditingId(n.id);
        setEditItem({ ...n, what_to_do_str: n.what_to_do?.join(', ') || '' });
    };

    const getIcon = (vibe: string) => {
        const v = vibe?.toLowerCase() || '';
        if (v.includes('lujo') || v.includes('elegante')) return ShoppingBag;
        if (v.includes('alternativo') || v.includes('moderno')) return Camera;
        if (v.includes('tapas') || v.includes('castizo')) return Utensils;
        return MapPin;
    };

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_barrios.png)', backgroundPosition: 'center' }}
            ></div>
            <div className={`content-wrapper ${styles.restaurantsPage}`}>

                <div className={`${styles.header} container`}>
                    <div className="inline-flex p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-6 border border-white/20">
                        <MapPin className="text-white" size={40} />
                    </div>
                    <h1 className={styles.title}>Barrios de <span className="text-madrid-gradient">Madrid</span></h1>
                    <p className="text-xl font-medium opacity-80">Explora la personalidad única de cada rincón de la capital.</p>
                    <button
                        className="btn-primary"
                        style={{ marginTop: '2rem' }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancelar' : <><Plus size={20} /> Añadir Barrio</>}
                    </button>
                </div>

                <div className="container">
                    {showForm && (
                        <form className={`${styles.addForm} glass`} onSubmit={handleAdd}>
                            <div className={styles.formGrid}>
                                <input
                                    type="text"
                                    placeholder="Nombre del barrio (Ej: Malasaña)"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Vibe (Ej: Alternativo y Moderno)"
                                    value={newItem.vibe}
                                    onChange={e => setNewItem({ ...newItem, vibe: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Qué hacer (separado por comas)"
                                    value={newItem.what_to_do_str}
                                    onChange={e => setNewItem({ ...newItem, what_to_do_str: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="URL de Imagen"
                                    value={newItem.image_url}
                                    onChange={e => setNewItem({ ...newItem, image_url: e.target.value })}
                                />
                                <textarea
                                    placeholder="Descripción del barrio"
                                    value={newItem.description}
                                    className="md:col-span-2 p-4 bg-white/5 border border-white/10 rounded-xl text-white"
                                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={isSaving}>
                                {isSaving ? <Loader2 className="animate-spin" /> : 'Guardar Barrio'}
                            </button>
                        </form>
                    )}

                    {isLoading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin mx-auto text-white" size={40} />
                        </div>
                    ) : (
                        <div className={styles.list}>
                            {neighborhoods.map((n) => {
                                const Icon = getIcon(n.vibe);
                                return (
                                    <div key={n.id} className={`${styles.item} ${editingId === n.id ? styles.editing : ''}`}>
                                        <div className={styles.itemImageWrapper}>
                                            <Image
                                                src={n.image_url || "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80"}
                                                alt={n.name}
                                                width={400}
                                                height={300}
                                                className={styles.itemImage}
                                                unoptimized={true}
                                            />
                                            <div className={styles.adminButtons}>
                                                <button className={styles.editBtn} onClick={() => startEditing(n)} title="Editar"><Edit2 size={16} /></button>
                                                <button className={styles.deleteBtn} onClick={() => handleDelete(n.id)} title="Eliminar"><Trash2 size={16} /></button>
                                            </div>
                                            <button
                                                className={`${styles.favoriteBtn} ${n.is_favorite ? styles.btnFavoriteActive : ''}`}
                                                onClick={() => toggleFavorite(n)}
                                                style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 10 }}
                                            >
                                                <Heart size={18} fill={n.is_favorite ? "currentColor" : "none"} />
                                            </button>
                                        </div>

                                        <div className={styles.itemInfo}>
                                            {editingId === n.id ? (
                                                <div className={styles.editForm}>
                                                    <input
                                                        type="text"
                                                        value={editItem.name}
                                                        onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                                                        placeholder="Nombre"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editItem.vibe}
                                                        onChange={e => setEditItem({ ...editItem, vibe: e.target.value })}
                                                        placeholder="Vibe"
                                                    />
                                                    <textarea
                                                        value={editItem.description}
                                                        onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                                                        placeholder="Descripción"
                                                    />
                                                    <div className={styles.editActions}>
                                                        <button onClick={() => handleUpdate(n.id)} className={styles.btnSave} disabled={isSaving}>
                                                            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <><Check size={16} /> Guardar</>}
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className={styles.btnCancelEdit}><X size={16} /> Cancelar</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className={styles.itemNameWrapper}>
                                                        <h3>{n.name}</h3>
                                                        <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/70">
                                                            {n.vibe}
                                                        </span>
                                                    </div>
                                                    <p className={styles.description}>{n.description}</p>
                                                    <div className="flex flex-wrap gap-2 mt-6">
                                                        {n.what_to_do?.map((todo, i) => (
                                                            <span key={i} className="px-3 py-1 bg-madrid-red/20 text-white rounded-full text-[10px] font-black border border-white/10 flex items-center gap-1 uppercase">
                                                                <Star size={10} className="fill-white" />
                                                                {todo}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className={styles.itemActions}>
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                                    <Icon size={32} className="text-white opacity-80" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-wider opacity-60">VIBE CHECK</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NeighborhoodsPage;

