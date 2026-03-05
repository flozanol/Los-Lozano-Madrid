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
        <section className="glass p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black flex items-center gap-2">
                    <MapPin className="text-madrid-red" />
                    RADAR (Cerca del Hotel)
                </h2>
                <span className="text-[10px] font-bold text-gray-400 uppercase">A 10 min caminando</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {nearbySpots.map((spot, index) => (
                    <div
                        key={index}
                        className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-madrid-red/50 transition-all group"
                    >
                        <div className="p-2 bg-white/10 rounded-xl w-fit mb-3 group-hover:bg-madrid-red/20 transition-colors">
                            <spot.icon size={20} className="text-white/80 group-hover:text-white" />
                        </div>
                        <p className="font-black text-sm mb-0.5 line-clamp-1 text-white">{spot.name}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">{spot.type}</span>
                            <span className="text-[10px] font-black text-madrid-red brightness-125">{spot.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NeighborhoodRadar;
