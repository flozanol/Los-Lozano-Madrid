'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div className={`${styles.navContainer} container`}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="Logo" width={40} height={32} className={styles.logoImg} />
          <div className={styles.logoBrand}>
            <span className={styles.logoText}>LOZANO</span>
          </div>
        </Link>

        <div className={styles.desktopLinks}>
          <Link href="/history">Historia</Link>
          <Link href="/places">Lugares</Link>
          <Link href="/restaurants">Restaurantes</Link>
          <Link href="/gallery">Galería</Link>
          <Link href="/social">Recados</Link>
        </div>

        <div className={styles.navInstitutional}>
          <Image
            src="/madrid-city-logo-v2.jpg"
            alt="Ayuntamiento de Madrid"
            width={100}
            height={50}
            className={styles.navCityLogo}
            priority
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
