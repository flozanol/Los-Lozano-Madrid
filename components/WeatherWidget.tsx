'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Wind, CloudLightning } from 'lucide-react';
import styles from './WeatherWidget.module.css';

const MADRID_LAT = 40.4168;
const MADRID_LON = -3.7038;

export default function WeatherWidget() {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${MADRID_LAT}&longitude=${MADRID_LON}&current_weather=true&timezone=Europe%2FMadrid`
                );
                const data = await response.json();
                setWeather(data.current_weather);
            } catch (error) {
                console.error('Error fetching weather:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        // Update every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getWeatherIcon = (code: number) => {
        if (code === 0) return <Sun className={styles.sun} size={32} />;
        if (code <= 3) return <Cloud className={styles.cloud} size={32} />;
        if (code <= 67) return <CloudRain className={styles.rain} size={32} />;
        if (code <= 99) return <CloudLightning className={styles.storm} size={32} />;
        return <Cloud size={32} />;
    };

    if (loading) {
        return (
            <div className={`${styles.widget} glass`}>
                <div className={styles.loading}>Cargando clima...</div>
            </div>
        );
    }

    if (!weather) return null;

    return (
        <div className={`${styles.widget} glass`}>
            <div className={styles.mainInfo}>
                <div className={styles.iconWrapper}>
                    {getWeatherIcon(weather.weathercode)}
                </div>
                <div className={styles.tempWrapper}>
                    <span className={styles.temp}>{Math.round(weather.temperature)}°</span>
                    <span className={styles.city}>Madrid, ES</span>
                </div>
            </div>

            <div className={styles.details}>
                <div className={styles.detailItem}>
                    <Wind size={14} />
                    <span>{weather.windspeed} km/h</span>
                </div>
                <div className={styles.detailItem}>
                    <Thermometer size={14} />
                    <span>Actual</span>
                </div>
            </div>
        </div>
    );
}
