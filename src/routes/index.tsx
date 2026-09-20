import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Menu,
  Paperclip,
  Pause,
  Play,
  Plus,
  X,
} from "lucide-react";

import heroImage from "@/assets/hero-production.jpg";
import productImage from "@/assets/product-film.jpg";
import industrialImage from "@/assets/industrial-film.jpg";
import droneImage from "@/assets/drone-aerial.jpg";
import photoImage from "@/assets/photography-set.jpg";
import testimonialImage from "@/assets/testimonial-set.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const description =
  "Professional video production, photography, drone cinematography, animation, B-roll, product videos, virtual tours, and visual storytelling for businesses and organizations.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Professional Video Production & Visual Content | [COMPANY NAME]" },
      { name: "description", content: description },
      { property: "og:title", content: "Professional Video Production & Visual Content | [COMPANY NAME]" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "[COMPANY NAME]",
          description,
          email: "[COMPANY EMAIL]",
          telephone: "[PHONE NUMBER]",
          address: { "@type": "PostalAddress", addressLocality: "[CITY / LOCATION]" },
        }),
      },
    ],
  }),
  component: Index,
});

const navItems = ["Work", "Services", "Industries", "Process", "About", "Contact"];

const services = [
  ["Video Production", "Professional production for brands, campaigns, events, organizations, and digital platforms."],
  ["B-Roll Production", "Location-specific footage for filmmakers, agencies, newsrooms, and media teams without a traveling crew."],
  ["Product Videos", "Clear, considered films that make features, benefits, and real-world applications easy to understand."],
  ["Explainer Videos", "Complicated products, software, procedures, and ideas made simple through visual storytelling."],
  ["Virtual Video Tours", "Immersive journeys through facilities, campuses, equipment, properties, and capabilities."],
  ["Drone Cinematography", "Aerial perspective for real estate, events, industrial work, film, television, and destination stories."],
  ["Professional Photography", "Purpose-built imagery for products, people, facilities, real estate, and campaigns."],
  ["Motion Graphics & Animation", "Animated systems for advertising, presentations, education, and digital campaigns."],
  ["Whiteboard Animation", "Direct illustrated storytelling for educational, technical, and instructional communication."],
  ["Time-Lapse Production", "Long-duration documentation transformed into compelling progress and promotional content."],
  ["Construction Site Monitoring", "Reliable visual documentation of progress, milestones, processes, and completed work."],
  ["Testimonial Videos", "Authentic customer stories designed to earn trust and communicate real-world value."],
];

const featured = [
  { label: "01 / Product", title: "Make the product impossible to overlook.", image: productImage, alt: "Cinema camera filming a sculptural product on a studio set", note: "Product films · Explainers · Motion" },
  { label: "02 / Place", title: "Show the scale. Reveal the experience.", image: droneImage, alt: "Aerial view of contemporary architecture by a lake", note: "Drone · Virtual tours · Real estate" },
  { label: "03 / Industry", title: "Bring complex work into clear focus.", image: industrialImage, alt: "Camera operator filming inside a large manufacturing facility", note: "B-roll · Time-lapse · Monitoring" },
  { label: "04 / People", title: "Create portraits with a point of view.", image: photoImage, alt: "Photographer creating an editorial portrait in a studio", note: "Photography · Campaigns · Editorial" },
];

const projects = [
  { title: "Form / Function", category: "Product Film", industry: "Sample project — replace", image: productImage, size: "lg:col-span-7" },
  { title: "Built in Motion", category: "Industrial B-Roll", industry: "Sample project — replace", image: industrialImage, size: "lg:col-span-5" },
  { title: "Above the Horizon", category: "Drone Cinematography", industry: "Sample project — replace", image: droneImage, size: "lg:col-span-5" },
  { title: "A Human Point of View", category: "Brand Documentary", industry: "Sample project — replace", image: testimonialImage, size: "lg:col-span-7" },
];

const industries = [
  ["Education", "Recruit, explain, teach, and show the life of a campus."],
  ["Healthcare", "Make expertise, care, facilities, and patient stories human."],
  ["Beauty & Fashion", "Turn products and people into distinctive campaign worlds."],
  ["Real Estate", "Let buyers experience space, context, and detail before a visit."],
  ["Travel & Tourism", "Create desire through place, movement, culture, and atmosphere."],
  ["Industrial & Manufacturing", "Make complex processes, scale, and capability visible."],
  ["Construction", "Document progress while building a library of marketing content."],
  ["Film & Media", "Capture flexible, location-specific footage that cuts seamlessly."],
  ["Corporate / Business", "Communicate strategy, culture, proof, and customer value."],
];

