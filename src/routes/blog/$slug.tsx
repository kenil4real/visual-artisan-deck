import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { BlogHeader, BlogFooter } from "@/components/blog-chrome";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getPost, posts, type BlogBlock } from "@/lib/blog";

import "../../homepage.css";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Post"} — The Kekera Growth Ledger` },
      {
        name: "description",
        content: loaderData?.excerpt ?? "A post from The Kekera Growth Ledger.",
      },
      { property: "og:title", content: `${loaderData?.title ?? "Post"} — The Kekera Growth Ledger` },
      { property: "og:description", content: loaderData?.excerpt ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/blog/${loaderData?.slug ?? ""}/` },
      { property: "og:image", content: "https://www.kekerainc.com/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.kekerainc.com/og-image.png" },
    ],
    links: [{ rel: "canonical", href: `/blog/${loaderData?.slug ?? ""}/` }],
  }),
  component: BlogPost,
});

function Block({ block }: { block: BlogBlock }) {
  if (block.type === "h2") {
    return <h2>{block.text}</h2>;
  }
  if (block.type === "quote") {
    return <blockquote>{block.text}</blockquote>;
  }
  return <p>{block.text}</p>;
}

function BlogPost() {
  const post = Route.useLoaderData();
  const index = posts.findIndex((p) => p.slug === post.slug);
  const next = posts[(index + 1) % posts.length];

  return (
    <div className="kekera-home">
      <BlogHeader />

      <article className="blog-article">
        <div className="wrap">
          <div className="ba-narrow">
            <Link to="/blog" className="ba-back">
              <span aria-hidden="true">←</span> The Growth Ledger
            </Link>
            <p className="kick">The Kekera Blog</p>
            <h1>{post.title}</h1>
            <p className="blog-meta ba-meta">
              <span>{post.dateLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{post.readTime}</span>
              <span aria-hidden="true">·</span>
              <span>By the Kekera crew</span>
            </p>
          </div>
        </div>

        <div className="wrap">
          <div className="ba-img">
            <img src={post.image} alt={post.imageAlt} width={1600} height={1000} />
          </div>
        </div>

        <div className="wrap">
          <div className="ba-narrow ba-prose">
            {post.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </div>
      </article>

      <section className="section" aria-label="Next post">
        <div className="wrap">
          <div className="ba-narrow ba-next">
            <p className="kick">Keep reading</p>
            <Link to="/blog/$slug" params={{ slug: next.slug }} className="ba-next-link">
              <span className="ba-next-title">{next.title}</span>
              <span className="ba-next-arr" aria-hidden="true">
                →
              </span>
            </Link>
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
              What we are seeing across client accounts, in your inbox. No spam, no fluff.
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
