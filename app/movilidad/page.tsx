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
import Image from 'next/image';

const MovilidadPage = () => {
    const transportOptions = [
        {
            title: "Metro de Madrid",
            icon: <Train className="text-white" size={32} />,
            color: "bg-blue-600",
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
            color: "bg-sky-500",
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
            color: "bg-blue-800",
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
            color: "bg-emerald-500",
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
        <div className="min-h-screen bg-slate-950 pb-24">
            {/* Header Hero */}
            <header className="relative h-[300px] flex items-end justify-start overflow-hidden pt-16">
                <Image
                    src="/madrid_street_view.png" // Fallback path
                    alt="Madrid Mobility"
                    fill
                    className="object-cover opacity-40 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                <div className="container relative z-10 p-6">
                    <div className="inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20">
                        <Navigation className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        Moverse por <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Madrid</span>
                    </h1>
                    <p className="text-slate-300 text-lg max-w-xl">
                        Guía de transporte para que la familia se desplace como auténticos madrileños.
                    </p>
                </div>
            </header>

            <div className="container p-6 space-y-12">

                {/* Tarjeta Multi Info */}
                <section className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <CreditCard size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-500 rounded-lg">
                                <CreditCard size={24} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Tarjeta Multi</h2>
                        </div>
                        <p className="text-slate-300 mb-6 max-w-2xl">
                            Es la tarjeta roja recargable. Imprescindible para el Metro y el Bus. Se compra en las máquinas del Metro o estancos.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                                    <Info size={16} /> Abono Turístico
                                </h4>
                                <p className="text-sm text-slate-400">
                                    Recomendado si vamos a usar mucho el transporte. Incluye viajes ilimitados por días (1, 2, 3... 7 días).
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                <h4 className="text-sky-400 font-bold mb-2 flex items-center gap-2">
                                    <Smartphone size={16} /> Contactless
                                </h4>
                                <p className="text-sm text-slate-400">
                                    En los buses ya puedes pagar directamente con Apple Pay o tu tarjeta de débito/crédito.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Transport Options Grid */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <MapIcon className="text-red-500" /> Opciones de Transporte
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {transportOptions.map((option, idx) => (
                            <div key={idx} className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300 group">
                                <div className={`p-6 ${option.color} flex items-center justify-between`}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/20 rounded-2xl">
                                            {option.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">{option.title}</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-300 mb-6 italic">"{option.description}"</p>

                                    <div className="space-y-3 mb-8">
                                        {option.tips.map((tip, tIdx) => (
                                            <div key={tIdx} className="flex items-start gap-3 text-sm text-slate-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                                                <p>{tip}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {option.links.map((link, lIdx) => (
                                            <a
                                                key={lIdx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/10"
                                            >
                                                {link.label} <ExternalLink size={14} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Citymapper Call to Action */}
                <div className="p-1 gap-1 text-center py-10 opacity-60">
                    <p className="text-slate-400 text-sm">Organiza tu ruta en tiempo real con</p>
                    <a href="https://citymapper.com/madrid" target="_blank" className="text-white font-bold hover:underline">Citymapper Madrid</a>
                </div>
            </div>
        </div>
    );
};

export default MovilidadPage;
