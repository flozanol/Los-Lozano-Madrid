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
                        className="p-4 bg-white/50 rounded-2xl border border-white hover:border-madrid-red/30 transition-all group"
                    >
                        <div className="p-2 bg-gray-50 rounded-xl w-fit mb-3 group-hover:bg-red-50 transition-colors">
                            <spot.icon size={20} className="text-gray-600 group-hover:text-madrid-red" />
                        </div>
                        <p className="font-bold text-sm mb-0.5 line-clamp-1">{spot.name}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-gray-400 capitalize">{spot.type}</span>
                            <span className="text-[10px] font-bold text-madrid-red">{spot.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NeighborhoodRadar;