const process = [
  ["Discovery", "We understand your business, audience, goals, message, and creative direction."],
  ["Planning", "We shape the concept, script, storyboard, locations, schedule, shot list, and production plan."],
  ["Production", "Our team captures video, photography, aerial footage, interviews, B-roll, and every required detail."],
  ["Editing", "We bring it together through edit, color, sound, motion graphics, animation, and finishing."],
  ["Delivery", "You receive polished content prepared for the platforms, formats, and moments where it must work."],
];

const benefits = [
  "Communicate complex information visually",
  "Showcase products and services",
  "Increase audience engagement",
  "Create stronger first impressions",
  "Support campaigns across every channel",
  "Document facilities and projects",
  "Build credibility through real stories",
  "Create a reusable visual content library",
];

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <a href="#top" aria-label="[COMPANY NAME] home" className={`group flex items-center gap-2 ${inverse ? "text-paper" : "text-foreground"}`}>
      <span className="grid size-8 grid-cols-2 gap-0.5 border border-current p-1" aria-hidden="true">
        <span className="bg-current" /><span className="bg-signal" /><span className="bg-signal" /><span className="bg-current" />
      </span>
      <span className="font-display text-sm font-bold uppercase leading-none">[Company<br />Name]</span>
    </a>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 48);
    handle(); window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? "bg-paper/95 text-foreground shadow-sm backdrop-blur-md" : "text-paper"}`}>
      <nav className="page-gutter flex h-20 items-center justify-between" aria-label="Main navigation">
        <BrandMark inverse={!scrolled} />
        <div className="hidden items-center gap-6 xl:flex">
          {navItems.map((item) => <a key={item} href={`#${item.toLowerCase()}`} className="label-caps story-link py-2">{item}</a>)}
        </div>
        <div className="flex items-center gap-3">
          <Button variant={scrolled ? "editorial" : "inverted"} size="editorial" onClick={() => goTo("contact")} className="hidden sm:inline-flex">Request a quote <ArrowRight /></Button>
          <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu className="size-5" /></Button>
        </div>
      </nav>
      <div className={`fixed inset-0 z-50 flex flex-col bg-ink text-paper transition-transform duration-500 xl:hidden ${open ? "translate-y-0" : "-translate-y-full"}`} aria-hidden={!open}>
        <div className="page-gutter flex h-20 items-center justify-between"><BrandMark inverse /><Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setOpen(false)}><X /></Button></div>
        <div className="page-gutter flex flex-1 flex-col justify-center gap-1">
          {navItems.map((item, index) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)} className="font-display text-5xl uppercase leading-none sm:text-7xl"><sup className="mr-3 text-xs text-signal">0{index + 1}</sup>{item}</a>)}
        </div>
        <div className="page-gutter pb-8"><Button variant="inverted" size="editorial" className="w-full" onClick={() => { setOpen(false); goTo("contact"); }}>Request a quote <ArrowRight /></Button></div>
      </div>
    </header>
  );
}

function Marquee({ dark = false }: { dark?: boolean }) {
  const words = "VIDEO PRODUCTION ✦ PHOTOGRAPHY ✦ DRONE ✦ ANIMATION ✦ STORYTELLING ✦ ";
  return <div className={`overflow-hidden border-y py-4 ${dark ? "border-paper/20 bg-ink text-paper" : "border-foreground/20 bg-signal text-paper"}`} aria-hidden="true"><div className="marquee-track flex whitespace-nowrap font-display text-xl font-semibold uppercase sm:text-3xl"><span>{words}</span><span>{words}</span></div></div>;
}

function SectionHeader({ label, title, light = false }: { label: string; title: string; light?: boolean }) {
  return <header className={`grid gap-8 lg:grid-cols-12 ${light ? "text-paper" : "text-foreground"}`}><p className="label-caps lg:col-span-3">{label}</p><h2 className="section-display lg:col-span-9">{title}</h2></header>;
}

function MediaImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <div className={`overflow-hidden bg-muted ${className}`}><img src={src} alt={alt} loading="lazy" width={1600} height={1200} className="media-zoom h-full w-full object-cover group-hover:scale-[1.035]" /></div>;
}

function ShowreelDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [playing, setPlaying] = useState(false);
  return <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) setPlaying(false); }}><DialogContent className="max-w-6xl border-paper/20 bg-ink p-0 text-paper shadow-2xl sm:rounded-none"><DialogTitle className="sr-only">[COMPANY NAME] showreel</DialogTitle><DialogDescription className="sr-only">Showreel media placeholder ready for the final production reel.</DialogDescription><div className="relative aspect-video overflow-hidden"><img src={heroImage} alt="Film crew preparing a cinematic production" className={`h-full w-full object-cover transition duration-1000 ${playing ? "scale-105 opacity-70" : ""}`} /><div className="absolute inset-0 bg-ink/35" /><div className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center"><Button variant="inverted" size="icon" className="size-20 rounded-full" aria-label={playing ? "Pause showreel placeholder" : "Play showreel placeholder"} onClick={() => setPlaying(!playing)}>{playing ? <Pause className="size-6" /> : <Play className="ml-1 size-6" />}</Button><p className="label-caps">{playing ? "Showreel media placeholder — replace with final film" : "Play showreel"}</p></div></div></DialogContent></Dialog>;
}

function Index() {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    setSubmitted(true); form.reset();
  };
  return <main id="top">
    <Navigation />

    <section className="relative min-h-[94svh] overflow-hidden bg-ink text-paper">
      <img src={heroImage} alt="Professional cinema crew creating a film in an architectural interior" width={1920} height={1088} fetchPriority="high" className="hero-drift absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-ink/45" /><div className="absolute inset-0 bg-linear-to-t from-ink via-transparent to-ink/25" />
      <div className="page-gutter relative flex min-h-[94svh] flex-col justify-end pb-9 pt-28">
        <p className="label-caps hero-rise mb-6" style={{ animationDelay: ".1s" }}>Video production <span className="text-signal">•</span> Photography <span className="text-signal">•</span> Visual storytelling</p>
        <h1 className="editorial-display max-w-[15ch] uppercase">
          <span className="hero-rise block" style={{ animationDelay: ".18s" }}>Professional</span>
          <span className="hero-rise block" style={{ animationDelay: ".28s" }}>video <span className="text-signal">&</span> visual</span>
          <span className="hero-rise block" style={{ animationDelay: ".38s" }}>content that</span>
          <span className="hero-rise block" style={{ animationDelay: ".48s" }}>brings brands to life.</span>
        </h1>
        <div className="mt-8 grid gap-7 border-t border-paper/35 pt-5 md:grid-cols-12 md:items-end">
          <p className="max-w-xl text-sm leading-relaxed text-paper/80 md:col-span-5 md:col-start-5">Custom production, photography, animation, aerial cinematography, and visual storytelling for businesses, organizations, and creators.</p>
          <div className="flex flex-wrap gap-3 md:col-span-3 md:justify-end"><Button variant="inverted" size="editorial" onClick={() => goTo("contact")}>Request a quote <ArrowRight /></Button><Button variant="editorialOutline" size="editorial" onClick={() => goTo("work")}>View work</Button></div>
        </div>
        <a href="#intro" className="label-caps mt-9 flex w-max items-center gap-3">Scroll to explore <span className="pulse-line inline-block h-8 w-px bg-signal" /></a>
      </div>
    </section>

    <Marquee />

    <section id="intro" className="page-gutter py-24 sm:py-36 lg:py-48">
      <div className="grid gap-12 lg:grid-cols-12">
        <p className="label-caps lg:col-span-2">The studio position</p>
        <div className="lg:col-span-10"><h2 className="section-display max-w-[15ch]">We create visual stories that make businesses, products, people, and places <span className="text-signal">impossible to ignore.</span></h2><p className="mt-12 max-w-xl text-lg leading-relaxed lg:ml-auto">We combine professional production, cinematic storytelling, photography, animation, aerial cinematography, and post-production to make ideas clear—and make an impression.</p></div>
      </div>
    </section>

    <section id="services" className="page-gutter bg-ink py-24 text-paper sm:py-36">
      <SectionHeader label="What we do / 01" title="Visual content, from concept to final frame." light />
      <p className="mt-10 max-w-xl text-paper/65 lg:ml-[25%]">From a single product video to a complete content campaign, we handle the process from planning through delivery.</p>
      <div className="mt-20 border-t border-paper/25">
        {services.map(([title, copy], index) => <article key={title} className="group grid gap-4 border-b border-paper/25 py-7 transition-colors hover:bg-paper hover:px-5 hover:text-ink sm:grid-cols-12 sm:items-start"><span className="label-caps text-signal sm:col-span-1">{String(index + 1).padStart(2, "0")}</span><h3 className="font-display text-3xl leading-none transition-transform group-hover:translate-x-2 sm:col-span-5 sm:text-5xl">{title}</h3><p className="max-w-lg text-sm leading-relaxed opacity-65 sm:col-span-5 sm:col-start-8">{copy}</p><Plus className="hidden size-5 transition-transform group-hover:rotate-45 sm:col-start-12 sm:row-start-1 sm:block" /></article>)}
      </div>
    </section>

    <section className="page-gutter py-24 sm:py-36">
      <SectionHeader label="Featured capabilities / 02" title="Different stories need different ways of seeing." />
      <div className="mt-20 space-y-28">
        {featured.map((item, index) => <article key={item.label} className={`group grid items-end gap-7 lg:grid-cols-12 ${index % 2 ? "" : ""}`}><MediaImage src={item.image} alt={item.alt} className={`aspect-[4/3] lg:col-span-8 ${index % 2 ? "lg:col-start-5 lg:row-start-1" : ""}`} /><div className={`lg:col-span-4 ${index % 2 ? "lg:col-start-1 lg:row-start-1" : ""}`}><p className="label-caps text-signal">{item.label}</p><h3 className="mt-4 font-display text-4xl leading-[.95] sm:text-6xl">{item.title}</h3><p className="mt-6 text-sm text-muted-foreground">{item.note}</p><button className="label-caps mt-8 flex items-center gap-3 border-b border-current pb-2" onClick={() => goTo("contact")}>Explore service <ArrowRight className="size-4" /></button></div></article>)}
      </div>
    </section>

    <section id="work" className="bg-paper py-24 sm:py-36">
      <div className="page-gutter"><SectionHeader label="Selected work / 03" title="Projects made to be seen." /><p className="mt-8 max-w-lg text-muted-foreground lg:ml-[25%]">A flexible case-study system, ready for your real project titles, clients, footage, and stories.</p></div>
      <div className="page-gutter mt-16 grid gap-x-5 gap-y-16 lg:grid-cols-12">
        {projects.map((project, index) => <article key={project.title} className={`group ${project.size}`}><MediaImage src={project.image} alt={`${project.category} sample imagery`} className={`${index === 1 || index === 2 ? "aspect-[4/5]" : "aspect-[16/10]"}`} /><div className="mt-4 flex items-start justify-between gap-5 border-t border-foreground/25 pt-3"><div><h3 className="font-display text-2xl">{project.title}</h3><p className="label-caps mt-2 text-signal">{project.industry}</p></div><p className="text-xs text-muted-foreground">{project.category}</p></div></article>)}
      </div>
    </section>

    <section className="page-gutter bg-ink py-24 text-paper sm:py-36">
      <div className="mb-10 flex items-end justify-between"><div><p className="label-caps text-signal">Showreel / 04</p><h2 className="section-display mt-4">Watch the work.</h2></div><ArrowDown className="hidden size-12 sm:block" /></div>
      <button className="group relative block aspect-video w-full overflow-hidden text-paper" onClick={() => setShowreelOpen(true)} aria-label="Open showreel"><img src={heroImage} alt="Film production showreel poster" loading="lazy" width={1920} height={1088} className="media-zoom h-full w-full object-cover group-hover:scale-[1.025]" /><span className="absolute inset-0 bg-ink/30" /><span className="absolute inset-0 grid place-items-center"><span className="flex size-24 items-center justify-center rounded-full bg-paper text-ink transition-transform group-hover:scale-110"><Play className="ml-1 size-7" /></span></span><span className="label-caps absolute bottom-5 left-5">Play showreel · Media placeholder</span></button>
    </section>

    <section id="industries" className="page-gutter py-24 sm:py-36">
      <SectionHeader label="Who we work with / 05" title="Visual storytelling for every kind of business." />
      <div className="mt-20 grid border-l border-t border-foreground/25 md:grid-cols-2 lg:grid-cols-3">
        {industries.map(([title, copy], index) => <article key={title} className="group min-h-64 border-b border-r border-foreground/25 p-6 transition-colors hover:bg-signal hover:text-paper"><p className="label-caps">0{index + 1}</p><h3 className="mt-16 font-display text-3xl">{title}</h3><p className="mt-4 max-w-xs text-sm leading-relaxed opacity-65">{copy}</p></article>)}
      </div>
    </section>

    <section className="page-gutter overflow-hidden bg-signal py-24 text-paper sm:py-36">
      <p className="label-caps">Why professional visuals? / 06</p><h2 className="section-display mt-7 max-w-[16ch]">Good visuals don't just look better. They communicate better.</h2>
      <ol className="mt-20 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">{benefits.map((benefit, index) => <li key={benefit} className="border-t border-paper/35 py-6"><span className="font-display text-6xl text-paper/35">{String(index + 1).padStart(2, "0")}</span><p className="mt-5 max-w-[17rem] text-lg font-semibold">{benefit}</p></li>)}</ol>
    </section>

    <section id="process" className="page-gutter py-24 sm:py-36">
      <SectionHeader label="How we work / 07" title="From the first idea to the final frame." />
      <div className="mt-20 lg:ml-[25%]">{process.map(([title, copy], index) => <article key={title} className="group grid gap-5 border-t border-foreground/25 py-8 sm:grid-cols-[7rem_1fr_1fr]"><span className="font-display text-5xl text-signal">0{index + 1}</span><h3 className="font-display text-4xl">{title}</h3><p className="max-w-lg text-sm leading-relaxed text-muted-foreground">{copy}</p></article>)}</div>
    </section>

    <section id="about" className="grid bg-ink text-paper lg:grid-cols-2">
      <div className="page-gutter flex flex-col justify-center py-24 lg:py-32"><p className="label-caps text-signal">The difference / 08</p><h2 className="section-display mt-6">We don't just capture footage. We build visual stories.</h2><p className="mt-10 max-w-xl leading-relaxed text-paper/65">Every project is different. We combine production expertise, creative thinking, technical execution, and storytelling to create content that serves a real purpose.</p><div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-paper/25 pt-5 label-caps"><span>Story</span><span>Strategy</span><span>Quality</span><span>Communication</span><span>Reliability</span></div></div>
      <img src={testimonialImage} alt="Professional interview production in progress" loading="lazy" width={1600} height={1104} className="h-full min-h-[34rem] w-full object-cover" />
    </section>

    <section className="page-gutter py-24 sm:py-36">
      <p className="label-caps text-signal">Client voice / Placeholder</p><blockquote className="mt-12 max-w-6xl font-display text-4xl leading-tight sm:text-7xl">“Add a verified client testimonial here. This section is intentionally ready for a real story—not a fabricated one.”</blockquote><footer className="mt-12 border-t border-foreground/25 pt-5 text-sm text-muted-foreground">[CLIENT NAME] · [COMPANY] · [INDUSTRY]</footer>
    </section>

    <section className="group relative min-h-[75svh] overflow-hidden bg-ink text-paper">
      <img src={photoImage} alt="Editorial photography production set" loading="lazy" width={1200} height={1504} className="media-zoom absolute inset-0 h-full w-full object-cover object-center group-hover:scale-[1.025]" /><div className="absolute inset-0 bg-ink/60" /><div className="page-gutter relative flex min-h-[75svh] flex-col justify-center py-24"><p className="label-caps text-signal">Start a project</p><h2 className="section-display mt-6 max-w-[13ch]">Have a project in mind? Let's create something that gets noticed.</h2><p className="mt-8 max-w-lg text-paper/75">Tell us what you're working on and what you need to communicate. We'll help shape the right production approach.</p><div className="mt-9 flex flex-wrap gap-3"><Button variant="inverted" size="editorial" onClick={() => goTo("contact")}>Request a project quote <ArrowRight /></Button><Button variant="editorialOutline" size="editorial" onClick={() => goTo("contact")}>Schedule a consultation</Button></div></div>
    </section>

    <section id="contact" className="page-gutter bg-paper py-24 sm:py-36">
      <SectionHeader label="Project inquiry / 09" title="Tell us what you want to make." />
      <form className="mt-20 grid gap-x-8 gap-y-8 lg:ml-[25%] lg:grid-cols-2" onSubmit={submit} noValidate={false}>
        <Field label="Name" required><Input name="name" required placeholder="Your name" /></Field>
        <Field label="Company"><Input name="company" placeholder="Company or organization" /></Field>
        <Field label="Email" required><Input name="email" type="email" required placeholder="name@company.com" /></Field>
        <Field label="Phone"><Input name="phone" type="tel" placeholder="Phone number" /></Field>
        <Field label="Project type" required><NativeSelect name="projectType" required options={["Select a project type", "Video Production", "B-Roll", "Product Video", "Explainer Video", "Virtual Tour", "Drone Cinematography", "Photography", "Motion Graphics", "Animation", "Time-Lapse", "Construction Monitoring", "Testimonial Video", "Other"]} /></Field>
        <Field label="Industry" required><NativeSelect name="industry" required options={["Select an industry", "Education", "Healthcare", "Beauty & Fashion", "Real Estate", "Travel & Tourism", "Industrial & Manufacturing", "Construction", "Film & Media", "Corporate / Business", "Other"]} /></Field>
        <Field label="Desired timeline"><Input name="timeline" placeholder="When do you need it?" /></Field>
        <Field label="Budget range"><NativeSelect name="budget" options={["Select a range", "Under $2,500", "$2,500–$5,000", "$5,000–$10,000", "$10,000–$25,000", "$25,000+", "Not sure yet"]} /></Field>
        <Field label="Project description" required className="lg:col-span-2"><Textarea name="description" required rows={6} placeholder="What are you creating, who is it for, and what should it achieve?" /></Field>
        <Field label="Attach reference files" className="lg:col-span-2"><label className="flex min-h-24 cursor-pointer items-center justify-between border border-dashed border-input px-5 transition-colors hover:border-signal"><span className="text-sm text-muted-foreground">Choose files to attach</span><Paperclip className="size-5" /><Input name="references" type="file" multiple className="sr-only" /></label></Field>
        <Field label="Preferred contact method" className="lg:col-span-2"><div className="flex flex-wrap gap-5">{["Email", "Phone", "Video Call"].map((method) => <label key={method} className="flex cursor-pointer items-center gap-2 text-sm"><input type="radio" name="contactMethod" value={method} defaultChecked={method === "Email"} className="size-4 accent-signal" />{method}</label>)}</div></Field>
        <div className="flex flex-wrap items-center gap-5 lg:col-span-2"><Button type="submit" variant="editorial" size="editorial">Send project inquiry <ArrowRight /></Button><p className="max-w-md text-xs leading-relaxed text-muted-foreground">Demo form: connect your preferred email or project system before publishing to receive submissions.</p></div>
        {submitted && <div role="status" className="flex items-center gap-3 border border-signal bg-signal/10 p-4 text-sm lg:col-span-2"><Check className="size-5 text-signal" />Your inquiry was validated successfully. Connect a form destination to deliver it.</div>}
      </form>
    </section>

    <Footer />
    <ShowreelDialog open={showreelOpen} setOpen={setShowreelOpen} />
  </main>;
}

