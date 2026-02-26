'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={styles.nav}>
      <div className={`${styles.navContainer} container`}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo-lozano-clean.png" alt="Logo" width={55} height={45} className={styles.logoImg} />
          <div className={styles.logoBrand}>
            <span className={styles.logoText}>LOZANO</span>
            <span className={styles.logoYear}>MADRID 2026</span>
          </div>
        </Link>

        {/* Institutional Mark for every page */}
        <div className={styles.navInstitutional}>
          <Image
            src="/madrid-city-logo-v2.jpg"
            alt="Ayuntamiento de Madrid"
            width={120}
            height={60}
            className={styles.navCityLogo}
          />
        </div>


        <button className={styles.mobileToggle} onClick={toggleMenu} aria-label="Toggle Navigation">
          <div className={`${styles.bar} ${isOpen ? styles.bar1 : ''}`}></div>
          <div className={`${styles.bar} ${isOpen ? styles.bar2 : ''}`}></div>
          <div className={`${styles.bar} ${isOpen ? styles.bar3 : ''}`}></div>
        </button>

        <ul className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
          <li><Link href="/history" onClick={() => setIsOpen(false)}>Historia</Link></li>
          <li><Link href="/places" onClick={() => setIsOpen(false)}>Lugares</Link></li>
          <li><Link href="/restaurants" onClick={() => setIsOpen(false)}>Restaurantes</Link></li>
          <li><Link href="/calendar" onClick={() => setIsOpen(false)}>Calendario</Link></li>
          <li><Link href="/gallery" onClick={() => setIsOpen(false)}>Galería</Link></li>
          <li><Link href="/map" onClick={() => setIsOpen(false)}>Mapa</Link></li>

          <li><Link href="/social" onClick={() => setIsOpen(false)}>Recados</Link></li>
        </ul>



      </div>
    </nav>
  );
};

export default Navbar;
