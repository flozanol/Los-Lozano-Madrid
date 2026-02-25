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

        <h1 className={styles.title}>VIAJE DE LOS LOZANO <span className="text-gold">A MADRID</span></h1>

        <p className={styles.dates}>26 MAR — 06 ABR 2026</p>

        <div className={styles.ctaGroup}>
          <Link href="/calendar" className="btn-primary">Ver Itinerario</Link>
        </div>
      </div>

      <div className={styles.heroPattern}></div>
    </div>

  );
};

export default HomePage;
