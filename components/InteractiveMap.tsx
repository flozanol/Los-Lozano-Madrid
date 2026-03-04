'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/lib/supabase';
import { MapPin, Utensils, Landmark, Loader2, Save, X } from 'lucide-react';
import styles from './InteractiveMap.module.css';

// Fix for Leaflet default icons in Next.js
const fixLeafletIcons = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

interface InteractiveMapProps {
    pins: any[];
    places: any[];
    restaurants: any[];
    onDataUpdate: () => void;
}

const InteractiveMap = ({ pins, places, restaurants, onDataUpdate }: InteractiveMapProps) => {
    const [newPinCoords, setNewPinCoords] = useState<[number, number] | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Interés',
        description: '',
        specialty: ''
    });

    useEffect(() => {
        fixLeafletIcons();
    }, []);

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                setNewPinCoords([e.latlng.lat, e.latlng.lng]);
                setShowForm(true);
            },
        });
        return null;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPinCoords || !formData.name) return;

        setIsSaving(true);
        const [lat, lng] = newPinCoords;

        try {
            let table = 'pins';
            let payload: any = {
                name: formData.name,
                category: formData.category,
                latitude: lat,
                longitude: lng
            };

            // Intelligent routing based on category
            if (formData.category === 'Restaurante') {
                table = 'restaurants';
                payload = {
                    ...payload,
                    specialty: formData.specialty || 'General',
                    description: formData.description || 'Guardado desde el mapa',
                    rating: '⭐⭐⭐⭐⭐',
                    image: 'https://images.unsplash.com/photo-1515516969-d41f71df9138?auto=format&fit=crop&w=600&q=80'
                };
            } else if (['Monumento', 'Ocio', 'Museo', 'Parque'].includes(formData.category)) {
                table = 'places_to_visit';
                payload = {
                    ...payload,
                    description: formData.description || 'Guardado desde el mapa',
                    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=600&auto=format&fit=crop'
                };
            }

            const { error } = await supabase.from(table).insert([payload]);

            if (error) throw error;

            setNewPinCoords(null);
            setShowForm(false);
            setFormData({ name: '', category: 'Interés', description: '', specialty: '' });
            onDataUpdate();
        } catch (error: any) {
            console.error('Error saving pin:', error);
            alert(`Error: ${error.message || 'No se pudo guardar'}. Asegúrate de que las tablas existen en tu base de datos.`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={styles.mapContainerWrapper}>
            {showForm && (
                <div className={`${styles.pinForm} glass`}>
                    <div className={styles.formHeader}>
                        <h3>📍 Nuevo Lugar</h3>
                        <button onClick={() => setShowForm(false)} className={styles.btnClose}>
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSave}>
                        <div className={styles.inputGroup}>
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej: Mercado de San Miguel"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Categoría</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Interés">Punto de Interés (General)</option>
                                <option value="Restaurante">Comida / Cena</option>
                                <option value="Monumento">Monumento / Visita</option>
                                <option value="Ocio">Ocio / Compras</option>
                                <option value="Museo">Museo / Arte</option>
                            </select>
                        </div>

                        {formData.category === 'Restaurante' && (
                            <div className={styles.inputGroup}>
                                <label>Especialidad</label>
                                <input
                                    type="text"
                                    value={formData.specialty}
                                    onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                                    placeholder="Ej: Tapas, Paella..."
                                />
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <label>Descripción / Nota</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="¿Por qué quieres ir aquí?"
                                rows={2}
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={isSaving}>
                            {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Guardar Lugar</>}
                        </button>
                    </form>
                </div>
            )}

            <MapContainer center={[40.4168, -3.7038]} zoom={14} className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents />

                {/* Custom Pins */}
                {pins.map((pin, index) => (
                    <Marker key={`pin-${index}`} position={[pin.latitude, pin.longitude]}>
                        <Popup>
                            <div className={styles.popup}>
                                <div className={styles.popupHeader}>
                                    <MapPin size={14} className="text-gold" />
                                    <strong>{pin.name}</strong>
                                </div>
                                <span className={styles.popupCategory}>{pin.category}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Places to Visit */}
                {places.map((place, index) => (
                    <Marker key={`place-${index}`} position={[place.latitude, place.longitude]}>
                        <Popup>
                            <div className={styles.popup}>
                                <div className={styles.popupHeader}>
                                    <Landmark size={14} className="text-gold" />
                                    <strong>{place.name}</strong>
                                </div>
                                <span className={styles.popupCategory}>{place.category}</span>
                                {place.description && <p className={styles.popupDesc}>{place.description}</p>}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Restaurants */}
                {restaurants.map((rest, index) => (
                    <Marker key={`rest-${index}`} position={[rest.latitude, rest.longitude]}>
                        <Popup>
                            <div className={styles.popup}>
                                <div className={styles.popupHeader}>
                                    <Utensils size={14} className="text-gold" />
                                    <strong>{rest.name}</strong>
                                </div>
                                <div className={styles.popupDetail}>
                                    <span className={styles.popupCategory}>{rest.specialty}</span>
                                    <div className={styles.stars}>{rest.rating}</div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {newPinCoords && (
                    <Marker position={newPinCoords}>
                        <Popup>Ubicación seleccionada</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default InteractiveMap;
