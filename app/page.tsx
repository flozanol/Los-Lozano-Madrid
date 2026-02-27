'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Sparkles, Coffee, Sun, Moon, Calendar, Map as MapIcon, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Countdown from '@/components/Countdown';
import WeatherWidget from '@/components/WeatherWidget';
import styles from './page.module.css';

const HomePage = () => {
  const tripStartDate = "2026-03-26T00:00:00";
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [isTripActive, setIsTripActive] = useState(false);

  useEffect(() => {
    const checkTripStatus = () => {
      const start = new Date(tripStartDate);
      const now = new Date();
      setIsTripActive(now >= start);

      if (now >= start) {
        fetchTodayEvents();
      }
    };

    const fetchTodayEvents = async () => {
      const now = new Date();
      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
      const todayStr = `${now.getDate()} ${months[now.getMonth()]}`;

      const { data } = await supabase
        .from('itinerary')
        .select('*')
        .eq('date_str', todayStr);

      if (data) setTodayEvents(data);
    };

    checkTripStatus();
  }, []);

  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        {/* Institutional Mark */}
        <div className={styles.institutionalBadge}>
          <Image
            src="/madrid-city-logo-v2.jpg"
            alt="Ayuntamiento de Madrid"
            width={200}
            height={100}
            className={styles.cityLogo}
            priority
          />
        </div>

        <div className={styles.logoWrapper}>
          <Image
            src="/logo.png"
            alt="Los Lozano Madrid 2026"
            width={350}
            height={175}
            className={styles.logoImage}
            priority
          />
        </div>

        <h1 className={styles.title}>
          LOS LOZANO <br />
          <span className="text-madrid-gradient">EN MADRID</span>
        </h1>

        <div className={styles.sloganContainer}>
          <span className={styles.sloganText}>EXPERIENCIA MODERNA</span>
        </div>

        <div className={styles.dashboardGrid}>
          {/* TODAY SECTION / COUNTDOWN */}
          <div className={`${styles.todayCard} glass`}>
            <div className={styles.cardTag}>
              {isTripActive ? 'Sucediendo Ahora' : 'Cuenta Regresiva'}
            </div>

            {isTripActive ? (
              <div className={styles.todayInfo}>
                <h2>Hoy en Madrid</h2>
                <p>Descubre lo que tenemos planeado para este día.</p>
                <div className={styles.dayBlocks}>
                  <div className={styles.block}>
                    <div className={styles.blockLabel}><Coffee size={14} /> Mañana</div>
                    <div className={styles.blockContent}>
                      {todayEvents.find(e => e.time_block === 'Mañana')?.event_name || 'Libre / Desayuno'}
                    </div>
                  </div>
                  <div className={styles.block}>
                    <div className={styles.blockLabel}><Sun size={14} /> Tarde</div>
                    <div className={styles.blockContent}>
                      {todayEvents.find(e => e.time_block === 'Tarde')?.event_name || 'Exploración Libre'}
                    </div>
                  </div>
                  <div className={styles.block}>
                    <div className={styles.blockLabel}><Moon size={14} /> Noche</div>
                    <div className={styles.blockContent}>
                      {todayEvents.find(e => e.time_block === 'Noche')?.event_name || 'Cena Familiar'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.todayInfo}>
                <h2>Falta muy poco</h2>
                <Countdown targetDate={tripStartDate} />
              </div>
            )}
          </div>

          {/* QUICK STATS */}
          <div className={`${styles.smallCard} glass`}>
            <WeatherWidget />
          </div>

          <div className={`${styles.smallCard} glass`}>
            <p className={styles.dates}>
              <MapPin size={18} className="text-madrid-red" />
              26 MAR — 06 ABR
            </p>
            <div className="flex gap-2">
              <Link href="/calendar" className="btn-primary">
                <Calendar size={18} />
                Plan
              </Link>
              <Link href="/map" className="btn-secondary-outline">
                <MapIcon size={18} />
                Mapa
              </Link>
            </div>
          </div>
        </div>

        {/* Emergency Quick Access */}
        <Link href="/safety" className="btn-secondary-outline mt-10" style={{ border: '1px solid rgba(232, 30, 43, 0.3)', color: 'var(--madrid-red)' }}>
          <Shield size={18} />
          Acceso de Seguridad
        </Link>
      </div>

      <div className={styles.heroPattern}></div>
    </div>
  );
};

export default HomePage;
