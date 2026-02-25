import Countdown from '@/components/Countdown';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import styles from './page.module.css';


const HomePage = () => {
  const tripStartDate = "2026-03-26T00:00:00";


  return (
    <div className={styles.hero}>
      <div className={`${styles.heroContent} glass`}>
        <Countdown targetDate={tripStartDate} />

        <div className={styles.logoWrapper}>
          <Image
            src="/logo.png"
            alt="Los Lozano Madrid 2026"
            width={500}
            height={250}
            className={styles.logoImage}
            priority
          />
        </div>

        <h1 className={styles.title}>VILLA Y CORTE</h1>
        <p className={styles.dates}>26 MAR — 06 ABR 2026</p>

        <div className={styles.ctaGroup}>
          <a href="/chat" className="btn-primary">
            <Sparkles size={20} />
            Consultar Guía IA
          </a>
          <a href="/calendar" className={styles.btnSecondary}>Ver Itinerario</a>
        </div>
      </div>

      <div className={styles.heroPattern}></div>
    </div>

  );
};

export default HomePage;
