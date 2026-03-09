'use client';

import React from 'react';
import {
    Train,
    Bike,
    Bus,
    Navigation,
    CreditCard,
    Smartphone,
    ExternalLink,
    Info,
    Map as MapIcon,
    Zap
} from 'lucide-react';
import styles from './page.module.css';

const MovilidadPage = () => {
    const transportOptions = [
        {
            title: "Metro de Madrid",
            icon: <Train className="text-white" size={32} />,
            color: "var(--madrid-red)", // Using brand red
            description: "La forma más rápida y eficiente. 12 líneas que conectan toda la ciudad.",
            tips: [
                "Línea 8 te lleva al aeropuerto (T1-T4).",
                "Línea 2 (Roja) pasa por Sol y Retiro.",
                "Abierto de 6:00 a 1:30."
            ],
            links: [
                { label: "Plano Oficial PDF", url: "https://www.metromadrid.es/sites/default/files/documentos/Viaja%20en%20Metro/Planos/Planoesquematico.pdf" },
                { label: "App Metro Madrid", url: "https://www.metromadrid.es/es/viaja-en-metro/apps" }
            ]
        },
        {
            title: "BiciMAD",
            icon: <Bike className="text-white" size={32} />,
            color: "#00a1df", // Official BiciMAD blue
            description: "Bicicletas eléctricas compartidas. Ideales para pasear y trayectos cortos.",
            tips: [
                "Usa la app Muevalevante o BiciMAD.",
                "Hay estaciones por todo el centro.",
                "¡Cuidado con las cuestas, pero la bici ayuda!"
            ],
            links: [
                { label: "Web BiciMAD", url: "https://www.bicimad.com/" }
            ]
        },
        {
            title: "Autobuses EMT",
            icon: <Bus className="text-white" size={32} />,
            color: "#004a99", // EMT Blue
            description: "Para disfrutar de las vistas. Los 'Búhos' funcionan de noche.",
            tips: [
                "EMT Madrid te da tiempos de espera reales.",
                "Paga con tarjeta Multi o contactless directo.",
                "Carriles bus exclusivos para ir rápido."
            ],
            links: [
                { label: "Web EMT", url: "https://www.emtmadrid.es/" }
            ]
        },
        {
            title: "Movilidad Eléctrica",
            icon: <Zap className="text-white" size={32} />,
            color: "#10b981", // Emerald
            description: "Patines y Scooters eléctricos (Lime, Dott, Tier).",
            tips: [
                "Prohibido circular por la acera.",
                "Obligatorio aparcar en zonas designadas.",
                "Casco recomendado."
            ],
            links: [
                { label: "App Citymapper", url: "https://citymapper.com/madrid" }
            ]
        }
    ];

    return (
        <>
            <div className="section-bg" style={{ backgroundImage: 'url(/madrid_xix_century.png)' }}></div>
            <div className={`content-wrapper ${styles.movilidadPage}`}>
                <div className="container">
                    <header className={styles.header}>
                        <div className="inline-flex p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-6 border border-white/20">
                            <Navigation className="text-white" size={40} />
                        </div>
                        <h1 className="text-madrid-gradient">Moverse por <span className="text-white">Madrid</span></h1>
                        <p>Guía de transporte para que la familia se desplace como auténticos madrileños.</p>
                    </header>

                    {/* Map Section */}
                    <section className={styles.mapSection}>
                        <div className={styles.mapContainer}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12151.05646194303!2d-3.7037905!3d40.4167754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422997800a3c81%3A0xc430bcd5a446168e!2sMadrid!5e0!3m2!1ses!2ses!4v1710123456789!5m2!1ses!2ses"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Madrid Map"
                            ></iframe>
                        </div>
                    </section>

                    {/* Cards Grid */}
                    <div className={styles.grid}>
                        {transportOptions.map((option, idx) => (
                            <div key={idx} className={styles.card}>
                                <div className={styles.cardHeader} style={{ backgroundColor: option.color }}>
                                    <div className={styles.iconBox}>
                                        {option.icon}
                                    </div>
                                    <h3>{option.title}</h3>
                                </div>
                                <div className={styles.content}>
                                    <p className={styles.description}>{option.description}</p>
                                    <ul className={styles.tips}>
                                        {option.tips.map((tip, tIdx) => (
                                            <li key={tIdx}>
                                                <div className={styles.dot} />
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={styles.links}>
                                        {option.links.map((link, lIdx) => (
                                            <a
                                                key={lIdx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.linkBtn}
                                            >
                                                {link.label} <ExternalLink size={14} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Multi Info Section */}
                    <div className={styles.multiInfo}>
                        <div className={styles.multiIcon}>
                            <CreditCard size={48} />
                        </div>
                        <div className={styles.multiText}>
                            <h3>La Tarjeta Multi</h3>
                            <p>Es la tarjeta roja recargable (2.50€). Imprescindible para el Metro y recomendada para el Bus.</p>

                            <div className={styles.infoGrid}>
                                <div className={styles.infoBox}>
                                    <h4><Info size={18} /> Abono Turístico</h4>
                                    <p>Ideal si vamos a usar mucho el Metro. Se carga por días (1, 2, 3... hasta 7) y es personal.</p>
                                </div>
                                <div className={styles.infoBox}>
                                    <h4><Smartphone size={18} /> Contactless</h4>
                                    <p>En el autobús puedes pagar directamente apoyando tu móvil o tarjeta bancaria sobre el lector.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MovilidadPage;
