import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  BadgeCheck,
  Bot,
  Check,
  Calendar,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  Film,
  MapPin,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Palette,
  Pause,
  Phone,
  Play,
  RotateCcw,
  Smartphone,
  Sparkles,
  UserCheck,
  Video,
  Volume2,
  VolumeX,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { NeonButton, Section, SectionHeading } from "./ui";
import { submitLeadServerFn, broadcastLeadEvent } from "@/lib/lead-actions";
import {
  calendlyUrl,
  deliverables,
  faqs,
  formats,
  footerCopyright,
  footerDescription,
  footerEmail,
  footerIndiaAddress,
  footerIndiaMapUrl,
  footerPhone,
  footerTagline,
  footerUsaAddress,
  footerUsaMapUrl,
  industries,
  individualPricingList,
  nav,
  packagePricingTiers,
  pricingRows,
  pricingColumns,
  digitalTwinSetupItem,
  processSteps,
  portfolioItems,
  samples,
  services,
  strategyCallEmail,
  twinFeatures,
  useCases,
  whyAiVideo,
  whyUs,
} from "./data";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const [industriesDropdownOpen, setIndustriesDropdownOpen] = useState(false);
  const [isLogoDocked, setIsLogoDocked] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIndustriesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const heroTrack = document.getElementById("hero-scroll-track");
      if (!heroTrack) {
        setIsLogoDocked(true);
        return;
      }
      const rect = heroTrack.getBoundingClientRect();
      const scrollableDistance = heroTrack.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) {
        setIsLogoDocked(true);
        return;
      }
      const scrolled = -rect.top;
      const progress = scrolled / scrollableDistance;
      setIsLogoDocked(progress >= 0.94);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const industriesListCol1 = [
    { name: "Healthcare", href: "/industries/healthcare" },
    { name: "Professional Services", href: "/industries/professional-services" },
    { name: "IT & SaaS", href: "/industries/it-saas" },
    { name: "Real Estate", href: "/industries/real-estate" },
    { name: "Travel & Hospitality", href: "/industries/travel-hospitality" },
  ];

  const industriesListCol2 = [
    { name: "Home Services", href: "/industries/home-services" },
    { name: "Education", href: "/industries/education" },
    { name: "eCommerce", href: "/industries/ecommerce" },
    { name: "Interior Design", href: "/industries/interior-design" },
  ];

  return (
    <header id="site-nav-container" className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-3 md:py-3.5">
          <a
            href="/#top"
            id="navbar-logo-anchor"
            className="-ml-3 sm:-ml-5 flex items-center transition-opacity hover:opacity-90"
            aria-label="Quickupp AI Studio Home"
          >
            <img
              src="/images/LOGO 1.png"
              alt="Quickupp AI Studio logo"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain"
              width={125}
              height={40}
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-100/70 px-2.5 py-1.5 lg:flex shadow-xs relative"
          >
            <a
              href="/#samples"
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-white hover:text-purple-600 hover:shadow-xs active:scale-95"
            >
              Samples
            </a>
            <a
              href="/#services"
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-white hover:text-purple-600 hover:shadow-xs active:scale-95"
            >
              Services
            </a>

            {/* Industries Dropdown Trigger */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setIndustriesDropdownOpen(true)}
              onMouseLeave={() => setIndustriesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIndustriesDropdownOpen(!industriesDropdownOpen)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                  industriesDropdownOpen
                    ? "bg-white text-purple-600 shadow-xs"
                    : "text-slate-600 hover:bg-white hover:text-purple-600 hover:shadow-xs"
                }`}
                aria-expanded={industriesDropdownOpen}
              >
                <span>Industries</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${
                    industriesDropdownOpen ? "rotate-180 text-purple-600" : "text-slate-400"
                  }`}
                />
              </button>

              {/* Assurix-Style Dark Glassmorphic Industries Dropdown Menu (Screenshot 1) */}
              {industriesDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] rounded-2xl border border-slate-700/80 bg-[#0d0f18]/95 p-5 shadow-2xl backdrop-blur-2xl text-white animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/90">
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-cyan-400">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                      <span>INDUSTRIES WE SCALE</span>
                    </div>
                    <a
                      href="/industries"
                      className="flex items-center gap-1 text-[11px] font-bold text-slate-300 transition-colors hover:text-cyan-400"
                    >
                      <span>Explore All</span>
                      <span className="text-xs">↗</span>
                    </a>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-2">
                      {industriesListCol1.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-200 transition-all hover:text-cyan-300 hover:translate-x-1 py-1"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80 shrink-0" />
                          <span>{item.name}</span>
                        </a>
                      ))}
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-2">
                      {industriesListCol2.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-200 transition-all hover:text-cyan-300 hover:translate-x-1 py-1"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400/80 shrink-0" />
                          <span>{item.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a
              href="/#pricing"
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-white hover:text-purple-600 hover:shadow-xs active:scale-95"
            >
              Pricing
            </a>
            <a
              href="/#portfolio"
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-white hover:text-purple-600 hover:shadow-xs active:scale-95"
            >
              Portfolio
            </a>
            <a
              href="/#process"
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-white hover:text-purple-600 hover:shadow-xs active:scale-95"
            >
              How It Works
            </a>
            <a
              href="/#faq"
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-white hover:text-purple-600 hover:shadow-xs active:scale-95"
            >
              FAQ
            </a>
            <a
              href="/#contact"
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-white hover:text-purple-600 hover:shadow-xs active:scale-95"
            >
              Contact
            </a>
          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <NeonButton
              href={calendlyUrl}
              variant="call"
              size="sm"
              className="hidden md:inline-flex items-center gap-1.5 whitespace-nowrap group"
            >
              <Calendar className="h-3.5 w-3.5 text-purple-700 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>Book a 30 min call</span>
            </NeonButton>

            <NeonButton
              href="/#contact"
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex whitespace-nowrap"
            >
              Get AI Video Quote
            </NeonButton>

            {/* Mobile / Tablet Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-800 transition-colors hover:border-purple-400 hover:text-purple-600 lg:hidden"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation Menu Dropdown */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="border-b border-slate-200 bg-white/98 px-5 py-5 shadow-2xl backdrop-blur-2xl lg:hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto"
          >
            <div className="mx-auto flex max-w-md flex-col gap-1.5">
              <a
                href="/#samples"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
              >
                <span>Samples</span>
                <span className="text-xs text-purple-600">→</span>
              </a>

              <a
                href="/#services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
              >
                <span>Services</span>
                <span className="text-xs text-purple-600">→</span>
              </a>

              {/* Mobile Industries Accordion */}
              <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-2">
                <button
                  type="button"
                  onClick={() => setMobileIndustriesOpen(!mobileIndustriesOpen)}
                  className="flex w-full items-center justify-between px-2 py-1.5 text-sm font-bold text-purple-900"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span>Industries We Scale</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-purple-700 transition-transform ${
                      mobileIndustriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileIndustriesOpen && (
                  <div className="mt-2 flex flex-col gap-1 border-t border-purple-200/60 pt-2 pl-2">
                    {[...industriesListCol1, ...industriesListCol2].map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-purple-100 hover:text-purple-900"
                      >
                        <span>{item.name}</span>
                        <span className="text-purple-600">↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="/#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
              >
                <span>Pricing</span>
                <span className="text-xs text-purple-600">→</span>
              </a>

              <a
                href="/#portfolio"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
              >
                <span>Portfolio</span>
                <span className="text-xs text-purple-600">→</span>
              </a>

              <a
                href="/#process"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
              >
                <span>How It Works</span>
                <span className="text-xs text-purple-600">→</span>
              </a>

              <a
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
              >
                <span>FAQ</span>
                <span className="text-xs text-purple-600">→</span>
              </a>

              <a
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
              >
                <span>Contact</span>
                <span className="text-xs text-purple-600">→</span>
              </a>

              <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-4">
                <a
                  href={calendlyUrl}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-purple-200/90 bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 py-2.5 text-sm font-bold text-purple-900 shadow-xs transition-all hover:from-violet-200 hover:via-purple-200 hover:to-pink-200 hover:border-purple-400 active:scale-95"
                >
                  <Calendar className="h-4 w-4 text-purple-700 shrink-0" />
                  <span>Book a 30 min call</span>
                </a>
                <a
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-lg bg-gradient-brand py-2.5 text-sm font-bold text-white shadow-md hover:brightness-110"
                >
                  Get AI Video Quote
                </a>
                <a
                  href="https://wa.me/918177828748"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-purple-400 hover:text-purple-700"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export function HeroOrbitalAtmosphere({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden select-none ${className}`}>
      {/* Animated geometric curved background watermarks / intersecting contour lines */}
      <svg
        className="absolute -left-20 sm:-left-12 lg:-left-24 bottom-[-60px] lg:bottom-[-80px] w-[650px] sm:w-[780px] lg:w-[920px] h-[650px] sm:h-[780px] lg:h-[920px] select-none opacity-90"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="heroAtmosphereGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.20" />
            <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Center Glow Disc */}
        <circle cx="300" cy="300" r="260" fill="url(#heroAtmosphereGlow)" className="animate-aura-pulse" />

        {/* 1. Outer Orbit Ring with smooth 80s continuous rotation */}
        <g className="animate-orbit-spin-slow">
          <circle
            cx="300"
            cy="300"
            r="270"
            stroke="rgba(147, 51, 234, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="8 12"
          />
          {/* Orbiting Satellite Light Points */}
          <circle cx="570" cy="300" r="4" fill="#ec4899" className="drop-shadow-[0_0_8px_#ec4899]" />
          <circle cx="30" cy="300" r="3.5" fill="#3b82f6" className="drop-shadow-[0_0_8px_#3b82f6]" />
        </g>

        {/* 2. Middle Breathing Cyan/Blue Orbit Ring */}
        <circle
          cx="300"
          cy="300"
          r="200"
          stroke="rgba(79, 70, 229, 0.32)"
          strokeWidth="1.8"
          className="animate-orbit-breath"
        />

        {/* 3. Animated S-Curve Contour 1 */}
        <path
          d="M 0 300 C 180 180, 420 420, 600 300"
          stroke="rgba(147, 51, 234, 0.28)"
          strokeWidth="1.8"
          className="animate-wave-float-1"
        />

        {/* 4. Animated S-Curve Contour 2 (Intersecting Wave) */}
        <path
          d="M 0 360 C 220 440, 380 160, 600 240"
          stroke="rgba(219, 39, 119, 0.30)"
          strokeWidth="1.6"
          className="animate-wave-float-2"
        />
      </svg>

      {/* Radiant ambient gradient splash */}
      <div
        className="animate-aura-pulse absolute top-0 right-0 w-80 lg:w-[480px] h-80 lg:h-[480px] rounded-full blur-3xl pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.30) 0%, rgba(236, 72, 153, 0.18) 50%, transparent 70%)",
        }}
      />
    </div>
  );
}

export function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileHeroRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroBrandRef = useRef<HTMLDivElement>(null);
  const mediaCardRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const userExplicitlyMutedRef = useRef(true);
  const [isMuted, setIsMuted] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(116);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const toggleAudio = (e?: { stopPropagation?: () => void }) => {
    if (e?.stopPropagation) e.stopPropagation();
    const isMobile = window.innerWidth < 1024;
    const activeVideo = isMobile ? mobileVideoRef.current : desktopVideoRef.current;
    if (!activeVideo) return;

    const nextMuted = !isMuted;
    userExplicitlyMutedRef.current = nextMuted;

    activeVideo.muted = nextMuted;
    activeVideo.volume = nextMuted ? 0 : 1;
    setIsMuted(nextMuted);

    activeVideo.play().catch(() => {});
  };

  // Video autoplay and lifecycle management
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    const activeVideo = isMobile ? mobileVideoRef.current : desktopVideoRef.current;
    const inactiveVideo = isMobile ? desktopVideoRef.current : mobileVideoRef.current;

    if (inactiveVideo) {
      inactiveVideo.pause();
    }

    if (activeVideo) {
      activeVideo.defaultMuted = true;
      activeVideo.muted = isMuted;
      activeVideo.volume = isMuted ? 0 : 1;
      activeVideo.playsInline = true;
      activeVideo.play().catch(() => {
        activeVideo.muted = true;
        activeVideo.volume = 0;
        setIsMuted(true);
        activeVideo.play().catch(() => {});
      });
    }
  }, [isDesktop, isMuted]);

  // IntersectionObserver: resume video when hero is in view, pause when out of view
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    const targetElement = isMobile ? mobileHeroRef.current : trackRef.current;
    if (!targetElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const activeVideo = isMobile ? mobileVideoRef.current : desktopVideoRef.current;
        if (!activeVideo) return;

        if (entry.isIntersecting) {
          activeVideo.muted = isMuted;
          activeVideo.volume = isMuted ? 0 : 1;
          activeVideo.play().catch(() => {
            activeVideo.muted = true;
            activeVideo.volume = 0;
            activeVideo.play().catch(() => {});
          });
        } else {
          activeVideo.pause();
        }
      },
      { threshold: [0, 0.1] },
    );

    observer.observe(targetElement);
    return () => observer.disconnect();
  }, [isDesktop, isMuted]);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const nav = document.getElementById("site-nav-container");
      if (nav) {
        setHeaderHeight(nav.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    let observer: ResizeObserver | null = null;
    const nav = document.getElementById("site-nav-container");
    if (nav && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateHeaderHeight);
      observer.observe(nav);
    }

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      if (observer) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const handleMobileScroll = () => {
      if (window.innerWidth >= 1024) return;
      if (!mobileHeroRef.current || !mobileVideoRef.current) return;

      const rect = mobileHeroRef.current.getBoundingClientRect();
      if (rect.bottom <= 60 || rect.top >= window.innerHeight) {
        if (!mobileVideoRef.current.paused) {
          mobileVideoRef.current.pause();
        }
      } else {
        if (mobileVideoRef.current.paused) {
          mobileVideoRef.current.muted = isMuted;
          mobileVideoRef.current.volume = isMuted ? 0 : 1;
          mobileVideoRef.current.play().catch(() => {});
        }
      }
    };

    const handleScroll = () => {
      if (window.innerWidth < 1024) return;
      if (!trackRef.current || !containerRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollableDistance = trackHeight - windowHeight;

      if (scrollableDistance <= 0) return;

      const scrolled = -trackRect.top;
      const rawP = scrolled / scrollableDistance;
      const p = Math.min(Math.max(rawP, 0), 1);

      const expandP = Math.min(p / 0.65, 1);

      if (scrolled <= 0) {
        containerRef.current.style.position = "absolute";
        containerRef.current.style.top = "0px";
        containerRef.current.style.bottom = "auto";
        if (desktopVideoRef.current && desktopVideoRef.current.paused) {
          desktopVideoRef.current.muted = isMuted;
          desktopVideoRef.current.volume = isMuted ? 0 : 1;
          desktopVideoRef.current.play().catch(() => {});
        }
      } else if (scrolled >= scrollableDistance) {
        containerRef.current.style.position = "absolute";
        containerRef.current.style.top = "auto";
        containerRef.current.style.bottom = "0px";
        if (desktopVideoRef.current && !desktopVideoRef.current.paused) {
          desktopVideoRef.current.pause();
        }
      } else {
        containerRef.current.style.position = "fixed";
        containerRef.current.style.top = "0px";
        containerRef.current.style.bottom = "auto";
        if (desktopVideoRef.current && desktopVideoRef.current.paused) {
          desktopVideoRef.current.muted = isMuted;
          desktopVideoRef.current.volume = isMuted ? 0 : 1;
          desktopVideoRef.current.play().catch(() => {});
        }
      }

      // 1. Hero Brand Logo & Subtitle: Glides smoothly UPWARDS and disappears slowly as video expands
      if (heroBrandRef.current) {
        const brandOpacity = Math.max(0, 1 - expandP * 1.5);
        const brandTransY = -expandP * 140; // Rises up smoothly as the video screen gets big
        heroBrandRef.current.style.opacity = brandOpacity.toString();
        heroBrandRef.current.style.transform = `translate3d(0, ${brandTransY}px, 0)`;
        heroBrandRef.current.style.pointerEvents = expandP > 0.5 ? "none" : "auto";
      }

      // 2. Expand Media Video Card: Starts small/compact cutting into logo, smoothly expands to TRUE 100% FULL SCREEN
      if (mediaCardRef.current) {
        const width = window.innerWidth;
        const isMobile = width < 640;
        const isTablet = width >= 640 && width < 1024;

        if (isMobile) {
          // Mobile (< 640px): Starting card is 54% width, 32% height
          const startW = 54;
          const startH = 32;
          const currentW = startW + (100 - startW) * expandP;
          const currentH = startH + (100 - startH) * expandP;
          const currentRadius = 16 * (1 - expandP);
          mediaCardRef.current.style.width = expandP >= 0.98 ? "100%" : `${currentW}%`;
          mediaCardRef.current.style.height = expandP >= 0.98 ? "100%" : `${currentH}%`;
          mediaCardRef.current.style.right = expandP >= 0.98 ? "0px" : `${(1 - expandP) * 2}vw`;
          mediaCardRef.current.style.bottom = expandP >= 0.98 ? "0px" : `${(1 - expandP) * 2}vh`;
          mediaCardRef.current.style.borderRadius = `${currentRadius}px`;
          mediaCardRef.current.style.border =
            expandP >= 0.98 ? "none" : "1px solid rgba(255, 255, 255, 0.2)";
        } else if (isTablet) {
          // Tablet (640px - 1023px): Starting card is 44% width, 36% height
          const startW = 44;
          const startH = 36;
          const currentW = startW + (100 - startW) * expandP;
          const currentH = startH + (100 - startH) * expandP;
          const currentRadius = 18 * (1 - expandP);
          mediaCardRef.current.style.width = expandP >= 0.98 ? "100%" : `${currentW}%`;
          mediaCardRef.current.style.height = expandP >= 0.98 ? "100%" : `${currentH}%`;
          mediaCardRef.current.style.right = expandP >= 0.98 ? "0px" : `${(1 - expandP) * 2.5}vw`;
          mediaCardRef.current.style.bottom = expandP >= 0.98 ? "0px" : `${(1 - expandP) * 2.5}vh`;
          mediaCardRef.current.style.borderRadius = `${currentRadius}px`;
          mediaCardRef.current.style.border =
            expandP >= 0.98 ? "none" : "1px solid rgba(255, 255, 255, 0.2)";
        } else {
          // Desktop & Laptop (1024px+): Starting card is 36% width, 42% height
          const startW = 36;
          const startH = 42;
          const currentW = startW + (100 - startW) * expandP;
          const currentH = startH + (100 - startH) * expandP;
          const currentRadius = 20 * (1 - expandP);

          mediaCardRef.current.style.width = expandP >= 0.98 ? "100%" : `${currentW}%`;
          mediaCardRef.current.style.height = expandP >= 0.98 ? "100%" : `${currentH}%`;
          mediaCardRef.current.style.right = expandP >= 0.98 ? "0px" : `${(1 - expandP) * 2.5}vw`;
          mediaCardRef.current.style.bottom = expandP >= 0.98 ? "0px" : `${(1 - expandP) * 10}vh`;
          mediaCardRef.current.style.borderRadius = `${currentRadius}px`;
          mediaCardRef.current.style.border =
            expandP >= 0.98 ? "none" : "1px solid rgba(255, 255, 255, 0.2)";
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        handleScroll();
        handleMobileScroll();
      });
    };

    const onResize = () => {
      handleScroll();
      handleMobileScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    handleScroll();
    handleMobileScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* 1. MOBILE & TABLET VIEW (< 1024px): Video centered in between, sentence below it */}
      <section
        id="hero-mobile-section"
        ref={mobileHeroRef}
        aria-hidden={isDesktop}
        className="block lg:hidden relative overflow-hidden bg-aura-diagonal-soft w-full min-h-[calc(100vh-60px)] px-4 sm:px-6 pb-12 flex flex-col items-center justify-center text-center"
        style={{ paddingTop: `${headerHeight + 20}px` }}
      >
        {/* Animated podcast-style geometric orbital watermarks & contour waves */}
        <HeroOrbitalAtmosphere className="scale-90" />

        {/* Ambient atmospheric brand glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-10 h-[360px] w-[360px] rounded-full opacity-35 blur-3xl"
          style={{ backgroundImage: "var(--gradient-glow)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-10 h-[300px] w-[300px] rounded-full opacity-25 blur-3xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(90, 160, 255, 0.25), transparent 60%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center w-full max-w-md mx-auto my-auto">
          {/* Top: AI Studio Title for Mobile & Tablet */}
          <div className="w-full mb-3 px-2 flex justify-center">
            <img
              src="/images/ai studio logo hero.png"
              alt="Quickupp AI Studio"
              title="Quickupp AI Studio"
              className="w-full max-w-[280px] xs:max-w-[320px] h-auto object-contain select-none"
              width={1600}
              height={300}
              loading="eager"
              fetchPriority="high"
            />
          </div>

          {/* Video in between (centered, high-impact vertical format) */}
          <div className="relative w-full max-w-[310px] xs:max-w-[340px] sm:max-w-[390px] aspect-[9/16] max-h-[58vh] rounded-2xl overflow-hidden border border-white/20 bg-[#0e081e] shadow-[0_0_50px_rgba(200,80,255,0.35)] glow-neon">
            <video
              ref={(el) => {
                mobileVideoRef.current = el;
                if (el) {
                  el.defaultMuted = true;
                  el.muted = isMuted;
                  el.playsInline = true;
                }
              }}
              src="/videos/Hero Video.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              // @ts-ignore
              fetchpriority="high"
              onClick={toggleAudio}
              className="h-full w-full object-cover object-center cursor-pointer"
            >
              <track kind="captions" src="" label="English" default />
            </video>

            {/* Audio Voice Toggle Button */}
            <div className="absolute top-2.5 left-2.5 z-30">
              <button
                type="button"
                onClick={toggleAudio}
                className="group inline-flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-3.5 py-2 text-[10px] sm:text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:border-neon hover:bg-neon/20 hover:scale-105 active:scale-95 cursor-pointer"
                title={isMuted ? "Click to Unmute Voice" : "Click to Mute Audio"}
                aria-label={isMuted ? "Unmute video voice" : "Mute video audio"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-red-400 group-hover:text-neon" />
                    <span className="text-white/90">Unmute Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-neon animate-pulse" />
                    <span className="text-neon font-bold">Voice Active</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Below that: Hero Headline & Subheading */}
          <div className="mt-4 sm:mt-6 w-full max-w-lg px-2 text-center">
            <h1 className="font-[var(--font-google-sans)] text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-900">
              <span className="font-serif italic font-bold text-gradient-brand inline-block pr-1.5">
                AI Video Creation
              </span>{" "}
              for Businesses That Want to Stand Out
            </h1>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Turn your ideas into engaging, professional videos with AI - faster, smarter, and more cost-effectively.
            </p>
          </div>
        </div>
      </section>

      {/* 2. DESKTOP VIEW (lg: 1024px+): Full Cinema Scroll & Expansion Engine */}
      <section
        id="hero-scroll-track"
        ref={trackRef}
        aria-hidden={!isDesktop}
        className="hidden lg:block relative w-full h-[280vh] bg-aura-diagonal-soft"
      >
        <div
          ref={containerRef}
          className="absolute top-0 left-0 w-full h-screen overflow-hidden bg-aura-diagonal-soft pointer-events-none"
        >
          {/* Animated podcast-style geometric orbital watermarks & contour waves */}
          <HeroOrbitalAtmosphere />

          {/* Ambient atmospheric background glows */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full opacity-35 blur-3xl"
            style={{ backgroundImage: "var(--gradient-glow)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 bottom-10 h-[450px] w-[450px] rounded-full opacity-25 blur-3xl"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(90, 160, 255, 0.25), transparent 60%)",
            }}
          />

          {/* Top & Left Content: Cleanly positioned below navigation bar, spanning across and behind video card */}
          <div
            ref={heroBrandRef}
            className="absolute inset-0 px-6 lg:px-12 xl:px-16 flex flex-col justify-between pointer-events-auto will-change-transform z-10"
            style={{
              paddingTop: `calc(${headerHeight}px + clamp(75px, 11vh, 115px))`,
              paddingBottom: "10vh",
            }}
          >
            {/* Top: Giant "AI Studio" Title spanning across the screen and extending behind video card */}
            <div className="w-full flex-shrink-0">
              <img
                src="/images/ai studio logo hero.png"
                alt="Quickupp AI Studio - Tech-Enabled AI Video Production Studio"
                title="Quickupp AI Studio"
                className="w-full max-w-[96vw] lg:max-w-[95vw] xl:max-w-[94vw] 2xl:max-w-[1720px] h-auto object-contain object-left select-none opacity-[0.98]"
                width={4267}
                height={730}
                loading="eager"
                fetchPriority="high"
              />
            </div>

            {/* Bottom Row: Primary Headline on the left - perfectly aligned with logo above and bottom baseline of video card */}
            <div
              className="w-full max-w-lg lg:max-w-xl xl:max-w-[48vw] 2xl:max-w-[50vw] mb-0 pb-0"
              style={{ paddingLeft: "min(3.21%, 55px)" }}
            >
              <h1 className="font-[var(--font-google-sans)] text-3xl lg:text-[2.35rem] xl:text-[2.85rem] 2xl:text-[3.35rem] font-bold leading-[1.12] tracking-tight text-slate-900">
                <span className="font-serif italic font-bold text-gradient-brand inline-block pr-1.5">
                  AI Video Creation
                </span>{" "}
                for Businesses That Want to Stand Out
              </h1>
              <p className="mt-3 lg:mt-4 xl:mt-5 text-base lg:text-[1.05rem] xl:text-[1.2rem] 2xl:text-[1.3rem] text-slate-600 leading-relaxed font-normal max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
                Turn your ideas into engaging, professional videos with AI - faster, smarter, and more cost-effectively.
              </p>
            </div>
          </div>

          {/* Media Video Showcase: Aligned directly below navigation bar to avoid cutting */}
          <div
            className="absolute bottom-0 inset-x-0 z-20 pointer-events-none overflow-hidden"
            style={{ top: `${headerHeight}px` }}
          >
            <div
              ref={mediaCardRef}
              className="pointer-events-auto absolute bg-[#0e081e] shadow-[0_0_60px_-10px_rgba(200,80,255,0.45)] will-change-transform glow-neon border border-white/20 overflow-hidden"
              style={{
                width: "36%",
                height: "42%",
                right: "2.5vw",
                bottom: "10vh",
                borderRadius: "20px",
              }}
            >
              {/* Active autoplaying video with audio default */}
              <video
                ref={(el) => {
                  desktopVideoRef.current = el;
                  if (el) {
                    el.defaultMuted = true;
                    el.muted = isMuted;
                    el.playsInline = true;
                  }
                }}
                src="/videos/Hero Video.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                // @ts-ignore
                fetchpriority="high"
                onClick={toggleAudio}
                className="h-full w-full object-cover object-center cursor-pointer"
              >
                <track kind="captions" src="" label="English" default />
              </video>

              {/* Audio Voice Toggle Button */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:right-auto z-30">
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="group inline-flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-2.5 py-1 sm:px-3 sm:py-1 text-[9px] sm:text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:border-neon hover:bg-neon/20 hover:scale-105 active:scale-95 cursor-pointer"
                  title={isMuted ? "Click to Unmute Voice" : "Click to Mute Audio"}
                  aria-label={isMuted ? "Unmute video voice" : "Mute video audio"}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-400 group-hover:text-neon" />
                      <span className="text-white/90">Unmute Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-neon animate-pulse" />
                      <span className="text-neon font-bold">Voice Active</span>
                    </>
                  )}
                </button>
              </div>

              {/* Floating Formats Pills */}
              <div className="absolute bottom-2.5 sm:bottom-3 inset-x-2 sm:inset-x-4 flex flex-nowrap items-center justify-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1 z-20">
                {formats.map((format) => (
                  <span
                    key={format}
                    className="whitespace-nowrap rounded-full border border-white/20 bg-black/80 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-xs font-semibold text-white/95 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-neon hover:bg-neon/20 hover:scale-105"
                  >
                    {format}
                  </span>
                ))}
              </div>

              {/* Showcase Badge */}
              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-neon/50 bg-black/75 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-xs font-bold text-white shadow-md backdrop-blur-md">
                  <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-neon animate-pulse" />
                  <span>AI Video Showcase</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function HeroOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const checklistItems = [
    "Script Included",
    "5+ AI Video Formats",
    "Up to 60-Second Videos",
    "9:16 Reel Format",
    "48–72 Hour Delivery",
    "1 Revision Included",
  ];

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative overflow-hidden px-5 sm:px-8 lg:px-12 py-10 sm:py-14 md:py-16 border-b border-purple-100/80 bg-aura-diagonal"
    >
      {/* Ambient background brand glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-20 top-0 h-[450px] w-[450px] rounded-full blur-3xl transition-all duration-1000 ease-out ${
          isVisible ? "opacity-25" : "opacity-0"
        }`}
        style={{ backgroundImage: "var(--gradient-glow)" }}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute -left-20 bottom-0 h-[380px] w-[380px] rounded-full blur-3xl transition-all duration-1000 ease-out ${
          isVisible ? "opacity-20" : "opacity-0"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(90, 160, 255, 0.22), transparent 60%)",
        }}
      />

      <div className="mx-auto w-full max-w-6xl relative z-10">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading, Value Prop, Paragraphs & CTAs (7 cols on tablet/desktop) */}
          <div className="md:col-span-7 flex flex-col items-start text-left">
            {/* Brand Eyebrow Badge */}
            <div
              className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100 blur-0"
                  : "opacity-0 -translate-y-3 scale-95 blur-sm"
              }`}
            >
              <span className="eyebrow text-[11px] sm:text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon shadow-[0_0_8px_#c850ff]"></span>
                </span>
                AI Video Production Company
              </span>
            </div>

            {/* Headline */}
            <h2
              className={`mt-3 sm:mt-4 font-[var(--font-google-sans)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight text-slate-900 transition-all duration-800 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-sm"
              }`}
            >
              AI Video Production Services for{" "}
              <span className="font-serif italic font-bold text-gradient-brand inline-block pr-1.5">
                Modern Businesses
              </span>
            </h2>

            {/* Subheading */}
            <h3
              className={`mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg font-semibold text-slate-700 leading-snug transition-all duration-800 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-4 blur-sm"
              }`}
            >
              Create AI UGC, AI Avatar, Cartoon, Hyper-Realistic &amp; Digital Twin Videos for Your
              Brand
            </h3>

            {/* Paragraph 1 & 2 */}
            <p
              className={`mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base leading-relaxed text-muted-foreground transition-all duration-800 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-4 blur-sm"
              }`}
            >
              Create engaging and professional video content without traditional production
              complexity. Quickupp AI Studio provides professional AI video production services for
              businesses, brands, founders and marketing teams — from AI UGC videos and AI avatar
              reels to hyper-realistic AI advertisements and digital twin videos.
            </p>

            <p
              className={`mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground transition-all duration-800 delay-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-4 blur-sm"
              }`}
            >
              Our AI video production includes scripting, AI-generated visuals, voiceover, lip-sync,
              captions, background music and editing, delivered in social-media-ready 9:16 format.
            </p>

            {/* Action Buttons */}
            <div
              className={`mt-5 sm:mt-6 flex flex-wrap items-center gap-3 transition-all duration-800 delay-550 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-95"
              }`}
            >
              <NeonButton
                href="#book-call"
                variant="call"
                className="text-xs sm:text-sm inline-flex items-center gap-1.5 group"
              >
                <Calendar className="h-3.5 w-3.5 text-purple-700 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span>Book a 30 min call</span>
              </NeonButton>
              <NeonButton href="#contact" className="text-xs sm:text-sm">
                Get Your AI Video Quote
              </NeonButton>
              <NeonButton
                href="#samples"
                variant="ghost"
                className="text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-neon/60 bg-neon/10">
                  <Play className="h-2 w-2 fill-neon text-neon ml-0.5" />
                </span>
                <span>View Video Samples</span>
              </NeonButton>
            </div>
          </div>

          {/* Right Column: 6 Feature Cards (2 cols on mobile, 1 col on tablet/desktop) */}
          <div
            className={`md:col-span-5 w-full grid grid-cols-2 md:grid-cols-1 gap-2 sm:gap-2.5 lg:gap-3 transition-all duration-800 delay-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            {checklistItems.map((item, idx) => (
              <div
                key={item}
                className="group flex items-center gap-2 sm:gap-3 rounded-xl border border-slate-200 bg-white/90 px-2.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-800 shadow-sm transition-all duration-300 hover:border-purple-300 hover:bg-purple-50/50 hover:scale-[1.02] hover:shadow-md"
                style={{ transitionDelay: isVisible ? `${450 + idx * 70}ms` : "0ms" }}
              >
                <span className="flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full bg-neon/20 text-neon border border-neon/50 shadow-[0_0_10px_rgba(200,80,255,0.35)] group-hover:scale-110 group-hover:bg-neon group-hover:text-black transition-all duration-200">
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[3]" />
                </span>
                <span className="tracking-wide">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustStrip() {
  const items = [
    { icon: Film, label: "5+ AI Video Formats" },
    { icon: Clock, label: "48–72 Hour Delivery" },
    { icon: Smartphone, label: "9:16 Reel Ready" },
    { icon: BadgeCheck, label: "Script + 1 Revision Included" },
  ];

  return (
    <section className="border-y border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 px-5 py-5 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-center gap-3 lg:justify-start">
            <item.icon className="h-5 w-5 shrink-0 text-neon" />
            <span className="text-sm font-medium text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Samples() {
  const [activeTab, setActiveTab] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedMap, setCompletedMap] = useState<Record<number, boolean>>({});
  const [mutedMap, setMutedMap] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const filters = ["All", ...formats];
  const allFiltered = useMemo(() => {
    return activeTab === "All"
      ? samples
      : samples.filter(
          (s) =>
            s.format.toLowerCase().trim() === activeTab.toLowerCase().trim() ||
            (activeTab === "AI UGC" && s.format.includes("UGC")) ||
            (activeTab === "AI Cartoon" && s.format.includes("Cartoon")) ||
            (activeTab === "AI Avatar" && s.format.includes("Avatar")) ||
            (activeTab === "Hyper-Realistic" && s.format.includes("Realistic")) ||
            (activeTab === "Digital Twin" && s.format.includes("Twin")),
        );
  }, [activeTab]);

  // Group filtered samples into pairs of 2
  const pairs = useMemo(() => {
    const list: (typeof samples)[] = [];
    for (let i = 0; i < allFiltered.length; i += 2) {
      list.push(allFiltered.slice(i, i + 2));
    }
    return list;
  }, [allFiltered]);

  // Observe cards container directly so animation plays right when cards enter the viewport
  useEffect(() => {
    const el = cardsContainerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.05, rootMargin: "60px 0px 60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Advance to next video pair
  const handleAdvance = () => {
    if (pairs.length > 1) {
      setCompletedMap({});
      setCurrentIndex((prev) => (prev + 1) % pairs.length);
    }
  };

  const handlePrev = () => {
    if (pairs.length > 1) {
      setCompletedMap({});
      setCurrentIndex((prev) => (prev - 1 + pairs.length) % pairs.length);
    }
  };

  // Reset index and completion state whenever tab changes so it always starts from first video(s)
  useEffect(() => {
    setCurrentIndex(0);
    setCompletedMap({});
  }, [activeTab]);

  const currentPair = useMemo(() => pairs[currentIndex] || pairs[0] || [], [pairs, currentIndex]);

  // Autoplay active video pair smoothly across mobile and desktop (default muted)
  useEffect(() => {
    if (!isInView) return;

    currentPair.forEach((_, idx) => {
      const video = videoRefs.current[idx];
      if (video) {
        const isMuted = mutedMap[idx] ?? true;
        video.defaultMuted = true;
        video.muted = isMuted;
        video.volume = isMuted ? 0 : 1;
        video.playsInline = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            const onGesture = () => {
              const v = videoRefs.current[idx];
              if (v) {
                v.defaultMuted = true;
                v.muted = mutedMap[idx] ?? true;
                v.play().catch(() => {});
              }
              window.removeEventListener("touchstart", onGesture);
              window.removeEventListener("scroll", onGesture);
            };
            window.addEventListener("touchstart", onGesture, { once: true, passive: true });
            window.addEventListener("scroll", onGesture, { once: true, passive: true });
          });
        }
      }
    });
  }, [isInView, currentIndex, activeTab, currentPair, mutedMap]);

  const toggleMute = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[idx];
    if (!video) return;
    const isCurrentlyMuted = mutedMap[idx] ?? true;
    const nextMuted = !isCurrentlyMuted;
    video.muted = nextMuted;
    video.volume = nextMuted ? 0 : 1;
    setMutedMap((prev) => ({ ...prev, [idx]: nextMuted }));
    if (!nextMuted && video.paused) {
      video.play().catch(() => {});
    }
  };

  const handleVideoEnded = (idx: number) => {
    setCompletedMap((prev) => {
      const updated = { ...prev, [idx]: true };
      return updated;
    });
  };

  const handleReplay = (idx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompletedMap((prev) => ({ ...prev, [idx]: false }));
    const video = videoRefs.current[idx];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const allPairCompleted =
    currentPair.length > 0 && currentPair.every((_, i) => completedMap[i] === true);

  return (
    <Section id="samples" className="relative overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80">
      {/* Giant scrolling 'SAMPLES' watermark — continuous left marquee loop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden select-none z-0"
      >
        <div className="animate-watermark-scroll flex whitespace-nowrap">
          {/* Duplicated for seamless infinite loop */}
          {[0, 1].map((i) => (
            <span
              key={i}
              className="flex shrink-0 items-center font-extrabold uppercase text-slate-900/[0.04]"
              style={{ fontSize: "clamp(5rem, 18vw, 14rem)", letterSpacing: "0.2em" }}
            >
              SAMPLES&nbsp;&nbsp;•&nbsp;&nbsp;SAMPLES&nbsp;&nbsp;•&nbsp;&nbsp;SAMPLES&nbsp;&nbsp;•&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <SectionHeading
          eyebrow="AI Video Samples"
          title="Explore Our AI Video"
          highlight="Samples"
          description="See how different AI video formats can bring your brand, product or service to life."
        />
        <p className="mx-auto mb-8 -mt-6 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          Not sure which AI video format is right for your business? Explore our video samples to
          understand the difference between AI UGC videos, AI cartoon animation, AI avatar videos,
          hyper-realistic AI videos and AI digital twin videos.
        </p>

        {/* Filter Tabs */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveTab(filter)}
            className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all duration-300 sm:text-sm ${
              activeTab === filter
                ? "bg-gradient-brand text-neon-foreground shadow-md glow-neon scale-105"
                : "border border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:text-slate-900"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 2 at a time Diagonal Showcase Container */}
      <div
        ref={cardsContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="mx-auto max-w-5xl space-y-6 overflow-hidden py-2 min-h-[300px]"
      >
        {currentPair.map((item, idx) => {
          const isSecond = idx === 1; // Card 1 is top (left entry), Card 2 is bottom (right entry)
          const isReversed = idx % 2 === 1; // Diagonal layout: top card left-video/right-text, bottom card right-video/left-text

          const slideAnimationClass = isInView
            ? isSecond
              ? "animate-slide-in-right"
              : "animate-slide-in-left"
            : `opacity-0 ${isSecond ? "translate-x-10" : "-translate-x-10"}`;

          const isEnded = Boolean(completedMap[idx]);
          const isVideoMuted = mutedMap[idx] ?? true;

          return (
            <div
              key={`sample-card-${activeTab}-${currentIndex}-${idx}`}
              className={`relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-xl backdrop-blur-xl transition-all duration-500 hover:border-purple-300 hover:shadow-2xl sm:p-7 md:p-8 ${slideAnimationClass}`}
            >
              <div
                className={`flex flex-col items-center gap-6 md:gap-10 ${
                  isReversed ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* Authentic 9:16 Vertical Reel Player with dark stylish border */}
                <div
                  onClick={() => {
                    const v = videoRefs.current[idx];
                    if (v) {
                      if (v.ended || completedMap[idx]) {
                        handleReplay(idx);
                      } else if (v.paused) {
                        v.play().catch(() => {});
                      } else {
                        v.pause();
                      }
                    }
                  }}
                  className="relative aspect-[9/16] w-full max-w-[260px] sm:max-w-[280px] shrink-0 overflow-hidden rounded-2xl border-2 border-slate-800 bg-black shadow-lg transition-all duration-300 hover:border-neon cursor-pointer"
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                      if (el) {
                        el.defaultMuted = true;
                        el.muted = isVideoMuted;
                        el.volume = isVideoMuted ? 0 : 1;
                        el.playsInline = true;
                        // Lazy-set src only when element is mounted to avoid
                        // browser pre-fetching all videos on page load
                        if (item.videoUrl && !el.src) {
                          el.src = item.videoUrl;
                          el.load();
                        }
                      }
                    }}
                    key={item.videoUrl}
                    muted={isVideoMuted}
                    playsInline
                    preload="none"
                    onEnded={() => handleVideoEnded(idx)}
                    className="h-full w-full object-cover"
                  >
                    <track kind="captions" src="" label="English" default />
                  </video>

                  {/* Audio Unmute / Sound On Toggle Button (Default Muted) */}
                  <div className="absolute top-2.5 left-2.5 z-30">
                    <button
                      type="button"
                      onClick={(e) => toggleMute(idx, e)}
                      className="group/mute inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:border-neon hover:bg-neon/20 hover:scale-105 active:scale-95 cursor-pointer"
                      title={isVideoMuted ? "Click to Unmute Audio" : "Click to Mute Audio"}
                      aria-label={isVideoMuted ? "Unmute sample video" : "Mute sample video"}
                    >
                      {isVideoMuted ? (
                        <>
                          <VolumeX className="h-3.5 w-3.5 text-red-400 group-hover/mute:text-neon" />
                          <span className="text-white/90">Unmute</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3.5 w-3.5 text-neon animate-pulse" />
                          <span className="text-neon font-bold">Sound On</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* "Watch Again" Overlay when video reaches end */}
                  {isEnded && (
                    <div
                      onClick={(e) => handleReplay(idx, e)}
                      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 p-3 text-center backdrop-blur-[2px] animate-in fade-in duration-300 cursor-pointer"
                    >
                      <button
                        type="button"
                        onClick={(e) => handleReplay(idx, e)}
                        className="group/btn inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-xs sm:text-sm font-bold text-neon-foreground shadow-xl transition-all hover:scale-105 active:scale-95 glow-neon cursor-pointer"
                        aria-label={`Watch ${item.format} video again`}
                      >
                        <RotateCcw className="h-4 w-4 transition-transform duration-300 group-hover/btn:-rotate-45" />
                        <span>Watch Again</span>
                      </button>
                    </div>
                  )}

                  <span className="absolute bottom-3 left-3 rounded-lg bg-black/80 border border-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-md z-10">
                    {item.format}
                  </span>
                </div>

                {/* Content Side */}
                <div className="flex flex-1 flex-col justify-between self-stretch py-1 text-left">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-purple-600">
                        Industry: {item.industry}
                      </span>
                      <span className="rounded-md border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                        9:16 Vertical Reel
                      </span>
                    </div>

                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {item.format}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {item.description}
                    </p>

                    {/* What's Included Deliverables Checklist */}
                    {(() => {
                      const matchedDeliverable =
                        deliverables.find(
                          (d) =>
                            d.title
                              .toLowerCase()
                              .includes(item.format.toLowerCase().replace("video", "").trim()) ||
                            item.format
                              .toLowerCase()
                              .includes(d.title.toLowerCase().replace("video", "").trim()),
                        ) || deliverables[0];

                      return (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wider text-purple-700 sm:text-sm">
                              ✦ What's Included in This Package:
                            </p>
                            <span className="text-[11px] font-semibold text-slate-500">
                              {matchedDeliverable.items.length} Deliverables
                            </span>
                          </div>

                          <ul className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs sm:text-sm text-slate-700">
                            {matchedDeliverable.items.map((point) => (
                              <li key={point} className="flex items-center gap-2.5">
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[10px] font-extrabold text-purple-700 shadow-sm">
                                  ✓
                                </span>
                                <span className="leading-snug text-slate-800">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Card Bottom Action & Turnaround Bar */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                        {item.format}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">⚡ 48–72h Turnaround</span>
                    </div>

                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-gradient-brand hover:scale-105"
                    >
                      <span>Create Similar Video</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Indicators & Next/Prev Controls */}
      {pairs.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={handlePrev}
            className="flex min-h-[44px] min-w-[44px] h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-sm text-slate-700 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900"
            aria-label="Previous samples"
          >
            ←
          </button>
          <div className="flex items-center gap-1">
            {pairs.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="flex min-h-[44px] min-w-[32px] items-center justify-center p-1 cursor-pointer"
                aria-label={`Slide ${i + 1}`}
              >
                <span
                  className={`h-2.5 rounded-full transition-all duration-300 block ${
                    currentIndex === i
                      ? "w-8 bg-gradient-brand shadow-sm glow-neon"
                      : "w-2.5 bg-slate-200 hover:bg-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            onClick={handleAdvance}
            className="flex min-h-[44px] min-w-[44px] h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-sm text-slate-700 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900"
            aria-label="Next samples"
          >
            →
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <p className="mb-4 text-xl font-semibold text-slate-900">
          Want a Similar Video for Your Business?
        </p>
        <NeonButton href="#contact">Get Your AI Video Quote</NeonButton>
      </div>
      </div>
    </Section>
  );
}

function PortfolioCard({ sample }: { sample: (typeof portfolioItems)[number] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [srcLoaded, setSrcLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Lazy-load src only when card scrolls into view
          if (sample.videoUrl && !video.src) {
            video.src = sample.videoUrl;
            video.load();
            setSrcLoaded(true);
          }
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch(() => {
                video.defaultMuted = true;
                video.muted = true;
                video
                  .play()
                  .then(() => setIsPlaying(true))
                  .catch(() => {});
                const onInteract = () => {
                  video
                    .play()
                    .then(() => setIsPlaying(true))
                    .catch(() => {});
                  window.removeEventListener("touchstart", onInteract);
                  window.removeEventListener("scroll", onInteract);
                };
                window.addEventListener("touchstart", onInteract, { once: true, passive: true });
                window.addEventListener("scroll", onInteract, { once: true, passive: true });
              });
          }
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.08, rootMargin: "40px 0px 40px 0px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [sample.videoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    videoRef.current.volume = nextMuted ? 0 : 1;
    setIsMuted(nextMuted);
    if (!nextMuted && videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <article className="group relative flex aspect-[9/16] w-full flex-col justify-between overflow-hidden rounded-[24px] border border-border/80 bg-black p-4 sm:p-5 shadow-2xl transition-all duration-300 hover:border-neon/60 hover:shadow-[0_0_35px_-5px_rgba(217,70,239,0.35)] sm:w-[calc(50%-0.875rem)] lg:w-[calc(33.333%-1.25rem)]">
      {/* Background Video — lazy-loaded: src set only when card enters viewport */}
      {sample.videoUrl && (
        <video
          ref={(el) => {
            videoRef.current = el;
            if (el) {
              el.defaultMuted = true;
              el.muted = isMuted;
              el.volume = isMuted ? 0 : 1;
              el.playsInline = true;
            }
          }}
          muted={isMuted}
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        >
          <track kind="captions" src="" label="English" default />
        </video>
      )}

      {/* Loading shimmer shown until video src is assigned */}
      {sample.videoUrl && !srcLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e0820] via-[#1a0a2e] to-[#0e0820] animate-pulse pointer-events-none" />
      )}

      {/* Blank / Coming Soon state */}
      {!sample.videoUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-black via-[#1a0a2e] to-black pointer-events-none">
          {/* Pulsing ring */}
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-neon/20" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-neon/40 bg-black/60 backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neon/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.37m5.96 12a14.98 14.98 0 01-12.12 6.16M15.59 14.37L9.63 2.37" />
              </svg>
            </span>
          </div>
          <p className="text-xs font-semibold tracking-widest text-neon/60 uppercase">Coming Soon</p>
        </div>
      )}

      {/* Video Interactive Tap Area — only when video exists */}
      {sample.videoUrl && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 h-full w-full cursor-pointer z-0 border-none bg-transparent p-0 text-left"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        />
      )}

      {/* Cinematic Soft Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 pointer-events-none" />

      {/* Sound Toggle (Top Right) — only when video exists */}
      <div className="z-10 flex items-center justify-end">
        {sample.videoUrl && (
          <button
            type="button"
            onClick={toggleMute}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 bg-black/60 text-white/90 border border-white/15 backdrop-blur-md transition-all hover:scale-110 hover:bg-neon hover:text-black shadow"
            title={isMuted ? "Unmute sound" : "Mute sound"}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Center Play/Pause indicator on hover or when paused — only when video exists */}
      {sample.videoUrl && (
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${
            !isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand text-neon-foreground shadow-[0_0_20px_rgba(217,70,239,0.6)] backdrop-blur-md">
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="ml-0.5 h-6 w-6 text-white fill-white" />
            )}
          </div>
        </div>
      )}

      {/* Bottom Industry & Description Info with subtle frosted backing */}
      <div className="z-10 space-y-1 rounded-xl bg-black/40 p-2.5 backdrop-blur-sm pointer-events-none border border-white/5">
        <div className="text-xs font-bold text-neon sm:text-sm">Industry: {sample.industry}</div>
        <p className="text-xs text-white/90 line-clamp-2 leading-relaxed font-normal">
          {sample.description}
        </p>
      </div>
    </article>
  );
}

export function Portfolio() {
  return (
    <Section id="portfolio" className="relative overflow-hidden bg-gradient-to-b from-slate-100/80 via-purple-50/20 to-slate-100/90 border-y border-slate-200/80">
      <SectionHeading
        eyebrow="AI Video Portfolio"
        title="AI Video"
        highlight="Portfolio"
        description="Explore real examples of AI-powered video content created for different business requirements."
        center={true}
      />

      {/* Video Cards Grid - 6 cards (3 per row on desktop) */}
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6 md:gap-7">
        {portfolioItems.map((sample, idx) => (
          <PortfolioCard key={`portfolio-${sample.industry}-${idx}`} sample={sample} />
        ))}
      </div>

      {/* Buttons Group (Create a Similar Video & See More) */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-full bg-gradient-brand px-8 py-3.5 text-sm font-bold tracking-wide text-neon-foreground shadow-lg glow-neon transition-all duration-200 hover:scale-105 hover:brightness-110"
        >
          Create a Similar Video
        </a>
        <a
          href="https://youtube.com/@quickuppaistudios?si=QnC53RJK3YyMFtth"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold tracking-wide text-slate-800 shadow-sm transition-all duration-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
        >
          See More
        </a>
      </div>
    </Section>
  );
}

const serviceIcons: Record<string, typeof Sparkles> = {
  "AI UGC Video Production": Video,
  "AI Cartoon Animation Services": Palette,
  "AI Avatar Video Production": Bot,
  "Hyper-Realistic AI Video Production": Wand2,
  "AI Digital Twin & Clone Video Services": UserCheck,
};

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="services" className="relative overflow-hidden bg-aura-diagonal border-y border-purple-100/80 shadow-inner">
      {/* Left Half-Cut Geometric Orbital Watermark */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[520px] sm:w-[650px] lg:w-[780px] h-[520px] sm:h-[650px] lg:h-[780px] select-none z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="servicesLeftGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Center Glow */}
          <circle cx="300" cy="300" r="260" fill="url(#servicesLeftGlow)" className="animate-aura-pulse" />

          {/* Outer Orbit Ring with smooth continuous rotation */}
          <g className="animate-orbit-spin-slow">
            <circle
              cx="300"
              cy="300"
              r="270"
              stroke="rgba(147, 51, 234, 0.28)"
              strokeWidth="1.6"
              strokeDasharray="8 12"
            />
            <circle cx="570" cy="300" r="4" fill="#f472b6" className="drop-shadow-[0_0_8px_#f472b6]" />
            <circle cx="30" cy="300" r="3.5" fill="#38bdf8" className="drop-shadow-[0_0_8px_#38bdf8]" />
          </g>

          {/* Middle Breathing Cyan/Blue Orbit Ring */}
          <circle
            cx="300"
            cy="300"
            r="200"
            stroke="rgba(79, 70, 229, 0.30)"
            strokeWidth="1.8"
            className="animate-orbit-breath"
          />

          {/* S-Curve Contours */}
          <path
            d="M 0 300 C 180 180, 420 420, 600 300"
            stroke="rgba(147, 51, 234, 0.26)"
            strokeWidth="1.8"
            className="animate-wave-float-1"
          />
          <path
            d="M 0 360 C 220 440, 380 160, 600 240"
            stroke="rgba(244, 63, 158, 0.28)"
            strokeWidth="1.6"
            className="animate-wave-float-2"
          />
        </svg>
      </div>

      {/* Right Half-Cut Geometric Orbital Watermark */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[520px] sm:w-[650px] lg:w-[780px] h-[520px] sm:h-[650px] lg:h-[780px] select-none z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="servicesRightGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.20" />
              <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Center Glow */}
          <circle cx="300" cy="300" r="260" fill="url(#servicesRightGlow)" className="animate-aura-pulse" />

          {/* Outer Orbit Ring with smooth counter-clockwise rotation */}
          <g className="animate-orbit-spin-reverse">
            <circle
              cx="300"
              cy="300"
              r="270"
              stroke="rgba(147, 51, 234, 0.28)"
              strokeWidth="1.6"
              strokeDasharray="8 12"
            />
            <circle cx="570" cy="300" r="4" fill="#a855f7" className="drop-shadow-[0_0_8px_#a855f7]" />
            <circle cx="30" cy="300" r="3.5" fill="#ec4899" className="drop-shadow-[0_0_8px_#ec4899]" />
          </g>

          {/* Middle Breathing Magenta/Violet Orbit Ring */}
          <circle
            cx="300"
            cy="300"
            r="200"
            stroke="rgba(168, 85, 247, 0.30)"
            strokeWidth="1.8"
            className="animate-orbit-breath"
          />

          {/* S-Curve Contours (mirrored flow) */}
          <path
            d="M 0 300 C 180 420, 420 180, 600 300"
            stroke="rgba(147, 51, 234, 0.26)"
            strokeWidth="1.8"
            className="animate-wave-float-2"
          />
          <path
            d="M 0 240 C 220 160, 380 440, 600 360"
            stroke="rgba(56, 189, 248, 0.28)"
            strokeWidth="1.6"
            className="animate-wave-float-1"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <SectionHeading
          eyebrow="AI Video Creation Services"
          title="Our AI Video Production"
          highlight="Services"
          description="Choose the AI video format that best fits your business and marketing goals."
        />
        <div
          ref={sectionRef}
          className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6 lg:gap-7"
        >
        {services.map((service, idx) => {
          const Icon = serviceIcons[service.title] || Sparkles;
          const animationClass = isInView
            ? "animate-service-card"
            : "opacity-0 scale-90 translate-y-6";

          return (
            <article
              key={service.title}
              style={{ animationDelay: `${idx * 0.1}s` }}
              className={`group relative flex w-full max-w-[350px] flex-col justify-between overflow-hidden rounded-[26px] border border-slate-200 bg-white/95 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-300 hover:shadow-xl sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.25rem)] ${animationClass}`}
            >
              <div className="relative z-10">
                {/* Header: Sparkle Icon + Full Service Title Heading */}
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-purple-600" />
                  </div>
                  <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                    {service.title}
                  </h3>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {service.description}
                </p>

                {/* Distinct Highlighted Text (No Background) */}
                <div className="mt-4 pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-purple-700">
                    <Sparkles className="h-3.5 w-3.5 text-purple-700" />
                    <span>Best For</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-800 font-medium">
                    {service.bestFor}
                  </p>
                </div>

                {/* Bullet Points Checklist */}
                <div className="mt-4 space-y-2">
                  {service.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 text-xs text-slate-700"
                    >
                      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[9px] font-bold text-purple-700">
                        ✓
                      </span>
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clean Gradient Button with Only Pricing */}
              <div className="relative z-10 mt-6 border-t border-slate-100 pt-4">
                <a
                  href="#contact"
                  className="flex w-full items-center justify-center rounded-lg bg-gradient-brand py-2.5 text-sm font-bold tracking-wide text-neon-foreground shadow-md transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-95 sm:text-base"
                >
                  {service.price}
                </a>
              </div>
            </article>
          );
        })}
      </div>
      </div>
    </Section>
  );
}

export function WhyAiVideo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="why-ai" className="relative overflow-hidden bg-background">
      {/* Dynamic Fluid Gradient Ribbon Waves Background */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden z-0">
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] min-w-[1200px] h-[130%] object-cover opacity-90"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="whyAiRibbon1" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.28" />
              <stop offset="40%" stopColor="#ec4899" stopOpacity="0.22" />
              <stop offset="75%" stopColor="#3b82f6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.10" />
            </linearGradient>

            <linearGradient id="whyAiRibbon2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#d946ef" stopOpacity="0.14" />
            </linearGradient>

            <radialGradient id="whyAiGlowLeft" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.20" />
              <stop offset="60%" stopColor="#ec4899" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="whyAiGlowRight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.20" />
              <stop offset="65%" stopColor="#a855f7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient luminous glow discs */}
          <circle cx="220" cy="300" r="320" fill="url(#whyAiGlowLeft)" className="animate-aura-pulse" />
          <circle cx="1220" cy="500" r="340" fill="url(#whyAiGlowRight)" className="animate-aura-pulse" />

          {/* Flowing Ribbon 1 - Upper Harmonic Arc */}
          <path
            d="M -60 140 C 260 20, 540 380, 900 220 C 1160 110, 1360 300, 1500 200 L 1500 330 C 1340 430, 1120 250, 880 350 C 520 490, 240 150, -60 260 Z"
            fill="url(#whyAiRibbon1)"
            className="animate-wave-float-1"
          />

          {/* Flowing Ribbon 2 - Lower Harmonic Arc */}
          <path
            d="M -60 580 C 300 740, 600 420, 940 600 C 1200 720, 1400 490, 1500 620 L 1500 490 C 1380 370, 1180 600, 920 470 C 580 310, 280 620, -60 450 Z"
            fill="url(#whyAiRibbon2)"
            className="animate-wave-float-2"
          />

          {/* Dynamic Dotted / Dashed Accent Contour Line 1 */}
          <path
            d="M -60 140 C 260 20, 540 380, 900 220 C 1160 110, 1360 300, 1500 200"
            stroke="rgba(219, 39, 119, 0.40)"
            strokeWidth="2"
            strokeDasharray="6 8"
            fill="none"
            className="animate-wave-float-1"
          />

          {/* Dynamic Cyan Accent Contour Line 2 */}
          <path
            d="M -60 580 C 300 740, 600 420, 940 600 C 1200 720, 1400 490, 1500 620"
            stroke="rgba(56, 189, 248, 0.40)"
            strokeWidth="2"
            strokeDasharray="8 10"
            fill="none"
            className="animate-wave-float-2"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <SectionHeading
          eyebrow="Why AI Video"
          title="Why Businesses Are Choosing AI Video"
          highlight="Production"
          description="Traditional video production can involve actors, locations, equipment and repeated shooting requirements. AI video production gives businesses a flexible way to create engaging content at scale while reducing production complexity."
        />
        <div ref={sectionRef} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {whyAiVideo.map((item, i) => {
            const animationClass = isInView ? "animate-cyber-wave" : "opacity-0 translate-y-8";

            return (
              <article
                key={item.title}
                style={{ animationDelay: `${i * 0.12}s` }}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-7 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-300 hover:shadow-xl ${animationClass}`}
              >
                {/* Top Neon Scanner Accent Bar on Hover */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-brand transition-all duration-500 group-hover:w-full" />

                {/* Ambient Glowing Watermark Number */}
                <span className="pointer-events-none absolute right-4 top-2 text-5xl font-black text-slate-900/[0.04] transition-all duration-300 group-hover:text-purple-600/15 group-hover:scale-110">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Number Pill Badge */}
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-200 bg-purple-50 text-xs font-bold text-purple-700 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900 transition-colors duration-200 group-hover:text-purple-600">
                  {item.title}
                </h3>

                <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3">
          <NeonButton
            href="#book-call"
            variant="call"
            size="sm"
            className="inline-flex items-center gap-1.5 whitespace-nowrap group"
          >
            <Calendar className="h-3.5 w-3.5 text-purple-700 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span>Book a 30 min call</span>
          </NeonButton>
          <NeonButton href="#contact" variant="primary" size="sm">
            Get AI Video Quote
          </NeonButton>
        </div>
      </div>
    </Section>
  );
}

export function Pricing() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="pricing" className="relative overflow-hidden bg-aura-diagonal border-y border-purple-100/80">
      <SectionHeading
        eyebrow="AI Video Production Services"
        title="AI Video Production Packages &"
        highlight="Pricing"
        description="Transparent rates for individual reels and high-volume monthly content bundles."
      />

      <div ref={tableRef} className="mx-auto max-w-6xl space-y-12">
        {/* 1. Individual Service Pricing */}
        <div className="space-y-3.5">
          <div className="border-b border-slate-200 pb-2.5">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Individual Service Pricing
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Per-video rate for each service, billed individually.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm backdrop-blur-xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <th className="px-5 py-3.5 sm:px-6">Service</th>
                  <th className="px-5 py-3.5 text-right sm:px-6 sm:text-left">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {individualPricingList.map((item, idx) => (
                  <tr
                    key={item.service}
                    className={`transition-colors hover:bg-purple-50/40 ${
                      idx % 2 === 1 ? "bg-slate-50/40" : "bg-white"
                    }`}
                  >
                    <td className="px-5 py-3.5 sm:px-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                        <span className="font-bold text-slate-900">{item.service}</span>
                        {item.description ? (
                          <span className="text-xs text-slate-500 font-normal hidden md:inline">
                            — {item.description}
                          </span>
                        ) : null}
                        {item.badge ? (
                          <span className="w-fit rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                            {item.badge}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-purple-700 sm:px-6 sm:text-left text-base">
                      {item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Package Pricing */}
        <div className="space-y-3.5">
          <div className="border-b border-slate-200 pb-2.5">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Package Pricing
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Bundle pricing by video volume and turnaround time. Prices shown are for the full package.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm backdrop-blur-xl">
            {/* Horizontal Scroll Hint for Mobile */}
            <div className="flex items-center justify-between bg-slate-50/90 px-4 py-2 text-[11px] font-medium text-slate-500 md:hidden border-b border-slate-200">
              <span>← Swipe horizontally to view all services →</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-700 sm:text-xs">
                    <th className="px-4 py-3.5 sm:px-5">Package</th>
                    <th className="px-4 py-3.5 sm:px-5">Delivery</th>
                    <th className="px-3 py-3.5 text-center sm:px-4">Videos</th>
                    <th className="px-4 py-3.5 text-center sm:px-5">AI UGC</th>
                    <th className="px-4 py-3.5 text-center sm:px-5">AI Avatar</th>
                    <th className="px-4 py-3.5 text-center sm:px-5">AI Cartoon</th>
                    <th className="px-4 py-3.5 text-center sm:px-5">Hyper-Realistic</th>
                    <th className="px-4 py-3.5 text-center sm:px-5">Digital Twin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {packagePricingTiers.map((tier, idx) => {
                    const isEven = idx % 2 === 1;
                    const rowBg = tier.popular
                      ? "bg-purple-50/30 hover:bg-purple-50/60"
                      : isEven
                      ? "bg-slate-50/40 hover:bg-purple-50/30"
                      : "bg-white hover:bg-purple-50/30";

                    return (
                      <tr key={tier.package} className={`transition-colors ${rowBg}`}>
                        {/* Package Name & Badge */}
                        <td className="px-4 py-3.5 font-bold text-slate-900 sm:px-5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span>{tier.package}</span>
                            {tier.badge ? (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                  tier.popular
                                    ? "bg-purple-600 text-white shadow-xs"
                                    : "border border-purple-200 bg-purple-50 text-purple-700"
                                }`}
                              >
                                {tier.badge}
                              </span>
                            ) : null}
                          </div>
                        </td>

                        {/* Delivery */}
                        <td className="px-4 py-3.5 text-slate-600 sm:px-5 whitespace-nowrap font-medium text-xs sm:text-sm">
                          {tier.delivery}
                        </td>

                        {/* Videos Count */}
                        <td className="px-3 py-3.5 text-center font-bold text-slate-900 sm:px-4 whitespace-nowrap">
                          <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full border border-purple-100 bg-purple-50/80 px-2 text-xs font-bold text-purple-700">
                            {tier.videos}
                          </span>
                        </td>

                        {/* AI UGC */}
                        <td className="px-4 py-3.5 text-center font-bold text-slate-800 sm:px-5 whitespace-nowrap">
                          {tier.aiUgc}
                        </td>

                        {/* AI Avatar */}
                        <td className="px-4 py-3.5 text-center font-bold text-slate-800 sm:px-5 whitespace-nowrap">
                          {tier.aiAvatar}
                        </td>

                        {/* AI Cartoon */}
                        <td className="px-4 py-3.5 text-center font-bold text-slate-800 sm:px-5 whitespace-nowrap">
                          {tier.aiCartoon}
                        </td>

                        {/* Hyper-Realistic */}
                        <td className="px-4 py-3.5 text-center font-bold text-purple-700 sm:px-5 whitespace-nowrap">
                          {tier.hyperRealistic}
                        </td>

                        {/* Digital Twin */}
                        <td className="px-4 py-3.5 text-center font-bold text-purple-700 sm:px-5 whitespace-nowrap">
                          {tier.digitalTwin}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. Digital Twin Setup */}
        <div className="space-y-3.5">
          <div className="border-b border-slate-200 pb-2.5">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Digital Twin Setup
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              One-time fee to build your Digital Twin before ordering Digital Twin videos.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm backdrop-blur-xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <th className="px-5 py-3.5 sm:px-6">Service</th>
                  <th className="px-5 py-3.5 text-center sm:px-6">Delivery</th>
                  <th className="px-5 py-3.5 text-right sm:px-6 text-purple-700">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white transition-colors hover:bg-purple-50/40">
                  <td className="px-5 py-4 sm:px-6 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-600" />
                      <span>{digitalTwinSetupItem.service}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center text-slate-600 sm:px-6 font-medium">
                    {digitalTwinSetupItem.delivery}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-purple-700 sm:px-6 text-base sm:text-lg">
                    {digitalTwinSetupItem.price}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Plan Callout Box */}
        <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-r from-purple-50/60 via-white to-pink-50/40 p-6 sm:p-8 text-center shadow-sm">
          <h4 className="text-lg font-bold text-slate-900 sm:text-xl">
            Need a Custom Volume or Monthly Content Retainer?
          </h4>
          <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-600">
            We offer tailored enterprise production schedules, dedicated creative directors, and custom
            AI pipelines for brands needing 30+ reels per month.
          </p>
          <div className="mt-5 flex flex-wrap justify-center items-center gap-3">
            <NeonButton
              href="#book-call"
              variant="call"
              size="sm"
              className="inline-flex items-center gap-1.5 whitespace-nowrap group"
            >
              <Calendar className="h-3.5 w-3.5 text-purple-700 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>Book a 30 min call</span>
            </NeonButton>
            <NeonButton href="#contact" variant="primary" size="sm">
              Get Custom Quote
            </NeonButton>
            <a
              href="https://wa.me/918177828748"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 active:scale-95"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>Chat with Production Team</span>
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Deliverables() {
  const [open, setOpen] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="deliverables">
      <SectionHeading
        eyebrow="Deliverables"
        title="What's Included in Your"
        highlight="AI Video?"
        description="Complete AI video production from script to final 9:16 reel."
        center={true}
      />
      <div ref={containerRef} className="mx-auto max-w-4xl space-y-3 overflow-hidden">
        {deliverables.map((item, i) => {
          const isLeft = i % 2 === 0;
          const animationClass = isInView
            ? isLeft
              ? "animate-item-left"
              : "animate-item-right"
            : `opacity-0 ${isLeft ? "-translate-x-10" : "translate-x-10"}`;

          return (
            <div
              key={item.title}
              style={{ animationDelay: `${i * 0.14}s` }}
              className={`panel overflow-hidden transition-all duration-300 ${animationClass}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50/80"
                aria-expanded={open === i}
              >
                <span>{item.title}</span>
                <span className="text-purple-600 font-bold transition-transform duration-200">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="border-t border-slate-200 bg-slate-50/80 px-6 py-5 select-text"
                >
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {item.items.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2.5 text-sm text-slate-600"
                      >
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export function DigitalTwin() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const twinVideoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const twinSample = samples.find((s) => s.format === "Digital Twin") || samples[4];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.05, rootMargin: "50px 0px 50px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = twinVideoRef.current;
    if (!video || !isInView) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const onTouch = () => {
          if (twinVideoRef.current) {
            twinVideoRef.current.defaultMuted = true;
            twinVideoRef.current.muted = true;
            twinVideoRef.current.play().catch(() => {});
          }
          window.removeEventListener("touchstart", onTouch);
          window.removeEventListener("scroll", onTouch);
        };
        window.addEventListener("touchstart", onTouch, { once: true, passive: true });
        window.addEventListener("scroll", onTouch, { once: true, passive: true });
      });
    }
  }, [isInView, twinSample?.videoUrl]);

  return (
    <Section id="digital-twin" className="relative overflow-hidden bg-aura-diagonal-soft border-y border-purple-100/70">
      {/* Giant left-scrolling 'AI VIDEO' watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden select-none z-0"
      >
        <div className="animate-watermark-scroll flex whitespace-nowrap">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="flex shrink-0 items-center font-extrabold uppercase text-slate-900/[0.04]"
              style={{ fontSize: "clamp(5rem, 18vw, 14rem)", letterSpacing: "0.2em" }}
            >
              AI VIDEO&nbsp;&nbsp;•&nbsp;&nbsp;AI VIDEO&nbsp;&nbsp;•&nbsp;&nbsp;AI VIDEO&nbsp;&nbsp;•&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div ref={sectionRef} className="relative z-10 grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Content Side: Enters from RIGHT */}
        <div
          className={`lg:col-span-5 transition-all duration-700 ${
            isInView ? "animate-item-right" : "opacity-0 translate-x-12"
          }`}
        >
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-neon" />
            AI Digital Twin Videos
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Build Your AI Digital Twin Once.{" "}
            <span className="font-serif italic text-gradient-brand inline-block pr-1.5">
              Create Videos Again and Again.
            </span>
          </h2>
          <p className="mt-4 text-base font-medium text-slate-800 md:text-lg">
            Turn your approved appearance and voice into a reusable AI video asset for future
            content.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Our AI digital twin video service helps founders, doctors, coaches, consultants,
            educators and personal brands create recurring video content using an appropriately
            authorized and client-approved digital twin. Once your digital twin is configured, it
            can be used for future AI video production without requiring you to record every
            individual video.
          </p>
          <p className="mt-6 text-2xl font-bold text-gradient-brand md:text-3xl">
            $499 One-Time Setup
          </p>
          <div className="mt-6">
            <NeonButton href="#contact">Create My Digital Twin</NeonButton>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Digital twin and voice cloning services require appropriate client authorization and
            consent.
          </p>
        </div>

        {/* Card Side: Enters from LEFT with points and Reel Player side-by-side */}
        <div
          className={`panel lg:col-span-7 flex flex-col items-center justify-between gap-6 p-6 shadow-xl transition-all duration-700 sm:flex-row sm:p-8 md:p-9 ${
            isInView ? "animate-item-left" : "opacity-0 -translate-x-12"
          }`}
        >
          {/* Checklist Points */}
          <ul className="flex flex-1 flex-col justify-between gap-3 self-stretch sm:gap-3.5">
            {twinFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-xs md:text-sm">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-700 shadow-sm">
                  ✓
                </span>
                <span className="font-medium text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Digital Twin Image Card */}
          <div className="relative aspect-[9/16] w-full max-w-[200px] shrink-0 overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg sm:max-w-[210px] md:max-w-[220px]">
            <img
              src="/images/digital twin image .png"
              alt="Digital Twin Sample Reel"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Industries() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getIndustryHref = (name: string) => {
    switch (name) {
      case "Real Estate":
        return "/industries/real-estate";
      case "Clinics & Doctors":
        return "/industries/healthcare";
      case "D2C & E-commerce":
      case "Beauty & Skincare":
      case "Jewellery & Luxury":
        return "/industries/ecommerce";
      case "Interior Design":
        return "/industries/interior-design";
      case "Restaurants & Cafes":
      case "Travel & Tourism":
        return "/industries/travel-hospitality";
      case "Education & Coaching":
        return "/industries/education";
      case "IT & SaaS":
        return "/industries/it-saas";
      case "Finance & Insurance":
        return "/industries/professional-services";
      case "Fitness & Wellness":
        return "/industries/home-services";
      default:
        return "/industries";
    }
  };

  return (
    <Section id="industries" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-100/90 border-b border-slate-200/80">
      <SectionHeading
        eyebrow="AI Video Production for Businesses"
        title="AI Video Production for Your"
        highlight="Industry"
        description="Create industry-specific video content designed around your audience, product and marketing goals."
      />
      <div ref={sectionRef} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry, i) => {
          const animationClass = isInView ? "animate-industry-card" : "opacity-0 translate-y-6";
          const href = getIndustryHref(industry.name);

          return (
            <a
              key={industry.name}
              href={href}
              style={{ animationDelay: `${(i % 6) * 0.08}s` }}
              className={`panel panel-hover group relative overflow-hidden p-6 transition-all duration-300 hover:border-purple-400 hover:shadow-[0_0_30px_-5px_rgba(200,80,255,0.35)] block ${animationClass}`}
            >
              {industry.image ? (
                <>
                  {/* Clearly Visible Background Image with 65% opacity */}
                  <img
                    src={industry.image}
                    alt={industry.name}
                    className="pointer-events-none absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)] max-w-none object-cover object-right opacity-65 transition-all duration-500 group-hover:scale-105 group-hover:opacity-80"
                  />
                  {/* Balanced directional gradient: dark on bottom/left for text, transparent on top/right to see artwork */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#0b0816]/90 via-[#0b0816]/55 to-[#0b0816]/15" />
                </>
              ) : null}

              <div className="relative z-10 flex flex-col justify-between h-full min-h-[170px]">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white transition-colors group-hover:text-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {industry.name}
                    </h3>
                    <span className="text-xs font-bold text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore ↗
                    </span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/95 font-normal drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    {industry.description}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-1.5 text-xs font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] pt-3 border-t border-white/15">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-300">✦ Recommended:</span>
                    <span className="text-white font-medium">{industry.recommended}</span>
                  </div>
                  <span className="text-purple-300 font-bold group-hover:text-cyan-300 transition-colors">
                    View Subpage →
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </Section>
  );
}

export function UseCases() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-slate-100/60 border-b border-slate-200/70">
      <SectionHeading
        eyebrow="Use Cases"
        title="What Can You Create With"
        highlight="AI Video?"
        description="From product promotions to educational content, AI videos can be adapted for multiple marketing and communication objectives."
        center={true}
      />
      <div
        ref={sectionRef}
        className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2.5 sm:gap-3"
      >
        {useCases.map((useCase, i) => {
          const animationClass = isInView ? "animate-pill-pop" : "opacity-0 scale-75";

          return (
            <span
              key={useCase}
              style={{ animationDelay: `${i * 0.05}s` }}
              className={`rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 hover:scale-105 md:text-sm ${animationClass}`}
            >
              {useCase}
            </span>
          );
        })}
      </div>
    </Section>
  );
}

export function StrategyCall() {
  const calendlyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = "calendly-widget-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initWidget = () => {
      if (
        typeof window !== "undefined" &&
        (window as unknown as { Calendly?: { initInlineWidget: (opts: unknown) => void } }).Calendly &&
        calendlyContainerRef.current
      ) {
        try {
          calendlyContainerRef.current.innerHTML = "";
          (window as unknown as { Calendly: { initInlineWidget: (opts: unknown) => void } }).Calendly.initInlineWidget({
            url: `${calendlyUrl}?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=7c3aed`,
            parentElement: calendlyContainerRef.current,
          });
        } catch {
          // Keep fallback iframe intact
        }
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      initWidget();
    }
  }, []);

  return (
    <Section id="book-call" className="py-10 md:py-16 relative overflow-hidden bg-gradient-to-b from-slate-100/90 via-purple-50/30 to-slate-100/95 border-y border-slate-200/80">
      <SectionHeading
        eyebrow="Get In Touch"
        title="Book a free"
        highlight="strategy call."
        description="No commitment. No sales pitch. A real 30-minute conversation about your brand, your goals, and how we'd help you scale."
      />

      <div className="mx-auto max-w-[620px]">
        {/* Contact Action Pills */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`mailto:${strategyCallEmail}`}
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
          >
            <Mail className="h-4 w-4 text-purple-600 transition-transform group-hover:scale-110" />
            <span>{strategyCallEmail}</span>
          </a>

          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
          >
            <Calendar className="h-4 w-4 text-purple-600 transition-transform group-hover:scale-110" />
            <span>Book a slot via Calendly</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Schedule Subtitle */}
        <div className="mb-3 flex items-center justify-center sm:justify-start gap-2 px-1">
          <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Schedule a Strategy Call
          </span>
        </div>

        {/* Compact Calendly Container with Zero Visible Scrollbars */}
        <div className="relative mx-auto w-full max-w-[620px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 sm:p-3 shadow-xl">
          <div
            ref={calendlyContainerRef}
            className="calendly-inline-widget min-w-[320px]"
            data-url={`${calendlyUrl}?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=7c3aed`}
            style={{ minWidth: "320px", width: "calc(100% + 24px)", height: "720px" }}
          >
            <iframe
              src={`${calendlyUrl}?embed_domain=${typeof window !== "undefined" ? window.location.hostname : "quickuppaistudio.us"}&embed_type=Inline&hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=7c3aed`}
              width="100%"
              height="720"
              frameBorder="0"
              title="Select a Date & Time - Strategy Call"
              className="h-[720px] border-0"
              style={{ width: "calc(100% + 24px)", height: "720px" }}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Process() {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="process" className="overflow-hidden bg-aura-diagonal border-y border-purple-100/70">
      <SectionHeading
        eyebrow="How It Works"
        title="How Our AI Video Production"
        highlight="Process Works"
        description="A streamlined 6-step production pipeline engineered for rapid turnaround and pristine quality."
      />
      <div ref={containerRef} className="relative">
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, i) => {
            const delay = `${i * 0.12}s`;
            const animClass = isInView
              ? "animate-step-card"
              : "opacity-0 [transform:perspective(800px)_rotateX(-20deg)_translateY(25px)]";

            return (
              <li
                key={step.title}
                style={{ animationDelay: delay }}
                className={`panel group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-300 hover:shadow-xl ${animClass}`}
              >
                {/* Step Top Bar Scanner Line */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-brand transition-all duration-500 group-hover:w-full" />

                {/* Ambient Step Number Watermark */}
                <span className="pointer-events-none absolute right-4 top-2 text-5xl font-black text-slate-900/[0.04] transition-all duration-300 group-hover:text-purple-600/15 group-hover:scale-110">
                  0{i + 1}
                </span>

                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-xs font-black text-neon-foreground shadow-md transition-transform duration-300 group-hover:scale-110">
                    {i + 1}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-purple-600">
                    Step {i + 1} of 6
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900 transition-colors duration-200 group-hover:text-purple-600 sm:text-lg">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>

        {/* Turnaround Time Pill */}
        <div className="mx-auto mt-8 flex max-w-fit items-center justify-center gap-2 rounded-full border border-amber-300 bg-amber-50/90 px-6 py-3 text-center shadow-sm transition-all duration-700">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 sm:text-sm whitespace-nowrap">
            <Clock className="h-4 w-4 text-amber-600 shrink-0" />
            <span>48–72 Working Hours Delivery</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function WhyUs() {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Section className="relative overflow-hidden bg-gradient-to-b from-slate-100/90 via-indigo-50/20 to-slate-100/95 border-y border-slate-200/80">
      <SectionHeading
        eyebrow="AI Video Agency"
        title="Why Choose"
        highlight="Quickupp AI Studio?"
      />
      <div
        ref={containerRef}
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 [perspective:1200px]"
      >
        {whyUs.map((item, idx) => {
          const delay = `${idx * 0.1}s`;
          const animClass = isInView ? `animate-why-${idx % 6}` : "opacity-0 scale-75";

          return (
            <article
              key={item.title}
              style={{ animationDelay: delay }}
              className={`panel group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-7 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-300 hover:shadow-xl will-change-transform ${animClass}`}
            >
              {/* Dynamic Top Bar Highlight */}
              <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-brand transition-all duration-500 group-hover:w-full" />

              {/* Ambient Glowing Corner Orb */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-brand opacity-10 blur-xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-25" />

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-600 shadow-sm" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-purple-700">
                  0{idx + 1} Benefit
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900 transition-colors duration-200 group-hover:text-purple-600 sm:text-xl">
                {item.title}
              </h3>

              <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

export function LeadFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Section id="contact" className="relative overflow-hidden bg-gradient-to-b from-slate-100/90 via-purple-50/30 to-slate-100/95 border-t border-slate-200/80">
      {/* Light Shade Dynamic Fluid Ribbon Wave Background */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden z-0">
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] min-w-[1200px] h-[130%] object-cover opacity-100"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="leadRibbonLight1" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.32" />
              <stop offset="40%" stopColor="#ec4899" stopOpacity="0.25" />
              <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.12" />
            </linearGradient>

            <linearGradient id="leadRibbonLight2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#d946ef" stopOpacity="0.18" />
            </linearGradient>

            <radialGradient id="leadGlowLightLeft" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="leadGlowLightRight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.20" />
              <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient soft glow discs */}
          <circle cx="200" cy="260" r="340" fill="url(#leadGlowLightLeft)" className="animate-aura-pulse" />
          <circle cx="1240" cy="540" r="360" fill="url(#leadGlowLightRight)" className="animate-aura-pulse" />

          {/* Flowing Ribbon 1 */}
          <path
            d="M -60 180 C 280 40, 560 390, 920 240 C 1180 130, 1370 310, 1500 220 L 1500 340 C 1350 430, 1130 260, 890 360 C 530 500, 250 170, -60 290 Z"
            fill="url(#leadRibbonLight1)"
            className="animate-wave-float-1"
          />

          {/* Flowing Ribbon 2 */}
          <path
            d="M -60 560 C 310 710, 620 410, 950 580 C 1210 690, 1390 480, 1500 590 L 1500 480 C 1370 370, 1170 580, 910 460 C 570 310, 270 600, -60 440 Z"
            fill="url(#leadRibbonLight2)"
            className="animate-wave-float-2"
          />

          {/* Subtle delicate accent contour strokes */}
          <path
            d="M -60 180 C 280 40, 560 390, 920 240 C 1180 130, 1370 310, 1500 220"
            stroke="rgba(219, 39, 119, 0.45)"
            strokeWidth="2.2"
            strokeDasharray="6 8"
            fill="none"
            className="animate-wave-float-1"
          />
          <path
            d="M -60 560 C 310 710, 620 410, 950 580 C 1210 690, 1390 480, 1500 590"
            stroke="rgba(56, 189, 248, 0.45)"
            strokeWidth="2.2"
            strokeDasharray="8 10"
            fill="none"
            className="animate-wave-float-2"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <SectionHeading
          eyebrow="Get a Quote"
          title="Let's Create Your Next"
          highlight="AI Video"
          description="Tell us about your business and our team will prepare and share a tailored AI video proposal."
          center={true}
        />
        <div className="panel mx-auto max-w-3xl p-6 sm:p-10">
        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <BadgeCheck className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
              Thank You! Requirement Submitted
            </h3>
            <p className="max-w-md mx-auto text-xs sm:text-sm text-muted-foreground">
              We have received your project details. Our production team will review your
              requirements and contact you directly shortly.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="rounded-full border border-border bg-secondary/50 px-5 py-2 text-xs font-semibold text-white hover:border-neon hover:text-neon transition-colors"
              >
                Submit Another Requirement
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const form = e.currentTarget;
              const data = new FormData(form);
              const name = String(data.get("name") || "");
              const phone = String(data.get("phone") || "");
              const email = String(data.get("email") || "");
              const business = String(data.get("business") || "");
              const industry = String(data.get("industry") || "");
              const videoType = String(data.get("videoType") || "");
              const location = String(data.get("location") || "");
              const requirement = String(data.get("requirement") || "");

              // 1. Send directly to PostgreSQL Database
              let savedLead: any = null;
              try {
                const res = await submitLeadServerFn({
                  data: {
                    source: "USA - Contact Form",
                    name,
                    phone,
                    email,
                    business,
                    industry,
                    videoType,
                    location,
                    requirement,
                  },
                });
                if (res?.success && res.lead) {
                  savedLead = res.lead;
                }
              } catch (err) {
                console.error("PostgreSQL submission error:", err);
              }

              // 2. Also keep local sync for Admin fast-cache and instant real-time broadcast
              const newLead = savedLead || {
                id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                source: "USA - Contact Form",
                name,
                phone,
                email: email || undefined,
                business,
                industry,
                video_type: videoType,
                location: location || undefined,
                requirement,
                status: "New" as const,
                created_at: new Date().toISOString(),
              };

              try {
                const existing = JSON.parse(localStorage.getItem("ai_studio_local_leads") || "[]");
                const filtered = existing.filter((l: any) => l.id !== newLead.id);
                filtered.unshift(newLead);
                localStorage.setItem("ai_studio_local_leads", JSON.stringify(filtered));
              } catch (err) {
                console.error(err);
              }

              // 3. Broadcast instant real-time push to open Admin panel tabs
              broadcastLeadEvent({ type: "NEW_LEAD", lead: newLead });

              setLoading(false);
              setSubmitted(true);
              form.reset();

              // Auto-revert form back to normal after 3 seconds
              setTimeout(() => {
                setSubmitted(false);
              }, 3000);
            }}
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contactFullName"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Full Name*
                </label>
                <input
                  id="contactFullName"
                  type="text"
                  name="name"
                  required
                  placeholder="Your name"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="contactBusinessName"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Business Name*
                </label>
                <input
                  id="contactBusinessName"
                  type="text"
                  name="business"
                  required
                  placeholder="Your business"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contactPhone"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Phone / WhatsApp Number*
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  name="phone"
                  required
                  placeholder="+1 (555) 000-0000"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Email Address
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contactIndustry"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Business Industry*
                </label>
                <div className="relative mt-1.5">
                  <select
                    id="contactIndustry"
                    name="industry"
                    required
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 pr-10 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="">Select industry</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Clinics & Doctors">Clinics & Doctors</option>
                    <option value="D2C & E-commerce">D2C & E-commerce</option>
                    <option value="Beauty & Skincare">Beauty & Skincare</option>
                    <option value="Interior Design">Interior Design</option>
                    <option value="Restaurants & Cafes">Restaurants & Cafes</option>
                    <option value="Education & Coaching">Education & Coaching</option>
                    <option value="IT & SaaS">IT & SaaS</option>
                    <option value="Finance & Insurance">Finance & Insurance</option>
                    <option value="Travel & Tourism">Travel & Tourism</option>
                    <option value="Fitness & Wellness">Fitness & Wellness</option>
                    <option value="Jewellery & Luxury">Jewellery & Luxury</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="contactVideoType"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Which AI Video Are You Interested In?*
                </label>
                <div className="relative mt-1.5">
                  <select
                    id="contactVideoType"
                    name="videoType"
                    required
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 pr-10 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="">Select video type</option>
                    <option value="AI UGC Video">AI UGC Video</option>
                    <option value="AI Cartoon Animation">AI Cartoon Animation</option>
                    <option value="AI Avatar Video">AI Avatar Video</option>
                    <option value="Hyper-Realistic AI Video">Hyper-Realistic AI Video</option>
                    <option value="AI Digital Twin / Clone">AI Digital Twin / Clone</option>
                    <option value="Not Sure - Need Guidance">Not Sure - Need Guidance</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contactLocation"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Location / City*
                </label>
                <input
                  id="contactLocation"
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. New York, California, Delaware"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="contactBudget"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Approximate Budget
                </label>
                <select
                  id="contactBudget"
                  name="budget"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="">Select budget</option>
                  <option value="$100 - $300">$100 - $300</option>
                  <option value="$300 - $700">$300 - $700</option>
                  <option value="$700 - $1,500">$700 - $1,500</option>
                  <option value="$1,500 - $3,000">$1,500 - $3,000</option>
                  <option value="$3,000+">$3,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="contactRequirement"
                className="block text-xs font-semibold text-slate-800"
              >
                Tell Us About Your Requirement
              </label>
              <textarea
                id="contactRequirement"
                name="requirement"
                rows={3}
                placeholder="Product, service, audience or video idea"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-brand py-3.5 text-sm font-semibold text-neon-foreground glow-neon transition-all hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Get My AI Video Quote"}
            </button>
          </form>
        )}
      </div>
      </div>
    </Section>
  );
}

export function WhatsAppCtaSection() {
  const professionalMessage = encodeURIComponent(
    "Hello Quickupp AI Studio Team,\n\nI would like to explore AI Video Production services for my business. Please share details regarding available video formats, packages, pricing, and turnaround time.\n\nLooking forward to your response.\n\nThank you!",
  );

  return (
    <section className="border-t border-slate-200 bg-slate-50/60 px-5 py-12 md:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
          Have a Video Idea? Let's Turn It Into an{" "}
          <span className="font-serif italic font-bold text-gradient-brand whitespace-nowrap inline-block pr-1.5">
            AI Reel.
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
          Send us your product, service or video idea on WhatsApp and our team will recommend the
          right AI video format for your business.
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href={`https://wa.me/918177828748?text=${professionalMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white shadow transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section id="faq" className="relative overflow-hidden bg-aura-diagonal-soft border-y border-purple-100/70">
      {/* Giant left-scrolling 'FAQ' watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden select-none z-0"
      >
        <div className="animate-watermark-scroll flex whitespace-nowrap">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="flex shrink-0 items-center font-extrabold uppercase text-slate-900/[0.04]"
              style={{ fontSize: "clamp(5rem, 18vw, 14rem)", letterSpacing: "0.2em" }}
            >
              FAQ&nbsp;&nbsp;•&nbsp;&nbsp;FAQ&nbsp;&nbsp;•&nbsp;&nbsp;FAQ&nbsp;&nbsp;•&nbsp;&nbsp;FAQ&nbsp;&nbsp;•&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <SectionHeading
          eyebrow="AI Video Production"
          title="Frequently Asked Questions About AI Video Production"
          center={true}
        />
        <div className="panel mx-auto max-w-4xl divide-y divide-slate-200 border border-slate-200 bg-white overflow-hidden shadow-md">
          {faqs.map((faq, i) => (
            <div
              key={faq.question}
              className={`transition-colors duration-200 ${
                open === i ? "bg-purple-50/40" : "hover:bg-slate-50/60"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-slate-900 transition-colors hover:text-purple-700 md:text-base cursor-pointer"
                aria-expanded={open === i}
              >
                <span className={open === i ? "text-purple-700 font-bold" : ""}>{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${
                    open === i ? "rotate-180 text-purple-600" : ""
                  }`}
                />
              </button>
              {open === i ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="animate-in fade-in slide-in-from-top-1 duration-200 px-6 pb-5 pt-1 text-sm leading-relaxed text-slate-600 select-text"
                >
                  {faq.answer}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Contact() {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="final-cta" className="scroll-mt-[72px] px-5 py-8 md:py-12 overflow-hidden relative bg-aura-diagonal border-t border-purple-100/80">
      <div ref={containerRef} className="mx-auto w-full max-w-5xl relative z-10">
        <div
          className={`panel relative mx-auto overflow-hidden p-6 text-center sm:p-8 md:p-12 transition-all duration-700 hover:border-purple-300 hover:shadow-xl ${
            isInView ? "animate-cta-float" : "opacity-0 translate-y-8"
          }`}
          style={{ backgroundImage: "var(--gradient-hero)" }}
        >
          {/* Ambient Glowing Orbs */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-neon/15 blur-2xl transition-all duration-700 group-hover:scale-125" />
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-44 w-44 rounded-full bg-[#60a5fa]/15 blur-2xl transition-all duration-700 group-hover:scale-125" />

          {/* Top Neon Scanner Bar on Hover */}
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-brand opacity-80" />

          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-neon" />
            Contact
          </span>
          <h2 className="mx-auto mt-3.5 max-w-xl text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Ready to Create Your Next{" "}
            <span className="font-serif italic text-gradient-brand inline-block pr-1.5">
              AI Video?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-800 md:text-base">
            Turn your product, service or idea into engaging AI-powered video content.
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">
            Whether you need an <span className="text-slate-900 font-semibold">AI UGC video</span>,{" "}
            <span className="text-slate-900 font-semibold">AI avatar reel</span>,{" "}
            <span className="text-slate-900 font-semibold">cartoon animation</span>,{" "}
            <span className="text-slate-900 font-semibold">hyper-realistic AI advertisement</span> or{" "}
            <span className="text-slate-900 font-semibold">digital twin video</span>, Quickupp AI
            Studio can help you create professional video content for social media, advertising and
            brand communication.
          </p>
          <div className="mt-7 flex flex-wrap justify-center items-center gap-3">
            <NeonButton
              href="#book-call"
              variant="call"
              className="inline-flex items-center gap-1.5 group"
            >
              <Calendar className="h-3.5 w-3.5 text-purple-700 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>Book a 30 min call</span>
            </NeonButton>
            <NeonButton href="#contact">Get Your AI Video Quote</NeonButton>
            <NeonButton href="#samples" variant="ghost">
              View Video Samples
            </NeonButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const footerGroups = [
    {
      title: "AI Video Services",
      links: [
        { label: "AI UGC Videos", href: "#services" },
        { label: "AI Cartoon Animation", href: "#services" },
        { label: "AI Avatar Videos", href: "#services" },
        { label: "Hyper-Realistic AI Videos", href: "#services" },
        { label: "AI Digital Twin Videos", href: "#services" },
        { label: "Bulk Reels Packages", href: "#pricing" },
      ],
    },
    {
      title: "Company & Links",
      links: [
        { label: "About Us", href: "#top" },
        { label: "Video Portfolio", href: "#portfolio" },
        { label: "Pricing Tiers", href: "#pricing" },
        { label: "Our Process", href: "#process" },
        { label: "FAQs", href: "#faq" },
        { label: "Get a Quote", href: "#contact" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-slate-200 bg-slate-950 px-5 pt-12 pb-8 text-slate-300 md:pt-16 overflow-hidden">
      {/* Seamless atmospheric radial glow covering the entire bottom of the footer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[600px] w-full select-none"
        style={{
          background:
            "radial-gradient(ellipse 110% 80% at 50% 90%, rgba(200, 50, 255, 0.35) 0%, rgba(130, 45, 255, 0.22) 40%, rgba(40, 110, 255, 0.1) 65%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl flex flex-col">
        {/* Main Footer Grid: 4 Clean Columns across full width */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 items-start">
          {/* Col 1: Brand & Bio ONLY */}
          <div className="flex flex-col items-start gap-3.5">
            <a href="#top" className="-ml-1 flex items-center transition-opacity hover:opacity-90">
              <img
                src="/images/logo.png"
                alt="Quickupp AI Studio logo"
                className="h-9 md:h-10 w-auto object-contain"
                loading="lazy"
                width={125}
                height={40}
              />
            </a>
            <p className="text-sm font-semibold text-neon">{footerTagline}</p>
            <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
              {footerDescription}
            </p>
          </div>

          {/* Col 2: AI Video Services */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
              {footerGroups[0].title}
            </h3>
            <ul className="space-y-2.5">
              {footerGroups[0].links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-slate-400 transition-colors hover:text-neon sm:text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company & Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
              {footerGroups[1].title}
            </h3>
            <ul className="space-y-2.5">
              {footerGroups[1].links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-slate-400 transition-colors hover:text-neon sm:text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Locations & Contact */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
                Our Locations
              </h3>
              <div className="mt-2.5 flex flex-col gap-2 text-xs sm:text-sm">
                <a
                  href={footerUsaMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 text-slate-400 hover:text-[#60a5fa] transition-colors"
                >
                  <MapPin className="h-4 w-4 text-[#60a5fa] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white group-hover:text-[#60a5fa]">
                      USA Office:{" "}
                    </span>
                    <span>{footerUsaAddress}</span>
                  </div>
                </a>

                <a
                  href={footerIndiaMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 text-slate-400 hover:text-neon transition-colors"
                >
                  <MapPin className="h-4 w-4 text-neon shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white group-hover:text-neon">
                      India Office:{" "}
                    </span>
                    <span>{footerIndiaAddress}</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Direct Email and Phone Contact Links */}
            <div className="border-t border-slate-800 pt-3 flex flex-col gap-2 text-xs sm:text-sm">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${footerEmail}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-neon"
                title="Send email via Gmail"
              >
                <Mail className="h-4 w-4 text-neon shrink-0" />
                <span>{footerEmail}</span>
              </a>

              <a
                href={`tel:${footerPhone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-emerald-400"
                title="Call Quickupp AI Studio"
              >
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="font-mono">{footerPhone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Brand Giant Logo seamlessly integrated inside the footer */}
        <div className="mt-10 mb-6 md:mt-12 md:mb-8 flex items-center justify-center select-none">
          <img
            src="/images/footer logo.png"
            alt="Quickupp AI Studio"
            className="w-full max-w-5xl h-auto max-h-[160px] sm:max-h-[220px] md:max-h-[300px] object-contain drop-shadow-[0_0_50px_rgba(200,50,255,0.25)]"
            loading="lazy"
          />
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-4 pb-2 text-center text-xs text-slate-500 sm:flex-row">
          <p>{footerCopyright}</p>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <a href="/privacy-policy" className="hover:text-neon transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/terms" className="hover:text-neon transition-colors">
              Terms & Conditions
            </a>
            <span>•</span>
            <a href="/cookie-policy" className="hover:text-neon transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWhatsAppButton() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {/* Scroll to Top Floating Button (Visible once user scrolls > 300px) */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-purple-700 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-900 hover:scale-110 active:scale-95 ${
          showScrollTop
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* Official WhatsApp Floating Button */}
      <a
        href={`https://wa.me/918177828748?text=${encodeURIComponent(
          "Hello Quickupp AI Studio Team,\n\nI would like to explore AI Video Production services for my business. Please share details regarding available video formats, packages, pricing, and turnaround time.\n\nLooking forward to your response.\n\nThank you!",
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Quickupp AI Studio on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(37,211,102,0.65)] active:scale-95"
      >
        {/* Official WhatsApp SVG Vector Icon */}
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm-3.6 3.63c-.2 0-.42.01-.6.04-.24.04-.52.14-.72.37-.25.28-.97.95-.97 2.32s.99 2.69 1.13 2.87c.14.19 1.95 2.98 4.73 4.18.66.29 1.18.46 1.58.59.66.21 1.27.18 1.75.11.53-.08 1.63-.67 1.86-1.31.23-.65.23-1.2.16-1.31-.07-.12-.25-.19-.53-.33-.28-.14-1.63-.8-1.88-.89-.25-.09-.44-.14-.62.14-.19.28-.72.89-.88 1.07-.16.19-.33.21-.61.07-.28-.14-1.18-.44-2.25-1.39-.83-.74-1.4-1.66-1.56-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.62-1.5-.86-2.05-.22-.53-.46-.46-.62-.47z" />
        </svg>
      </a>
    </div>
  );
}

export function QuotePopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Popup on every website refresh / load after 1.2s
    const initialTimer = setTimeout(() => {
      setIsOpen(true);
    }, 1200);

    // 2. Repeat popup every 5 minutes (300,000 ms)
    const recurringTimer = setInterval(() => {
      setIsOpen(true);
    }, 300000);

    // 3. Listen for manual trigger events across buttons
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("open-quote-modal", handleOpenEvent);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(recurringTimer);
      window.removeEventListener("open-quote-modal", handleOpenEvent);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("ai_studio_modal_dismissed", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-[4px] animate-in fade-in duration-300">
      <div className="panel relative max-h-[96vh] w-full max-w-lg overflow-y-auto overflow-x-hidden border-slate-200 bg-white p-5 shadow-2xl sm:p-7">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-3.5 top-3.5 rounded-full border border-slate-200 bg-slate-100 p-1.5 text-slate-500 transition-colors hover:border-purple-300 hover:text-slate-900"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-3.5 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-500/40 shadow-sm">
              <BadgeCheck className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">Thank You!</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
              Your video inquiry has been received. Our team will review your requirements and reach
              out to you directly with a proposal.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="#book-call"
                onClick={handleClose}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-purple-200/90 bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 py-2.5 text-xs sm:text-sm font-bold text-purple-900 shadow-xs transition-all hover:from-violet-200 hover:via-purple-200 hover:to-pink-200 hover:border-purple-400"
              >
                <Calendar className="h-4 w-4 text-purple-700" />
                <span>Book a 30 Min Strategy Call Now</span>
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-lg bg-slate-100 border border-slate-200 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="pr-6 text-center sm:pr-0">
              <span className="eyebrow py-1 text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-neon" />
                Get a Quote
              </span>
              <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">
                Let's Create Your Next{" "}
                <span className="font-serif italic text-gradient-brand inline-block pr-1.5">
                  AI Video
                </span>
              </h3>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                Fill in your details below and our team will get in touch with a customized quote.
              </p>

              {/* Attractive Call Highlight Banner */}
              <div className="mt-3 flex items-center justify-between gap-2.5 rounded-lg border border-purple-200/90 bg-gradient-to-r from-violet-100 via-purple-50 to-pink-100 p-2.5 text-left shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-purple-950 sm:text-xs">Prefer a live strategy call?</p>
                    <p className="text-[10px] text-purple-700">Skip the wait & book a 1-on-1 call directly.</p>
                  </div>
                </div>
                <a
                  href="#book-call"
                  onClick={handleClose}
                  className="shrink-0 inline-flex items-center gap-1 rounded-md bg-gradient-brand px-2.5 py-1 text-[11px] font-bold text-white shadow-xs transition-all hover:brightness-110 active:scale-95"
                >
                  <Calendar className="h-3 w-3 text-white" />
                  <span>Book Call</span>
                </a>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                const form = e.currentTarget;
                const data = new FormData(form);
                const name = String(data.get("name") || "");
                const phone = String(data.get("phone") || "");
                const email = String(data.get("email") || "");
                const videoType = String(data.get("videoType") || "");
                const business = String(data.get("business") || "");
                const location = String(data.get("location") || "");
                const additional = String(data.get("additional") || "");

                // 1. Send directly to PostgreSQL Database
                let savedLead: any = null;
                try {
                  const res = await submitLeadServerFn({
                    data: {
                      source: "USA - Popup Modal",
                      name,
                      phone,
                      email,
                      videoType,
                      business,
                      location,
                      additional,
                    },
                  });
                  if (res?.success && res.lead) {
                    savedLead = res.lead;
                  }
                } catch (err) {
                  console.error("PostgreSQL modal submission error:", err);
                }

                // 2. Also keep local sync for Admin fast-cache and instant real-time broadcast
                const newLead = savedLead || {
                  id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                  source: "USA - Popup Modal",
                  name,
                  phone,
                  email: email || undefined,
                  business,
                  video_type: videoType,
                  location: location || undefined,
                  requirement: additional || undefined,
                  status: "New" as const,
                  created_at: new Date().toISOString(),
                };

                try {
                  const existing = JSON.parse(
                    localStorage.getItem("ai_studio_local_leads") || "[]",
                  );
                  const filtered = existing.filter((l: any) => l.id !== newLead.id);
                  filtered.unshift(newLead);
                  localStorage.setItem("ai_studio_local_leads", JSON.stringify(filtered));
                } catch (err) {
                  console.error(err);
                }

                // 3. Broadcast instant real-time push to open Admin panel tabs
                broadcastLeadEvent({ type: "NEW_LEAD", lead: newLead });

                setLoading(false);
                setSubmitted(true);
                form.reset();

                // Auto-revert form back to normal and close popup modal after 3 seconds
                setTimeout(() => {
                  setSubmitted(false);
                  setIsOpen(false);
                }, 3000);
              }}
              className="mt-4 space-y-3"
            >
              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="w-full">
                  <label
                    htmlFor="modalFullName"
                    className="block text-[11px] font-semibold text-slate-800 sm:text-xs"
                  >
                    Full Name <span className="text-purple-600">*</span>
                  </label>
                  <input
                    id="modalFullName"
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. John Doe"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none sm:text-sm"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="modalPhone"
                    className="block text-[11px] font-semibold text-slate-800 sm:text-xs"
                  >
                    Phone Number <span className="text-purple-600">*</span>
                  </label>
                  <input
                    id="modalPhone"
                    type="tel"
                    name="phone"
                    required
                    placeholder="+1 (555) 000-0000"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="w-full">
                  <label
                    htmlFor="modalEmail"
                    className="block text-[11px] font-semibold text-slate-800 sm:text-xs"
                  >
                    Email Address <span className="text-purple-600">*</span>
                  </label>
                  <input
                    id="modalEmail"
                    type="email"
                    name="email"
                    required
                    placeholder="you@company.com"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none sm:text-sm"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="modalVideoType"
                    className="block text-[11px] font-semibold text-slate-800 sm:text-xs"
                  >
                    Type of AI Video <span className="text-purple-600">*</span>
                  </label>
                  <div className="relative mt-1">
                    <select
                      id="modalVideoType"
                      name="videoType"
                      required
                      defaultValue=""
                      className="w-full appearance-none rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 pr-9 text-xs text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none sm:text-sm cursor-pointer"
                    >
                      <option value="" disabled className="text-slate-400">
                        Select video type...
                      </option>
                      <option value="AI UGC Video">
                        AI UGC Video
                      </option>
                      <option value="AI Cartoon Animation">
                        AI Cartoon Animation
                      </option>
                      <option value="AI Avatar Video">
                        AI Avatar Video
                      </option>
                      <option value="Hyper-Realistic AI Video">
                        Hyper-Realistic AI Video
                      </option>
                      <option value="AI Digital Twin / Clone">
                        AI Digital Twin / Clone
                      </option>
                      <option value="Monthly Bulk Package">
                        Monthly Package (5-15 Reels)
                      </option>
                      <option value="Custom Requirement">
                        Custom AI Video
                      </option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="w-full">
                  <label
                    htmlFor="modalBusiness"
                    className="block text-[11px] font-semibold text-slate-800 sm:text-xs"
                  >
                    Your Business / Brand <span className="text-purple-600">*</span>
                  </label>
                  <input
                    id="modalBusiness"
                    type="text"
                    name="business"
                    required
                    placeholder="e.g. Skincare, Real Estate..."
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none sm:text-sm"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="modalLocation"
                    className="block text-[11px] font-semibold text-slate-800 sm:text-xs"
                  >
                    Location (City / Country) <span className="text-purple-600">*</span>
                  </label>
                  <input
                    id="modalLocation"
                    type="text"
                    name="location"
                    required
                    placeholder="e.g. New York, USA"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="modalAdditional"
                    className="block text-[11px] font-semibold text-slate-800 sm:text-xs"
                  >
                    Additional Notes
                  </label>
                  <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </div>
                <textarea
                  id="modalAdditional"
                  name="additional"
                  rows={2}
                  placeholder="Any specific duration, language, script ideas..."
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>

              {/* Legal Terms & Consent Checkbox */}
              <div className="flex items-start gap-2 pt-0.5 pb-0.5">
                <input
                  type="checkbox"
                  id="modalConsent"
                  name="consent"
                  required
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600 shrink-0"
                />
                <label
                  htmlFor="modalConsent"
                  className="text-[11px] text-slate-600 leading-snug cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 font-medium underline hover:text-purple-800"
                  >
                    Privacy Policy
                  </a>
                  ,{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 font-medium underline hover:text-purple-800"
                  >
                    Terms &amp; Conditions
                  </a>
                  , and{" "}
                  <a
                    href="/cookie-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 font-medium underline hover:text-purple-800"
                  >
                    Cookie Policy
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-brand py-2.5 text-xs font-bold uppercase tracking-wider text-neon-foreground shadow-lg glow-neon transition-all hover:brightness-110 disabled:opacity-50 sm:py-3 sm:text-sm active:scale-95 cursor-pointer"
              >
                {loading ? "Submitting..." : "Submit & Request Quote"}
              </button>

              {/* Alternative Quick Booking Option */}
              <div className="pt-0.5">
                <div className="relative my-2 flex items-center justify-center">
                  <div className="w-full border-t border-slate-200"></div>
                  <span className="absolute bg-white px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    or
                  </span>
                </div>

                <a
                  href="#book-call"
                  onClick={handleClose}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg border border-purple-200/90 bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 py-2 text-xs font-bold text-purple-900 shadow-xs transition-all hover:from-violet-200 hover:via-purple-200 hover:to-pink-200 hover:border-purple-400 active:scale-95 sm:text-sm"
                >
                  <Calendar className="h-3.5 w-3.5 text-purple-700 transition-transform duration-200 group-hover:scale-110" />
                  <span>Book a 30 Min Strategy Call Directly</span>
                  <span className="text-xs text-purple-600 font-bold transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
