'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import styles from './page.module.css';

// Dynamic import for the Map component to avoid SSR issues
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
    ssr: false,
    loading: () => (
        <div className={styles.loading}>
            <Loader2 className="animate-spin text-gold" size={40} />
            <p>Cargando mapa interactivo...</p>
        </div>
    )
});

const MapPage = () => {
    const [pins, setPins] = useState<any[]>([]);
    const [places, setPlaces] = useState<any[]>([]);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch custom pins
            const { data: pinsData } = await supabase.from('pins').select('*');
            // Fetch places to visit (only those with coordinates)
            const { data: placesData } = await supabase.from('places_to_visit').select('*').not('latitude', 'is', null);
            // Fetch restaurants (only those with coordinates)
            const { data: restData } = await supabase.from('restaurants').select('*').not('latitude', 'is', null);

            setPins(pinsData || []);
            setPlaces(placesData || []);
            setRestaurants(restData || []);
        } catch (error) {
            console.error('Error fetching map data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    return (
        <div className={styles.mapPage}>
            <div className="container">
                <header className={styles.header}>
                    <h1 className={styles.title}>Mapa de <span className="text-gold">Experiencias</span></h1>
                    <p className={styles.subtitle}>
                        Toca cualquier punto del mapa para guardar un lugar.
                        Comparte restaurantes, monumentos y rincones favoritos con todos.
                    </p>
                </header>

                <div className={styles.mapWrapper}>
                    <InteractiveMap
                        pins={pins}
                        places={places}
                        restaurants={restaurants}
                        onDataUpdate={fetchAllData}
                    />
                </div>
            </div>
        </div>
    );
};

export default MapPage;
