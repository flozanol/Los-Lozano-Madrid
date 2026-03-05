'use client';

import { Footprints, Map, Coffee, Landmark, Beer, Users, ChevronRight } from 'lucide-react';

const RoutesPage = () => {
    const routes = [
        {
            title: 'Centro Histórico',
            distance: '3.5 km',
            time: '2-3 horas',
            description: 'Un viaje por el Madrid de los Austrias. Desde el Palacio Real hasta la mítica Plaza Mayor.',
            stops: ['Palacio Real', 'Catedral de la Almudena', 'Plaza de la Villa', 'Plaza Mayor', 'Puerta del Sol'],
            icon: Landmark,
            color: 'border-blue-500'
        },
        {
            title: 'Ruta Cultural',
            distance: '2.8 km',
            time: '2 horas',
            description: 'El Triángulo del Arte y el Paseo del Prado. Museos, fuentes y mucha historia.',
            stops: ['Museo del Prado', 'Fuente de Neptuno', 'Museo Thyssen', 'Cibeles', 'Puerta de Alcalá'],
            icon: Map,
            color: 'border-red-500'
        },
        {
            title: 'Ruta de Tapas (Latina)',
            distance: '1.2 km',
            time: 'Lo que aguante el cuerpo',
            description: 'La ruta más "Lozano". Tapas, cañas y el mejor ambiente de Madrid.',
            stops: ['Calle Cava Baja', 'Plaza de los Carros', 'San Isidro', 'Cava Alta'],
            icon: Beer,
            color: 'border-amber-500'
        }
    ];

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_skyline.webp)', backgroundPosition: 'center' }}
            ></div>
            <div className="content-wrapper">
                <div className="container">
                    <header className="mb-12 text-center text-white">
                        <Footprints className="mx-auto mb-4 text-madrid-red" size={48} />
                        <h1 className="text-4xl font-black mb-4">RUTAS <span className="text-gold">CAMINABLES</span></h1>
                        <p className="text-gray-200 max-w-xl mx-auto">Madrid se descubre a pie. Aquí tienes nuestras rutas sugeridas diseñadas para grupos grandes.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {routes.map((route, idx) => (
                            <section key={idx} className={`glass p-8 border-t-8 ${route.color} flex flex-col h-full`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-white/50 rounded-2xl shadow-sm text-madrid-red">
                                        <route.icon size={28} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black uppercase text-gray-500">Distancia</p>
                                        <p className="font-bold">{route.distance}</p>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-black mb-2">{route.title}</h2>
                                <p className="text-gray-600 mb-6 text-sm">{route.description}</p>

                                <div className="space-y-4 mb-8 flex-grow">
                                    {route.stops.map((stop, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-madrid-red/10 text-madrid-red flex items-center justify-center rounded-full text-xs font-bold shrink-0">
                                                {i + 1}
                                            </div>
                                            <span className="text-sm font-semibold">{stop}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-gray-100 mt-auto">
                                    <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400">
                                        <Users size={14} />
                                        <span>Ideal para grupos</span>
                                    </div>
                                    <button className="w-full btn-primary !py-3 flex justify-between items-center text-sm">
                                        VER MAPA DETALLADO
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoutesPage;
