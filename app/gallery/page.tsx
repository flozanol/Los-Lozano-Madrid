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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('photos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setPhotos(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!inputCaption || !inputUser || !selectedFile) {
            alert('Por favor, selecciona una foto, indica tu nombre y un pie de foto.');
            return;
        }

        setIsUploading(true);
        try {
            // Check if bucket exists/is accessible by trying to list or just upload
            // We'll use 'gallery' lowercase as it's the standard internal ID
            const bucketName = 'gallery';

            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, selectedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Upload Error Details:', uploadError);
                throw new Error(`Error de Storage: ${uploadError.message}. Verifica que el bucket '${bucketName}' exista y sea público.`);
            }

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            // 3. Save reference to database
            const { error: dbError } = await supabase
                .from('photos')
                .insert([
                    {
                        url: publicUrl,
                        caption: inputCaption,
                        user_name: inputUser
                    }
                ]);

            if (dbError) throw dbError;

            alert('¡Foto subida con éxito! Ya puedes verla en la galería.');
            setInputCaption('');
            setSelectedFile(null);
            fetchPhotos();
        } catch (error: any) {
            console.error('Final Upload Error:', error);
            alert(error.message || 'Error inesperado al subir la foto.');
        } finally {
            setIsUploading(false);
        }
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
                            <div className={styles.dropzone} onClick={() => document.getElementById('file-input')?.click()}>
                                <input
                                    type="file"
                                    id="file-input"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <Camera size={48} className={selectedFile ? "text-success" : "text-gold"} style={{ color: selectedFile ? '#22c55e' : '#D4AF37' }} />
                                <p>{selectedFile ? `Foto seleccionada: ${selectedFile.name}` : "Pulsa aquí para elegir una foto"}</p>
                            </div>
                            <button className="btn-primary" onClick={handleUpload} disabled={isUploading}>
                                {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                                {isUploading ? 'Subiendo...' : 'Publicar en Galería'}
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
