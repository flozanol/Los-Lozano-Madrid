'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import 'leaflet/dist/leaflet.css';
import styles from './page.module.css';

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const useMapEvents = dynamic(() => import('react-leaflet').then(mod => mod.useMapEvents), { ssr: false });

const MapPage = () => {
    const [L, setL] = useState<any>(null);
    const [pins, setPins] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newPinCoords, setNewPinCoords] = useState<[number, number] | null>(null);
    const [pinData, setPinData] = useState({ name: '', category: 'Interés' });

    useEffect(() => {
        import('leaflet').then(m => {
            setL(m);
            delete (m.Icon.Default.prototype as any)._getIconUrl;
            m.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        });
        fetchPins();
    }, []);

    const fetchPins = async () => {
        const { data, error } = await supabase.from('pins').select('*');
        if (data) setPins(data);
    };

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                setNewPinCoords([e.latlng.lat, e.latlng.lng]);
                setShowForm(true);
            },
        });
        return null;
    };

    const handleAddPin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPinCoords || !pinData.name) return;

        const { error } = await supabase.from('pins').insert([
            {
                name: pinData.name,
                category: pinData.category,
                latitude: newPinCoords[0],
                longitude: newPinCoords[1]
            }
        ]);

        if (!error) {
            setPinData({ name: '', category: 'Interés' });
            setShowForm(false);
            setNewPinCoords(null);
            fetchPins();
        }
    };

    if (!L) return <div className={styles.loading}>Cargando mapa...</div>;

    return (
        <div className={styles.mapPage}>
            <div className="container">
                <header className={styles.header}>
                    <h1 className={styles.title}>Mapa de <span className="text-gold">Madrid</span></h1>
                    <p className={styles.subtitle}>Haz clic en cualquier punto del mapa para añadir un nuevo pin.</p>
                </header>

                {showForm && (
                    <div className={`${styles.pinForm} glass`}>
                        <h3>Añadir Marcador</h3>
                        <form onSubmit={handleAddPin}>
                            <input
                                type="text"
                                placeholder="Nombre del lugar"
                                value={pinData.name}
                                onChange={e => setPinData({ ...pinData, name: e.target.value })}
                                required
                            />
                            <select value={pinData.category} onChange={e => setPinData({ ...pinData, category: e.target.value })}>
                                <option value="Monumento">Monumento</option>
                                <option value="Restaurante">Restaurante</option>
                                <option value="Ocio">Ocio</option>
                                <option value="Interés">Interés</option>
                            </select>
                            <div className={styles.formButtons}>
                                <button type="submit" className="btn-primary">Guardar Pin</button>
                                <button type="button" onClick={() => setShowForm(false)} className={styles.btnCancel}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className={styles.mapWrapper}>
                    <MapContainer center={[40.4168, -3.7038]} zoom={14} style={{ height: '600px', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapEvents />
                        {pins.map((pin, index) => (
                            <Marker key={index} position={[pin.latitude, pin.longitude]}>
                                <Popup>
                                    <div className={styles.popup}>
                                        <strong>{pin.name}</strong><br />
                                        <span>{pin.category}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        {newPinCoords && (
                            <Marker position={newPinCoords}>
                                <Popup>Nuevo Pin aquí...</Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default MapPage;

