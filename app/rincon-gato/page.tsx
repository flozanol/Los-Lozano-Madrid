'use client';

import { UtensilsCrossed, Star, MapPin, ChevronRight, Info, Heart } from 'lucide-react';

const RinconGatoPage = () => {
    const restaurants = [
        {
            name: 'Casa Enriqueta',
            area: 'Puerta del Ángel',
            specialty: 'Gallinejas y Entresijos',
            description: 'Autenticidad pura. Si quieres probar el Madrid más castizo y menos turístico, este es tu sitio. Un local de toda la vida.',
            vibe: 'Castizo / Tradicional',
            price: '€'
        },
        {
            name: 'Bodegas el Maño',
            area: 'Malasaña',
            specialty: 'Vermut y raciones caseras',
            description: 'Una taberna que resiste a la gentrificación. Los mejores boquerones y una ensaladilla que quita el sentido.',
            vibe: 'Taberna de barrio',
            price: '€€'
        },
        {
            name: 'Sala de Despiece',
            area: 'Ponzano',
            specialty: 'Cocina de producto creativa',
            description: 'Aunque es muy conocido por locales, mantiene una calidad y una puesta en escena brutal. No es el típico sitio de turistas.',
            vibe: 'Industrial / Moderno',
            price: '€€€'
        },
        {
            name: 'La Venencia',
            area: 'Barrio de las Letras',
            specialty: 'Jerez y Manzanilla',
            description: 'Prohibido hacer fotos. Solo se sirve vino de Jerez y tapas frías. Entrar es volver a los años 30.',
            vibe: 'Histórico / Sin filtros',
            price: '€'
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
                        <div className="inline-flex p-4 bg-white/20 backdrop-blur-md rounded-3xl mb-6 border border-white/30">
                            <UtensilsCrossed className="text-gold" size={48} />
                        </div>
                        <h1 className="text-5xl font-black mb-4 tracking-tight">RINCÓN DEL <span className="text-madrid-gradient">GATO</span></h1>
                        <p className="text-gray-200 max-w-2xl mx-auto text-lg font-medium">
                            Donde comen los madrileños (los de verdad). Olvida los menús turísticos y descubre el Madrid auténtico.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {restaurants.map((res, idx) => (
                            <section key={idx} className="glass overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-red-50 text-madrid-red rounded-2xl group-hover:bg-madrid-red group-hover:text-white transition-colors">
                                                <Heart size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black">{res.name}</h2>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <MapPin size={12} className="text-gray-400" />
                                                    <span className="text-xs font-bold text-gray-500 uppercase">{res.area}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {res.vibe}
                                            </span>
                                            <p className="text-lg font-black text-emerald-600 mt-2">{res.price}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-xs font-black text-madrid-red uppercase tracking-widest mb-1">Especialidad</p>
                                        <p className="text-lg font-bold text-gray-800">{res.specialty}</p>
                                    </div>

                                    <p className="text-gray-600 leading-relaxed mb-8 italic">
                                        "{res.description}"
                                    </p>

                                    <button className="w-full py-4 bg-gray-50 rounded-2xl font-black text-sm text-gray-400 group-hover:bg-madrid-red group-hover:text-white transition-all flex justify-between items-center px-6">
                                        VER LOCALIZACIÓN
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </section>
                        ))}
                    </div>

                    <footer className="mt-20 glass p-8 text-center border-dashed border-2 border-white/30">
                        <Info className="mx-auto mb-4 text-white/50" size={32} />
                        <p className="text-white/80 font-medium">
                            ¿Conoces algún sitio que sea secreto de los gatos? <br />
                            ¡Cuéntaselo a la familia en el Chat!
                        </p>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default RinconGatoPage;
