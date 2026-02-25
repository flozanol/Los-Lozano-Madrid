'use client';

import { useState } from 'react';
import styles from './page.module.css';

const PlacesPage = () => {
    const [places, setPlaces] = useState([
        {
            name: "Palacio Real",
            category: "Monumento",
            desc: "Residencia oficial de la Familia Real, aunque solo para actos de Estado.",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Palacio_Real_de_Madrid_at_sunset.jpg/1200px-Palacio_Real_de_Madrid_at_sunset.jpg"
        },
        {
            name: "Museo del Prado",
            category: "Arte",
            desc: "Nuestra pinacoteca más importante. Goya, Velázquez y El Greco nos esperan.",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Museo_del_Prado_2016_%2825185969599%29.jpg/1200px-Museo_del_Prado_2016_%2825185969599%29.jpg"
        },
        {
            name: "Parque del Retiro",
            category: "Naturaleza",
            desc: "El pulmón de Madrid. Paseo en barca obligado y visita al Palacio de Cristal.",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Parque_del_Buen_Retiro_en_Madrid_01.jpg/1200px-Parque_del_Buen_Retiro_en_Madrid_01.jpg"
        },
        {
            name: "Gran Vía",
            category: "Ocio",
            desc: "El Broadway madrileño. Luces, teatros y la mejor arquitectura del siglo XX.",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Gran_V%C3%ADa_%28Madrid%29_11.jpg/1200px-Gran_V%C3%ADa_%28Madrid%29_11.jpg"
        },
        {
            name: "Templo de Debod",
            category: "Historia",
            desc: "Un regalo de Egipto. El mejor atardecer de todo Madrid sin ninguna duda.",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Temple_of_Debod_01.jpg/1200px-Temple_of_Debod_01.jpg"
        }



    ]);

    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', category: 'Visita', desc: '', image: '' });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.name && newItem.desc) {
            const img = newItem.image || "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80";
            setPlaces([...places, { ...newItem, image: img }]);
            setNewItem({ name: '', category: 'Visita', desc: '', image: '' });
            setShowForm(false);
        }
    };

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_austrias_habsburg.png)' }}
            ></div>
            <div className={`content-wrapper ${styles.placesPage}`}>

                <div className={`${styles.header} container`}>
                    <h1 className={styles.title}>Qué <span className="text-gold">Visitar</span></h1>
                    <p>Lugares que no nos podemos perder en esta aventura.</p>
                    <button
                        className="btn-primary"
                        style={{ marginTop: '2rem' }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancelar' : '+ Sugerir Lugar'}
                    </button>
                </div>

                <div className="container">
                    {showForm && (
                        <form className={styles.addForm} onSubmit={handleAdd}>
                            <input
                                type="text"
                                placeholder="Nombre del lugar"
                                value={newItem.name}
                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Categoría (Ej: Museo)"
                                value={newItem.category}
                                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Descripción corta"
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

                    <div className={styles.grid}>
                        {places.map((place, index) => (
                            <div key={index} className={styles.card}>
                                <div className={styles.imageBox}>
                                    <img src={place.image} alt={place.name} />
                                    <span className={styles.category}>{place.category}</span>
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>{place.name}</h3>
                                    <p>{place.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlacesPage;
