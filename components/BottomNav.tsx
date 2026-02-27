'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Calendar,
    Map as MapIcon,
    ClipboardList,
    ShieldAlert,
    Menu,
    X,
    Utensils,
    Camera,
    History,
    Users,
    MessageSquare,
    Beer
} from 'lucide-react';
import styles from './BottomNav.module.css';

const BottomNav = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const mainItems = [
        { href: '/', icon: Home, label: 'Inicio' },
        { href: '/calendar', icon: Calendar, label: 'Plan' },
        { href: '/map', icon: MapIcon, label: 'Mapa' },
        { href: '/safety', icon: ShieldAlert, label: 'S.O.S' },
    ];

    const extraItems = [
        { href: '/history', icon: History, label: 'Historia' },
        { href: '/places', icon: Camera, label: 'Lugares' },
        { href: '/restaurants', icon: Utensils, label: 'Restaurantes' },
        { href: '/tapas', icon: Beer, label: 'Tapeo' },
        { href: '/expenses', icon: Users, label: 'Gastos' },
        { href: '/checklist', icon: ClipboardList, label: 'Documentos' },
        { href: '/gallery', icon: Camera, label: 'Galería' },
        { href: '/social', icon: MessageSquare, label: 'Recados' },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            {/* Menu Overlay */}
            <div className={`${styles.menuOverlay} ${isMenuOpen ? styles.overlayActive : ''}`}>
                <div className={styles.overlayContent}>
                    <header className={styles.overlayHeader}>
                        <h2>Explorar <span className="text-madrid-gradient">Madrid</span></h2>
                        <button onClick={toggleMenu} className={styles.closeBtn}><X size={32} /></button>
                    </header>
                    <div className={styles.overlayGrid}>
                        {extraItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={styles.overlayItem}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className={styles.overlayIcon}><item.icon size={24} /></div>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <nav className={styles.bottomNav}>
                <div className={styles.container}>
                    {mainItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            >
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* More Menu Button */}
                    <button className={`${styles.navItem} ${isMenuOpen ? styles.active : ''}`} onClick={toggleMenu}>
                        <Menu size={22} />
                        <span>Más</span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default BottomNav;
