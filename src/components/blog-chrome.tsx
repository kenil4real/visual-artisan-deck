import { useState } from "react";
import { Link } from "@tanstack/react-router";

const NAV = [
  { label: "Services", href: "/#services" },
  { label: "Results", href: "/#results" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/#about" },
];

export function BlogHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="nav" aria-label="Primary">
        <div className="nav-in">
          <Link to="/" className="wordmark" aria-label="Kekera Inc. — home">
            <span className="mark" aria-hidden="true" />
            <span className="wm">KEKERA</span>
          </Link>
          <ul className="nav-links">
            {NAV.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
            <li>
              <Link to="/blog" aria-current="page">
                Blog
              </Link>
            </li>
          </ul>
          <span className="nav-ctas">
            <a className="btn btn-accent nav-cta" href="/#contact">
              Get My Kekera Growth Review
            </a>
            <span className="micro">We reply within one business day</span>
          </span>
          <button
            className="burger"
            aria-expanded={open}
            aria-controls="blog-mmenu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </nav>
      <div className={`mmenu${open ? " open" : ""}`} id="blog-mmenu" aria-hidden={!open}>
        {NAV.map((l) => (
          <a key={l.label} className="mlink" href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <Link to="/blog" className="mlink" onClick={() => setOpen(false)}>
          Blog
        </Link>
        <div className="mfoot">
          <a className="btn btn-accent" href="/#contact">
            Get My Kekera Growth Review <span className="arr" aria-hidden="true">→</span>
          </a>
          <span className="micro">We reply within one business day.</span>
        </div>
      </div>
    </>
  );
}

export function BlogFooter() {
  return (
    <footer>
      <div className="foot-cols">
        <div>
          <div className="f-brand">
            <span className="mark" aria-hidden="true" />
            <span className="wm">KEKERA INC.</span>
          </div>
          <p className="f-blurb">
            A full-service growth agency: creative, ads, web, and AI analytics under one roof.
          </p>
          <p className="f-contact">
            <a href="mailto:Divyaramani@kekerainc.com">Divyaramani@kekerainc.com</a>
            <br />
            We reply within one business day.
          </p>
        </div>
        <div className="f-col">
          <h4>Explore</h4>
          <ul>
            <li>
              <a href="/#services">Services</a>
            </li>
            <li>
              <a href="/#results">Results</a>
            </li>
            <li>
              <a href="/#pricing">Pricing</a>
            </li>
            <li>
              <a href="/#about">About</a>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
          </ul>
        </div>
        <div className="f-col">
          <h4>Start</h4>
          <ul>
            <li>
              <a href="/#contact">Get My Kekera Growth Review</a>
            </li>
            <li>
              <a href="mailto:Divyaramani@kekerainc.com?subject=Growth%20call%20request">
                Book a Growth Call
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <div className="foot-bottom-in">
          <span>© 2026 Kekera Inc.</span>
          <span>
            <a href="/">kekerainc.com</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
