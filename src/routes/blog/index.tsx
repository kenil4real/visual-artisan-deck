import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { BlogHeader, BlogFooter } from "@/components/blog-chrome";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { posts } from "@/lib/blog";

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
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blog/" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [featured, ...rest] = posts;
  return (
    <main className="min-h-screen bg-paper text-foreground">
      <BlogHeader />

      <section className="page-gutter bg-ink pb-16 pt-16 text-paper sm:pb-24 sm:pt-24">
        <p className="label-caps text-signal">The Kekera blog</p>
        <h1 className="section-display mt-6 max-w-[12ch] uppercase">The Growth Ledger</h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-paper/70">
          Practical marketing notes for small businesses: what we are seeing across real accounts,
          what is working, and what we would stop doing. Written by the people who run it.
        </p>
      </section>

      <section className="page-gutter py-16 sm:py-24" aria-label="Blog posts">
        <Link
          to="/blog/$slug"
          params={{ slug: featured.slug }}
          className="group grid gap-8 lg:grid-cols-12 lg:items-end"
        >
          <div className="overflow-hidden bg-muted lg:col-span-8">
            <img
              src={featured.image}
              alt={featured.imageAlt}
              loading="eager"
              width={1600}
              height={1000}
              className="media-zoom aspect-[16/10] w-full object-cover group-hover:scale-[1.03]"
            />
          </div>
          <div className="lg:col-span-4">
            <p className="label-caps text-signal">Latest</p>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl group-hover:underline group-hover:decoration-signal group-hover:underline-offset-8">
              {featured.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{featured.excerpt}</p>
            <p className="label-caps mt-6 flex items-center gap-3 text-muted-foreground">
              {featured.dateLabel} <span aria-hidden="true">·</span> {featured.readTime}
            </p>
            <span className="label-caps mt-6 inline-flex items-center gap-2 border-b border-current pb-1">
              Read the post{" "}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        <div className="mt-16 grid gap-x-8 gap-y-14 border-t border-foreground/20 pt-14 sm:grid-cols-2">
          {rest.map((post) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="group block"
            >
              <div className="overflow-hidden bg-muted">
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  loading="lazy"
                  width={1200}
                  height={750}
                  className="media-zoom aspect-[16/10] w-full object-cover group-hover:scale-[1.03]"
                />
              </div>
              <h2 className="mt-6 font-display text-2xl leading-tight sm:text-3xl group-hover:underline group-hover:decoration-signal group-hover:underline-offset-8">
                {post.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
              <p className="label-caps mt-5 flex items-center gap-3 text-muted-foreground">
                {post.dateLabel} <span aria-hidden="true">·</span> {post.readTime}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="page-gutter bg-ink py-16 text-paper sm:py-24"
        aria-label="Newsletter signup"
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="label-caps text-signal">Newsletter</p>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-5xl">
              The Growth Ledger, once a month.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/70">
              One email a month: what we are seeing across client accounts, what is working, what we
              would stop doing. No spam, no fluff.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <NewsletterSignup dark />
          </div>
        </div>
      </section>

      <BlogFooter />
    </main>
  );
}
