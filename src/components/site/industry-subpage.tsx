import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Compass,
  Cpu,
  GraduationCap,
  Home,
  MessageCircle,
  Pause,
  Play,
  RotateCcw,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  UserCheck,
  Volume2,
  VolumeX,
  Wrench,
  Zap,
} from "lucide-react";
import {
  IndustryData,
  allIndustriesList,
  getIndustryBySlug,
} from "./industries-data";
import {
  calendlyUrl,
  footerCopyright,
  footerDescription,
  footerEmail,
  footerIndiaAddress,
  footerIndiaMapUrl,
  footerPhone,
  footerTagline,
  footerUsaAddress,
  footerUsaMapUrl,
} from "./data";
import { NeonButton, Section, SectionHeading } from "./ui";
import {
  Header,
  Footer,
  FloatingWhatsAppButton,
  QuotePopupModal,
} from "./sections";

// Icon mapping helper
function renderIndustryIcon(iconName: string, className = "h-6 w-6") {
  switch (iconName) {
    case "Stethoscope":
      return <Stethoscope className={className} />;
    case "Briefcase":
      return <Briefcase className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    case "Building2":
      return <Building2 className={className} />;
    case "Compass":
      return <Compass className={className} />;
    case "Wrench":
      return <Wrench className={className} />;
    case "GraduationCap":
      return <GraduationCap className={className} />;
    case "ShoppingBag":
      return <ShoppingBag className={className} />;
    case "Home":
      return <Home className={className} />;
    case "UserCheck":
      return <UserCheck className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Scale":
      return <Scale className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export function IndustrySubpage({ data }: { data: IndustryData }) {
  // Video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showReplay, setShowReplay] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Auto play when page loads
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);

    const vid = videoRef.current;
    if (vid) {
      vid.muted = true;
      vid.play().catch(() => setIsPlaying(false));
    }
  }, [data.slug]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused || vid.ended) {
      vid.play();
      setIsPlaying(true);
      setShowReplay(false);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  };

  const handleReplay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    vid.play();
    setIsPlaying(true);
    setShowReplay(false);
  };

  return (
    <div id="top" className="min-h-screen w-full overflow-x-clip bg-background text-foreground selection:bg-purple-500 selection:text-white">
      {/* Universal Header with Industries Dropdown */}
      <Header />

      <main id="main-content" className="pt-20 lg:pt-24">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO SECTION (Assurix Hero v7 split layout) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-purple-50/20 to-white pt-10 pb-16 md:pt-16 md:pb-24 border-b border-slate-200/80">
          {/* Subtle Ambient Glowing Orbs */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-purple-200/40 via-violet-100/30 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 -right-20 h-[350px] w-[350px] rounded-full bg-purple-200/30 blur-2xl" />

          <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
            {/* Breadcrumb Navigation */}
            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
              <Link to="/" className="transition-colors hover:text-purple-600">
                Home
              </Link>
              <span>/</span>
              <Link to="/industries" className="transition-colors hover:text-purple-600">
                Industries
              </Link>
              <span>/</span>
              <span className="text-purple-600 font-bold">{data.name}</span>
            </div>

            {/* Split Hero Layout */}
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Left Column: Heading, Subtitle, Actions */}
              <div className="lg:col-span-7 xl:col-span-7">
                {/* Eyebrow Pill */}
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/90 px-3.5 py-1.5 text-xs font-bold text-purple-700 shadow-xs backdrop-blur-xs">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600 animate-pulse" />
                  <span>AI Video Production for {data.shortName}</span>
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-[2.85rem] leading-[1.12]">
                  {data.heroHeading}{" "}
                  <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent underline decoration-purple-300 decoration-wavy underline-offset-8">
                    {data.heroHighlight}
                  </span>
                </h1>

                <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl">
                  {data.heroSubheading}
                </p>

                {/* Primary CTA Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <NeonButton
                    href="#contact"
                    variant="primary"
                    size="md"
                    className="shadow-lg shadow-purple-500/20"
                  >
                    Get {data.shortName} Video Quote
                  </NeonButton>

                  <NeonButton
                    href={calendlyUrl}
                    variant="call"
                    size="md"
                    className="group"
                  >
                    <Calendar className="h-4 w-4 text-purple-700 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span>Book 30-min Strategy Call</span>
                  </NeonButton>

                  <a
                    href="https://wa.me/918177828748"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:border-[#25D366] hover:text-[#25D366] hover:shadow-sm"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                {/* Trust Badges Strip */}
                <div className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-purple-600" />
                    <span>48–72h Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-purple-600" />
                    <span>Script & Audio Included</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-purple-600" />
                    <span>Vertical 9:16 Format</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Assurix-Style Floating Stat Card */}
              <div className="lg:col-span-5 xl:col-span-5">
                <div className="relative overflow-hidden rounded-3xl border border-purple-900/40 bg-gradient-to-br from-[#0c0818] via-[#150f2e] to-[#0d071a] p-8 text-white shadow-2xl shadow-purple-950/40">
                  {/* Subtle Card Glow */}
                  <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-purple-500/20 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-violet-600/20 blur-2xl" />

                  <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
                        {renderIndustryIcon(allIndustriesList.find((i) => i.slug === data.slug)?.icon || "Sparkles", "h-5 w-5")}
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
                          {data.shortName} Performance
                        </div>
                        <div className="text-sm font-semibold text-white/90">
                          AI Video Production Metrics
                        </div>
                      </div>
                    </div>
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  </div>

                  {/* Vertical Metric Counter Items with Dividers */}
                  <div className="relative z-10 mt-6 divide-y divide-white/10">
                    {data.heroMetrics.map((metric, idx) => (
                      <div key={idx} className={`py-5 first:pt-0 last:pb-0`}>
                        <div className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-baseline gap-1">
                          <span className="bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                            {metric.value}
                          </span>
                        </div>
                        <div className="mt-1 text-xs font-medium uppercase tracking-wider text-purple-200/80">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Mini Banner */}
                  <div className="relative z-10 mt-6 rounded-2xl bg-white/5 border border-white/10 p-3.5 text-center">
                    <p className="text-xs font-medium text-slate-300">
                      Standard package starts at <span className="font-bold text-white">$79/reel</span> with full commercial rights.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: CURVED MEDIA / PARALLAX VIDEO SHOWCASE */}
        {/* ========================================================================= */}
        <section className="relative -mt-6 sm:-mt-10 max-w-5xl mx-auto px-5 z-20">
          <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border-4 border-white bg-slate-950 shadow-2xl shadow-purple-950/20">
            <div className="relative aspect-video w-full max-h-[520px] bg-slate-900 flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src={data.mediaVideoUrl}
                poster={data.mediaPosterUrl}
                playsInline
                loop
                muted={isMuted}
                onEnded={() => setShowReplay(true)}
                className="h-full w-full object-cover"
              />

              {/* Gradient Scrim for Controls */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/15">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span>{data.mediaBadge}</span>
              </div>

              {/* Overlay Controls */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {showReplay ? (
                    <button
                      onClick={handleReplay}
                      className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Watch Again</span>
                    </button>
                  ) : (
                    <button
                      onClick={togglePlay}
                      className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-slate-900 shadow-lg backdrop-blur-md transition-transform hover:scale-105"
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-slate-900" />}
                      <span>{isPlaying ? "Pause" : "Play Sample"}</span>
                    </button>
                  )}

                  <button
                    onClick={toggleMute}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 transition-colors hover:bg-black/80"
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-purple-300" />}
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-md">
                  <Clock className="h-3.5 w-3.5 text-purple-400" />
                  <span>9:16 Vertical Reel Mastered</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: 3 KEY BENEFIT CARDS (Assurix Service v5 style) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-slate-50/60 pt-20 pb-24 md:pt-28 md:pb-32 border-b border-slate-200/80">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            {/* Centered Intro Tagline */}
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-purple-600">
                Targeted Video Solutions
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
                {data.introSubhead}
              </h2>
            </div>

            {/* 3 Elevated Cards Grid with Top Floating Badges */}
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {data.benefitCards.map((card, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-3xl border border-slate-200/90 bg-white p-8 pt-12 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between"
                >
                  {/* Floating Circular / Square Icon Badge on Top Border */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-200 bg-gradient-to-tr from-purple-100 to-violet-50 text-purple-700 shadow-md shadow-purple-500/15 transition-transform duration-300 group-hover:scale-110 group-hover:from-purple-600 group-hover:to-violet-600 group-hover:text-white">
                    {renderIndustryIcon(card.iconName, "h-7 w-7")}
                  </div>

                  <div>
                    {/* Badge Pill */}
                    <div className="text-center">
                      <span className="inline-block rounded-full bg-purple-50 px-3 py-1 text-[11px] font-bold tracking-wide text-purple-700 border border-purple-100">
                        {card.formatTag}
                      </span>
                    </div>

                    <h3 className="mt-4 text-center text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {card.title}
                    </h3>

                    <p className="mt-3 text-center text-sm leading-relaxed text-slate-600">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 text-center">
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:text-purple-800 transition-all group-hover:gap-2.5"
                    >
                      <span>{card.ctaText}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: STORY & CREDIBILITY SPLIT (Assurix About v3 style) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-white py-20 md:py-28 border-b border-slate-200/80">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left Column: Visual Showcase + Floating Social Proof Pill */}
              <div className="relative lg:col-span-6">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-2xl bg-slate-950 aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={data.story.image}
                    alt={data.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Floating Social Proof Pill (Avatar Stack + Rating) */}
                <div className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:right-6 max-w-xs rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300">
                  <div className="flex items-center gap-3">
                    {/* Avatar Stack */}
                    <div className="flex -space-x-2 overflow-hidden">
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-purple-200 text-purple-900 font-bold text-[10px] flex items-center justify-center">
                        AI
                      </div>
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-indigo-200 text-indigo-900 font-bold text-[10px] flex items-center justify-center">
                        QC
                      </div>
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-pink-200 text-pink-900 font-bold text-[10px] flex items-center justify-center">
                        HD
                      </div>
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                        +
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">
                        {data.story.socialProofBadge}
                      </div>
                      <div className="text-[11px] font-semibold text-purple-600">
                        {data.story.socialProofSubtext}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Eyebrow, Heading, Description, Stat Pill, CTA */}
              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 border border-purple-200">
                  <span>✦ {data.story.eyebrow}</span>
                </div>

                <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                  {data.story.heading}
                </h2>

                <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600">
                  {data.story.description}
                </p>

                {/* Big Stat Pill + Action */}
                <div className="mt-8 flex flex-wrap items-center gap-6 sm:gap-8 pt-6 border-t border-slate-200">
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-slate-900">
                      {data.story.statValue}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {data.story.statLabel}
                    </div>
                  </div>

                  <div className="h-10 w-px bg-slate-200 hidden sm:block" />

                  <NeonButton
                    href="#contact"
                    variant="primary"
                    size="md"
                    className="shadow-md"
                  >
                    Get a Free Quote
                  </NeonButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: FEATURED PACKAGES & FORMATS TAILORED FOR THIS INDUSTRY */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-slate-50 py-20 md:py-28 border-b border-slate-200/80">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <SectionHeading
              eyebrow="Proven AI Video Formats"
              title={`High-Converting Video Formats for`}
              highlight={data.shortName}
              description={`Choose the production format tailored for your ${data.shortName.toLowerCase()} audience and growth goals.`}
            />

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {data.featuredFormats.map((format, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-3xl bg-white p-7 border transition-all duration-300 flex flex-col justify-between ${
                    format.popular
                      ? "border-purple-400 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/20"
                      : "border-slate-200/90 shadow-sm hover:shadow-lg"
                  }`}
                >
                  {format.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-lg font-bold text-slate-900">
                        {format.name}
                      </h3>
                      <div className="text-2xl font-black text-purple-700">
                        {format.price}
                      </div>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-purple-500" />
                      <span>Turnaround: {format.turnaround}</span>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {format.description}
                    </p>

                    <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
                      {format.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <Check className="h-4 w-4 text-purple-600 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-7 pt-4 border-t border-slate-100">
                    <NeonButton
                      href="#contact"
                      variant={format.popular ? "primary" : "secondary"}
                      size="sm"
                      className="w-full justify-center"
                    >
                      Order {format.name}
                    </NeonButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: INDUSTRY USE CASES REEL IDEAS */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-white py-16 md:py-24 border-b border-slate-200/80">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Content Playbook
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
                High-Impact Reel Concepts for {data.name}
              </h2>
              <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto">
                Proven video hooks and storytelling angles ready to script and produce for your brand.
              </p>
            </div>

            <div className="mt-10 grid gap-3.5 sm:grid-cols-2">
              {data.useCases.map((useCase, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition-colors hover:border-purple-300 hover:bg-purple-50/30"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{useCase}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Formatted in 9:16 vertical for Instagram Reels, TikTok & Shorts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: ALL INDUSTRIES DIRECTORY (Assurix Service v4 9-Card Grid) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-slate-50 py-20 md:py-28 border-b border-slate-200/80">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Explore Our Specializations
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
                Comprehensive AI Video Services by Industry
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Explore tailored AI video production workflows across major commercial sectors.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allIndustriesList.map((item) => {
                const isCurrent = item.slug === data.slug;
                return (
                  <Link
                    key={item.slug}
                    to={`/industries/$slug`}
                    params={{ slug: item.slug }}
                    className={`group relative rounded-2xl p-5 transition-all duration-300 border flex flex-col justify-between ${
                      isCurrent
                        ? "bg-purple-900 text-white border-purple-800 shadow-lg ring-2 ring-purple-500/30"
                        : "bg-white text-slate-900 border-slate-200/90 shadow-xs hover:border-purple-400 hover:shadow-md hover:-translate-y-1"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                            isCurrent
                              ? "bg-white/10 text-white"
                              : "bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white"
                          }`}
                        >
                          {renderIndustryIcon(item.icon, "h-5 w-5")}
                        </div>
                        {isCurrent && (
                          <span className="rounded-full bg-purple-700 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                            Current
                          </span>
                        )}
                      </div>

                      <h3
                        className={`mt-4 text-base font-bold ${
                          isCurrent ? "text-white" : "text-slate-900 group-hover:text-purple-600"
                        }`}
                      >
                        {item.name}
                      </h3>

                      <p
                        className={`mt-1.5 text-xs leading-relaxed ${
                          isCurrent ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {item.tagline}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                      <span className={isCurrent ? "text-purple-200" : "text-purple-600"}>
                        {isCurrent ? "Active Page" : "View Industry"}
                      </span>
                      <ArrowRight
                        className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-1 ${
                          isCurrent ? "text-purple-200" : "text-purple-600"
                        }`}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: INDUSTRY SPECIFIC FAQS */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-white py-16 md:py-24 border-b border-slate-200/80">
          <div className="mx-auto max-w-4xl px-5 sm:px-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Frequently Asked Questions
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Common Questions about {data.name} AI Videos
              </h2>
            </div>

            <div className="mt-10 space-y-3.5">
              {data.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs transition-colors hover:border-purple-300"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-900 transition-colors hover:text-purple-700"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-purple-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 9: BOTTOM CALL-TO-ACTION BANNER */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0e0a1a] via-[#1a1236] to-[#0a0714] py-20 text-white">
          <div className="pointer-events-none absolute -top-40 right-0 h-80 w-80 rounded-full bg-purple-600/30 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-5 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3.5 py-1 text-xs font-bold text-purple-300 border border-purple-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ready to Scale Your Video Content?</span>
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Start Producing High-Converting AI Videos for{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                {data.name}
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Order your first AI video or speak with our creative strategy team today. Delivery in 48–72 hours with full commercial rights.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <NeonButton
                href="#contact"
                variant="primary"
                size="lg"
                className="shadow-xl shadow-purple-600/30"
              >
                Get {data.shortName} Video Quote
              </NeonButton>

              <NeonButton
                href={calendlyUrl}
                variant="call"
                size="lg"
                className="group"
              >
                <Calendar className="h-4 w-4 text-purple-700 shrink-0 transition-transform group-hover:scale-110" />
                <span>Book 30-min Strategy Call</span>
              </NeonButton>
            </div>
          </div>
        </section>
      </main>

      {/* Global Overlays & Modals */}
      <Footer />
      <FloatingWhatsAppButton />
      <QuotePopupModal />
    </div>
  );
}

// Industries Directory Hub Page Component for /industries
export function IndustriesDirectoryHub() {
  return (
    <div id="top" className="min-h-screen w-full overflow-x-clip bg-background text-foreground selection:bg-purple-500 selection:text-white">
      <Header />

      <main id="main-content" className="pt-24 pb-20">
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-purple-50/20 to-white py-16 border-b border-slate-200/80">
          <div className="mx-auto max-w-6xl px-5 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-xs font-bold text-purple-700">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Industries We Scale</span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
              AI Video Production by{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Industry
              </span>
            </h1>

            <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
              Select your industry to explore tailored video formats, proven customer conversion hooks, sample productions, and pricing.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allIndustriesList.map((item) => (
                <Link
                  key={item.slug}
                  to={`/industries/$slug`}
                  params={{ slug: item.slug }}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-400 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                      {renderIndustryIcon(item.icon, "h-6 w-6")}
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                      {item.name}
                    </h2>

                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {item.tagline}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
                    <span>Explore {item.shortName} Subpage</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
      <QuotePopupModal />
    </div>
  );
}
