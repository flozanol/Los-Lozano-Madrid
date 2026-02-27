'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Sparkles, Coffee, Sun, Moon, Calendar, Map as MapIcon, Shield, ChevronRight } from 'lucide-react';
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
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.heroContent}>
        <div className={styles.logoWrapper}>
          <Image
            src="/logo.png"
            alt="Los Lozano Madrid 2026"
            width={300}
            height={150}
            className={styles.logoImage}
            priority
          />
        </div>

        <h1 className={styles.title}>
          LOS LOZANO <br />
          <span className="text-madrid-gradient">EN MADRID</span>
        </h1>

        <div className={styles.dashboardGrid}>
          {/* TODAY SECTION / COUNTDOWN */}
          <div className={`${styles.todayCard} glass`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTag}>
                {isTripActive ? 'Sucediedo Hoy' : 'Cuenta Regresiva'}
              </span>
              {!isTripActive && <span className={styles.dateLabel}>26 MAR — 06 ABR</span>}
            </div>

            {isTripActive ? (
              <div className={styles.todayInfo}>
                <h2>Agenda de Hoy</h2>
                <div className={styles.dayBlocks}>
                  <div className={styles.block}>
                    <div className={styles.blockLabel}><Coffee size={14} /> Mañana</div>
                    <div className={styles.blockContent}>
                      {todayEvents.find(e => e.time_block === 'Mañana')?.event_name || 'Libre'}
                    </div>
                  </div>
                  <div className={styles.block}>
                    <div className={styles.blockLabel}><Sun size={14} /> Tarde</div>
                    <div className={styles.blockContent}>
                      {todayEvents.find(e => e.time_block === 'Tarde')?.event_name || 'Libre'}
                    </div>
                  </div>
                  <div className={styles.block}>
                    <div className={styles.blockLabel}><Moon size={14} /> Noche</div>
                    <div className={styles.blockContent}>
                      {todayEvents.find(e => e.time_block === 'Noche')?.event_name || 'Cena'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.todayInfo}>
                <Countdown targetDate={tripStartDate} />
              </div>
            )}
            <Link href="/calendar" className={styles.fullItineryBtn}>
              Ver Itinerario Completo <ChevronRight size={16} />
            </Link>
          </div>

          {/* SMART WIDGETS */}
          <div className={styles.sideWidgets}>
            <div className={`${styles.smallCard} glass`}>
              <WeatherWidget />
            </div>
            <Link href="/map" className={`${styles.smallCard} glass ${styles.mapCard}`}>
              <MapIcon size={24} className={styles.iconRed} />
              <span>Ver Mapa de Experiencias</span>
            </Link>
            <Link href="/safety" className={`${styles.smallCard} glass ${styles.safetyCard}`}>
              <Shield size={24} className={styles.iconRed} />
              <span>Centro de Seguridad</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
