function AsxFamilyCareSvg() {
  return (
    <svg width="36" height="36" viewBox="0 0 64 64" fill="none" stroke="#001d28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="19" r="4.5" />
      <path d="M25 33c0-3.9 3.1-7 7-7s7 3.1 7 7" />
      <circle cx="21" cy="23" r="3.5" />
      <path d="M15 37c0-3.3 2.7-6 6-6" />
      <circle cx="43" cy="23" r="3.5" />
      <path d="M43 31c3.3 0 6 2.7 6 6" />
      <path d="M12 39c2 7 8 12 15 13" />
      <path d="M10 36c2.5-3 7-4 12-2l7 3" />
      <path d="M17 31l-7 5" />
      <path d="M52 39c-2 7-8 12-15 13" />
      <path d="M54 36c-2.5-3-7-4-12-2l-7 3" />
      <path d="M47 31l7 5" />
    </svg>
  );
}

function AsxIncomeMoneySvg() {
  return (
    <svg width="36" height="36" viewBox="0 0 64 64" fill="none" stroke="#001d28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 14c-1.5 0-2.5 1-2.5 2.5 0 .5.5 1 1 1.5-3 1.5-5 4.5-5 8 0 4.5 3.8 8 8.5 8s8.5-3.5 8.5-8c0-3.5-2-6.5-5-8 .5-.5 1-1 1-1.5 0-1.5-1-2.5-2.5-2.5" />
      <path d="M33.5 21.5h-2.5a1.2 1.2 0 0 0 0 2.4h2a1.2 1.2 0 0 1 0 2.4H30" />
      <path d="M32 20v7.5" />
      <path d="M22 22l6 14" />
      <path d="M18 17l6 19" />
      <path d="M22 36h22" />
      <path d="M24 36l-4 13" />
      <path d="M40 36l3 13" />
      <path d="M20 44l22 2" />
      <path d="M14 50c9 5 27 5 36-1" />
    </svg>
  );
}

function AsxMedicalPulseSvg() {
  return (
    <svg width="36" height="36" viewBox="0 0 64 64" fill="none" stroke="#001d28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M43.5 14c-4.2 0-7.8 2.5-9.5 6.2-1.7-3.7-5.3-6.2-9.5-6.2-5.8 0-10.5 4.7-10.5 10.5 0 8.5 11 16.5 20 23.3 9-6.8 20-14.8 20-23.3 0-5.8-4.7-10.5-10.5-10.5Z" />
      <path d="M18 24.5h5.5l2.5-5 3.5 10 3-7 2.5 2h5" />
      <circle cx="21" cy="46" r="6" />
      <path d="M22 43.5h-1.8a1 1 0 0 0 0 2h1.6a1 1 0 0 1 0 2h-1.8" />
      <path d="M21 42.5v7" />
      <path d="M39 49l4-8 4 8" />
      <path d="M43 41v9" />
      <path d="M46 45l3-6 3 6" />
      <path d="M49 39v7" />
    </svg>
  );
}

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
import { calendlyUrl } from "./data";
import { NeonButton } from "./ui";
import {
  Header,
  Footer,
  FloatingWhatsAppButton,
  QuotePopupModal,
} from "./sections";

// Assurix line icons
function renderAssurixIcon(iconName: string, className = "h-8 w-8") {
  switch (iconName) {
    case "Stethoscope":
      return <Stethoscope className={className} strokeWidth={1.5} />;
    case "Briefcase":
      return <Briefcase className={className} strokeWidth={1.5} />;
    case "Cpu":
      return <Cpu className={className} strokeWidth={1.5} />;
    case "Building2":
      return <Building2 className={className} strokeWidth={1.5} />;
    case "Compass":
      return <Compass className={className} strokeWidth={1.5} />;
    case "Wrench":
      return <Wrench className={className} strokeWidth={1.5} />;
    case "GraduationCap":
      return <GraduationCap className={className} strokeWidth={1.5} />;
    case "ShoppingBag":
      return <ShoppingBag className={className} strokeWidth={1.5} />;
    case "Home":
      return <Home className={className} strokeWidth={1.5} />;
    case "UserCheck":
      return <UserCheck className={className} strokeWidth={1.5} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} strokeWidth={1.5} />;
    case "Sparkles":
      return <Sparkles className={className} strokeWidth={1.5} />;
    case "Zap":
      return <Zap className={className} strokeWidth={1.5} />;
    case "Scale":
      return <Scale className={className} strokeWidth={1.5} />;
    default:
      return <Sparkles className={className} strokeWidth={1.5} />;
  }
}

