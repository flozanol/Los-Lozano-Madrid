import Link from 'next/link';
import Countdown from '@/components/Countdown';
import Image from 'next/image';
import { MapPin, Sparkles } from 'lucide-react';

import styles from './page.module.css';

const HomePage = () => {
  const tripStartDate = "2026-03-26T00:00:00";

  return (
    <div className={styles.hero}>
      <div className={`${styles.heroContent} glass`}>
        {/* Official Madrid City Council Logo */}
        <div className={styles.institutionalBadge}>
          <Image
            src="/madrid-city-logo-v2.jpg"
            alt="Ayuntamiento de Madrid"
            width={220}
            height={110}
            className={styles.cityLogo}
          />
        </div>

        {/* Restore Countdown */}
        <div className={styles.countdownWrapper}>
          <Countdown targetDate={tripStartDate} />
        </div>

        {/* Original Family Trip Logo */}
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

        <h1 className={styles.title}>
          VIAJE DE LOS LOZANO <br />
          <span className="text-madrid-gradient">A MADRID</span>
        </h1>

        <div className={styles.sloganContainer}>
          <span className={styles.sloganText}>DONDE SE CRUZAN LOS CAMINOS</span>
        </div>

        <p className={styles.dates}>
          <MapPin size={18} className="inline mr-2" />
          26 MAR — 06 ABR 2026
        </p>

        <div className={styles.ctaGroup}>
          <Link href="/calendar" className="btn-primary-blue">
            <Sparkles size={18} />
            Ver Itinerario
          </Link>
          <Link href="/places" className="btn-secondary-outline">
            Explorar Ciudad
          </Link>
        </div>
      </div>

      <div className={styles.heroPattern}></div>
    </div>
  );
};

export default HomePage;
