'use client';

import { useState, useEffect } from 'react';
import { Phone, MapPin, ShieldCheck, HeartPulse, Building2, Plus, Trash2, Loader2, ExternalLink } from 'lucide-react';
import styles from './page.module.css';
import FamilyLock from '@/components/FamilyLock';
import { supabase } from '@/lib/supabase';

interface EmergencyContact {
    id: string;
    name: string;
    number: string;
    color: string;
}

interface Accommodation {
    id: string;
    name: string;
    address: string;
    phone: string;
    map_link: string;
}

export default function SafetyPage() {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [hotels, setHotels] = useState<Accommodation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [showManage, setShowManage] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', number: '', color: '#E81E2B' });
    const [newHotel, setNewHotel] = useState({ name: '', address: '', phone: '', map_link: '' });

    useEffect(() => {
        fetchSafetyData();
    }, []);

    const fetchSafetyData = async () => {
        setIsLoading(true);

        const { data: contactsData } = await supabase
            .from('emergency_contacts')
            .select('*')
            .order('created_at', { ascending: true });

        const { data: hotelsData } = await supabase
            .from('family_accommodations')
            .select('*')
            .order('created_at', { ascending: true });

        if (contactsData) setContacts(contactsData);
        if (hotelsData) setHotels(hotelsData);

        setIsLoading(false);
    };

    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const { error } = await supabase.from('emergency_contacts').insert([newContact]);
        if (!error) {
            setNewContact({ name: '', number: '', color: '#E81E2B' });
            fetchSafetyData();
        }
        setIsSaving(false);
    };

    const handleAddHotel = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const { error } = await supabase.from('family_accommodations').insert([newHotel]);
        if (!error) {
            setNewHotel({ name: '', address: '', phone: '', map_link: '' });
            fetchSafetyData();
        }
        setIsSaving(false);
    };

    const handleDelete = async (table: string, id: string) => {
        if (confirm('¿Eliminar este registro permanentemente?')) {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (!error) fetchSafetyData();
        }
    };

    return (
        <>
            <div className="section-bg" style={{ backgroundImage: 'url(/madrid_night.png)' }}></div>
            <div className={`content-wrapper ${styles.safetyPage}`}>
                <div className="container">
                    <header className={styles.header}>
                        <h1 className="text-madrid-gradient">Botón de <span className="text-madrid-red">Pánico</span></h1>
                        <p>Información crítica de seguridad y emergencia para toda la familia.</p>
                    </header>

                    {isLoading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin mx-auto text-madrid-red" size={40} />
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {/* Public Section */}
                            <div className={`${styles.card} glass`}>
                                <div className={styles.cardHeader}>
                                    <Phone className={styles.headerIcon} />
                                    <h2>Emergencias</h2>
                                </div>
                                <div className={styles.numbersGrid}>
                                    {contacts.map((item) => (
                                        <a key={item.id} href={`tel:${item.number}`} className={styles.numberItem}>
                                            <div className={styles.itemIcon} style={{ backgroundColor: item.color }}>
                                                <HeartPulse size={24} />
                                            </div>
                                            <div className={styles.itemInfo}>
                                                <h3>{item.number}</h3>
                                                <span>{item.name}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Protected Section */}
                            <FamilyLock>
                                <div className={styles.protectedSection}>
                                    <div className={`${styles.card} glass`}>
                                        <div className={styles.cardHeader}>
                                            <Building2 className={styles.headerIcon} />
                                            <h2>Alojamientos</h2>
                                        </div>
                                        <div className={styles.hotelsList}>
                                            {hotels.map((hotel) => (
                                                <div key={hotel.id} className={styles.hotelItem}>
                                                    <h3>{hotel.name}</h3>
                                                    <p className={styles.address}>
                                                        <MapPin size={16} />
                                                        {hotel.address}
                                                    </p>
                                                    <div className={styles.hotelActions}>
                                                        {hotel.phone && (
                                                            <a href={`tel:${hotel.phone}`} className="btn-primary">
                                                                <Phone size={18} /> Llamar
                                                            </a>
                                                        )}
                                                        {hotel.map_link && (
                                                            <a href={hotel.map_link} target="_blank" rel="noopener noreferrer" className="btn-secondary-outline">
                                                                <ExternalLink size={18} /> Ver Mapa
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Management UI inside Lock */}
                                    <button
                                        className={`${styles.manageBtn} btn-secondary-outline`}
                                        onClick={() => setShowManage(!showManage)}
                                    >
                                        {showManage ? 'Cerrar Edición' : 'Editar Contactos y Hoteles'}
                                    </button>

                                    {showManage && (
                                        <div className={styles.manageContainer}>
                                            <div className={`${styles.card} glass`}>
                                                <h3>Gestionar Emergencias</h3>
                                                <form onSubmit={handleAddContact} className={styles.form}>
                                                    <input
                                                        placeholder="Nombre (ej: Policía)"
                                                        value={newContact.name}
                                                        onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                                                        required
                                                    />
                                                    <input
                                                        placeholder="Número"
                                                        value={newContact.number}
                                                        onChange={e => setNewContact({ ...newContact, number: e.target.value })}
                                                        required
                                                    />
                                                    <button type="submit" className="btn-primary" disabled={isSaving}>
                                                        {isSaving ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
                                                    </button>
                                                </form>
                                                <div className={styles.miniList}>
                                                    {contacts.map(c => (
                                                        <div key={c.id} className={styles.miniItem}>
                                                            <span>{c.name}: {c.number}</span>
                                                            <button onClick={() => handleDelete('emergency_contacts', c.id)}><Trash2 size={16} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={`${styles.card} glass`}>
                                                <h3>Gestionar Hoteles</h3>
                                                <form onSubmit={handleAddHotel} className={styles.formVertical}>
                                                    <input
                                                        placeholder="Nombre del Hotel"
                                                        value={newHotel.name}
                                                        onChange={e => setNewHotel({ ...newHotel, name: e.target.value })}
                                                        required
                                                    />
                                                    <input
                                                        placeholder="Dirección Completa"
                                                        value={newHotel.address}
                                                        onChange={e => setNewHotel({ ...newHotel, address: e.target.value })}
                                                        required
                                                    />
                                                    <input
                                                        placeholder="Teléfono"
                                                        value={newHotel.phone}
                                                        onChange={e => setNewHotel({ ...newHotel, phone: e.target.value })}
                                                    />
                                                    <input
                                                        placeholder="Link Google Maps"
                                                        value={newHotel.map_link}
                                                        onChange={e => setNewHotel({ ...newHotel, map_link: e.target.value })}
                                                    />
                                                    <button type="submit" className="btn-primary" disabled={isSaving}>
                                                        {isSaving ? <Loader2 className="animate-spin" /> : 'Añadir Hotel'}
                                                    </button>
                                                </form>
                                                <div className={styles.miniList}>
                                                    {hotels.map(h => (
                                                        <div key={h.id} className={styles.miniItem}>
                                                            <span>{h.name}</span>
                                                            <button onClick={() => handleDelete('family_accommodations', h.id)}><Trash2 size={16} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </FamilyLock>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
