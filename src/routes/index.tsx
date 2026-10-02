import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import "../homepage.css";
import bodyHtml from "../homepage-body.html?raw";
import homepageJs from "../homepage.js?raw";

const description =
  "Kekera Inc. — a full-service growth agency for Berks County businesses. Creative, ads, web, and AI analytics under one roof.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kekera Inc. — More calls. More booked jobs. Less guesswork." },
      { name: "description", content: description },
      { property: "og:title", content: "Kekera Inc. — More calls. More booked jobs. Less guesswork." },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.kekerainc.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://www.kekerainc.com/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500;1,6..72,600&family=Libre+Franklin:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
      },
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
          telephone: "+1-267-690-1880",
          areaServed: "Berks County, PA",
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
