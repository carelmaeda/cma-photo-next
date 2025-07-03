'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <section className="nav">
      <div className="section-wrapper">
        <div className="section-content">
          <nav className="nav-container">
            <div className="navbar">
              <Link href="/" className="logo">         
                <Image src="/logo.webp" alt="Logo" width={100} height={50} />
              </Link>

              {/* Desktop Navigation */}
              <ul className="nav-links desktop-nav">
                <li><Link href="#gallery">Gallery</Link></li>
                <li><Link href="#store">Store</Link></li>
              </ul>

              {/* Mobile Menu Toggle */}
              <button
                className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle navigation"
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </button>

              {/* Mobile Navigation */}
              <ul className={`nav-dropdown mobile-nav ${menuOpen ? 'open' : ''}`}>
                <li><Link href="#gallery" onClick={closeMenu}>Gallery</Link></li>
                <li><Link href="#store" onClick={closeMenu}>Store</Link></li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Navbar;