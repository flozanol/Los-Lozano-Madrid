import styles from './page.module.css';

const HistoryPage = () => {
    const sections = [
        {
            title: "Mayrit: Los Orígenes Árabes (S. IX)",
            text: "Madrid fue fundada por el emir Muhammad I de Córdoba como una atalaya militar para defender Toledo. El nombre original, 'Mayrit', significa 'lugar de abundantes aguas', en referencia a los arroyos que cruzaban la zona. Todavía se pueden ver restos de la muralla árabe cerca de la Cuesta de la Vega.",
            image: "/madrid_mayrit_arabic.png"
        },
        {
            title: "El Madrid de los Austrias y la Capitalidad (1561)",
            text: "Felipe II tomó la decisión trascendental de trasladar la Corte a Madrid en 1561. Durante el reinado de los Habsburgo, la ciudad creció con calles estrechas y conventos. Es la época de la Plaza Mayor, el Ayuntamiento y el Madrid que Cervantes y Lope de Vega recorrieron en el Siglo de Oro.",
            image: "/madrid_austrias_habsburg.png"
        },
        {
            title: "La Ilustración de los Borbones (S. XVIII)",
            text: "Con la llegada del primer Borbón, Felipe V, y especialmente con Carlos III (conocido como 'el mejor alcalde de Madrid'), la ciudad vivió una gran transformación. Se diseñaron el Paseo del Prado, la Puerta de Alcalá y se construyó el Palacio Real tras el incendio del Antiguo Alcázar.",
            image: "/madrid_royalty_borbones.png"
        },
        {
            title: "El Siglo XIX: Ensanchas y Ferrocarriles",
            text: "Madrid se moderniza. Se derriban las antiguas murallas para dar paso al Plan Castro, creando el elegante Barrio de Salamanca. Aparece la iluminación eléctrica, el tranvía y el ferrocarril, conectando a Madrid con el resto de Europa mientras la ciudad late con la bohemia de sus cafés.",
            image: "/madrid_xix_century.png"
        },
        {
            title: "La Movida y el Madrid del Siglo XXI",
            text: "Tras la transición, Madrid estalló en 'La Movida': un movimiento cultural de libertad, arte y noche. Hoy, Madrid es una metrópolis global que combina su herencia imperial con una modernidad cosmopolita, siendo un referente mundial de gastronomía, arte y alegría de vivir.",
            image: "/madrid_movida_80s.png"
        }
    ];



    return (
        <div className={styles.historyPage}>
            <header className={styles.header}>
                <div className="container">
                    <h1 className={styles.mainTitle}>Historia de <span className="text-gold">Madrid</span></h1>
                    <p className={styles.subtitle}>Un recorrido por los siglos en la Villa y Corte.</p>
                </div>
            </header>

            <div className="container">
                <div className={styles.timeline}>
                    {sections.map((section, index) => (
                        <div key={index} className={styles.section}>
                            <div className={styles.content}>
                                <h2>{section.title}</h2>
                                <p>{section.text}</p>
                            </div>
                            <div className={styles.imageWrapper}>
                                <img src={section.image} alt={section.title} className={styles.image} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
