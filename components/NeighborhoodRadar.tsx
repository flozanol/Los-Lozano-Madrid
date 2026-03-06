'use client';

import { Coffee, Beer, Utensils, ShoppingCart, Pill, TrainFront, MapPin } from 'lucide-react';

const NeighborhoodRadar = () => {
    const nearbySpots = [
        { name: 'Frida', type: 'Café', icon: Coffee, time: '2 min' },
        { name: 'Irish Rover', type: 'Bar', icon: Beer, time: '5 min' },
        { name: 'Lateral Bernabéu', type: 'Restaurante', icon: Utensils, time: '8 min' },
        { name: 'Carrefour Express', type: 'Supermercado', icon: ShoppingCart, time: '4 min' },
        { name: 'Farmacia 24h', type: 'Farmacia', icon: Pill, time: '6 min' },
        { name: 'Metro Santiago Bernabéu', type: 'Metro', icon: TrainFront, time: '10 min' },
    ];

    return (
        <section className="glass-premium p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-madrid-red/10 rounded-xl">
                        <MapPin className="text-madrid-red" size={20} />
                    </div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Radar Local</h2>
                </div>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">A 10 min caminando</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {nearbySpots.map((spot, index) => (
                    <div
                        key={index}
                        className="p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-madrid-red/40 hover:bg-white/10 transition-all group"
                    >
                        <div className="p-3 bg-white/5 rounded-2xl w-fit mb-4 group-hover:bg-madrid-red/20 transition-all">
                            <spot.icon size={20} className="text-white/60 group-hover:text-white transition-colors" />
                        </div>
                        <p className="font-black text-sm mb-1 line-clamp-1 text-white">{spot.name}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-tighter">{spot.type}</span>
                            <span className="text-[10px] font-black text-madrid-red brightness-125">{spot.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NeighborhoodRadar;
