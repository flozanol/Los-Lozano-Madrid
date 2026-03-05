'use client';

import { MapPin, Info, Camera, ShoppingBag, Utensils, Star } from 'lucide-react';

const NeighborhoodsPage = () => {
    const neighborhoods = [
        {
            name: 'La Latina',
            vibe: 'Castizo y Medieval',
            description: 'El barrio más antiguo de Madrid. Calles estrechas, plazas con historia y el epicentro del tapeo dominguero.',
            whatToDo: ['Tapas en Cava Baja', 'Mercado de la Cebada', 'El Rastro (Domingos)'],
            color: 'bg-red-50',
            icon: Utensils
        },
        {
            name: 'Malasaña',
            vibe: 'Alternativo y Moderno',
            description: 'Cuna de la Movida Madrileña. Vintage, arte urbano y coffee shops con mucho estilo.',
            whatToDo: ['Plaza del Dos de Mayo', 'Tiendas de ropa vintage', 'Café de la Luz'],
            color: 'bg-blue-50',
            icon: Camera
        },
        {
            name: 'Salamanca',
            vibe: 'Elegante y Lujoso',
            description: 'La Milla de Oro. Grandes avenidas, palacetes y las tiendas más exclusivas del mundo.',
            whatToDo: ['Compras en calle Serrano', 'Paseo por la Castellana', 'Plateía Madrid'],
            color: 'bg-amber-50',
            icon: ShoppingBag
        },
        {
            name: 'Chamberí',
            vibe: 'Residencial y Auténtico',
            description: 'Tradición madrileña sin tanto turista. Mercados gastronómicos y plazas llenas de vida local.',
            whatToDo: ['Estación de Metro de Chamberí (Museo)', 'Calle Ponzano (Tapeo)', 'Plaza de Olavide'],
            color: 'bg-emerald-50',
            icon: Info
        },
        {
            name: 'Retiro',
            vibe: 'Señorial y Verde',
            description: 'Cerca del parque más famoso. Tranquilidad, aire libre y mucha cultura museística.',
            whatToDo: ['Parque del Retiro', 'Palacio de Cristal', 'Museo del Prado (Cerca)'],
            color: 'bg-green-50',
            icon: MapPin
        }
    ];

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_skyline.webp)', backgroundPosition: 'bottom' }}
            ></div>
            <div className="content-wrapper">
                <div className="container">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl font-black mb-4">BARRIOS DE <span className="text-madrid-gradient">MADRID</span></h1>
                        <p className="text-gray-200 max-w-xl mx-auto">Cada barrio tiene su propia alma. Aquí te guiamos por los más icónicos para que no te pierdas nada.</p>
                    </header>

                    <div className="flex flex-col gap-8">
                        {neighborhoods.map((n, idx) => (
                            <section key={idx} className={`glass overflow-hidden ${n.color} transition-transform hover:scale-[1.01]`}>
                                <div className="md:flex">
                                    <div className="p-8 md:w-2/3">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm text-madrid-red">
                                                <n.icon size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black">{n.name}</h2>
                                                <span className="text-xs font-bold text-madrid-red uppercase tracking-widest">{n.vibe}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-6 leading-relaxed">{n.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {n.whatToDo.map((todo, i) => (
                                                <span key={i} className="px-4 py-2 bg-white/60 rounded-full text-sm font-semibold border border-white">
                                                    {todo}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="hidden md:flex md:w-1/3 items-center justify-center p-8 bg-white/30 backdrop-blur-sm">
                                        <div className="text-center">
                                            <Star className="text-amber-400 mx-auto mb-2" size={32} />
                                            <p className="font-black text-sm uppercase">Must Visit</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NeighborhoodsPage;
