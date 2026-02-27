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
      </div>
    </nav>
  );
};

export default Navbar;
