import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { BlogHeader, BlogFooter } from "@/components/blog-chrome";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getPost, posts, type BlogBlock } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Post"} — The Kekera Growth Ledger` },
      { name: "description", content: loaderData?.excerpt ?? "A post from The Kekera Growth Ledger." },
      { property: "og:title", content: `${loaderData?.title ?? "Post"} — The Kekera Growth Ledger` },
      { property: "og:description", content: loaderData?.excerpt ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/blog/${loaderData?.slug ?? ""}/` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `/blog/${loaderData?.slug ?? ""}/` }],
  }),
  component: BlogPost,
});

function Block({ block }: { block: BlogBlock }) {
  if (block.type === "h2") {
    return <h2 className="mt-12 font-display text-2xl leading-tight sm:text-3xl">{block.text}</h2>;
  }
  if (block.type === "quote") {
    return (
      <blockquote className="my-10 border-l-2 border-signal pl-6 font-display text-xl leading-snug sm:text-2xl">
        {block.text}
      </blockquote>
    );
  }
  return (
    <p className="mt-6 text-base leading-relaxed text-foreground/85 sm:text-lg">{block.text}</p>
  );
}

function BlogPost() {
  const post = Route.useLoaderData();
  const index = posts.findIndex((p) => p.slug === post.slug);
  const next = posts[(index + 1) % posts.length];

  return (
    <main className="min-h-screen bg-paper text-foreground">
      <BlogHeader />

      <article className="page-gutter pt-14 sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="label-caps inline-flex items-center gap-2 text-muted-foreground hover:text-signal"
          >
            <ArrowLeft className="size-4" /> All field notes
          </Link>
          <h1 className="mt-8 font-display text-4xl leading-[1.02] sm:text-6xl">{post.title}</h1>
          <p className="label-caps mt-6 flex flex-wrap items-center gap-3 text-muted-foreground">
            <span>{post.dateLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
            <span aria-hidden="true">·</span>
            <span>By the Kekera crew</span>
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl overflow-hidden bg-muted">
          <img
            src={post.image}
            alt={post.imageAlt}
            width={1600}
            height={1000}
            className="aspect-[16/10] w-full object-cover"
          />
        </div>

        <div className="mx-auto max-w-3xl pb-4">
          {post.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </article>

      <section className="page-gutter py-16 sm:py-20" aria-label="Next post">
        <div className="mx-auto max-w-3xl border-t border-foreground/20 pt-10">
          <p className="label-caps text-signal">Keep reading</p>
          <Link
            to="/blog/$slug"
            params={{ slug: next.slug }}
            className="group mt-4 flex items-center justify-between gap-6"
          >
            <span className="font-display text-2xl leading-tight group-hover:underline group-hover:decoration-signal group-hover:underline-offset-8 sm:text-3xl">
              {next.title}
            </span>
            <ArrowRight
              className="size-6 shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      <section
        className="page-gutter bg-ink py-16 text-paper sm:py-20"
        aria-label="Newsletter signup"
      >
        <div className="mx-auto grid max-w-3xl gap-8">
          <div>
            <p className="label-caps text-signal">Newsletter</p>
            <h2 className="mt-4 font-display text-3xl leading-tight">The Growth Ledger, once a month.</h2>
            <p className="mt-4 text-sm leading-relaxed text-paper/70">
              What we are seeing across client accounts, in your inbox. No spam, no fluff.
            </p>
          </div>
          <NewsletterSignup dark />
        </div>
      </section>

      <BlogFooter />
    </main>
  );
}
