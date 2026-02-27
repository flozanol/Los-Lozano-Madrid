'use client';

import { MapPin, Navigation, Star, UtensilsCrossed, Beer } from 'lucide-react';
import styles from './page.module.css';
import Image from 'next/image';

const TAPAS_PLACES = [
    {
        name: 'Mercado de San Miguel',
        description: 'El templo del tapeo gourmet en Madrid. No te pierdas los ocurrentes de aceitunas y los quesos.',
        address: 'Plaza de San Miguel, s/n',
        rating: 4.8,
        tags: ['Gourmet', 'Variedad', 'Centro'],
        image: 'https://images.unsplash.com/photo-1534604973900-c41ab4c5e63a?auto=format&fit=crop&q=80&w=800',
        route: 'https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=Mercado+de+San+Miguel+Madrid'
    },
    {
        name: 'Casa Lucio',
        description: 'Famoso por sus "Huevos Estrellados". Un clásico de La Latina que todo Lozano debe probar.',
        address: 'Calle de la Cava Baja, 35',
        rating: 4.7,
        tags: ['Clásico', 'Huevos Estrellados', 'La Latina'],
        image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=800',
        route: 'https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=Casa+Lucio+Madrid'
    },
    {
        name: 'La Venencia',
        description: 'Un viaje en el tiempo. Solo sirven Jerez y tapas sencillas. ¡Ojo! No dejan hacer fotos.',
        address: 'Calle de Echegaray, 7',
        rating: 4.6,
        tags: ['Auténtico', 'Sin fotos', 'Barrio de las Letras'],
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800',
        route: 'https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=La+Venencia+Madrid'
    }
];

export default function TapasPage() {
    return (
        <>
            <div className="section-bg" style={{ backgroundImage: 'url(/madrid_tapas_bg.png)' }}></div>
            <div className={`content-wrapper ${styles.tapasPage}`}>
                <div className="container">
                    <header className={styles.header}>
                        <h1 className="text-madrid-gradient">Tapeo y <span className="text-gold">Cañas</span></h1>
                        <p>Madrid se disfruta bocado a bocado. Aquí los mejores sitios cerca de nosotros.</p>
                    </header>

                    <div className={styles.grid}>
                        {TAPAS_PLACES.map((place) => (
                            <div key={place.name} className={`${styles.card} glass`}>
                                <div className={styles.imageBox}>
                                    <Image src={place.image} alt={place.name} fill className={styles.image} />
                                    <div className={styles.overlay}>
                                        <div className={styles.tags}>
                                            {place.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.titleRow}>
                                        <h3>{place.name}</h3>
                                        <div className={styles.rating}>
                                            <Star size={14} fill="currentColor" />
                                            <span>{place.rating}</span>
                                        </div>
                                    </div>
                                    <p className={styles.description}>{place.description}</p>
                                    <div className={styles.footer}>
                                        <div className={styles.address}>
                                            <MapPin size={14} />
                                            <span>{place.address}</span>
                                        </div>
                                        <a href={place.route} target="_blank" rel="noopener noreferrer" className="btn-primary-blue">
                                            <Navigation size={18} /> Ruta a pie
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`${styles.infoCard} glass`}>
                        <div className={styles.infoIcon}>
                            <Beer size={32} />
                        </div>
                        <div className={styles.infoText}>
                            <h3>Tip Familiar: "Ir de cañas"</h3>
                            <p>En Madrid, si pides una caña, suele venir con una tapa gratis. ¡Aprovechad el Barrio de La Latina los domingos!</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
