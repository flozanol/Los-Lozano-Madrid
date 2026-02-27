'use client';

import { Phone, MapPin, ShieldCheck, HeartPulse, Building2 } from 'lucide-react';
import styles from './page.module.css';
import FamilyLock from '@/components/FamilyLock';

const EMERGENCY_NUMBERS = [
    { name: 'Emergencias General', number: '112', icon: HeartPulse, color: '#ef4444' },
    { name: 'Policía Nacional', number: '091', icon: ShieldCheck, color: '#004599' },
    { name: 'Urgencias Médicas (SAMUR)', number: '092', icon: HeartPulse, color: '#f59e0b' },
];

const HOTELS = [
    {
        name: 'Alojamiento Principal - Madrid Centro',
        address: 'Calle Mayor, 1, 28013 Madrid (Cerca de Puerta del Sol)',
        phone: '+34 912 345 678',
        link: 'https://www.google.com/maps/search/?api=1&query=Calle+Mayor+1+Madrid'
    }
];

export default function SafetyPage() {
    return (
        <>
            <div className="section-bg" style={{ backgroundImage: 'url(/madrid_night.png)' }}></div>
            <div className={`content-wrapper ${styles.safetyPage}`}>
                <div className="container">
                    <header className={styles.header}>
                        <h1 className="text-madrid-gradient">Botón de <span className="text-gold">Pánico</span></h1>
                        <p>Información crítica de seguridad y emergencia para toda la familia.</p>
                    </header>

                    <div className={styles.grid}>
                        {/* Public Section - Always Visible */}
                        <div className={`${styles.card} glass`}>
                            <div className={styles.cardHeader}>
                                <Phone className={styles.headerIcon} />
                                <h2>Números de Emergencia</h2>
                            </div>
                            <div className={styles.numbersGrid}>
                                {EMERGENCY_NUMBERS.map((item) => (
                                    <a key={item.name} href={`tel:${item.number}`} className={styles.numberItem}>
                                        <div className={styles.itemIcon} style={{ backgroundColor: item.color }}>
                                            <item.icon size={24} />
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h3>{item.number}</h3>
                                            <span>{item.name}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Protected Section - Requires Password */}
                        <FamilyLock>
                            <div className={`${styles.card} glass`}>
                                <div className={styles.cardHeader}>
                                    <Building2 className={styles.headerIcon} />
                                    <h2>Detalles del Alojamiento</h2>
                                </div>
                                <div className={styles.hotelsList}>
                                    {HOTELS.map((hotel) => (
                                        <div key={hotel.name} className={styles.hotelItem}>
                                            <h3>{hotel.name}</h3>
                                            <p className={styles.address}>
                                                <MapPin size={16} />
                                                {hotel.address}
                                            </p>
                                            <div className={styles.hotelActions}>
                                                <a href={`tel:${hotel.phone}`} className="btn-primary-blue">
                                                    <Phone size={18} /> Llamar
                                                </a>
                                                <a href={hotel.link} target="_blank" rel="noopener noreferrer" className="btn-secondary-outline">
                                                    <MapPin size={18} /> Ver Mapa
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FamilyLock>
                    </div>
                </div>
            </div>
        </>
    );
}
