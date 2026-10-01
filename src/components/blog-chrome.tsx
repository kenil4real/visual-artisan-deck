import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-foreground/15 bg-paper/95 text-foreground backdrop-blur-md">
      <nav
        className="page-gutter flex h-16 items-center justify-between gap-3 sm:h-20"
        aria-label="Blog navigation"
      >
        <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="Kekera home">
          <span
            className="grid size-8 grid-cols-2 gap-0.5 border border-current p-1"
            aria-hidden="true"
          >
            <span className="bg-current" />
            <span className="bg-signal" />
            <span className="bg-signal" />
            <span className="bg-current" />
          </span>
          <span className="truncate font-display text-sm font-bold uppercase leading-none">
            Kekera
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            to="/blog"
            className="label-caps story-link whitespace-nowrap py-2"
            activeProps={{ className: "text-signal" }}
          >
            Blog
          </Link>
          <a href="/#contact" className="hidden sm:inline-flex">
            <Button variant="editorial" size="editorial">
              Request a quote <ArrowRight />
            </Button>
          </a>
        </div>
      </nav>
    </header>
  );
}

export function BlogFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="page-gutter py-16">
        <div className="grid gap-12 border-b border-paper/25 pb-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <Link
              to="/"
              className="flex min-w-0 items-center gap-2 text-paper"
              aria-label="Kekera home"
            >
              <span
                className="grid size-8 grid-cols-2 gap-0.5 border border-current p-1"
                aria-hidden="true"
              >
                <span className="bg-current" />
                <span className="bg-signal" />
                <span className="bg-signal" />
                <span className="bg-current" />
              </span>
              <span className="truncate font-display text-sm font-bold uppercase leading-none">
                Kekera
              </span>
            </Link>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-paper/60">
              Full-service digital agency for small businesses: media, marketing, paid advertising,
              web, SEO, branding, and AI analytics.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="label-caps mb-5 text-signal">Navigate</p>
            <Link to="/" className="mb-2 block text-sm hover:text-signal">
              Home
            </Link>
            <Link to="/blog" className="mb-2 block text-sm hover:text-signal">
              Blog
            </Link>
          </div>
          <div className="md:col-span-3">
            <p className="label-caps mb-5 text-signal">Contact</p>
            <a
              className="break-all text-sm hover:text-signal"
              href="mailto:Divyaramani@kekerainc.com"
            >
              Divyaramani@kekerainc.com
            </a>
          </div>
        </div>
        <Link
          to="/"
          className="label-caps mt-10 inline-flex items-center gap-3 text-paper/70 hover:text-signal"
        >
          <ArrowLeft className="size-4" /> Back to the main site
        </Link>
        <div className="mt-6 border-t border-paper/25 pt-5 text-xs text-paper/50">
          <p>© 2026 Kekera. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
