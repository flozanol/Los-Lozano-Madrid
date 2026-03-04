'use client';

import { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

const Countdown = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className={styles.countdown}>
            <div className={styles.item}>
                <span className={styles.number}>{timeLeft.days}</span>
                <span className={styles.label}>Días</span>
            </div>
            <div className={styles.separator}>:</div>
            <div className={styles.item}>
                <span className={styles.number}>{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className={styles.label}>Hrs</span>
            </div>
            <div className={styles.separator}>:</div>
            <div className={styles.item}>
                <span className={styles.number}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className={styles.label}>Min</span>
            </div>
            <div className={styles.separator}>:</div>
            <div className={styles.item}>
                <span className={styles.number}>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className={styles.label}>Seg</span>
            </div>
        </div>
    );
};

export default Countdown;
