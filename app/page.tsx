import { headers } from "next/headers";

export const dynamic = "force-dynamic";

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

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = process.env.VERCEL ? "https" : "http";
  return `${proto}://${host}`;
}

async function getJSON<T>(path: string): Promise<T> {
  const base = await getBaseUrl();
  const res = await fetch(`${base}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Error en ${path}`);
  return res.json();
}

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

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 16,
  background: "#ffffff",
  boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
};

const subtle: React.CSSProperties = { color: "#6b7280" };

export default async function Home() {
  const spotsRes = await getJSON<{ items: Spot[] }>("/api/spots").catch(() => ({ items: [] as Spot[] }));
  const secretRes = await getJSON<{ items: Spot[] }>("/api/secret-spots").catch(() => ({ items: [] as Spot[] }));
  const itinRes = await getJSON<{ items: ItItem[] }>("/api/itinerary").catch(() => ({ items: [] as ItItem[] }));

  const spots = spotsRes.items ?? [];
  const secretSpots = secretRes.items ?? [];
  const itinerary = itinRes.items ?? [];

  const spotById = new Map([...spots, ...secretSpots].map((s) => [s.id, s]));
  const days = groupByDay(itinerary);

  return (
    <main
      style={{
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
        background: "linear-gradient(180deg, #fff7ed 0%, #ffffff 45%)",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "28px 18px 40px" }}>
        <header style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 36, margin: 0, letterSpacing: -0.5 }}>Los Lozano en Madrid 🇪🇸</h1>
            <span style={{ ...subtle, fontSize: 14 }}>26 Mar → 6 Abr</span>
          </div>
          <p style={{ margin: "8px 0 0", ...subtle }}>
            Lo editan en Notion (toda la familia) y aquí se ve como “mini-sitio” para disfrutar el viaje desde hoy.
          </p>
        </header>

        {(spots.length === 0 || itinerary.length === 0) && (
          <div style={{ ...card, background: "#fffbeb", borderColor: "#fcd34d", marginBottom: 14 }}>
            <b>Ojo:</b>{" "}
            {spots.length === 0 && itinerary.length === 0
              ? "No pude cargar Spots ni Itinerario desde la página. Si tus /api sí funcionan, esto ya debería resolverse con este build."
              : spots.length === 0
                ? "No pude cargar Spots."
                : "No pude cargar Itinerario."}
            <div style={{ marginTop: 6, fontSize: 13, ...subtle }}>
              Tip: prueba también <code>/api/spots</code> y <code>/api/itinerary</code>.
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
          <section style={card}>
            <h2 style={{ margin: 0, fontSize: 18 }}>📅 Itinerario</h2>
            <p style={{ marginTop: 6, ...subtle, fontSize: 13 }}>
              Por día. Agrega “Lugar” (relación), “Hora”, “Grupo” y “Plan” en Notion.
            </p>

            {itinerary.length === 0 ? (
              <div style={{ marginTop: 12, ...subtle }}>Aún no hay planes (o no se cargaron).</div>
            ) : (
              <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
                {days.map(([dia, items]) => (
                  <div key={dia} style={{ borderTop: "1px solid #f3f4f6", paddingTop: 10 }}>
                    <div style={{ fontWeight: 900, textTransform: "capitalize" }}>{formatDia(dia === "Sin fecha" ? null : dia)}</div>

                    <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                      {items.map((it) => {
                        const lugares = it.lugarIds
                          .map((id) => spotById.get(id))
                          .filter(Boolean) as Spot[];

                        return (
                          <div
                            key={it.id}
                            style={{
                              border: "1px solid #f3f4f6",
                              borderRadius: 14,
                              padding: 12,
                              background: "#fafafa",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                              <div style={{ fontWeight: 800 }}>{it.hora ? `⏰ ${it.hora}` : "⏰ (hora por definir)"}</div>
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {it.grupo && <Tag>👨‍👩‍👧‍👦 {it.grupo}</Tag>}
                                {it.plan && <Tag>🗓️ {it.plan}</Tag>}
                              </div>
                            </div>

                            <div style={{ marginTop: 8 }}>
                              <b>Lugar:</b>{" "}
                              {lugares.length ? (
                                <span>
                                  {lugares.map((s, idx) => (
                                    <span key={s.id}>
                                      {idx ? ", " : ""}
                                      <span style={{ fontWeight: 700 }}>{s.nombre}</span>
                                      {s.tipo ? <span style={subtle}> ({s.tipo})</span> : null}
                                      {s.mapa ? (
                                        <span style={{ marginLeft: 8 }}>
                                          <a href={s.mapa} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
                                            Ver mapa →
                                          </a>
                                        </span>
                                      ) : null}
                                    </span>
                                  ))}
                                </span>
                              ) : (
                                <span style={subtle}>— (por decidir)</span>
                              )}
                            </div>

                            {lugares.length === 1 && lugares[0].historia ? (
                              <div style={{ marginTop: 8, fontSize: 13, ...subtle }}>
                                <b>Historia:</b> {lugares[0].historia}
                              </div>
                            ) : null}

                            {it.notas ? (
                              <div style={{ marginTop: 8, fontSize: 13, ...subtle }}>
                                <b>Notas:</b> {it.notas}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div style={{ display: "grid", gap: 16 }}>
            <section style={card}>
              <h2 style={{ margin: 0, fontSize: 18 }}>📍 Lugares y restaurantes</h2>
              <p style={{ marginTop: 6, ...subtle, fontSize: 13 }}>
                Historia, si es apto para abuela/niños, caminata y mapa.
              </p>

              {spots.length === 0 ? (
                <div style={{ marginTop: 12, ...subtle }}>Aún no hay lugares (o no se cargaron).</div>
              ) : (
                <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                  {spots.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        border: "1px solid #f3f4f6",
                        borderRadius: 16,
                        padding: 12,
                        background: "#fafafa",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <div style={{ fontWeight: 900 }}>{s.nombre}</div>
                        <div style={{ fontSize: 12, ...subtle }}>{s.tipo ?? "—"}</div>
                      </div>

                      {s.historia ? (
                        <div style={{ marginTop: 8, fontSize: 13, ...subtle }}>
                          <b>Historia:</b> {s.historia}
                        </div>
                      ) : (
                        <div style={{ marginTop: 8, fontSize: 13, ...subtle }}>
                          <b>Historia:</b> (pendiente) — escribe 2–3 líneas en Notion en “Historia Corta”.
                        </div>
                      )}

                      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        {s.aptoAbuela && <Tag>🧓 Apto abuela</Tag>}
                        {s.paraNinos && <Tag>👶 Niños</Tag>}
                        {s.caminar && <Tag>🚶 {s.caminar}</Tag>}
                        {s.votos != null && <Tag>⭐ {s.votos}</Tag>}
                        {s.mapa && (
                          <a href={s.mapa} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
                            Abrir en Maps →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section style={{ ...card, background: "linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)", borderColor: "#fef3c7" }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>🕵️‍♂️ Lugares Secretos</h2>
              <p style={{ marginTop: 6, ...subtle, fontSize: 13 }}>
                Gemas ocultas de Madrid: Naturaleza, Miradores, Historia, Bares, Cultura y Experiencias raras.
              </p>

              {secretSpots.length === 0 ? (
                <div style={{ marginTop: 12, ...subtle }}>Aún no hay lugares secretos (o no se cargaron). Asegúrate de configurar <code>SECRET_SPOTS_DB_ID</code>.</div>
              ) : (
                <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                  {secretSpots.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        border: "1px solid #fef3c7",
                        borderRadius: 16,
                        padding: 12,
                        background: "#ffffff",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <div style={{ fontWeight: 900, color: "#92400e" }}>{s.nombre}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#b45309" }}>{s.tipo ?? "—"}</div>
                      </div>

                      {s.historia && (
                        <div style={{ marginTop: 8, fontSize: 13, color: "#4b5563" }}>
                          {s.historia}
                        </div>
                      )}

                      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        {s.votos != null && <Tag>⭐ {s.votos}</Tag>}
                        {s.mapa && (
                          <a href={s.mapa} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#0ea5e9", fontWeight: 500 }}>
                            Ver secreto →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        <footer style={{ marginTop: 18, ...subtle, fontSize: 12 }}>Tip: editen en Notion y recarguen esta página 🙂</footer>
      </div>
    </main>
  );
}