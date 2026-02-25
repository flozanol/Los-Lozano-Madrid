'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import styles from './page.module.css';

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const MapPage = () => {
    const [L, setL] = useState<any>(null);

    useEffect(() => {
        import('leaflet').then(m => {
            setL(m);
            // Fix for default marker icons in Leaflet + Webpack
            delete (m.Icon.Default.prototype as any)._getIconUrl;
            m.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        });
    }, []);

    const pins = [
        { name: "Palacio Real", position: [40.4173, -3.7144], category: "Monumento" },
        { name: "Museo del Prado", position: [40.4137, -3.6921], category: "Arte" },
        { name: "Parque del Retiro", position: [40.4153, -3.6844], category: "Naturaleza" },
        { name: "Plaza Mayor", position: [40.4153, -3.7073], category: "Historia" },
        { name: "Gran Vía", position: [40.4199, -3.7022], category: "Ocio" },
        { name: "Templo de Debod", position: [40.4239, -3.7176], category: "Historia" },
        { name: "Casa Lucio", position: [40.4124, -3.7101], category: "Restaurante" },
        { name: "Sobrino de Botín", position: [40.4141, -3.7081], category: "Restaurante" }
    ];

    if (!L) return <div className={styles.loading}>Cargando mapa...</div>;

    return (
        <div className={styles.mapPage}>
            <div className="container">
                <h1 className={styles.title}>Mapa de <span className="text-gold">Madrid</span></h1>
                <p className={styles.subtitle}>Explora los lugares y descubre dónde están nuestros planes.</p>

                <div className={styles.mapWrapper}>
                    <MapContainer center={[40.4168, -3.7038]} zoom={14} style={{ height: '600px', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {pins.map((pin, index) => (
                            <Marker key={index} position={pin.position as [number, number]}>
                                <Popup>
                                    <div className={styles.popup}>
                                        <strong>{pin.name}</strong><br />
                                        <span>{pin.category}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default MapPage;
