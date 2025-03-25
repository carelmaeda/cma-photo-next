"use client";

import { useEffect } from "react";
import { FaInstagram } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js"); // Load Bootstrap JS dynamically
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid px-5">
        {/* Logo */}
        <Link className="navbar-brand" href="/">
          <Image src="/logo.webp" width={76} height={50} alt="Logo" />
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Navbar Links */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link active" href="/">
                Portfolio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#contact">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#about">
                About
              </Link>
            </li>
          </ul>

          {/* Social Media Icons */}
          <div className="social d-flex justify-content-center justify-content-lg-end w-100">
            <a href="https://instagram.com/carel011" target="_blank">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