export function IndustrySubpage({ data }: { data: IndustryData }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showReplay, setShowReplay] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
    <div id="top" className="min-h-screen w-full overflow-x-clip bg-[#f4f5f5] text-[#001d28] selection:bg-[#7c3aed] selection:text-white font-lexend antialiased">
      {/* Universal Header with Assurix Dropdown */}
      <Header />

      <main id="main-content" className="pt-20 lg:pt-24">
        {/* ========================================================================= */}
        {/* ASSURIX SECTION 1: HERO V7 (Screenshot 2 exact replica) */}
        {/* ========================================================================= */}
        <section className="relative bg-[#f4f5f5] pt-14 pb-20 md:pt-18 md:pb-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            {/* Breadcrumb Navigation */}
            <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#6c6c6c]">
              <Link to="/" className="hover:text-[#7c3aed] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/industries" className="hover:text-[#7c3aed] transition-colors">
                Industries
              </Link>
              <span>/</span>
              <span className="text-[#7c3aed] font-bold">{data.name}</span>
            </div>

            {/* Split Hero Layout */}
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Left Column: Heading + Subtitle + Action buttons */}
              <div className="lg:col-span-7">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-[#001d28] leading-[1.14]">
                  {data.heroHeading}{" "}
                  <span className="text-[#7c3aed]">
                    {data.heroHighlight}
                  </span>
                </h1>

                <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#2c436b] max-w-xl">
                  {data.heroSubheading}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <a
                    href="#contact"
                    className="assurix-btn-green inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-sm font-semibold shadow-md active:scale-95"
                  >
                    Get {data.shortName} Video Quote
                  </a>

                  <NeonButton
                    href={calendlyUrl}
                    variant="call"
                    size="md"
                    className="group rounded-xl border border-[#bfc8cc] bg-white text-[#001d28] hover:border-[#7c3aed]"
                  >
                    <Calendar className="h-4 w-4 text-[#7c3aed] shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span>Book 30 min call</span>
                  </NeonButton>

                  <a
                    href="https://wa.me/918177828748"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#bfc8cc] bg-white px-4 py-3 text-xs font-semibold text-[#001d28] shadow-xs transition-all hover:border-[#25D366] hover:text-[#25D366]"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Assurix Screenshot 2 Deep Accent Stat Card */}
              <div className="lg:col-span-5">
                <div className="rounded-[2.5rem] bg-[#001d28] p-8 md:p-11 text-white shadow-2xl relative overflow-hidden">
                  <div className="space-y-7 divide-y divide-white/15">
                    {data.heroMetrics.map((metric, idx) => (
                      <div key={idx} className={`animate-number-train ${idx === 0 ? "pt-0" : "pt-6"}`}>
                        <div className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                          {metric.value}
                        </div>
                        <div className="mt-1.5 text-sm font-medium text-[#d3dde8] tracking-wide">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ASSURIX SECTION 2: CURVED MEDIA SHOWCASE BANNER (Screenshot 2 & 3) */}
        {/* ========================================================================= */}
        <section className="relative -mt-8 sm:-mt-12 max-w-6xl mx-auto px-5 sm:px-6 z-20">
          <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border-4 border-white bg-slate-950 shadow-2xl">
            {data.mediaVideoUrl ? (
              <div className="relative aspect-video w-full max-h-[540px] bg-slate-900 flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  src={data.mediaVideoUrl}
                  poster={data.heroImageUrl}
                  playsInline
                  loop
                  muted={isMuted}
                  onEnded={() => setShowReplay(true)}
                  className="h-full w-full object-cover"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/15">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{data.mediaBadge}</span>
                </div>

                {/* Video Overlay Controls */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {showReplay ? (
                      <button
                        onClick={handleReplay}
                        className="flex items-center gap-2 rounded-full bg-[#001d28] px-4 py-2 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Watch Again</span>
                      </button>
                    ) : (
                      <button
                        onClick={togglePlay}
                        className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#001d28] shadow-lg backdrop-blur-md transition-transform hover:scale-105"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-[#001d28]" />}
                        <span>{isPlaying ? "Pause" : "Play Sample"}</span>
                      </button>
                    )}

                    <button
                      onClick={toggleMute}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 transition-colors hover:bg-black/80"
                      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-300" />}
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 rounded-full bg-black/50 px-3.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md">
                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                    <span>9:16 Vertical Reel Format</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative aspect-video w-full max-h-[540px] bg-slate-900 flex items-center justify-center overflow-hidden">
                <img
                  src={data.heroImageUrl}
                  alt={data.name}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ASSURIX SECTION 3: 3 KEY BENEFIT CARDS (Screenshot 3 exact replica) */}
        {/* ========================================================================= */}
        <section className="relative bg-[#f4f5f5] pt-24 pb-28 md:pt-32 md:pb-36">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            {/* Centered Intro Tagline */}
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-base sm:text-lg font-medium text-[#001d28]">
                {data.introSubhead}
              </p>
            </div>

            {/* 3 Elevated Rounded Cards with Top Floating Icon Badges */}
            <div className="mt-18 grid gap-8 md:grid-cols-3">
              {data.benefitCards.map((card, idx) => (
                <div
                  key={idx}
                  className="assurix-card-hover group relative rounded-[28px] bg-white p-8 pt-16 border border-[#dce3e4]/60 shadow-[0_10px_40px_-10px_rgba(0,29,40,0.08)] flex flex-col justify-between text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_-10px_rgba(0,29,40,0.12)]"
                >
                  {/* Floating Vertical Pill Badge overlapping top center border */}
                  <div className="absolute -top-[42px] left-1/2 -translate-x-1/2 flex h-[92px] w-[76px] items-center justify-center rounded-[38px] bg-[#e5edf5] text-[#001d28] transition-transform duration-300 group-hover:-translate-y-1">
                    {idx === 0 ? <AsxFamilyCareSvg /> : idx === 1 ? <AsxIncomeMoneySvg /> : <AsxMedicalPulseSvg />}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#001d28] leading-tight">
                      {card.title}
                    </h3>

                    <p className="mt-3 text-[14.5px] text-[#3e566d] leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <a
                      href="#contact"
                      className="inline-flex items-center justify-center gap-1.5 text-[14px] font-semibold text-[#001d28] hover:text-[#7c3aed] transition-all group-hover:gap-2.5"
                    >
                      <span>Read more</span>
                      <span className="text-[#001d28] font-bold text-sm">↘</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ASSURIX SECTION 4: STORY / TRANSFORMATION SPLIT (Screenshot 4 exact replica) */}
        {/* ========================================================================= */}
        <section className="relative bg-white py-24 md:py-32 border-y border-[#e5eaee]">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left Column: Rounded Image + Assurix Floating Social Proof Box */}
              <div className="relative lg:col-span-6">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-[#d3dde8] shadow-xl bg-slate-950 aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={data.story.image}
                    alt={data.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Floating Social Proof Box (Screenshot 4 exact replica) */}
                <div className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:right-6 bg-white rounded-2xl p-4 shadow-xl border border-[#e5eaee] max-w-[230px] animate-in fade-in duration-300">
                  <div className="text-xs font-bold text-[#001d28]">
                    {data.story.socialProofBadge}
                  </div>
                  {/* Avatar Stack */}
                  <div className="mt-2 flex -space-x-1.5 overflow-hidden">
                    <div className="h-7 w-7 rounded-full ring-2 ring-white bg-[#eaf4e5] text-[#3b742a] font-bold text-[9px] flex items-center justify-center">
                      AI
                    </div>
                    <div className="h-7 w-7 rounded-full ring-2 ring-white bg-[#e5f2f6] text-[#7c3aed] font-bold text-[9px] flex items-center justify-center">
                      QC
                    </div>
                    <div className="h-7 w-7 rounded-full ring-2 ring-white bg-[#f1f9ee] text-[#438047] font-bold text-[9px] flex items-center justify-center">
                      HD
                    </div>
                    <div className="h-7 w-7 rounded-full ring-2 ring-white bg-[#001d28] text-white font-bold text-[9px] flex items-center justify-center">
                      +
                    </div>
                  </div>
                  {/* Rating skeleton indicator bars */}
                  <div className="mt-2.5 space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-[#f4f5f5]" />
                    <div className="h-1.5 w-3/4 rounded-full bg-[#001d28]" />
                  </div>
                </div>
              </div>

              {/* Right Column: Eyebrow, Heading, Description, Stat Row + Button */}
              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#bfc8cc] bg-white px-3.5 py-1 text-xs font-semibold text-[#001d28] mb-3">
                  <span>Our story</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#001d28] leading-tight">
                  {data.story.heading}
                </h2>

                <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#2c436b]">
                  {data.story.description}
                </p>

                {/* Stat Number & Free Quote CTA Button Row */}
                <div className="mt-8 flex flex-wrap items-center gap-8 pt-6 border-t border-[#e5eaee]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold text-[#001d28]">
                      {data.story.statValue}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider text-[#6c6c6c] max-w-[140px] leading-tight">
                      {data.story.statLabel}
                    </span>
                  </div>

                  <a
                    href="#contact"
                    className="assurix-btn-green inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-sm font-semibold shadow-md active:scale-95"
                  >
                    Get a free quote
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ASSURIX SECTION 5: ALL SERVICES / INDUSTRY OUTLINE GRID (Screenshot 4 bottom) */}
        {/* ========================================================================= */}
        <section className="relative bg-[#f4f5f5] py-24 md:py-32 border-b border-[#e5eaee]">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-xl sm:text-2xl font-bold text-[#001d28]">
                Comprehensive insurance plans tailored for you
              </h2>
            </div>

            {/* 4-Column Outline Cards Grid matching Assurix Service v4 */}
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)] py-4">
              <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
                {/* Set 1 */}
                {allIndustriesList.map((item) => {
                  const isCurrent = item.slug === data.slug;
                  return (
                    <Link
                      key={"orig-" + item.slug}
                      to={`/industries/$slug`}
                      params={{ slug: item.slug }}
                      className={`assurix-card-hover w-64 min-w-64 rounded-2xl p-6 border transition-all duration-200 flex flex-col items-center justify-center text-center gap-3.5 shrink-0 ${
                        isCurrent
                          ? "bg-[#eaf4e5] border-[#3b742a] shadow-md ring-1 ring-[#3b742a]"
                          : "bg-white border-[#dce3e4] hover:border-[#7c3aed] hover:shadow-md"
                      }`}
                    >
                      <div className="text-[#001d28]">
                        {renderAssurixIcon(item.icon, "h-8 w-8")}
                      </div>
                      <div className="text-sm font-bold text-[#001d28]">
                        {item.name}
                      </div>
                    </Link>
                  );
                })}

                {/* Set 2 (Duplicate for Infinite Loop) */}
                {allIndustriesList.map((item) => {
                  const isCurrent = item.slug === data.slug;
                  return (
                    <Link
                      key={"dup-" + item.slug}
                      to={`/industries/$slug`}
                      params={{ slug: item.slug }}
                      className={`assurix-card-hover w-64 min-w-64 rounded-2xl p-6 border transition-all duration-200 flex flex-col items-center justify-center text-center gap-3.5 shrink-0 ${
                        isCurrent
                          ? "bg-[#eaf4e5] border-[#3b742a] shadow-md ring-1 ring-[#3b742a]"
                          : "bg-white border-[#dce3e4] hover:border-[#7c3aed] hover:shadow-md"
                      }`}
                    >
                      <div className="text-[#001d28]">
                        {renderAssurixIcon(item.icon, "h-8 w-8")}
                      </div>
                      <div className="text-sm font-bold text-[#001d28]">
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ASSURIX SECTION 5.5: WHO WE HELP (Reference SS-2 3-Image Collage + Checklist Split Replica) */}
        {data.useCases && data.useCases.length > 0 && (
          <section className="relative bg-white py-24 md:py-32 border-b border-[#eef2f5] overflow-hidden">
            <div className="mx-auto max-w-6xl px-5 sm:px-6">
              <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
                {/* Left Column: Reference SS-2 Exact 3 Shaped Overlapping Images Collage */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className="relative w-[340px] sm:w-[570px] h-[360px] sm:h-[540px] shrink-0">
                    {/* Main Right Tall Arch Image */}
                    <div className="absolute right-0 top-0 bottom-0 w-[200px] sm:w-[340px] h-[360px] sm:h-[540px] rounded-t-[100px] sm:rounded-t-[170px] rounded-br-[24px] sm:rounded-br-[40px] rounded-bl-0 overflow-hidden shadow-[0_20px_48px_-10px_rgba(0,29,40,0.14)] z-10 bg-slate-200">
                      <img
                        src={data.heroImageUrl || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"}
                        alt={data.name + " consultation"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Top-Left Overlapping Floating Circle with 12px White Halo Border */}
                    <div className="absolute left-[6px] sm:left-[10px] top-[30px] sm:top-[35px] w-[150px] sm:w-[250px] h-[150px] sm:h-[250px] rounded-full border-[7px] sm:border-[12px] border-white overflow-hidden shadow-[0_16px_40px_-6px_rgba(0,29,40,0.16)] z-30 bg-slate-200">
                      <img
                        src={data.story.image || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"}
                        alt={data.name + " care"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Bottom-Left Flush Arch Dome with 14px channel before tall arch */}
                    <div className="absolute left-[6px] sm:left-[10px] bottom-0 w-[130px] sm:w-[206px] h-[125px] sm:h-[200px] rounded-t-[65px] sm:rounded-t-[103px] rounded-b-0 overflow-hidden shadow-[0_14px_32px_-6px_rgba(0,29,40,0.12)] z-20 bg-slate-200">
                      <img
                        src={data.heroImageUrl || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"}
                        alt={data.name + " growth"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Title, Subtitle, Bullets, Divider, Checkmarks, Schedule Button */}
                <div className="lg:col-span-6 max-w-lg">
                  <h2 className="text-3xl sm:text-[40px] font-extrabold text-[#001d28] tracking-tight leading-[1.14]">
                    {"Affordable & scalable growth for every " + data.shortName.toLowerCase() + " stage"}
                  </h2>

                  <div className="mt-3 text-base font-bold text-[#1e3a5f]">
                    {data.shortName + " benefits"}
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {data.useCases.slice(0, 5).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-[14.5px] text-[#2c436b] leading-relaxed">
                        <span className="h-1 w-1 rounded-full bg-[#001d28] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <hr className="my-6 border-[#dce3e4]" />

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2.5 text-[14.5px] font-semibold text-[#001d28]">
                      <Check className="h-4 w-4 text-[#001d28] stroke-[2.5]" />
                      <span>{data.useCases[5] || "24/7 AI Lead Qualification & Booking"}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[14.5px] font-semibold text-[#001d28]">
                      <Check className="h-4 w-4 text-[#001d28] stroke-[2.5]" />
                      <span>{data.useCases[6] || "Dedicated Strategist & Full Pipeline Visibility"}</span>
                    </div>
                  </div>

                  <div>
                    <a
                      href={calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-[#001d28] px-8 py-3.5 text-[14.5px] font-bold text-white shadow-lg transition-all hover:bg-[#001d28] hover:-translate-y-0.5 active:scale-95"
                    >
                      Schedule a call
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: PACKAGES & FORMATS WITH PRICING */}
        {/* ========================================================================= */}
        <section className="relative bg-white py-20 md:py-28 border-b border-[#e5eaee]">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7c3aed]">
                Transparent Packages
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-[#001d28]">
                AI Video Production Plans for {data.shortName}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {data.featuredFormats.map((format, idx) => (
                <div
                  key={idx}
                  className={`rounded-3xl bg-white p-8 border flex flex-col justify-between transition-all duration-300 ${
                    format.popular
                      ? "border-[#0b7b8b] shadow-xl shadow-[#0b7b8b]/10 ring-2 ring-[#0b7b8b]/20"
                      : "border-[#dce3e4] shadow-sm hover:shadow-lg"
                  }`}
                >
                  <div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-lg font-bold text-[#001d28]">
                        {format.name}
                      </h3>
                      <div className="text-2xl font-bold text-[#7c3aed]">
                        {format.price}
                      </div>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#6c6c6c]">
                      <Clock className="h-3.5 w-3.5 text-[#7c3aed]" />
                      <span>Delivery: {format.turnaround}</span>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-[#2c436b] leading-relaxed">
                      {format.description}
                    </p>

                    <ul className="mt-5 space-y-2.5 border-t border-[#f4f5f5] pt-5">
                      {format.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-center gap-2 text-xs font-medium text-[#001d28]">
                          <Check className="h-4 w-4 text-[#3b742a] shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#f4f5f5]">
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
        {/* SECTION 7: FAQS ACCORDION */}
        {/* ========================================================================= */}
        <section className="relative bg-[#f4f5f5] py-20 md:py-28 border-b border-[#e5eaee]">
          <div className="mx-auto max-w-4xl px-5 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#001d28]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3.5">
              {data.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#dce3e4] bg-white overflow-hidden shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-[#001d28] hover:text-[#7c3aed] transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#6c6c6c] transition-transform ${
                          isOpen ? "rotate-180 text-[#7c3aed]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-[#2c436b] border-t border-[#f4f5f5] pt-3">
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
        {/* SECTION 8: BOTTOM CTA BANNER */}
        {/* ========================================================================= */}
        <section className="relative bg-[#022633] py-20 text-white">
          <div className="relative mx-auto max-w-5xl px-5 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white">
              Ready to Scale Your Video Content for{" "}
              <span className="text-[#34d399]">
                {data.name}
              </span>
              ?
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#bfc8cc] max-w-2xl mx-auto">
              Get standard 48–72h turnaround, full commercial rights, script writing, and revisions included.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#contact"
                className="assurix-btn-green inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold shadow-lg active:scale-95"
              >
                Get {data.shortName} Video Quote
              </a>

              <NeonButton
                href={calendlyUrl}
                variant="call"
                size="lg"
                className="bg-white text-[#001d28] hover:bg-slate-100"
              >
                <Calendar className="h-4 w-4 text-[#7c3aed] shrink-0" />
                <span>Book 30 min call</span>
              </NeonButton>
            </div>
          </div>
        </section>
      </main>

      {/* Global Overlays */}
      <Footer />
      <FloatingWhatsAppButton />
      <QuotePopupModal />
    </div>
  );
}

// Directory Hub component
export function IndustriesDirectoryHub() {
  return (
    <div id="top" className="min-h-screen w-full overflow-x-clip bg-[#f4f5f5] text-[#001d28] selection:bg-[#7c3aed] selection:text-white font-lexend antialiased">
      <Header />

      <main id="main-content" className="pt-24 pb-20">
        <section className="bg-[#f4f5f5] py-16 border-b border-[#e5eaee]">
          <div className="mx-auto max-w-6xl px-5 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#001d28]">
              Industries We Scale with{" "}
              <span className="text-[#7c3aed]">
                AI Video Production
              </span>
            </h1>
            <p className="mt-4 text-base text-[#2c436b] max-w-2xl mx-auto">
              Select your industry below to explore tailored video formats, proven hooks, sample reels, and pricing.
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
                  className="assurix-card-hover rounded-3xl border border-[#dce3e4] bg-white p-7 shadow-sm transition-all hover:-translate-y-1.5 hover:border-[#7c3aed] hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf4e5] text-[#3b742a]">
                      {renderAssurixIcon(item.icon, "h-8 w-8")}
                    </div>
                    <h2 className="mt-5 text-xl font-bold text-[#001d28]">
                      {item.name}
                    </h2>
                    <p className="mt-2 text-sm text-[#2c436b] leading-relaxed">
                      {item.tagline}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-[#f4f5f5] flex items-center justify-between text-xs font-bold text-[#001d28] hover:text-[#7c3aed]">
                    <span>Explore Subpage</span>
                    <ArrowRight className="h-4 w-4" />
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
