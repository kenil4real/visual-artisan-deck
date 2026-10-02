import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import "../homepage.css";
import bodyHtml from "../homepage-body.html?raw";
import homepageJs from "../homepage.js?raw";

const description =
  "Kekera Inc. — a full-service growth agency for small and midsize businesses. Creative, ads, web, and AI analytics under one roof.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kekera Inc. — More calls. More booked jobs. Less guesswork." },
      { name: "description", content: description },
      { property: "og:title", content: "Kekera Inc. — More calls. More booked jobs. Less guesswork." },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.kekerainc.com/" },
      { property: "og:image", content: "https://www.kekerainc.com/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Kekera Inc. — More calls. More booked jobs. Less guesswork.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.kekerainc.com/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: "https://www.kekerainc.com/" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Kekera Inc.",
          description,
          url: "https://www.kekerainc.com/",
          email: "Divyaramani@kekerainc.com",
        }),
      },
    ],
  }),
  component: Homepage,
});

function Homepage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const s = document.createElement("script");
    s.textContent = homepageJs;
    host.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="kekera-home"
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  );
}
