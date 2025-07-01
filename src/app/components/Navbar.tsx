'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`nav-container ${!navbarVisible ? 'hidden' : ''}`}>
      <div className="navbar">
        <div className="nav-header">
          <Link href="/" className="logo">         
            <Image src="/logo.webp" alt="Logo" width={100} height={50} />
          </Link>
          <button
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>

        <ul className={`nav-dropdown ${menuOpen ? 'open' : ''}`}>
          {['Portfolio', 'About', 'FAQ'].map((label) => (
            <li key={label}>
              <Link href={`#${label.toLowerCase()}`} onClick={closeMenu}>
                {label}
              </Link>
            </li>
          ))}

          <li className="nav-socials">
              <a href="https://www.instagram.com/the.lyonsking" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;