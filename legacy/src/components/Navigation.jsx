import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="nav">
      <Link to="/" onClick={closeMenu}>
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
          to="/funktionen"
          className={`nav-link ${isActive('/funktionen') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Funktionen
        </Link>
        <Link
          to="/preise"
          className={`nav-link ${isActive('/preise') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Preise
        </Link>
        <Link
          to="/use-cases"
          className={`nav-link ${isActive('/use-cases') ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            closeMenu();
          }}
        >
          Use Cases
        </Link>
        <Link
          to="/kontakt"
          className={`nav-link ${isActive('/kontakt') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Kontakt
        </Link>
        <Link to="/login" onClick={closeMenu}>
          <button className="nav-cta mobile-cta">Login</button>
        </Link>
      </nav>
      <Link to="/login" className="desktop-cta">
        <button className="nav-cta">Login</button>
      </Link>
    </header>
  );
}

export default Navigation;
