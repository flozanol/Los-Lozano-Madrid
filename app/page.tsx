'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Coffee, Sun, Moon, Map as MapIcon, Shield, ChevronRight, Sparkles, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Countdown from '@/components/Countdown';
import WeatherWidget from '@/components/WeatherWidget';
import TodayOperationalMode from '@/components/TodayOperationalMode';
import NeighborhoodRadar from '@/components/NeighborhoodRadar';
import styles from './page.module.css';

// Unified types for dashboard display
type Spot = {
  id: string;
  nombre: string;
  tipo: string | null;
  historia: string;
  mapa: string | null;
};

type ItineraryItem = {
  id: string;
  date_str: string;
  event_name: string;
  event_time: string;
  time_block?: string;
  participants: string;
};

const HomePage = () => {
  const tripStartDate = "2026-03-26T00:00:00";
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [isTripActive, setIsTripActive] = useState(false);

  // Supabase-sourced data states
  const [spots, setSpots] = useState<Spot[]>([]);
  const [secretSpots, setSecretSpots] = useState<Spot[]>([]);
  const [upcomingItinerary, setUpcomingItinerary] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);

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
      const { data } = await supabase
        .from('itinerary')
        .select('*')
        .eq('date_str', getTodayStr());

      if (data) setTodayEvents(data);
    };

    const getTodayStr = () => {
      const now = new Date();
      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
      return `${now.getDate()} ${months[now.getMonth()]}`;
    };

    const fetchDataFromSupabase = async () => {
      try {
        const [placesRes, secretsRes, itRes] = await Promise.all([
          supabase.from('places_to_visit').select('*').limit(5),
          supabase.from('secret_places').select('*').limit(3).order('created_at', { ascending: false }),
          supabase.from('itinerary').select('*').limit(10).order('created_at', { ascending: false })
        ]);

        if (placesRes.data) {
          setSpots(placesRes.data.map((s: any) => ({
            id: s.id,
            nombre: s.name,
            tipo: s.category,
            historia: s.description,
            mapa: s.latitude && s.longitude ? `https://www.google.com/maps?q=${s.latitude},${s.longitude}` : null,
          })));
        }

        if (secretsRes.data) {
          setSecretSpots(secretsRes.data.map((s: any) => ({
            id: s.id,
            nombre: s.name,
            tipo: s.category,
            historia: s.description,
            mapa: s.latitude && s.longitude ? `https://www.google.com/maps?q=${s.latitude},${s.longitude}` : null,
          })));
        }

        if (itRes.data) {
          setUpcomingItinerary(itRes.data);
        }

      } catch (e) {
        console.error("Error fetching data from Supabase", e);
      } finally {
        setLoading(false);
      }
    };

    checkTripStatus();
    fetchDataFromSupabase();
  }, []);

  return (
    <div className={styles.hero}>
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.heroContent}>
        <div className={styles.logoWrapper}>
          <Image
            src="/logo-lozano-madrid-2026.png"
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
          {/* TODAY OPERATIONAL MODE - PRIMARY FOCUS */}
          <div className="md:col-span-2">
            <TodayOperationalMode />
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

        {/* NEIGHBORHOOD RADAR */}
        <div style={{ marginTop: 40 }}>
          <NeighborhoodRadar />
        </div>

        {/* COUNTDOWN / PLANNER STATUS */}
        <div style={{ marginTop: 40 }}>
          <div className={`${styles.todayCard} glass`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTag}>
                {isTripActive ? 'Próximos Pasos' : 'Cuenta Regresiva'}
              </span>
              {!isTripActive && <span className={styles.dateLabel}>26 MAR — 06 ABR</span>}
            </div>

            <div className={styles.todayInfo}>
              {!isTripActive ? (
                <Countdown targetDate={tripStartDate} />
              ) : (
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
              )}
            </div>
            <Link href="/calendar" className={styles.fullItineryBtn}>
              Ver Itinerario Completo <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* NOTION CONTENT SECTION (NOW SUPABASE) */}
        <div style={{ marginTop: 40, display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))" }}>

          {/* ITINERARIO */}
          <section className="glass" style={{ padding: 24 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>📅 Próximos Planes</h2>
            <p style={{ marginTop: 8, color: "#6b7280", fontSize: 14 }}>
              Lo que viene en la agenda familiar.
            </p>

            {loading ? (
              <div style={{ marginTop: 20, color: "#6b7280" }}>Cargando planes...</div>
            ) : upcomingItinerary.length === 0 ? (
              <div style={{ marginTop: 20, color: "#6b7280" }}>Aún no hay planes. ¡Añade uno en el calendario!</div>
            ) : (
              <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
                {upcomingItinerary.slice(0, 4).map((item) => (
                  <div key={item.id} style={{ border: "1px solid rgba(0,0,0,0.05)", borderRadius: 16, padding: 16, background: "rgba(255,255,255,0.5)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 900, fontSize: 13, color: "var(--madrid-red)" }}>{item.date_str}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.6 }}>{item.event_time}</div>
                    </div>
                    <div style={{ fontWeight: 800, marginTop: 4, fontSize: 16 }}>{item.event_name}</div>
                    <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>👥 {item.participants}</div>
                  </div>
                ))}
                <Link href="/calendar" style={{ marginTop: 10, fontSize: 14, fontWeight: 600, color: "var(--madrid-red)" }}>Ir al calendario completo →</Link>
              </div>
            )}
          </section>

          <div style={{ display: "grid", gap: 24 }}>
            {/* LUGARES */}
            <section className="glass" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>📍 Imperdibles</h2>
                <Link href="/places" style={{ fontSize: 12, color: "var(--madrid-red)", fontWeight: 700 }}>VER TODOS</Link>
              </div>
              <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
                {spots.length === 0 ? (
                  <div style={{ color: "#6b7280", fontSize: 14 }}>Aún no hay lugares recomendados.</div>
                ) : (
                  spots.map(s => (
                    <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{s.nombre}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{s.tipo}</div>
                      </div>
                      {s.mapa && <a href={s.mapa} target="_blank" className="p-2 hover:bg-red-50 rounded-full transition-colors"><MapPin size={18} className="text-madrid-red" /></a>}
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* LUGARES SECRETOS */}
            <section className="glass" style={{ padding: 24, background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(255,255,255,0.7) 100%)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#92400e" }}>🕵️‍♂️ Secretos</h2>
                <Link href="/secret-places" style={{ fontSize: 12, color: "#d97706", fontWeight: 700 }}>EXPLORAR</Link>
              </div>
              <p style={{ marginTop: 4, color: "#b45309", fontSize: 13, fontWeight: 500 }}>Madrid fuera de lo común.</p>
              <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
                {secretSpots.length === 0 ? (
                  <div style={{ color: "#6b7280", fontSize: 14 }}>Aún no hay secretos revelados...</div>
                ) : (
                  secretSpots.map(s => (
                    <div key={s.id} style={{ padding: 16, borderRadius: 16, border: "1px solid rgba(245,158,11,0.15)", background: "white", boxShadow: "0 4px 12px rgba(217,119,6,0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div style={{ fontWeight: 800, color: "#92400e", fontSize: 15 }}>{s.nombre}</div>
                        <Sparkles size={14} className="text-amber-500" />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#d97706", marginTop: 4 }}>{s.tipo}</div>
                      {s.historia && <div style={{ marginTop: 8, fontSize: 13, color: "#4b5563", lineHeight: 1.4 }}>{s.historia}</div>}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

        </div>

        <footer style={{ marginTop: 40, textAlign: "center", color: "#6b7280", fontSize: 14 }}>
          Los Lozano en Madrid 2026 • Gestionado en Familia
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
