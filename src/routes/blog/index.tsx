import { createFileRoute, Link } from "@tanstack/react-router";

import { BlogHeader, BlogFooter } from "@/components/blog-chrome";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { posts } from "@/lib/blog";

import "../../homepage.css";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "The Growth Ledger — The Kekera Blog" },
      {
        name: "description",
        content:
          "The Growth Ledger from Kekera: practical marketing notes for small businesses — retainers, ad creative, local SEO, and what actually moves the needle.",
      },
      { property: "og:title", content: "The Growth Ledger — The Kekera Blog" },
      {
        property: "og:description",
        content:
          "Practical marketing notes for small businesses: retainers, ad creative, local SEO, and what actually moves the needle.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/blog/" },
      { property: "og:image", content: "https://www.kekerainc.com/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.kekerainc.com/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "/blog/" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [featured, ...rest] = posts;
  return (
    <div className="kekera-home">
      <BlogHeader />

      <header className="blog-hero">
        <div className="wrap">
          <p className="kick">The Kekera Blog</p>
          <h1>
            The Growth <em>Ledger</em>
          </h1>
          <p className="sec-lede">
            Practical marketing notes for small businesses: what we are seeing across real
            accounts, what is working, and what we would stop doing. Written by the people who
            run it.
          </p>
        </div>
      </header>

      <section className="section" aria-label="Blog posts">
        <div className="wrap">
          <Link to="/blog/$slug" params={{ slug: featured.slug }} className="blog-featured">
            <div className="bf-img">
              <img
                src={featured.image}
                alt={featured.imageAlt}
                loading="eager"
                width={1600}
                height={1000}
              />
            </div>
            <div className="bf-body">
              <p className="kick">Latest</p>
              <h2>{featured.title}</h2>
              <p className="bf-excerpt">{featured.excerpt}</p>
              <p className="blog-meta">
                {featured.dateLabel} <span aria-hidden="true">·</span> {featured.readTime}
              </p>
              <span className="blog-read">
                Read the post <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>

          <div className="ledger-list blog-list">
            {rest.map((post) => (
              <Link
                key={post.slug}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="l-row"
              >
                <span className="l-main">
                  <span className="l-title">{post.title}</span>
                  <span className="l-excerpt">{post.excerpt}</span>
                </span>
                <span className="l-meta">
                  {post.dateLabel} <span aria-hidden="true">·</span> {post.readTime}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="blog-newsletter" aria-label="Newsletter signup">
        <div className="wrap nl-grid">
          <div>
            <p className="kick">Newsletter</p>
            <h2>
              The Growth Ledger, <em>once a month.</em>
            </h2>
            <p className="nl-lede">
              One email a month: what we are seeing across client accounts, what is working,
              what we would stop doing. No spam, no fluff.
            </p>
          </div>
          <div>
            <NewsletterSignup />
          </div>
        </div>
      </section>

      <BlogFooter />
    </div>
  );
}
