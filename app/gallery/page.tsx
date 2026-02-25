'use client';

import { useState, useEffect } from 'react';

import { Camera, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

interface Photo {
    id: string;
    url: string;
    caption: string;
    user_name: string;
    created_at: string;
}

const GalleryPage = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [inputCaption, setInputCaption] = useState('');
    const [inputUser, setInputUser] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('photos')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setPhotos(data);
        }
        setIsLoading(false);
    };

    const handleUpload = async () => {
        if (!inputCaption || !inputUser) {
            alert('Por favor, indica tu nombre y un pie de foto.');
            return;
        }

        // This is a placeholder for real Supabase Storage integration
        alert('Conexión con Supabase establecida. Para subir fotos reales, configura el bucket en Supabase Dashboard.');
    };

    return (
        <>
            <div
                className="section-bg"
                style={{ backgroundImage: 'url(/madrid_movida_80s.png)' }}
            ></div>
            <div className={`content-wrapper ${styles.galleryPage}`}>

                <div className="container">
                    <header className={styles.header}>
                        <h1>Galería <span className="text-gold">Familiar</span></h1>
                        <p>Capturando cada momento de los Lozano en la Villa y Corte.</p>
                    </header>

                    <section className={styles.uploadSection}>
                        <div className={`${styles.uploadCard} glass`}>
                            <div className={styles.formGroup}>
                                <input
                                    type="text"
                                    placeholder="Tu nombre..."
                                    value={inputUser}
                                    onChange={(e) => setInputUser(e.target.value)}
                                    className={styles.input}
                                />
                                <input
                                    type="text"
                                    placeholder="Título de la foto..."
                                    value={inputCaption}
                                    onChange={(e) => setInputCaption(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.dropzone}>
                                <Camera size={48} className="text-gold" />
                                <p>Haz clic para seleccionar una foto</p>
                            </div>
                            <button className="btn-primary" onClick={handleUpload} disabled={isUploading}>
                                {isUploading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                                Subir Foto
                            </button>
                        </div>
                    </section>

                    {isLoading ? (
                        <div className="text-center py-10">
                            <Loader2 className="animate-spin mx-auto text-gold" size={40} />
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {photos.map(photo => (
                                <div key={photo.id} className={styles.photoCard}>
                                    <div className={styles.imageBox}>
                                        <img src={photo.url} alt={photo.caption} />
                                    </div>
                                    <div className={styles.photoInfo}>
                                        <h3>{photo.caption}</h3>
                                        <p>Por <strong>{photo.user_name}</strong> — {new Date(photo.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                            {photos.length === 0 && (
                                <p className="text-center col-span-full opacity-50">Aún no hay fotos. ¡Sé el primero en subir una!</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default GalleryPage;
