'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Map, ClipboardList, ShieldAlert } from 'lucide-react';
import styles from './BottomNav.module.css';

const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/', icon: Home, label: 'Inicio' },
        { href: '/calendar', icon: Calendar, label: 'Itinerario' },
        { href: '/map', icon: Map, label: 'Mapa' },
        { href: '/checklist', icon: ClipboardList, label: 'Docs' },
        { href: '/safety', icon: ShieldAlert, label: 'Pánico' },
    ];

    return (
        <nav className={styles.bottomNav}>
            <div className={styles.container}>
                {navItems.map((item) => {
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
            </div>
        </nav>
    );
};

export default BottomNav;
