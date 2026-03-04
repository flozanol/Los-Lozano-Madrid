'use client';

import {
    Users,
    Map,
    Compass,
    Crown,
    ShieldAlert,
    Palette,
    Zap,
    CheckCircle2,
    Trophy,
    History as HistoryIcon
} from 'lucide-react';
import styles from './page.module.css';

const HistoryPage = () => {
    const stats = [
        { icon: <Users size={24} />, label: "Habitantes Ciudad", value: "3.3 Millones", detail: "La más poblada de España" },
        { icon: <Map size={24} />, label: "Comunidad Madrid", value: "6.8 Millones", detail: "El motor económico del país" },
        { icon: <Compass size={24} />, label: "Altitud", value: "657 Metros", detail: "Una de las capitales más altas de Europa" },
        { icon: <CheckCircle2 size={24} />, label: "Fundación", value: "Año 865", detail: "Por el Emir Muhammad I" }
    ];

    const timeline = [
        {
            year: "865 - 1083",
            title: "Mayrit: El Origen Musulmán",
            subtitle: "La Atalaya del Agua",
            text: "Madrid no nació como una ciudad, sino como una fortaleza militar (alcazaba) construida por los árabes para vigilar los pasos de la Sierra y proteger Toledo. El nombre viene de 'Mayrit', que significa 'lugar de abundantes aguas'. ¡Bajo el Palacio Real todavía quedan restos de esta historia!",
            image: "/madrid_mayrit_arabic.png",
            icon: <ShieldAlert className="text-gold" />
        },
        {
            year: "1561",
            title: "La Capital del Imperio",
            subtitle: "Donde nunca se ponía el sol",
            text: "Felipe II elige Madrid como capital del Imperio Español. En esta época, España controlaba gran parte de América, Italia y Filipinas. La ciudad se llenó de artistas como Cervantes (escribió el Quijote aquí) y Velázquez. La Plaza Mayor era el centro de todo: juicios, fiestas y hasta corridas de toros.",
            image: "/madrid_austrias_habsburg.png",
            icon: <Crown className="text-gold" />
        },
        {
            year: "1759 - 1788",
            title: "Carlos III: El Mejor Alcalde",
            subtitle: "Luces y Museos",
            text: "El rey Carlos III odiaba que Madrid fuera sucia y oscura. La transformó totalmente: puso alcantarillas, alumbrado público y construyó monumentos como la Puerta de Alcalá, la Fuente de Cibeles y el edificio que hoy es el Museo del Prado.",
            image: "/madrid_royalty_borbones.png",
            icon: <Palette className="text-gold" />
        },
        {
            year: "1975 - 1985",
            title: "La Movida Madrileña",
            subtitle: "Explosión de Libertad",
            text: "Tras años de dictadura, con la llegada de la democracia, Madrid se convirtió en la ciudad más libre y fiestera del mundo. Cineastas como Almodóvar y músicos inundaron Malasaña. Fue una revolución cultural que todavía define el espíritu alegre y nocturno de la ciudad.",
            image: "/madrid_movida_80s.png",
            icon: <Zap className="text-gold" />
        }
    ];

    const facts = [
        { title: "El Oso y el Madroño", text: "Es el símbolo de Madrid. ¿Por qué? Porque antiguamente había muchísimos osos en los bosques que rodeaban la ciudad." },
        { title: "Km 0", text: "En la Puerta del Sol está el origen de todas las carreteras de España. Si te pones encima, ¡estás en el centro de la 'estrella' española!" },
        { title: "El Restaurante más viejo", text: "Casa Botín (cerca de Plaza Mayor) tiene el récord Guinness del restaurante más antiguo del mundo abierto sin pausa desde 1725." },
        { title: "Ciudad de Fútbol", text: "Madrid es la única ciudad con dos equipos (Real Madrid y Atlético) que han jugado tres finales de Champions entre ellos." }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.watermarkBg}></div>
            <div className="section-bg" style={{ backgroundImage: 'url(/madrid_royalty_borbones.png)' }}></div>

            <div className={`content-wrapper ${styles.historyView}`}>
                {/* HERO SECTION */}
                <header className={styles.hero}>
                    <div className="container">
                        <div className={styles.badge}>
                            <HistoryIcon size={16} />
                            <span>Crónica de la Villa y Corte</span>
                        </div>
                        <h1 className={styles.title}>España & <span className="text-madrid-gradient">Madrid</span></h1>
                        <p className={styles.lead}>
                            De una pequeña torre árabe a ser el corazón de un Imperio Global.
                            Descubre los secretos de la ciudad que nunca duerme.
                        </p>
                    </div>
                </header>

                {/* QUICK STATS */}
                <section className={styles.statsGrid}>
                    <div className="container">
                        <div className={styles.statsWrapper}>
                            {stats.map((stat, i) => (
                                <div key={i} className={`${styles.statCard} glass`}>
                                    <div className={styles.statIcon}>{stat.icon}</div>
                                    <div className={styles.statInfo}>
                                        <span className={styles.statLabel}>{stat.label}</span>
                                        <span className={styles.statValue}>{stat.value}</span>
                                        <p className={styles.statDetail}>{stat.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TIMELINE SECTION */}
                <section className={styles.timelineSection}>
                    <div className="container">
                        <h2 className={styles.sectionTitle}>La Línea del <span className="text-madrid-gradient">Tiempo</span></h2>
                        <div className={styles.timelineContainer}>
                            {timeline.map((item, i) => (
                                <div key={i} className={styles.timelineItem}>
                                    <div className={styles.timelineYear}>
                                        <div className={styles.yearCircle}>{item.icon}</div>
                                        <span>{item.year}</span>
                                    </div>
                                    <div className={`${styles.timelineContent} glass`}>
                                        <div className={styles.imgBox}>
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                        <div className={styles.textBox}>
                                            <span className={styles.subtitle}>{item.subtitle}</span>
                                            <h3>{item.title}</h3>
                                            <p>{item.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FUN FACTS CROSS SECTION */}
                <section className={styles.factsSection}>
                    <div className="container">
                        <div className={`${styles.factsGrid} glass`}>
                            <div className={styles.factsHeader}>
                                <Trophy className="text-madrid-red" size={40} />
                                <h2>¿Sabías que...?</h2>
                                <p>Cosas curiosas para contarle a tus amigos cuando vuelvas.</p>
                            </div>
                            <div className={styles.factsList}>
                                {facts.map((fact, i) => (
                                    <div key={i} className={styles.factItem}>
                                        <h4>{fact.title}</h4>
                                        <p>{fact.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER CALL TO ACTION */}
                <footer className={styles.historyFooter}>
                    <div className="container text-center">
                        <p>Y hoy en 2026, ¡vosotros formáis parte de esta historia!</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default HistoryPage;
