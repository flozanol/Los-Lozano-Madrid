'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Coffee, Sun, Moon, Map as MapIcon, Shield, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Countdown from '@/components/Countdown';
import WeatherWidget from '@/components/WeatherWidget';
import styles from './page.module.css';

// Types for Notion-sourced data
type Spot = {
  id: string;
  nombre: string;
  tipo: string | null;
  caminar: string | null;
  aptoAbuela: boolean;
  paraNinos: boolean;
  historia: string;
  mapa: string | null;
  votos: number | null;
  fechaIdeal: string | null;
};

type ItItem = {
  id: string;
  dia: string | null;
  hora: string;
  lugarIds: string[];
  plan: string | null;
  grupo: string | null;
  notas: string;
};

// Formatting helpers
function formatDia(iso: string | null) {
  if (!iso) return "Sin fecha";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function groupByDay(itinerary: ItItem[]) {
  const map = new Map<string, ItItem[]>();
  for (const it of itinerary) {
    const key = it.dia ?? "Sin fecha";
    map.set(key, [...(map.get(key) ?? []), it]);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 12,
        padding: "4px 10px",
        borderRadius: 999,
        background: "#f3f4f6",
        border: "1px solid #e5e7eb",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 16,
  background: "#ffffff",
  boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
};

const subtle: React.CSSProperties = { color: "#6b7280" };

const HomePage = () => {
  const tripStartDate = "2026-03-26T00:00:00";
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [isTripActive, setIsTripActive] = useState(false);

  // Notion data states
  const [spots, setSpots] = useState<Spot[]>([]);
  const [secretSpots, setSecretSpots] = useState<Spot[]>([]);
  const [itinerary, setItinerary] = useState<ItItem[]>([]);
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

    const fetchNotionData = async () => {
      try {
        const [sRes, secRes, iRes] = await Promise.all([
          fetch("/api/spots").then(r => r.json()),
          fetch("/api/secret-spots").then(r => r.json()),
          fetch("/api/itinerary").then(r => r.json())
        ]);
        setSpots(sRes.items || []);
        setSecretSpots(secRes.items || []);
        setItinerary(iRes.items || []);
      } catch (e) {
        console.error("Error fetching Notion data", e);
      } finally {
        setLoading(false);
      }
    };

    checkTripStatus();
    fetchNotionData();
  }, []);

  const spotById = new Map([...spots, ...secretSpots].map((s) => [s.id, s]));
  const days = groupByDay(itinerary);

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

        {/* NOTION CONTENT SECTION */}
        <div style={{ marginTop: 40, display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))" }}>

          {/* ITINERARIO */}
          <section className="glass" style={{ padding: 24 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>📅 Itinerario (Notion)</h2>
            <p style={{ marginTop: 8, ...subtle, fontSize: 14 }}>
              Basado en Notion. Sincronización automática.
            </p>

            {loading ? (
              <div style={{ marginTop: 20, ...subtle }}>Cargando itinerario...</div>
            ) : itinerary.length === 0 ? (
              <div style={{ marginTop: 20, ...subtle }}>No hay planes cargados en Notion.</div>
            ) : (
              <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
                {days.map(([dia, items]) => (
                  <div key={dia} style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 16 }}>
                    <div style={{ fontWeight: 900, textTransform: "capitalize", fontSize: 18 }}>{formatDia(dia === "Sin fecha" ? null : dia)}</div>
                    <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                      {items.map((it) => {
                        const lugares = it.lugarIds.map((id) => spotById.get(id)).filter(Boolean) as Spot[];
                        return (
                          <div key={it.id} style={{ border: "1px solid rgba(0,0,0,0.05)", borderRadius: 16, padding: 16, background: "rgba(255,255,255,0.5)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                              <div style={{ fontWeight: 800 }}>{it.hora ? `⏰ ${it.hora}` : "⏰ (por definir)"}</div>
                              <div style={{ display: "flex", gap: 8 }}>
                                {it.grupo && <Tag>👨‍👩‍👧‍👦 {it.grupo}</Tag>}
                                {it.plan && <Tag>🗓️ {it.plan}</Tag>}
                              </div>
                            </div>
                            <div style={{ marginTop: 10 }}>
                              <b>Lugar:</b>{" "}
                              {lugares.length ? (
                                <span>
                                  {lugares.map((s, idx) => (
                                    <span key={s.id}>
                                      {idx ? ", " : ""}
                                      <span style={{ fontWeight: 700 }}>{s.nombre}</span>
                                      {s.tipo && <span style={subtle}> ({s.tipo})</span>}
                                    </span>
                                  ))}
                                </span>
                              ) : <span style={subtle}>—</span>}
                            </div>
                            {it.notas && <div style={{ marginTop: 10, fontSize: 13, ...subtle }}><b>Notas:</b> {it.notas}</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div style={{ display: "grid", gap: 24 }}>
            {/* LUGARES */}
            <section className="glass" style={{ padding: 24 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>📍 Lugares</h2>
              <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
                {spots.length === 0 ? <div style={subtle}>No hay lugares cargados.</div> : (
                  spots.slice(0, 5).map(s => (
                    <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{s.nombre}</div>
                        <div style={{ fontSize: 12, ...subtle }}>{s.tipo}</div>
                      </div>
                      {s.mapa && <a href={s.mapa} target="_blank" style={{ fontSize: 12, color: "var(--madrid-red)" }}>Mapa →</a>}
                    </div>
                  ))
                )}
                <Link href="/map" style={{ marginTop: 10, fontSize: 14, fontWeight: 600, color: "var(--madrid-red)" }}>Ver todos los lugares →</Link>
              </div>
            </section>

            {/* LUGARES SECRETOS */}
            <section className="glass" style={{ padding: 24, background: "linear-gradient(135deg, rgba(232,30,43,0.05) 0%, rgba(255,255,255,0.7) 100%)" }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>🕵️‍♂️ Lugares Secretos</h2>
              <p style={{ marginTop: 4, ...subtle, fontSize: 13 }}>Gemas ocultas de Madrid.</p>
              <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
                {secretSpots.length === 0 ? <div style={subtle}>Aún no hay secretos...</div> : (
                  secretSpots.map(s => (
                    <div key={s.id} style={{ padding: 16, borderRadius: 16, border: "1px solid rgba(232,30,43,0.1)", background: "white" }}>
                      <div style={{ fontWeight: 800, color: "var(--madrid-red)" }}>{s.nombre}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#b45309", marginTop: 4 }}>{s.tipo}</div>
                      {s.historia && <div style={{ marginTop: 8, fontSize: 13, color: "#4b5563" }}>{s.historia}</div>}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

        </div>

        <footer style={{ marginTop: 40, textAlign: "center", ...subtle, fontSize: 14 }}>
          Actualizado desde Notion • Los Lozano en Madrid 2026
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
