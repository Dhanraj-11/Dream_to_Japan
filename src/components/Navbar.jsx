"use client";

import { useEffect, useState, memo } from "react";

function Navbar({ darkMode, toggleTheme }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    closeMenu();

    const target = document.querySelector(href);
    if (!target) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    window.dispatchEvent(new CustomEvent("warp-jump"));
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 140);
  };

  const links = [
    { href: "#home", label: "Home" },
    { href: "#dream", label: "My Dream" },
    { href: "#why-japan", label: "Why Japan" },
    { href: "#roadmap", label: "Roadmap" },
    { href: "#places", label: "Places" },
    { href: "#mission-status", label: "Mission Status" },
    { href: "#budget", label: "Budget" },
    { href: "#skills", label: "Skills" },
    { href: "#final-note", label: "Final Note" },
  ];

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-inner">
        <a
          href="#home"
          className="logo"
          onClick={(e) => handleNavClick(e, "#home")}
        >
          <span className="logo-circle">日</span>
          <span>My Japan Dream</span>
        </a>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>

          <button
            type="button"
            className="menu-btn"
            onClick={() => setOpen((prev) => !prev)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

export default memo(Navbar);