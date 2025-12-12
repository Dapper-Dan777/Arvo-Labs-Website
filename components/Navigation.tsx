'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="nav">
      <Link href="/" onClick={closeMenu}>
        <div className="logo">Arvo Labs</div>
      </Link>
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Menü öffnen">
        <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <Link
          href="/funktionen"
          className={`nav-link ${isActive('/funktionen') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Funktionen
        </Link>
        <Link
          href="/preise"
          className={`nav-link ${isActive('/preise') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Preise
        </Link>
        <Link
          href="/use-cases"
          className={`nav-link ${isActive('/use-cases') ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            closeMenu();
          }}
        >
          Use Cases
        </Link>
        <Link
          href="/kontakt"
          className={`nav-link ${isActive('/kontakt') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Kontakt
        </Link>
      </nav>
      <SignedOut>
        <div className="desktop-cta" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <ThemeToggle />
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="nav-cta">Login</button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="desktop-cta" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <ThemeToggle />
          <UserButton />
        </div>
      </SignedIn>
    </header>
  );
}

export default Navigation;


