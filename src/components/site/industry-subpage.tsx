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
  MapPin,
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

// Icon mapping helper matching Assurix line icon style
function renderIndustryIcon(iconName: string, className = "h-6 w-6") {
  switch (iconName) {
    case "Stethoscope":
      return <Stethoscope className={className} strokeWidth={1.75} />;
    case "Briefcase":
      return <Briefcase className={className} strokeWidth={1.75} />;
    case "Cpu":
      return <Cpu className={className} strokeWidth={1.75} />;
    case "Building2":
      return <Building2 className={className} strokeWidth={1.75} />;
    case "Compass":
      return <Compass className={className} strokeWidth={1.75} />;
    case "Wrench":
      return <Wrench className={className} strokeWidth={1.75} />;
    case "GraduationCap":
      return <GraduationCap className={className} strokeWidth={1.75} />;
    case "ShoppingBag":
      return <ShoppingBag className={className} strokeWidth={1.75} />;
    case "Home":
      return <Home className={className} strokeWidth={1.75} />;
    case "UserCheck":
      return <UserCheck className={className} strokeWidth={1.75} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} strokeWidth={1.75} />;
    case "Sparkles":
      return <Sparkles className={className} strokeWidth={1.75} />;
    case "Zap":
      return <Zap className={className} strokeWidth={1.75} />;
    case "Scale":
      return <Scale className={className} strokeWidth={1.75} />;
    default:
      return <Sparkles className={className} strokeWidth={1.75} />;
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
    <div id="top" className="min-h-screen w-full overflow-x-clip bg-[#fafbfc] text-[#0f172a] selection:bg-purple-600 selection:text-white font-sans antialiased">
      {/* Universal Header with Assurix-Style Dropdown */}
      <Header />

      <main id="main-content" className="pt-20 lg:pt-24">
        {/* ========================================================================= */}
        {/* ASSURIX SECTION 1: HERO V7 (Screenshot 2 exact replica) */}
        {/* ========================================================================= */}
        <section className="relative bg-[#f4f7f9] pt-12 pb-20 md:pt-16 md:pb-28 border-b border-slate-200/70">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            {/* Breadcrumbs */}
            <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link to="/" className="hover:text-purple-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/industries" className="hover:text-purple-600 transition-colors">
                Industries
              </Link>
              <span>/</span>
              <span className="text-purple-700 font-bold">{data.name}</span>
            </div>

            {/* Split Hero: Left Title & Paragraph, Right Dark Assurix Metric Card */}
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Left Column */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-purple-700 shadow-xs border border-purple-100 mb-4">
                  <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
                  <span>AI Video Studio • {data.shortName}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold tracking-tight text-[#0f172a] leading-[1.12]">
                  {data.heroHeading}{" "}
                  <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    {data.heroHighlight}
                  </span>
                </h1>

                <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl">
                  {data.heroSubheading}
                </p>

                {/* Primary Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <NeonButton
                    href="#contact"
                    variant="primary"
                    size="md"
                    className="shadow-md"
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
                    <span>Book 30 min call</span>
                  </NeonButton>

                  <a
                    href="https://wa.me/918177828748"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:border-[#25D366] hover:text-[#25D366]"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Assurix Screenshot 2 Deep Accent Stat Card */}
              <div className="lg:col-span-5">
                <div className="rounded-[2.2rem] bg-gradient-to-b from-[#15102a] to-[#0c0919] p-8 md:p-10 text-white shadow-2xl border border-purple-900/40 relative overflow-hidden">
                  <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-purple-500/20 blur-2xl" />

                  <div className="space-y-6 divide-y divide-white/10">
                    {data.heroMetrics.map((metric, idx) => (
                      <div key={idx} className={idx === 0 ? "pt-0" : "pt-6"}>
                        <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                          {metric.value}
                        </div>
                        <div className="mt-1.5 text-xs sm:text-sm font-medium text-purple-200/90 tracking-wide">
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
        {/* ASSURIX SECTION 2: CURVED PARALLAX / VIDEO BANNER (Screenshot 2 & 3) */}
        {/* ========================================================================= */}
        <section className="relative -mt-10 sm:-mt-14 max-w-6xl mx-auto px-5 sm:px-6 z-20">
          <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border-4 border-white bg-slate-950 shadow-2xl">
            <div className="relative aspect-video w-full max-h-[540px] bg-slate-900 flex items-center justify-center overflow-hidden">
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

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/15">
                <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                <span>{data.mediaBadge}</span>
              </div>

              {/* Video Overlay Controls */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
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
                      className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-slate-900 shadow-lg backdrop-blur-md transition-transform hover:scale-105"
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

                <div className="hidden sm:flex items-center gap-2 rounded-full bg-black/50 px-3.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md">
                  <Clock className="h-3.5 w-3.5 text-purple-400" />
                  <span>9:16 Vertical Reel Format</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ASSURIX SECTION 3: 3 KEY BENEFIT CARDS (Screenshot 3 exact replica) */}
        {/* ========================================================================= */}
        <section className="relative bg-[#fafbfc] pt-20 pb-24 md:pt-28 md:pb-32 border-b border-slate-200/70">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            {/* Centered Intro Tagline */}
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm sm:text-base font-semibold text-slate-600">
                {data.introSubhead}
              </p>
            </div>

            {/* 3 Elevated Rounded Cards with Top Floating Icon Badges */}
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {data.benefitCards.map((card, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-[2rem] bg-white p-8 pt-14 border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between text-center"
                >
                  {/* Floating Circular / Rounded Badge overlapping top center border */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef4f8] text-purple-700 border border-purple-100 shadow-sm transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-110">
                    {renderIndustryIcon(card.iconName, "h-6 w-6")}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {card.title}
                    </h3>

                    <p className="mt-3.5 text-sm text-slate-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100">
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:text-purple-800 transition-all group-hover:gap-2"
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
        {/* ASSURIX SECTION 4: STORY / TRANSFORMATION SPLIT (Screenshot 4 exact replica) */}
        {/* ========================================================================= */}
        <section className="relative bg-white py-20 md:py-28 border-b border-slate-200/70">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left Column: Rounded Image + Assurix Floating Social Proof Box */}
              <div className="relative lg:col-span-6">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-xl bg-slate-950 aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={data.story.image}
                    alt={data.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Floating Social Proof Box (Screenshot 4 exact replica) */}
                <div className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:right-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 max-w-[230px] animate-in fade-in duration-300">
                  <div className="text-xs font-extrabold text-slate-900">
                    {data.story.socialProofBadge}
                  </div>
                  {/* Avatar Stack */}
                  <div className="mt-2 flex -space-x-1.5 overflow-hidden">
                    <div className="h-7 w-7 rounded-full ring-2 ring-white bg-purple-200 text-purple-900 font-bold text-[9px] flex items-center justify-center">
                      AI
                    </div>
                    <div className="h-7 w-7 rounded-full ring-2 ring-white bg-indigo-200 text-indigo-900 font-bold text-[9px] flex items-center justify-center">
                      QC
                    </div>
                    <div className="h-7 w-7 rounded-full ring-2 ring-white bg-pink-200 text-pink-900 font-bold text-[9px] flex items-center justify-center">
                      HD
                    </div>
                    <div className="h-7 w-7 rounded-full ring-2 ring-white bg-slate-800 text-white font-bold text-[9px] flex items-center justify-center">
                      +
                    </div>
                  </div>
                  {/* Rating skeleton indicator bars */}
                  <div className="mt-2.5 space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-slate-100" />
                    <div className="h-1.5 w-3/4 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Right Column: Eyebrow, Heading, Description, Stat Row + Button */}
              <div className="lg:col-span-6">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">
                  ✦ {data.story.eyebrow}
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                  {data.story.heading}
                </h2>

                <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
                  {data.story.description}
                </p>

                {/* Stat Number & Free Quote CTA Button Row */}
                <div className="mt-8 flex flex-wrap items-center gap-8 pt-6 border-t border-slate-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900">
                      {data.story.statValue}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500 max-w-[140px] leading-tight">
                      {data.story.statLabel}
                    </span>
                  </div>

                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center rounded-xl bg-[#2d6a4f] hover:bg-[#23533e] text-white font-bold px-7 py-3.5 text-sm shadow-md transition-all hover:shadow-lg active:scale-95"
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
        <section className="relative bg-[#fafbfc] py-20 md:py-28 border-b border-slate-200/70">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Comprehensive video production plans tailored for you
              </h2>
            </div>

            {/* 4/3 Column Outline Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {allIndustriesList.map((item) => {
                const isCurrent = item.slug === data.slug;
                return (
                  <Link
                    key={item.slug}
                    to={`/industries/$slug`}
                    params={{ slug: item.slug }}
                    className={`rounded-2xl p-6 border transition-all duration-200 flex flex-col items-center justify-center text-center gap-3 ${
                      isCurrent
                        ? "bg-purple-50 border-purple-400 shadow-md ring-1 ring-purple-300"
                        : "bg-white border-slate-200 hover:border-purple-400 hover:shadow-md hover:-translate-y-1"
                    }`}
                  >
                    <div className="text-slate-700">
                      {renderIndustryIcon(item.icon, "h-8 w-8")}
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: PACKAGES & FORMATS WITH PRICING */}
        {/* ========================================================================= */}
        <section className="relative bg-white py-20 md:py-28 border-b border-slate-200/70">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Transparent Pricing
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
                AI Video Packages for {data.shortName}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {data.featuredFormats.map((format, idx) => (
                <div
                  key={idx}
                  className={`rounded-3xl bg-white p-8 border flex flex-col justify-between transition-all duration-300 ${
                    format.popular
                      ? "border-purple-500 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/20"
                      : "border-slate-200 shadow-sm hover:shadow-lg"
                  }`}
                >
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
                      <span>Delivery: {format.turnaround}</span>
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

                  <div className="mt-8 pt-4 border-t border-slate-100">
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
        <section className="relative bg-[#fafbfc] py-16 md:py-24 border-b border-slate-200/70">
          <div className="mx-auto max-w-4xl px-5 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3.5">
              {data.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-900 hover:text-purple-700 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                          isOpen ? "rotate-180 text-purple-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
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
        <section className="relative bg-gradient-to-br from-[#120d26] via-[#1d143c] to-[#0c0819] py-20 text-white">
          <div className="relative mx-auto max-w-5xl px-5 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Ready to Scale Your Video Content for{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                {data.name}
              </span>
              ?
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Get standard 48–72h turnaround, full commercial rights, script writing, and revisions included.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <NeonButton
                href="#contact"
                variant="primary"
                size="lg"
              >
                Get {data.shortName} Video Quote
              </NeonButton>

              <NeonButton
                href={calendlyUrl}
                variant="call"
                size="lg"
              >
                <Calendar className="h-4 w-4 text-purple-700 shrink-0" />
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
    <div id="top" className="min-h-screen w-full overflow-x-clip bg-[#fafbfc] text-[#0f172a] selection:bg-purple-600 selection:text-white font-sans antialiased">
      <Header />

      <main id="main-content" className="pt-24 pb-20">
        <section className="bg-[#f4f7f9] py-16 border-b border-slate-200/70">
          <div className="mx-auto max-w-6xl px-5 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
              Industries We Scale with{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI Video Production
              </span>
            </h1>
            <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
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
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1.5 hover:border-purple-400 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4f8] text-purple-700">
                      {renderIndustryIcon(item.icon, "h-6 w-6")}
                    </div>
                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                      {item.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {item.tagline}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
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
