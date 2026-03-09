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
    <>
      <div
        className="section-bg"
        style={{ backgroundImage: 'url(/madrid_hero_bg.png)', backgroundPosition: 'center' }}
      ></div>
      <div className={`content-wrapper ${styles.hero}`}>
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
            <span className="text-madrid-gradient font-black text-[1.2em]">EN MADRID</span>
          </h1>

          <div className={styles.dashboardGrid}>
            {/* TODAY OPERATIONAL MODE - PRIMARY FOCUS */}
            <div className="md:col-span-2 space-y-8">
              <TodayOperationalMode />
              <NeighborhoodRadar />
            </div>

            {/* SMART WIDGETS */}
            <div className={styles.sideWidgets}>
              <div className="glass-premium p-6">
                <WeatherWidget />
              </div>

              <Link href="/map" className="glass p-6 flex items-center gap-4 group no-underline">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-madrid-red/20 transition-colors">
                  <MapIcon size={24} className="text-madrid-red" />
                </div>
                <span className="font-bold text-white">Mapa de Experiencias</span>
              </Link>

              <Link href="/safety" className="glass p-6 flex items-center gap-4 group no-underline">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-madrid-red/20 transition-colors">
                  <Shield size={24} className="text-madrid-red" />
                </div>
                <span className="font-bold text-white">Centro de Seguridad</span>
              </Link>

              {/* COUNTDOWN / PLANNER STATUS */}
              <div className="glass-premium p-6 mt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="px-3 py-1 bg-madrid-red text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    {isTripActive ? 'Próximos Pasos' : 'Cuenta Regresiva'}
                  </span>
                  {!isTripActive && <span className="text-xs font-bold text-white/50 uppercase">26 MAR — 06 ABR</span>}
                </div>

                <div className="mb-6">
                  {!isTripActive ? (
                    <Countdown targetDate={tripStartDate} />
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="p-2 bg-white/5 rounded-lg text-madrid-red"><Coffee size={16} /></div>
                        <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Mañana</p>
                          <p className="font-bold text-sm text-white">{todayEvents.find(e => e.time_block === 'Mañana')?.event_name || 'Libre'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="p-2 bg-white/5 rounded-lg text-madrid-red"><Sun size={16} /></div>
                        <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tarde</p>
                          <p className="font-bold text-sm text-white">{todayEvents.find(e => e.time_block === 'Tarde')?.event_name || 'Libre'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Link href="/calendar" className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all no-underline border border-white/10">
                  Ver Itinerario <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* FEED SECTION */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">

            {/* ITINERARIO */}
            <section className="glass-premium p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/5 rounded-2xl">
                  <CalendarIcon size={24} className="text-madrid-red" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">PRÓXIMOS PLANES</h2>
                  <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Agenda Familiar</p>
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center opacity-50">Cargando planes...</div>
              ) : upcomingItinerary.length === 0 ? (
                <div className="py-12 text-center opacity-50">Aún no hay planes.</div>
              ) : (
                <div className="space-y-4">
                  {upcomingItinerary.slice(0, 4).map((item) => (
                    <div key={item.id} className="p-5 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 transition-all group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="px-2 py-1 bg-madrid-red/20 text-madrid-red text-[10px] font-black uppercase tracking-widest rounded-lg">{item.date_str}</span>
                        <span className="text-[10px] font-bold text-white/40 uppercase">{item.event_time}</span>
                      </div>
                      <h3 className="text-lg font-black text-white group-hover:text-madrid-red transition-colors">{item.event_name}</h3>
                      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-white/60">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">👥</div>
                        {item.participants}
                      </div>
                    </div>
                  ))}
                  <Link href="/calendar" className="inline-flex items-center gap-2 mt-4 text-xs font-black uppercase tracking-widest text-madrid-red hover:gap-4 transition-all no-underline">
                    Ir al calendario completo <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </section>

            <div className="space-y-8">
              {/* LUGARES IMPERDIBLES */}
              <section className="glass p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-madrid-red/10 rounded-xl">
                      <MapPin size={20} className="text-madrid-red" />
                    </div>
                    <h2 className="text-xl font-black text-white">IMPERDIBLES</h2>
                  </div>
                  <Link href="/places" className="text-[10px] font-black text-madrid-red uppercase tracking-widest hover:opacity-70">Ver Todos</Link>
                </div>

                <div className="divide-y divide-white/5">
                  {spots.length === 0 ? (
                    <div className="py-8 text-center opacity-50">Cargando lugares...</div>
                  ) : (
                    spots.map(s => (
                      <div key={s.id} className="py-4 flex justify-between items-center group">
                        <div>
                          <h4 className="font-bold text-white group-hover:text-madrid-red transition-colors">{s.nombre}</h4>
                          <p className="text-xs font-bold text-white/40 uppercase tracking-tighter">{s.tipo}</p>
                        </div>
                        {s.mapa && (
                          <a href={s.mapa} target="_blank" className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-madrid-red hover:bg-madrid-red/10 transition-all">
                            <MapPin size={18} />
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* SECCIÓN SECRETOS - GOLD THEME */}
              <section className="glass-premium p-8 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Sparkles size={120} className="text-amber-500" />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/20 rounded-xl">
                        <Sparkles size={20} className="text-amber-500" />
                      </div>
                      <h2 className="text-xl font-black text-amber-500">SECRETOS</h2>
                    </div>
                    <Link href="/secret-places" className="text-[10px] font-black text-amber-500 uppercase tracking-widest hover:opacity-70">Explorar</Link>
                  </div>

                  <p className="text-sm font-bold text-amber-500/60 uppercase tracking-widest mb-6">Madrid fuera de lo común</p>

                  <div className="space-y-4">
                    {secretSpots.length === 0 ? (
                      <p className="text-center py-4 opacity-50">Shhh... pronto más secretos.</p>
                    ) : (
                      secretSpots.map(s => (
                        <div key={s.id} className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm hover:bg-amber-500/10 transition-all cursor-default">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-black text-amber-600 uppercase tracking-tight">{s.nombre}</h4>
                            <span className="text-[10px] font-black bg-amber-500/20 px-2 py-0.5 rounded text-amber-600">{s.tipo}</span>
                          </div>
                          {s.historia && <p className="text-sm font-medium text-white/70 leading-relaxed italic">"{s.historia}"</p>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <footer className="mt-20 py-12 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
              Los Lozano en Madrid 2026 • Gestionado en Familia
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default HomePage;
