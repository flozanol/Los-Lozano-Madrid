'use client';

import { useState } from 'react';
import styles from './page.module.css';

const RestaurantsPage = () => {
    const [restaurants, setRestaurants] = useState([
        {
            name: "Sobrino de Botín",
            specialty: "Cochinillo Asado",
            desc: "El restaurante más antiguo del mundo según el Guinness. ¡Historia comestible!",
            rating: "⭐⭐⭐⭐⭐",
            image: "https://images.unsplash.com/photo-1515516969-d41f71df9138?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Casa Lucio",
            specialty: "Huevos Estrellados",
            desc: "Un clásico madrileño. Si no has comido sus huevos, no has estado en Madrid.",
            rating: "⭐⭐⭐⭐",
            image: "https://images.unsplash.com/photo-1514516348920-f319999a5e5a?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Chocolatería San Ginés",
            specialty: "Chocolate con Churros",
            desc: "Perfecto para después de una caminata o para empezar el día con energía.",
            rating: "⭐⭐⭐⭐⭐",
            image: "https://images.unsplash.com/photo-1599307734114-6f0223788912?auto=format&fit=crop&w=600&q=80"
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', specialty: '', desc: '', rating: '⭐⭐⭐⭐⭐', image: '' });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.name && newItem.desc) {
            const img = newItem.image || "https://images.unsplash.com/photo-1515516969-d41f71df9138?auto=format&fit=crop&w=600&q=80";
            setRestaurants([...restaurants, { ...newItem, image: img }]);
            setNewItem({ name: '', specialty: '', desc: '', rating: '⭐⭐⭐⭐⭐', image: '' });
            setShowForm(false);
        }
    };

    return (
        <div className={styles.restaurantsPage}>
            <div className={`${styles.header} container`}>
                <h1 className={styles.title}>Dónde <span className="text-gold">Comer</span></h1>
                <p>Selección de templos gastronómicos para disfrutar en familia.</p>
                <button
                    className="btn-primary"
                    style={{ marginTop: '2rem' }}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancelar' : '+ Añadir Restaurante'}
                </button>
            </div>

            <div className="container">
                {showForm && (
                    <form className={styles.addForm} onSubmit={handleAdd}>
                        <input
                            type="text"
                            placeholder="Nombre del restaurante"
                            value={newItem.name}
                            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Especialidad"
                            value={newItem.specialty}
                            onChange={e => setNewItem({ ...newItem, specialty: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={newItem.desc}
                            onChange={e => setNewItem({ ...newItem, desc: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="URL de Imagen (opcional)"
                            value={newItem.image}
                            onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                        />
                        <button type="submit" className="btn-primary">Añadir</button>
                    </form>
                )}

                <div className={styles.list}>
                    {restaurants.map((rest, index) => (
                        <div key={index} className={styles.item}>
                            <div className={styles.itemImageWrapper}>
                                <img src={rest.image} alt={rest.name} className={styles.itemImage} />
                            </div>
                            <div className={styles.itemInfo}>
                                <div className={styles.itemNameWrapper}>
                                    <h3>{rest.name}</h3>
                                    <span className={styles.rating}>{rest.rating}</span>
                                </div>
                                <p className={styles.specialty}><strong>Especialidad:</strong> {rest.specialty}</p>
                                <p className={styles.desc}>{rest.desc}</p>
                            </div>
                            <div className={styles.itemActions}>
                                <button className={styles.btnVote}>Lo quiero probar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RestaurantsPage;