function Field({ label, required, children, className = "" }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="label-caps mb-3 block">{label}{required && <span className="ml-1 text-signal" aria-hidden="true">*</span>}</span>{children}</label>;
}

function NativeSelect({ options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  return <select {...props} defaultValue="" className="h-11 w-full appearance-none rounded-none border border-input bg-transparent px-3 text-sm focus-visible:ring-1 focus-visible:ring-ring">{options.map((option, index) => <option key={option} value={index === 0 ? "" : option} disabled={index === 0}>{option}</option>)}</select>;
}

function Footer() {
  return <footer className="bg-ink text-paper"><Marquee dark /><div className="page-gutter py-16"><div className="grid gap-12 border-b border-paper/25 pb-16 md:grid-cols-12"><div className="md:col-span-5"><BrandMark inverse /><p className="mt-8 max-w-sm text-sm leading-relaxed text-paper/60">Full-service video production, photography, aerial cinematography, animation, and visual storytelling.</p></div><div className="grid grid-cols-2 gap-8 md:col-span-4"><div><p className="label-caps mb-5 text-signal">Navigate</p>{navItems.map((item) => <a key={item} href={`#${item.toLowerCase()}`} className="mb-2 block text-sm">{item}</a>)}</div><div><p className="label-caps mb-5 text-signal">Social</p>{["Instagram", "LinkedIn", "YouTube", "Vimeo"].map((item) => <span key={item} className="mb-2 block text-sm text-paper/70">{item}</span>)}</div></div><div className="md:col-span-3"><p className="label-caps mb-5 text-signal">Contact placeholders</p><p className="text-sm">[COMPANY EMAIL]</p><p className="mt-2 text-sm">[PHONE NUMBER]</p><p className="mt-2 text-sm">[CITY / LOCATION]</p></div></div><p className="section-display py-16 uppercase">Let's make something worth watching.</p><div className="flex flex-col gap-3 border-t border-paper/25 pt-5 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 [COMPANY NAME]. All rights reserved.</p><div className="flex gap-5"><span>Privacy Policy</span><span>Terms</span></div></div></div></footer>;
}