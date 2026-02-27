'use client';

import { useState } from 'react';
import { Lock, Unlock, ShieldAlert } from 'lucide-react';
import styles from './FamilyLock.module.css';

interface FamilyLockProps {
    children: React.ReactNode;
}

const FAMILY_PASSWORD = '1234'; // Default simple password, can be changed later

export default function FamilyLock({ children }: FamilyLockProps) {
    const [password, setPassword] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [error, setError] = useState(false);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === FAMILY_PASSWORD) {
            setIsUnlocked(true);
            setError(false);
        } else {
            setError(true);
            setPassword('');
        }
    };

    if (isUnlocked) {
        return <>{children}</>;
    }

    return (
        <div className={`${styles.lockContainer} glass`}>
            <div className={styles.iconWrapper}>
                <Lock size={48} className={styles.lockIcon} />
            </div>
            <h2>Sección Protegida</h2>
            <p>Introduce la clave familiar para acceder a esta información.</p>

            <form onSubmit={handleUnlock} className={styles.form}>
                <input
                    type="password"
                    placeholder="Clave Familiar"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={error ? styles.inputError : ''}
                />
                {error && (
                    <div className={styles.errorMessage}>
                        <ShieldAlert size={14} />
                        <span>Clave incorrecta</span>
                    </div>
                )}
                <button type="submit" className="btn-primary-blue">
                    <Unlock size={18} />
                    Desbloquear
                </button>
            </form>
        </div>
    );
}
