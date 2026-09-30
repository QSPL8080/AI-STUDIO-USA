import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  BarChart3,
  Bot,
  Camera,
  Check,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  Film,
  Layers,
  Lightbulb,
  MapPin,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Music,
  Palette,
  Pause,
  Phone,
  Play,
  Rocket,
  RotateCcw,
  Scissors,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  UserCheck,
  Users,
  Video,
  Volume2,
  VolumeX,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { NeonButton, Section, SectionHeading } from "./ui";
import { submitLeadServerFn, broadcastLeadEvent } from "@/lib/lead-actions";
import { openCheckoutModal, CheckoutModal } from "./checkout-modal";
export { CheckoutModal, openCheckoutModal };
import {
  calendlyUrl,
  deliverables,
  faqs,
  formats,
  footerCopyright,
  footerDescription,
  footerEmail,
  footerCanadaAddress,
  footerCanadaMapUrl,
  footerPhone,
  footerTagline,
  footerUsaAddress,
  footerUsaMapUrl,
  individualPricingList,
  nav,
  packagePricingTiers,
  digitalTwinSetupItem,
  processSteps,
  portfolioItems,
  samples,
  services,
  strategyCallEmail,
  twinFeatures,
  useCases,
  whatsAppUrl,
  whyAiVideo,
  whyUs,
} from "./data";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoDocked, setIsLogoDocked] = useState(false);

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

  return (
    <header id="site-nav-container" className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      <div id="site-header-bar" className="relative border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-xs z-50">
        <div className="mx-auto flex w-full max-w-[1560px] items-center justify-between gap-6 lg:gap-8 xl:gap-12 px-4 sm:px-6 lg:px-10 py-3.5 sm:py-4 md:py-4.5 min-h-[72px] sm:min-h-[78px] md:min-h-[82px]">
          <a
            href="/#top"
            id="navbar-logo-anchor"
            className="flex items-center shrink-0 transition-opacity hover:opacity-90 mr-2 lg:mr-3"
            aria-label="QUICKUPP AI STUDIO"
          >
            <img
              src="/images/LOGO 1.png"
              alt="QUICKUPP AI STUDIO"
              className="h-8 sm:h-9 md:h-10 lg:h-11 w-auto object-contain shrink-0"
              width={140}
              height={44}
            />
          </a>

          {/* Desktop Navigation Links (>=1024px) */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center gap-1.5 xl:gap-2.5 rounded-xl border border-slate-200/90 bg-slate-100/80 px-3.5 xl:px-4.5 py-1.5 lg:flex shadow-2xs relative shrink-0 mx-auto"
          >
            <a
              href="/#services"
              className="whitespace-nowrap rounded-lg px-3.5 xl:px-4 py-2 text-sm xl:text-[14.5px] font-bold text-slate-700 transition-all duration-200 hover:bg-white hover:text-purple-700 hover:shadow-xs active:scale-95"
            >
              Services
            </a>
            <a
              href="/#industries"
              className="whitespace-nowrap rounded-lg px-3.5 xl:px-4 py-2 text-sm xl:text-[14.5px] font-bold text-slate-700 transition-all duration-200 hover:bg-white hover:text-purple-700 hover:shadow-xs active:scale-95"
            >
              Industries
            </a>
            <a
              href="/portfolio"
              className="whitespace-nowrap rounded-lg px-3.5 xl:px-4 py-2 text-sm xl:text-[14.5px] font-bold text-slate-700 transition-all duration-200 hover:bg-white hover:text-purple-700 hover:shadow-xs active:scale-95"
            >
              Portfolio
            </a>
            <a
              href="/#pricing"
              className="whitespace-nowrap rounded-lg px-3.5 xl:px-4 py-2 text-sm xl:text-[14.5px] font-bold text-slate-700 transition-all duration-200 hover:bg-white hover:text-purple-700 hover:shadow-xs active:scale-95"
            >
              Pricing
            </a>
            <a
              href="/#process"
              className="whitespace-nowrap rounded-lg px-3.5 xl:px-4 py-2 text-sm xl:text-[14.5px] font-bold text-slate-700 transition-all duration-200 hover:bg-white hover:text-purple-700 hover:shadow-xs active:scale-95"
            >
              How It Works
            </a>
            <a
              href="/#faq"
              className="whitespace-nowrap rounded-lg px-3.5 xl:px-4 py-2 text-sm xl:text-[14.5px] font-bold text-slate-700 transition-all duration-200 hover:bg-white hover:text-purple-700 hover:shadow-xs active:scale-95"
            >
              FAQ
            </a>
          </nav>

          {/* Desktop Right Action CTA Buttons (Only on Large Screens >= 1024px) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0 ml-2 lg:ml-3">
            <NeonButton
              href={calendlyUrl}
              variant="call"
              size="sm"
              className="hidden xl:inline-flex items-center gap-1.5 whitespace-nowrap group !rounded-xl !px-4.5 !py-2.5 !text-xs sm:!text-[13.5px] font-bold shadow-xs"
            >
              <Calendar className="h-4 w-4 text-purple-700 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>Book a Strategy Call</span>
            </NeonButton>

            <NeonButton
              href="/#contact"
              variant="primary"
              size="sm"
              className="whitespace-nowrap !text-xs sm:!text-[13.5px] font-bold !py-2.5 !px-5 !rounded-xl shadow-md glow-neon"
            >
              Get AI Video Quote
            </NeonButton>

            <NeonButton
              variant="buy"
              size="sm"
              onClick={() => openCheckoutModal({ itemType: "package" })}
              className="inline-flex items-center gap-1.5 whitespace-nowrap group !rounded-xl !px-4.5 !py-2.5 !text-xs sm:!text-[13.5px] font-bold shadow-xs"
            >
              <Zap className="h-4 w-4 text-white shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>Buy Now</span>
            </NeonButton>
          </div>

          {/* Mobile & Tablet 3-Lines Menu Icon ONLY (< 1024px) */}
          <div className="flex items-center lg:hidden shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200/90 bg-slate-100/90 text-slate-800 transition-colors hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 active:scale-95 cursor-pointer shadow-xs shrink-0"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-800" strokeWidth={2.2} />
              ) : (
                <Menu className="h-6 w-6 text-slate-800" strokeWidth={2.2} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation Menu Dropdown (Absolute overlay with all actions under the 3-lines menu) */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="absolute top-full left-0 right-0 w-full border-b border-slate-200 bg-white/98 px-5 py-6 shadow-2xl backdrop-blur-2xl lg:hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[calc(100dvh-4.5rem)] overflow-y-auto z-50"
          >
            <div className="mx-auto flex max-w-md flex-col gap-1.5">
              {/* Highlighted Primary CTA at the top for immediate mobile visibility */}
              <a
                href={calendlyUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-purple-300 bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 py-3 px-4 text-sm font-bold text-purple-950 shadow-sm transition-all hover:from-violet-200 hover:via-purple-200 hover:to-pink-200 hover:border-purple-400 active:scale-95 mb-2"
              >
                <Calendar className="h-4 w-4 text-purple-700 shrink-0" />
                <span>Book a Strategy Call</span>
              </a>

              <a
                href="/#services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700 active:scale-[0.99]"
              >
                <span>Services</span>
                <span className="text-xs text-purple-600 font-bold">→</span>
              </a>

              <a
                href="/#industries"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700 active:scale-[0.99]"
              >
                <span>Industries</span>
                <span className="text-xs text-purple-600 font-bold">→</span>
              </a>

              <a
                href="/portfolio"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700 active:scale-[0.99]"
              >
                <span>Portfolio</span>
                <span className="text-xs text-purple-600 font-bold">→</span>
              </a>

              <a
                href="/#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700 active:scale-[0.99]"
              >
                <span>Pricing</span>
                <span className="text-xs text-purple-600 font-bold">→</span>
              </a>

              <a
                href="/#process"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700 active:scale-[0.99]"
              >
                <span>How It Works</span>
                <span className="text-xs text-purple-600 font-bold">→</span>
              </a>

              <a
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700 active:scale-[0.99]"
              >
                <span>FAQ</span>
                <span className="text-xs text-purple-600 font-bold">→</span>
              </a>

              {/* All Action Buttons grouped cleanly inside the 3-lines menu */}
              <div className="mt-3 flex flex-col gap-2.5 border-t border-slate-200 pt-4">
                <a
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-gradient-brand py-3 text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-95"
                >
                  Get AI Video Quote
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCheckoutModal({ itemType: "package" });
                  }}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-purple-400/80 bg-slate-900 py-3 text-sm font-bold text-white shadow-xs hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
                >
                  <Zap className="h-4 w-4 text-white shrink-0" />
                  <span>Buy Now</span>
                </button>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-purple-400 hover:text-purple-700 active:scale-95"
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
      const topBar = document.getElementById("site-header-bar");
      if (topBar) {
        setHeaderHeight(topBar.offsetHeight);
      } else {
        setHeaderHeight(64);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    let observer: ResizeObserver | null = null;
    const topBar = document.getElementById("site-header-bar");
    if (topBar && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateHeaderHeight);
      observer.observe(topBar);
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
        className="block lg:hidden relative overflow-hidden bg-aura-diagonal-soft w-full min-h-[calc(100dvh-60px)] px-4 sm:px-6 pb-12 flex flex-col items-center justify-center text-center"
        style={{ paddingTop: `calc(${headerHeight}px + 1.25rem)` }}
      >
        {/* Animated podcast-style geometric orbital watermarks & contour waves */}
        <HeroOrbitalAtmosphere className="scale-90 sm:scale-100" />

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

        <div className="relative z-10 flex flex-col items-center w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto my-auto">
          {/* Top: AI Studio Title for Mobile & Tablet */}
          <div className="w-full mb-3.5 sm:mb-5 px-2 flex justify-center">
            <img
              src="/images/ai studio logo hero.png"
              alt="Quickupp AI Studio"
              title="Quickupp AI Studio"
              className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[420px] md:max-w-[480px] h-auto object-contain select-none"
              width={1600}
              height={300}
              loading="eager"
              fetchPriority="high"
            />
          </div>

          {/* Video in between (centered, high-impact vertical format) */}
          <div className="relative w-full max-w-[310px] xs:max-w-[340px] sm:max-w-[380px] md:max-w-[420px] aspect-[9/16] max-h-[55vh] rounded-2xl overflow-hidden border border-white/20 bg-[#0e081e] shadow-[0_0_50px_rgba(200,80,255,0.35)] glow-neon">
            <video
              ref={(el) => {
                mobileVideoRef.current = el;
                if (el) {
                  el.defaultMuted = true;
                  el.muted = isMuted;
                  el.playsInline = true;
                }
              }}
              src="/videos/Hero%20Video%20New.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              onClick={toggleAudio}
              className="h-full w-full object-cover object-center cursor-pointer"
            />

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
          <div className="mt-4 sm:mt-6 w-full max-w-lg sm:max-w-xl md:max-w-2xl px-2 text-center">
            <h1 className="font-[var(--font-google-sans)] text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-900">
              <span className="font-serif italic font-bold text-gradient-brand inline-block pr-1.5">
                AI Video Creation
              </span>{" "}
              for Businesses That Want to Stand Out
            </h1>
            <p className="mt-2.5 sm:mt-3.5 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal">
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
                src="/videos/Hero%20Video%20New.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                onClick={toggleAudio}
                className="h-full w-full object-cover object-center cursor-pointer"
              />

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

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative overflow-hidden px-5 sm:px-8 lg:px-12 py-12 sm:py-16 md:py-20 border-b border-purple-100/80 bg-aura-diagonal"
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

      <div className="mx-auto w-full max-w-4xl relative z-10 flex flex-col items-center text-center">
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
            Conversion-Focused AI Video Ads for Modern Brands
          </span>
        </div>

        {/* Headline */}
        <h2
          className={`mt-3.5 font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-900 transition-all duration-800 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-3xl ${
            isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-sm"
          }`}
        >
          Create More Ad Creatives. Test More Ideas.{" "}
          <span className="font-serif italic font-bold text-gradient-brand inline-block pr-1.5">
            Find What Works.
          </span>
        </h2>

        {/* Description Paragraph 1 */}
        <p
          className={`mt-3 text-sm sm:text-base md:text-lg font-semibold text-slate-800 leading-snug transition-all duration-800 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-2xl ${
            isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-4 blur-sm"
          }`}
        >
          Your next winning ad shouldn't require a full production team.
        </p>

        {/* Description Paragraph 2 */}
        <p
          className={`mt-2.5 text-xs sm:text-sm md:text-base leading-relaxed text-slate-600 transition-all duration-800 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-3xl ${
            isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-4 blur-sm"
          }`}
        >
          Quickupp AI Studio creates conversion-focused AI video ads for brands that need more creative variations—without the traditional costs and logistics of expensive shoots, creators, locations, and production teams.
        </p>

        {/* Description Paragraph 3 */}
        <p
          className={`mt-2 text-xs sm:text-sm md:text-base leading-relaxed text-slate-600 transition-all duration-800 delay-400 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-2xl ${
            isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-4 blur-sm"
          }`}
        >
          From AI UGC and AI avatars to hyper-realistic product ads and digital twins, we take your idea from research to ready-to-run ad.
        </p>

        {/* Action Buttons & Microcopy */}
        <div
          className={`mt-6 sm:mt-8 flex flex-col items-center gap-3 transition-all duration-800 delay-550 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95"
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <NeonButton
              href={calendlyUrl}
              variant="call"
              className="text-xs sm:text-sm inline-flex items-center gap-1.5 group !rounded-lg"
            >
              <Calendar className="h-3.5 w-3.5 text-purple-700 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>Book a Strategy Call</span>
            </NeonButton>
            <NeonButton
              href="#services"
              variant="ghost"
              className="text-xs sm:text-sm inline-flex items-center gap-2 !rounded-lg"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="h-3.5 w-3.5 text-purple-600 shrink-0" />
            </NeonButton>
          </div>
          <p className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
            Starting at $79 / AI Video
          </p>
        </div>
      </div>
    </section>
  );
}

export function TrustStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const phases = [
    {
      phaseId: "PHASE 01",
      phaseTitle: "Strategy & Creative Foundation",
      steps: [
        { num: "01", name: "Research", icon: Search, tag: "Market Intel" },
        { num: "02", name: "Strategy", icon: Target, tag: "Angle & Positioning" },
        { num: "03", name: "Hooks", icon: Zap, tag: "3s Retention" },
        { num: "04", name: "Concepts", icon: Lightbulb, tag: "Angle Multipliers" },
      ],
    },
    {
      phaseId: "PHASE 02",
      phaseTitle: "Scripting & AI Production Engine",
      steps: [
        { num: "05", name: "Scripts", icon: FileText, tag: "Direct Response" },
        { num: "06", name: "Storyboard", icon: Film, tag: "Visual Flow" },
        { num: "07", name: "AI Production", icon: Wand2, tag: "Hyper-Real Render", highlight: true },
      ],
    },
    {
      phaseId: "PHASE 03",
      phaseTitle: "Post-Production, QC & Scaling",
      steps: [
        { num: "08", name: "Editing", icon: Scissors, tag: "Pacing & Motion" },
        { num: "09", name: "Sound Design", icon: Music, tag: "SFX & Voiceover" },
        { num: "10", name: "Quality Control", icon: ShieldCheck, tag: "Rigorous Polish" },
        { num: "11", name: "Delivery", icon: Rocket, tag: "Ready to Run Ad", isFinal: true },
      ],
    },
  ];

  let globalStepCounter = 0;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-purple-100/80 bg-gradient-to-b from-white via-purple-50/30 to-slate-50/50 py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Dynamic atmospheric lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)" }}
      />

      <div className="mx-auto w-full max-w-6xl relative z-10">
        {/* Purpose Header */}
        <div className="text-center max-w-3xl mx-auto mb-7 sm:mb-9">
          <span className="eyebrow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.6)]"></span>
            </span>
            Visual Process
          </span>

          <h2 className="mt-3.5 font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-900">
            AI Creative{" "}
            <span className="font-serif italic font-bold text-gradient-brand inline-block pr-1.5 whitespace-nowrap">
              Production Partner
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base md:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
            Quickupp is an AI creative production partner, not simply an AI video-generation tool.
          </p>
        </div>

        {/* 3-Phase Interconnected Pipeline Track */}
        <div className="space-y-4 sm:space-y-5">
          {phases.map((phase, pIdx) => (
            <div key={phase.phaseId} className="relative">
              {/* Phase Header Strip */}
              <div
                className={`flex items-center gap-2.5 mb-2.5 sm:mb-3 transition-all duration-700 ${
                  isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${pIdx * 180}ms` }}
              >
                <span className="font-mono text-[11px] font-black tracking-widest text-purple-700 bg-purple-100/90 border border-purple-200/90 px-2 py-0.5 rounded-md uppercase">
                  {phase.phaseId}
                </span>
                <span className="text-xs font-bold tracking-wide uppercase text-slate-500">
                  {phase.phaseTitle}
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-purple-200/80 via-slate-200/60 to-transparent" />
              </div>

              {/* Steps Flow Line for this Phase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {phase.steps.map((step, sIdx) => {
                  const IconComp = step.icon;
                  const globalIdx = globalStepCounter++;

                  return (
                    <div
                      key={step.name}
                      style={{
                        transitionDelay: `${globalIdx * 120}ms`,
                      }}
                      className={`group relative flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-all duration-600 ease-out cursor-default ${
                        isInView
                          ? "opacity-100 translate-y-0 scale-100"
                          : "opacity-0 translate-y-6 scale-95"
                      } hover:-translate-y-0.5`}
                    >
                      {/* Ambient step hover background glow */}
                      <div
                        className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                          step.highlight
                            ? "bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent border border-purple-300/60 opacity-100"
                            : step.isFinal
                            ? "bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-emerald-500/10 border border-emerald-300/60 opacity-100"
                            : "bg-slate-50/80 border border-slate-200/60 group-hover:border-purple-200 group-hover:bg-purple-50/40"
                        }`}
                      />

                      {/* Content inside step */}
                      <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                        {/* Number & Icon cluster */}
                        <div className="relative shrink-0">
                          <div
                            className={`h-9 w-9 sm:h-9.5 sm:w-9.5 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                              step.highlight
                                ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-sm shadow-purple-500/25"
                                : step.isFinal
                                ? "bg-gradient-to-br from-purple-600 via-pink-600 to-emerald-500 text-white shadow-sm shadow-purple-500/30"
                                : "bg-white text-purple-700 border border-purple-100 shadow-2xs group-hover:text-purple-900 group-hover:border-purple-200"
                            }`}
                          >
                            <IconComp className="h-4.5 w-4.5 stroke-[2.2]" />
                          </div>
                        </div>

                        {/* Title and Tag */}
                        <div className="flex flex-col min-w-0 text-left">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-slate-400">
                              {step.num}
                            </span>
                            <span
                              className={`text-xs sm:text-sm font-bold tracking-tight truncate ${
                                step.highlight || step.isFinal
                                  ? "text-purple-950 font-extrabold"
                                  : "text-slate-800 group-hover:text-purple-700"
                              }`}
                            >
                              {step.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-medium text-slate-500 truncate">
                            {step.tag}
                          </span>
                        </div>
                      </div>

                      {/* Forward connector arrow */}
                      <div className="relative z-10 shrink-0 text-slate-300 group-hover:text-purple-500 transition-colors pl-2">
                        {step.isFinal ? (
                          <span className="inline-flex items-center justify-center h-5 px-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-[9px] font-black text-emerald-800 uppercase tracking-wider">
                            Ready ✓
                          </span>
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Seamless phase connecting indicator between phases */}
              {pIdx < phases.length - 1 && (
                <div className="hidden lg:flex items-center justify-center my-1.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50/80 border border-purple-200/60 text-[9px] font-bold text-purple-600">
                    <span>Flows to next stage</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyQuickuppAiStudio() {
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const traditionalFriction = [
    { name: "Creators", icon: Users },
    { name: "Locations", icon: MapPin },
    { name: "Cameras", icon: Camera },
    { name: "Production crews", icon: Film },
    { name: "Multiple reshoots", icon: RotateCcw },
    { name: "Long production timelines", icon: Clock },
    { name: "Expensive post-production", icon: Scissors },
  ];

  const benefits = [
    {
      num: "01",
      title: "More Creative Variations",
      desc: "Create different hooks, concepts, personas, angles, and visual treatments without organizing a new shoot every time.",
      icon: Layers,
      badgeColor: "text-purple-700 bg-purple-100/90 border-purple-200/90",
      iconBg: "bg-purple-50 text-purple-600",
      activeBorder: "border-purple-300/90 ring-1 ring-purple-400/30",
    },
    {
      num: "02",
      title: "Faster Creative Production",
      desc: "Move from concept and script to finished ad creative through an AI-powered production workflow.",
      icon: Zap,
      badgeColor: "text-pink-700 bg-pink-100/90 border-pink-200/90",
      iconBg: "bg-pink-50 text-pink-600",
      activeBorder: "border-pink-300/90 ring-1 ring-pink-400/30",
    },
    {
      num: "03",
      title: "Lower Production Costs",
      desc: "Create professional video content without the traditional overhead of creators, studios, locations, and large production teams.",
      icon: DollarSign,
      badgeColor: "text-emerald-700 bg-emerald-100/90 border-emerald-200/90",
      iconBg: "bg-emerald-50 text-emerald-600",
      activeBorder: "border-emerald-300/90 ring-1 ring-emerald-400/30",
    },
    {
      num: "04",
      title: "Built for Testing",
      desc: "Create multiple creative directions so your marketing team has more variations to test across paid and organic channels.",
      icon: BarChart3,
      badgeColor: "text-blue-700 bg-blue-100/90 border-blue-200/90",
      iconBg: "bg-blue-50 text-blue-600",
      activeBorder: "border-blue-300/90 ring-1 ring-blue-400/30",
    },
  ];

  // Auto-change active benefit card every 6 seconds (relaxed reading pace)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveBenefit((prev) => (prev + 1) % benefits.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, benefits.length]);

  return (
    <section id="why-quickupp" className="relative overflow-hidden border-b border-purple-100/80 bg-gradient-to-b from-slate-50/50 via-white to-purple-50/20 py-8 sm:py-10 md:py-14 px-4 sm:px-6 lg:px-8">
      {/* Dynamic atmospheric lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }}
      />

      <div className="mx-auto w-full max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Left Column: Heading, Traditional Overhead & Transition (6 cols) */}
          <div className="lg:col-span-6 flex flex-col text-left">
            {/* Eyebrow */}
            <span className="eyebrow w-fit mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.6)]"></span>
              </span>
              Why Quickupp AI Studio
            </span>

            {/* Heading */}
            <h2 className="mt-1 font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-900">
              Your AI Creative Team —{" "}
              <span className="font-serif italic font-bold text-gradient-brand inline-block pr-1.5 whitespace-nowrap">
                Without the Production Overhead
              </span>
            </h2>

            {/* Supporting Copy */}
            <p className="mt-3 mb-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
              Traditional video production can require:
            </p>

            {/* 7 Traditional Friction Items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 mb-5">
              {traditionalFriction.map((item) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border border-rose-100/90 bg-white/90 backdrop-blur-xs transition-all duration-200 hover:border-rose-200 shadow-2xs"
                  >
                    <div className="h-7 w-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                      <IconComp className="h-3.5 w-3.5 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-800 tracking-tight leading-tight truncate">
                      {item.name}
                    </span>
                    <span className="ml-auto text-rose-400 text-[10px] font-bold">✕</span>
                  </div>
                );
              })}
            </div>

            {/* Transition Solution Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-950 p-4 sm:p-5 text-white shadow-lg shadow-purple-950/15">
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-500/30">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-widest text-purple-300 uppercase">
                      Streamlined Creative Engine
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug mt-0.5">
                      Quickupp AI Studio gives brands a streamlined AI-powered creative workflow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Single Rotating Benefit Card Showcase (6 cols) */}
          <div
            className="lg:col-span-6 flex flex-col gap-2.5"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* 4-Step Interactive Tabs */}
            <div className="flex items-center justify-end px-1">
              <div className="flex items-center gap-1 sm:gap-1.5">
                {benefits.map((b, bIdx) => {
                  const isCurrent = activeBenefit === bIdx;
                  return (
                    <button
                      key={b.num}
                      type="button"
                      onClick={() => setActiveBenefit(bIdx)}
                      className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md transition-all duration-300 flex items-center gap-1 ${
                        isCurrent
                          ? "bg-purple-900 text-white shadow-xs scale-105"
                          : "bg-purple-100/70 text-purple-700 hover:bg-purple-200/80"
                      }`}
                    >
                      <span>{b.num}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Single Light & Transparent Benefit Card */}
            {(() => {
              const current = benefits[activeBenefit];
              const IconComp = current.icon;

              return (
                <div
                  key={activeBenefit}
                  className="group relative overflow-hidden rounded-2xl p-6 sm:p-7 border border-purple-200/80 bg-white/70 backdrop-blur-xl shadow-xl shadow-purple-500/10 transition-all duration-500 text-left flex flex-col justify-between min-h-[220px] sm:min-h-[240px]"
                >
                  {/* Running 6-second progress indicator */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600"
                    style={{
                      animation: isPaused ? "none" : "scaleProgress 6s linear infinite",
                    }}
                  />

                  <div>
                    {/* Top Row: Number Badge & Glowing Icon */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="inline-flex items-center gap-2">
                        <span className={`font-mono text-xs font-black tracking-wider px-2.5 py-1 rounded-md border ${current.badgeColor}`}>
                          {current.num}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Benefit {activeBenefit + 1} of 4
                        </span>
                      </div>

                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${current.iconBg} shadow-sm shadow-purple-500/20`}>
                        <IconComp className="h-5 w-5 stroke-[2.2]" />
                      </div>
                    </div>

                    {/* Benefit Title */}
                    <h3 className="font-[var(--font-google-sans)] text-lg sm:text-xl font-bold tracking-tight text-slate-900 mb-2">
                      {current.title}
                    </h3>

                    {/* Benefit Description */}
                    <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                      {current.desc}
                    </p>
                  </div>

                  {/* Card Bottom Controls */}
                  <div className="flex items-center justify-end pt-3 mt-2 border-t border-purple-100/60">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setActiveBenefit((prev) => (prev - 1 + benefits.length) % benefits.length)}
                        className="h-7 w-7 rounded-lg bg-white border border-purple-100 text-slate-500 hover:text-purple-700 hover:border-purple-300 flex items-center justify-center transition-colors shadow-2xs"
                        aria-label="Previous benefit"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveBenefit((prev) => (prev + 1) % benefits.length)}
                        className="h-7 w-7 rounded-lg bg-white border border-purple-100 text-slate-500 hover:text-purple-700 hover:border-purple-300 flex items-center justify-center transition-colors shadow-2xs"
                        aria-label="Next benefit"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ResearchToAdStrip() {
  return (
    <section className="relative overflow-hidden border-y border-purple-100/90 bg-gradient-to-b from-purple-50/40 via-white to-purple-50/30 py-6 sm:py-7 px-4 sm:px-6 lg:px-8">
      {/* Radiant ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-36 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #c084fc 0%, transparent 70%)" }}
      />

      <div className="mx-auto w-full max-w-3xl relative z-10 flex flex-col items-center text-center">
        {/* Eyebrow / Heading Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/90 bg-white/95 px-3.5 py-1 text-xs font-bold text-purple-950 shadow-2xs backdrop-blur-md mb-2.5">
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span>From Research to Ready-to-Run Ad</span>
        </div>

        {/* Supporting Statement Headline */}
        <p className="font-[var(--font-google-sans)] text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-snug">
          <span className="text-slate-500 font-medium">We don't simply generate AI videos. </span>
          <span className="text-slate-900 font-bold block sm:inline">
            We build ad creatives around a{" "}
            <span className="font-serif italic font-bold text-gradient-brand">
              strategy.
            </span>
          </span>
        </p>
      </div>
    </section>
  );
}

export function Samples() {
  const [activeStep, setActiveStep] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const processSteps = [
    {
      num: "01",
      title: "RESEARCH",
      subtitle: "We research your:",
      items: [
        "Brand",
        "Product/service",
        "Target audience",
        "Competitors",
        "Market",
        "Existing creative",
        "Content landscape",
      ],
      footer: "The goal is to identify what your audience cares about and where creative opportunities exist.",
      icon: Search,
      tag: "Discovery & Intel",
    },
    {
      num: "02",
      title: "STRATEGY",
      subtitle: "We turn research into a creative direction.",
      subHeading: "We identify:",
      items: [
        "Customer pain points",
        "Benefits",
        "Positioning",
        "Messaging opportunities",
        "Creative angles",
        "Campaign objectives",
      ],
      icon: Target,
      tag: "Positioning & Angles",
    },
    {
      num: "03",
      title: "HOOKS",
      subtitle: "We develop attention-grabbing hooks designed to capture attention within the first few seconds.",
      subHeading: "Examples include:",
      items: [
        "Problem-based hooks",
        "Benefit-driven hooks",
        "Curiosity hooks",
        "Pattern interrupts",
        "Question hooks",
        "Direct-response hooks",
      ],
      icon: Zap,
      tag: "Attention Capture",
    },
    {
      num: "04",
      title: "CONCEPTS",
      subtitle: "We turn the strongest hooks and angles into practical video concepts.",
      footer: "Each concept defines the overall creative direction, storytelling approach, and intended audience response.",
      items: [],
      icon: Lightbulb,
      tag: "Creative Direction",
    },
    {
      num: "05",
      title: "SCRIPTS",
      subtitle: "We write or adapt the script around:",
      items: [
        "Selected concept",
        "Target audience",
        "Offer",
        "Messaging",
        "Hook",
        "CTA",
        "Video format",
      ],
      footer: "The final script becomes the foundation for production.",
      icon: FileText,
      tag: "Direct Response Copy",
    },
    {
      num: "06",
      title: "STORYBOARD",
      subtitle: "We transform the approved script into a visual production plan before generating the final video.",
      subHeading: "The storyboard defines:",
      items: [
        "Scene-by-scene structure",
        "Visual direction",
        "Camera framing",
        "Character actions",
        "Product placement",
        "Background/environment",
        "On-screen text",
        "Transitions",
        "Voiceover alignment",
        "Scene timing",
      ],
      purpose: "Every scene is planned before AI production begins. This helps maintain visual consistency, storytelling flow, and alignment between the script and final video.",
      icon: Film,
      tag: "Visual Architecture",
    },
    {
      num: "07",
      title: "AI PRODUCTION",
      subtitle: "We produce the video using the appropriate AI format:",
      items: [
        "AI UGC",
        "AI Avatar",
        "AI Cartoon",
        "Hyper-Realistic",
        "Digital Twin",
      ],
      footer: "Visuals, characters, environments, products, and scenes are generated according to the approved storyboard.",
      icon: Wand2,
      tag: "Generative Engine",
    },
    {
      num: "08",
      title: "EDITING",
      subtitle: "We assemble the generated scenes into the final video.",
      subHeading: "This includes:",
      items: [
        "Scene sequencing",
        "Pacing",
        "Transitions",
        "Captions",
        "Product shots",
        "Visual elements",
        "Text overlays",
        "Storytelling flow",
      ],
      icon: Scissors,
      tag: "Post & Motion",
    },
    {
      num: "09",
      title: "SOUND DESIGN",
      subtitle: "We add and refine:",
      items: [
        "AI voiceover",
        "Background music",
        "Sound effects",
        "Audio transitions",
        "Voice/music balance",
      ],
      footer: "The objective is to make the final creative feel complete and engaging.",
      icon: Music,
      tag: "Audio & Voiceover",
    },
    {
      num: "10",
      title: "QUALITY CONTROL",
      subtitle: "Every final creative goes through a quality-control review.",
      subHeading: "We check:",
      items: [
        "Visual consistency",
        "Script accuracy",
        "Voiceover",
        "Captions",
        "Branding",
        "Product representation",
        "Audio",
        "Scene transitions",
        "CTA",
        "Overall creative quality",
      ],
      icon: ShieldCheck,
      tag: "10-Point QA Check",
    },
    {
      num: "11",
      title: "DELIVERY",
      subtitle: "You receive an ad-ready final video designed for platforms such as:",
      items: [
        "Instagram Reels",
        "Facebook Ads",
        "TikTok",
        "YouTube Shorts",
        "Other vertical social placements",
      ],
      ctaText: "Start Your AI Video Project",
      icon: Rocket,
      tag: "Ad-Ready Scale",
    },
  ];

  const current = processSteps[activeStep];
  const IconComp = current.icon;

  return (
    <Section id="samples" className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50/20 to-slate-50/40 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      {/* Light atmospheric accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)" }}
      />

      <div className="mx-auto w-full max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="eyebrow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.6)]"></span>
            </span>
            Creative Workflow
          </span>

          <h2 className="mt-3.5 font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-900">
            11-Step Creative{" "}
            <span className="font-serif italic font-bold text-gradient-brand inline-block pr-1.5 whitespace-nowrap">
              Production Process
            </span>
          </h2>
        </div>

        {/* Detailed Active Step Presentation Stage */}
        <div 
          ref={stageRef}
          key={activeStep}
          className={`${
            isVisible || activeStep > 0 ? "animate-step-transition" : "opacity-0"
          } relative overflow-hidden rounded-3xl border border-purple-200/80 bg-white/90 backdrop-blur-xl p-5 sm:p-7 md:p-8 shadow-xl shadow-purple-500/10 transition-all duration-300`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
            {/* Left Stage Details (7 cols) */}
            <div className="lg:col-span-7 flex flex-col text-left">
              {/* Step Header */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs">
                  {current.num}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                  {current.tag}
                </span>
              </div>

              <h3 className="font-[var(--font-google-sans)] text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
                {current.num} — {current.title}
              </h3>

              {/* Subtitle statement */}
              <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed mb-3">
                {current.subtitle}
              </p>

              {current.subHeading && (
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  {current.subHeading}
                </p>
              )}

              {/* Bullet Points Grid with Staggered Reading Animation */}
              {current.items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {current.items.map((item, idx) => (
                    <div
                      key={`${activeStep}-${item}-${idx}`}
                      className={`${
                        isVisible || activeStep > 0 ? "animate-reading-item" : "opacity-0"
                      } flex items-center gap-2 p-2 rounded-lg border border-purple-100/80 bg-purple-50/30 hover:bg-purple-100/40 text-slate-800 text-xs font-medium transition-colors`}
                      style={{ animationDelay: isVisible || activeStep > 0 ? `${idx * 160}ms` : "0ms" }}
                    >
                      <span className="h-4.5 w-4.5 rounded bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                        ✓
                      </span>
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Purpose Box (if present) */}
              {current.purpose && (
                <div 
                  className={`${
                    isVisible || activeStep > 0 ? "animate-reading-item" : "opacity-0"
                  } rounded-xl border border-purple-200/90 bg-purple-50/50 p-3.5 sm:p-4 mb-4`}
                  style={{ animationDelay: isVisible || activeStep > 0 ? `${current.items.length * 160 + 100}ms` : "0ms" }}
                >
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-purple-900 block mb-1">
                    Purpose
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {current.purpose}
                  </p>
                </div>
              )}

              {/* Footer Statement (if present) */}
              {current.footer && (
                <div 
                  className={`${
                    isVisible || activeStep > 0 ? "animate-reading-item" : "opacity-0"
                  } rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 sm:p-3.5 text-xs text-slate-700 leading-relaxed font-medium mb-4`}
                  style={{ animationDelay: isVisible || activeStep > 0 ? `${current.items.length * 160 + 100}ms` : "0ms" }}
                >
                  {current.footer}
                </div>
              )}

              {/* Delivery CTA (if step 11) */}
              {current.ctaText && (
                <div 
                  className={`${
                    isVisible || activeStep > 0 ? "animate-reading-item" : "opacity-0"
                  } mt-2`}
                  style={{ animationDelay: isVisible || activeStep > 0 ? `${current.items.length * 160 + 150}ms` : "0ms" }}
                >
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/35"
                  >
                    <span>{current.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Right Stage Visual Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between self-stretch rounded-2xl border border-purple-100/90 bg-gradient-to-br from-purple-50/40 via-white to-pink-50/30 p-5 sm:p-6 text-left">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="font-mono text-[11px] font-bold text-slate-400">
                    Step {activeStep + 1} of 11
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                    <IconComp className="h-5 w-5 stroke-[2.2]" />
                  </div>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                  Stage Overview
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Every step is designed to optimize retention, engagement, and conversion for performance-driven ad campaigns.
                </p>

                {/* Mini Visual Pipeline Checklist */}
                <div className="space-y-1.5 pt-2 border-t border-purple-100/80">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Workflow Progress</span>
                    <span className="font-mono text-purple-700 font-bold">{Math.round(((activeStep + 1) / 11) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-purple-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 rounded-full"
                      style={{ width: `${((activeStep + 1) / 11) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-purple-100/80">
                <button
                  type="button"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeStep === 0
                      ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                      : "bg-white border border-purple-200 text-purple-900 hover:bg-purple-50 cursor-pointer shadow-2xs"
                  }`}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  disabled={activeStep === processSteps.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(processSteps.length - 1, prev + 1))}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeStep === processSteps.length - 1
                      ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                      : "bg-purple-900 text-white hover:bg-purple-950 cursor-pointer shadow-md shadow-purple-900/20"
                  }`}
                >
                  <span>Next Step</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
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
        />
      )}

      {/* Loading shimmer shown until video src is assigned */}
      {sample.videoUrl && !srcLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e0820] via-[#1a0a2e] to-[#0e0820] animate-pulse pointer-events-none" />
      )}

      {/* Image display when imageUrl is provided without videoUrl */}
      {!sample.videoUrl && (sample as any).imageUrl && (
        <img
          src={(sample as any).imageUrl}
          alt={sample.industry}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      )}

      {/* Blank / Coming Soon state when no video and no image */}
      {!sample.videoUrl && !(sample as any).imageUrl && (
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
          href="https://www.youtube.com/channel/UC7Cy1X5ASFijzI2ky4suVBw"
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

function ServiceVideoCard({
  service,
  onEnded,
  isActive,
}: {
  service: (typeof services)[0];
  onEnded: () => void;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Play video on mount / active
  useEffect(() => {
    if (!videoRef.current || !service.videoUrl) return;
    videoRef.current.currentTime = 0;
    videoRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, [service.videoUrl, isActive]);

  // For image-only service (Digital Twin), auto-advance after 6.5s
  useEffect(() => {
    if (service.videoUrl || !isActive) return;
    const timer = setTimeout(() => {
      onEnded();
    }, 6500);
    return () => clearTimeout(timer);
  }, [service.videoUrl, isActive, onEnded]);

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
    const nextMuted = !isMuted;
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
    <div
      ref={containerRef}
      className="group relative w-full max-w-[240px] sm:max-w-[260px] md:max-w-[275px] aspect-[9/16] rounded-2xl border-2 border-purple-200/90 bg-slate-950 overflow-hidden shadow-xl shadow-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-400 transition-all duration-500 mx-auto"
    >
      {service.videoUrl ? (
        <>
          <video
            ref={videoRef}
            src={service.videoUrl}
            muted={isMuted}
            playsInline
            preload="auto"
            onEnded={onEnded}
            className="h-full w-full object-cover cursor-pointer"
            onClick={togglePlay}
          />

          {/* Sound Toggle Button (Top Right) */}
          <button
            type="button"
            onClick={toggleMute}
            className="absolute top-3 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 hover:bg-purple-600 shadow-md cursor-pointer"
            title={isMuted ? "Unmute audio" : "Mute audio"}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          </button>

          {/* Center Play/Pause indicator on hover or when paused */}
          <div
            onClick={togglePlay}
            className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-200 z-10 ${
              !isPlaying ? "opacity-100 bg-black/30" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur-md border border-white/20">
              {isPlaying ? (
                <Pause className="h-4 w-4 text-white" />
              ) : (
                <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="relative h-full w-full bg-gradient-to-br from-[#120b24] via-[#1a0f35] to-[#0c0618] flex flex-col justify-between p-5 text-center overflow-hidden">
          {/* Subtle tech background grid pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Top badge */}
          <div className="relative z-10 flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-[10px] font-bold text-purple-300 shadow-sm backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-neon animate-pulse" />
              Digital Clone Model
            </span>
          </div>

          {/* Center visual: Cybernetic Avatar Placeholder with pulse */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto py-6">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute h-24 w-24 rounded-full border border-purple-500/30 animate-ping opacity-30" />
              <div className="absolute h-20 w-20 rounded-full bg-gradient-to-tr from-purple-600/30 to-pink-600/30 blur-md" />
              
              {/* Center icon avatar box */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/40 bg-purple-900/60 shadow-[0_0_25px_rgba(200,80,255,0.4)] backdrop-blur-md">
                <Sparkles className="h-7 w-7 text-neon" />
              </div>
            </div>

            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/75 border border-purple-400/40 text-[11px] font-bold uppercase tracking-wider text-purple-200 shadow-lg backdrop-blur-md">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon shadow-[0_0_6px_#c850ff]"></span>
                </span>
                Coming Soon
              </span>
            </div>
          </div>

          {/* Bottom description */}
          <div className="relative z-10 pb-4">
            <p className="text-[11px] text-purple-200/90 font-medium leading-relaxed max-w-[220px] mx-auto">
              High-fidelity digital twin with authorized voice cloning & custom likeness.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Services() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const currentService = services[activeIdx];
  const isReversed = activeIdx % 2 === 1;

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % services.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + services.length) % services.length);
  };

  return (
    <Section id="services" className="relative overflow-hidden bg-gradient-to-b from-slate-50/50 via-purple-50/20 to-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-y border-purple-100/80 shadow-inner">
      {/* Light atmospheric ambient background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)" }}
      />

      <div className="mx-auto w-full max-w-7xl relative z-10" ref={sectionRef}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="eyebrow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.6)]"></span>
            </span>
            AI Video Services
          </span>

          <h2 className="mt-3.5 font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-900">
            AI Video Ad{" "}
            <span className="font-serif italic font-bold text-gradient-brand inline-block pr-1.5 whitespace-nowrap">
              Services
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base md:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
            Choose the video format that fits your brand, audience, product, and campaign objective.
          </p>
        </div>

        {/* Interactive Services Tab Bar */}
        <div className="mb-6 sm:mb-8 overflow-x-auto scrollbar-none pb-2">
          <div className="flex items-center justify-between min-w-[620px] lg:min-w-0 gap-1.5 p-1.5 rounded-2xl border border-purple-100/80 bg-white/80 backdrop-blur-md shadow-sm">
            {services.map((srv, idx) => {
              const isSelected = activeIdx === idx;
              return (
                <button
                  key={srv.num}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`flex-1 flex flex-col items-center py-2 px-2 rounded-xl transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-purple-900 text-white shadow-md shadow-purple-900/20 scale-[1.02]"
                      : "text-slate-600 hover:text-purple-700 hover:bg-purple-50/70"
                  }`}
                >
                  <span className={`font-mono text-[10px] font-bold ${isSelected ? "text-purple-200" : "text-slate-400"}`}>
                    {srv.num}
                  </span>
                  <span className="text-[11px] font-bold tracking-tight truncate max-w-[120px] flex items-center justify-center">
                    <span>{srv.title.replace("AI ", "")}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Service Slide Card (Alternates Left/Right by Index) */}
        <div
          key={activeIdx}
          className="animate-step-transition relative overflow-hidden rounded-3xl border border-purple-200/80 bg-white/90 backdrop-blur-xl p-5 sm:p-7 md:p-8 shadow-xl shadow-purple-500/10 transition-all duration-300 max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Content Column */}
            <div
              className={`lg:col-span-7 flex flex-col space-y-3.5 text-left ${
                isReversed ? "lg:order-2" : "lg:order-1"
              }`}
            >
              {/* Meta Line */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs">
                    {currentService.tag}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-purple-600">
                    Production Format
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-400">
                  {activeIdx + 1} / {services.length}
                </span>
              </div>

              {/* Title & Tagline & Description Block */}
              <div>
                <h3 className="font-[var(--font-google-sans)] text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-1">
                  {currentService.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug mb-1.5">
                  {currentService.tagline}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentService.description}
                </p>
              </div>

              {/* Clean Two-Column Info Cards for Ideal For & Great For with item-by-item points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900/70 block mb-2 font-mono">
                    Ideal For
                  </span>
                  <ul className="space-y-1.5 flex-1">
                    {currentService.idealFor.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-800 font-medium leading-tight">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900/70 block mb-2 font-mono">
                    Great For
                  </span>
                  <ul className="space-y-1.5 flex-1">
                    {currentService.greatFor.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-800 font-medium leading-tight">
                        <span className="h-1.5 w-1.5 rounded-full bg-pink-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price & CTA Row + Navigation Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-purple-100/80">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Starting At
                  </span>
                  <span className="text-sm sm:text-base md:text-lg font-bold text-slate-900 font-mono">
                    {currentService.startingAt}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/35 cursor-pointer"
                  >
                    <span>{currentService.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>

                  {/* Prev / Next Mini Controls */}
                  <div className="flex items-center gap-1 pl-2 border-l border-purple-200/80">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-200 bg-white text-purple-900 hover:bg-purple-50 transition-all cursor-pointer shadow-2xs"
                      title="Previous service"
                      aria-label="Previous service"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-200 bg-white text-purple-900 hover:bg-purple-50 transition-all cursor-pointer shadow-2xs"
                      title="Next service"
                      aria-label="Next service"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video / Media Card Column */}
            <div
              className={`lg:col-span-5 flex justify-center items-center ${
                isReversed ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <ServiceVideoCard
                service={currentService}
                onEnded={handleNext}
                isActive={true}
              />
            </div>
          </div>
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
          eyebrow="WHY AI VIDEO ADS"
          title="Why Brands Are Building More Creative With"
          highlight="AI"
          description="Modern paid media requires creative volume. Instead of depending on one ad concept, brands can develop multiple creative directions around the same product or offer."
        />

        {/* Variations Eyebrow */}
        <div className="text-center mb-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/90 bg-white/90 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-purple-950 shadow-xs backdrop-blur-md font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-neon animate-ping" />
            CREATE VARIATIONS ACROSS
          </span>
        </div>

        <div ref={sectionRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {whyAiVideo.map((item, i) => {
            const animationClass = isInView ? "animate-cyber-wave" : "opacity-0 translate-y-8";

            return (
              <article
                key={item.title}
                style={{ animationDelay: `${i * 0.08}s` }}
                className={`group relative overflow-hidden rounded-xl border border-slate-200/90 bg-white/95 p-4 sm:p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-md flex flex-col justify-start h-full min-h-[116px] sm:min-h-[122px] ${animationClass}`}
              >
                {/* Top Neon Scanner Accent Bar on Hover */}
                <div className="absolute left-0 top-0 h-0.5 w-0 bg-gradient-brand transition-all duration-500 group-hover:w-full" />

                {/* Ambient Glowing Watermark Number */}
                <span className="pointer-events-none absolute right-3 top-1 text-4xl font-black text-slate-900/[0.04] transition-all duration-300 group-hover:text-purple-600/15">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="w-full">
                  <div className="flex items-center gap-2.5">
                    {/* Number Pill Badge */}
                    <div className="flex h-6 w-6 items-center justify-center rounded-md border border-purple-200 bg-purple-50 text-[11px] font-bold text-purple-700 shadow-2xs transition-transform duration-300 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold uppercase tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-purple-600">
                      {item.title}
                    </h3>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600 font-normal">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Closing Callout Block */}
        <div className="mt-6 max-w-2xl mx-auto rounded-xl border border-purple-200/80 bg-gradient-to-r from-purple-50/70 via-white to-pink-50/50 p-4 sm:p-5 text-center shadow-xs backdrop-blur-md">
          <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
            The goal isn't simply to make more videos.
          </p>
          <p className="mt-1 text-xs font-semibold text-purple-900">
            It's to give your marketing team more creative opportunities to test.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
        eyebrow="PRICING"
        title="Simple Pricing."
        highlight="Built for Creative Volume."
        description="Choose the package that fits your volume and production needs with instant checkout."
      />

      <div ref={tableRef} className="mx-auto max-w-6xl space-y-10">
        {/* 1. Main Pricing Matrix (Service vs Video Volume) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Simple Pricing. Built for Creative Volume.
              </h3>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Choose individual video production or volume bundles with fast turnaround times.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openCheckoutModal({ itemType: "package" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-purple-500/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer self-start sm:self-auto"
            >
              <span>Choose Your Package</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-purple-200/80 bg-white shadow-md backdrop-blur-xl">
            {/* Horizontal Scroll Hint for Mobile */}
            <div className="flex items-center justify-between bg-purple-50/70 px-4 py-2 text-[11px] font-medium text-purple-900 md:hidden border-b border-purple-100">
              <span>← Swipe horizontally to see all tiers & order →</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-700 sm:text-xs">
                    <th className="px-4 py-4 sm:px-5 font-extrabold text-slate-900 min-w-[200px]">Service</th>
                    <th className="px-3 py-4 text-center sm:px-4 font-bold min-w-[85px]">1 Video</th>
                    <th className="px-3 py-4 text-center sm:px-4 font-bold min-w-[85px]">5 Videos</th>
                    <th className="px-3 py-4 text-center sm:px-4 font-bold min-w-[85px] bg-purple-100/50 text-purple-900 border-x border-purple-200/50">
                      10 Videos
                    </th>
                    <th className="px-3 py-4 text-center sm:px-4 font-bold min-w-[85px]">15 Videos</th>
                    <th className="px-3 py-4 text-center sm:px-4 font-bold min-w-[85px]">30 Videos</th>
                    <th className="px-3 py-4 text-center sm:px-4 font-bold min-w-[85px]">30+</th>
                    <th className="px-4 py-4 text-center sm:px-5 font-bold min-w-[120px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Row 1: AI UGC Video Ads */}
                  <tr className="transition-colors hover:bg-purple-50/40">
                    <td className="px-4 py-4 font-bold text-slate-900 sm:px-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">AI UGC Video Ads</span>
                        <span className="text-[11px] text-slate-500 font-normal">Real creator-style content</span>
                      </div>
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "single-video", format: "ai-ugc" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 1 Video - AI UGC"
                    >
                      $79
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "starter", format: "ai-ugc" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 5 Videos - AI UGC"
                    >
                      $359
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "growth", format: "ai-ugc" })}
                      className="px-3 py-4 text-center font-bold text-purple-950 bg-purple-50/40 border-x border-purple-200/50 cursor-pointer hover:text-purple-600 hover:bg-purple-100/70 transition-colors"
                      title="Order 10 Videos - AI UGC (Popular)"
                    >
                      $649
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "scale", format: "ai-ugc" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 15 Videos - AI UGC"
                    >
                      $899
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "pro", format: "ai-ugc" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 30 Videos - AI UGC"
                    >
                      $1,549
                    </td>
                    <td className="px-3 py-4 text-center font-semibold text-purple-700">
                      <a
                        href="#contact"
                        className="inline-flex items-center text-purple-700 hover:text-purple-900 hover:underline font-bold transition-all cursor-pointer"
                        title="Contact us for Custom volume"
                      >
                        Custom
                      </a>
                    </td>
                    <td className="px-4 py-4 text-center sm:px-5">
                      <button
                        type="button"
                        onClick={() => openCheckoutModal({ itemType: "package", tierId: "growth", format: "ai-ugc" })}
                        className="inline-flex items-center gap-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 text-[11px] font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span>Buy Now</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>

                  {/* Row 2: AI Avatar Video Ads */}
                  <tr className="transition-colors hover:bg-purple-50/40 bg-slate-50/30">
                    <td className="px-4 py-4 font-bold text-slate-900 sm:px-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">AI Avatar Video Ads</span>
                        <span className="text-[11px] text-slate-500 font-normal">On-camera spokesperson video</span>
                      </div>
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "single-video", format: "ai-avatar" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 1 Video - AI Avatar"
                    >
                      $79
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "starter", format: "ai-avatar" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 5 Videos - AI Avatar"
                    >
                      $359
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "growth", format: "ai-avatar" })}
                      className="px-3 py-4 text-center font-bold text-purple-950 bg-purple-50/40 border-x border-purple-200/50 cursor-pointer hover:text-purple-600 hover:bg-purple-100/70 transition-colors"
                      title="Order 10 Videos - AI Avatar"
                    >
                      $649
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "scale", format: "ai-avatar" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 15 Videos - AI Avatar"
                    >
                      $899
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "pro", format: "ai-avatar" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 30 Videos - AI Avatar"
                    >
                      $1,549
                    </td>
                    <td className="px-3 py-4 text-center font-semibold text-purple-700">
                      <a
                        href="#contact"
                        className="inline-flex items-center text-purple-700 hover:text-purple-900 hover:underline font-bold transition-all cursor-pointer"
                        title="Contact us for Custom volume"
                      >
                        Custom
                      </a>
                    </td>
                    <td className="px-4 py-4 text-center sm:px-5">
                      <button
                        type="button"
                        onClick={() => openCheckoutModal({ itemType: "package", tierId: "growth", format: "ai-avatar" })}
                        className="inline-flex items-center gap-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 text-[11px] font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span>Buy Now</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>

                  {/* Row 3: AI Cartoon Video Ads */}
                  <tr className="transition-colors hover:bg-purple-50/40">
                    <td className="px-4 py-4 font-bold text-slate-900 sm:px-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">AI Cartoon Video Ads</span>
                        <span className="text-[11px] text-slate-500 font-normal">Animated character storytelling</span>
                      </div>
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "single-video", format: "ai-cartoon" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 1 Video - AI Cartoon"
                    >
                      $79
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "starter", format: "ai-cartoon" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 5 Videos - AI Cartoon"
                    >
                      $359
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "growth", format: "ai-cartoon" })}
                      className="px-3 py-4 text-center font-bold text-purple-950 bg-purple-50/40 border-x border-purple-200/50 cursor-pointer hover:text-purple-600 hover:bg-purple-100/70 transition-colors"
                      title="Order 10 Videos - AI Cartoon"
                    >
                      $649
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "scale", format: "ai-cartoon" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 15 Videos - AI Cartoon"
                    >
                      $899
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "pro", format: "ai-cartoon" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 30 Videos - AI Cartoon"
                    >
                      $1,549
                    </td>
                    <td className="px-3 py-4 text-center font-semibold text-purple-700">
                      <a
                        href="#contact"
                        className="inline-flex items-center text-purple-700 hover:text-purple-900 hover:underline font-bold transition-all cursor-pointer"
                        title="Contact us for Custom volume"
                      >
                        Custom
                      </a>
                    </td>
                    <td className="px-4 py-4 text-center sm:px-5">
                      <button
                        type="button"
                        onClick={() => openCheckoutModal({ itemType: "package", tierId: "growth", format: "ai-cartoon" })}
                        className="inline-flex items-center gap-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 text-[11px] font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span>Buy Now</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>

                  {/* Row 4: AI Hyper-Realistic Video Ads */}
                  <tr className="transition-colors hover:bg-purple-50/40 bg-slate-50/30">
                    <td className="px-4 py-4 font-bold text-slate-900 sm:px-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">AI Hyper-Realistic Video Ads</span>
                        <span className="text-[11px] text-slate-500 font-normal">Cinematic high-impact visuals</span>
                      </div>
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "single-video", format: "hyper-realistic" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 1 Video - Hyper-Realistic"
                    >
                      $149
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "starter", format: "hyper-realistic" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 5 Videos - Hyper-Realistic"
                    >
                      $699
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "growth", format: "hyper-realistic" })}
                      className="px-3 py-4 text-center font-bold text-purple-950 bg-purple-50/40 border-x border-purple-200/50 cursor-pointer hover:text-purple-600 hover:bg-purple-100/70 transition-colors"
                      title="Order 10 Videos - Hyper-Realistic"
                    >
                      $1,249
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "scale", format: "hyper-realistic" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 15 Videos - Hyper-Realistic"
                    >
                      $1,699
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "pro", format: "hyper-realistic" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 30 Videos - Hyper-Realistic"
                    >
                      $2,949
                    </td>
                    <td className="px-3 py-4 text-center font-semibold text-purple-700">
                      <a
                        href="#contact"
                        className="inline-flex items-center text-purple-700 hover:text-purple-900 hover:underline font-bold transition-all cursor-pointer"
                        title="Contact us for Custom volume"
                      >
                        Custom
                      </a>
                    </td>
                    <td className="px-4 py-4 text-center sm:px-5">
                      <button
                        type="button"
                        onClick={() => openCheckoutModal({ itemType: "package", tierId: "growth", format: "hyper-realistic" })}
                        className="inline-flex items-center gap-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 text-[11px] font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span>Buy Now</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>

                  {/* Row 5: AI Digital Twin Video */}
                  <tr className="transition-colors hover:bg-purple-50/40">
                    <td className="px-4 py-4 font-bold text-slate-900 sm:px-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">AI Digital Twin Video</span>
                        <span className="text-[11px] text-slate-500 font-normal">Custom likeness & voice model</span>
                      </div>
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "single-video", format: "digital-twin" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 1 Video - Digital Twin"
                    >
                      $179
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "starter", format: "digital-twin" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 5 Videos - Digital Twin"
                    >
                      $849
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "growth", format: "digital-twin" })}
                      className="px-3 py-4 text-center font-bold text-purple-950 bg-purple-50/40 border-x border-purple-200/50 cursor-pointer hover:text-purple-600 hover:bg-purple-100/70 transition-colors"
                      title="Order 10 Videos - Digital Twin"
                    >
                      $1,499
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "scale", format: "digital-twin" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 15 Videos - Digital Twin"
                    >
                      $2,049
                    </td>
                    <td
                      onClick={() => openCheckoutModal({ itemType: "package", tierId: "pro", format: "digital-twin" })}
                      className="px-3 py-4 text-center font-bold text-slate-800 cursor-pointer hover:text-purple-600 hover:bg-purple-50/80 transition-colors"
                      title="Order 30 Videos - Digital Twin"
                    >
                      $3,499
                    </td>
                    <td className="px-3 py-4 text-center font-semibold text-purple-700">
                      <a
                        href="#contact"
                        className="inline-flex items-center text-purple-700 hover:text-purple-900 hover:underline font-bold transition-all cursor-pointer"
                        title="Contact us for Custom volume"
                      >
                        Custom
                      </a>
                    </td>
                    <td className="px-4 py-4 text-center sm:px-5">
                      <button
                        type="button"
                        onClick={() => openCheckoutModal({ itemType: "package", tierId: "growth", format: "digital-twin" })}
                        className="inline-flex items-center gap-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 text-[11px] font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span>Buy Now</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. Digital Twin Setup Card */}
        <div className="space-y-3.5">
          <div className="border-b border-slate-200 pb-2.5">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              DIGITAL TWIN SETUP
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              One-time setup fee to configure your digital twin and clone your voice model.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-purple-200/80 bg-white shadow-sm backdrop-blur-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg">
                  Digital Twin Avatar & Voice Model Setup
                </span>
                <span className="rounded-full border border-purple-200 bg-purple-100/90 px-2.5 py-0.5 text-[10px] font-bold text-purple-800 shadow-xs">
                  One-Time
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Full avatar training, high-fidelity voice clone calibration, and speaking model setup.
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block font-mono">
                  Setup Fee
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tracking-tight text-gradient-brand">
                    $499
                  </span>
                  <span className="text-xs font-bold text-slate-600">One-Time</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openCheckoutModal({ itemType: "setup" })}
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Buy Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
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
            <button
              type="button"
              onClick={() => openCheckoutModal({ itemType: "package" })}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-brand px-4 py-2 text-xs sm:text-sm font-bold text-neon-foreground shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Buy Plan
            </button>
            <a
              href={whatsAppUrl}
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

export function PackageInclusions() {
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

  const inclusions = [
    "Content & competitor research",
    "Creative strategy",
    "Creative concept development",
    "Hooks & angles",
    "Script writing / adaptation",
    "Storyboard",
    "Up to 60-second video",
    "AI voiceover",
    "Character expressions & movements",
    "Backgrounds & visual elements",
    "Captions / subtitles",
    "Background music & sound effects",
    "9:16 Reel / TikTok / Shorts format",
    "End-to-end AI production",
    "Quality control",
    "Ad-ready final video",
  ];

  return (
    <Section id="package-inclusions" className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50/15 to-white py-10 sm:py-12 md:py-14 border-b border-purple-100/80">
      <SectionHeading
        eyebrow="PACKAGE INCLUSIONS"
        title="Every Video"
        highlight="Includes"
        description="Comprehensive end-to-end production included in every single AI video we deliver."
        center={true}
      />

      <div ref={containerRef} className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-purple-200/80 bg-white/95 p-5 sm:p-7 md:p-8 shadow-md shadow-purple-500/5 backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-2.5">
            {inclusions.map((item, idx) => {
              const animationClass = isInView ? "animate-inclusion-item" : "opacity-0 translate-y-3";
              return (
                <div
                  key={item}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                  className={`flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-all hover:bg-slate-50 ${animationClass}`}
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xs">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {item}
                  </span>
                </div>
              );
            })}
          </div>

          {/* CTA Row */}
          <div className="mt-6 pt-5 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Ready to scale your video ads?
              </span>
              <p className="text-xs text-slate-500">
                Launch high-converting creator, avatar, and animation ads in 48–72 hours.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <span>Start Your AI Video Project</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
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
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.6)]"></span>
            </span>
            AI Digital Twin Videos
          </span>
          <h2 className="mt-3.5 font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-900">
            Build Your AI Digital Twin Once.{" "}
            <span className="font-serif italic font-bold text-gradient-brand inline-block pr-1.5 whitespace-nowrap">
              Create Videos Again and Again.
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg font-semibold text-slate-800">
            Turn your approved appearance and voice into a reusable AI video asset for future
            content.
          </p>
          <p className="mt-3 text-xs sm:text-sm md:text-base leading-relaxed text-slate-600">
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
            <NeonButton href="#contact">Get Your Digital Twin</NeonButton>
          </div>
          <p className="mt-4 text-xs text-slate-500">
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
              src="/images/Digital%20Twin%20Image.png?v=3"
              alt="Digital Twin Sample Reel"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
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
    <Section id="industries" className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-slate-100/60 border-b border-slate-200/70">
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
          // Fallback to iframe recreation
          if (calendlyContainerRef.current) {
            calendlyContainerRef.current.innerHTML = `
              <iframe
                src="${calendlyUrl}?embed_domain=${typeof window !== "undefined" ? window.location.hostname : "quickuppaistudio.us"}&embed_type=Inline&hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=7c3aed"
                width="100%"
                height="560"
                frameborder="0"
                title="Select a Date & Time - Strategy Call"
                style="width: 100%; height: 560px; border: 0;"
              ></iframe>
            `;
          }
        }
      } else if (calendlyContainerRef.current) {
        const iframe = calendlyContainerRef.current.querySelector("iframe");
        if (iframe) {
          iframe.src = `${calendlyUrl}?embed_domain=${typeof window !== "undefined" ? window.location.hostname : "quickuppaistudio.us"}&embed_type=Inline&hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=7c3aed`;
        }
      }
    };

    const handleCalendlyMessage = async (e: MessageEvent) => {
      if (
        e.origin.includes("calendly.com") ||
        (e.data && typeof e.data === "object" && e.data.event && String(e.data.event).startsWith("calendly."))
      ) {
        if (e.data.event === "calendly.event_scheduled") {
          try {
            const { recordCalendlyBookingServerFn } = await import("@/lib/lead-actions");
            // The widget only provides Calendly URIs (no name / email / time); the server
            // fetches the real booking so it matches the webhook + sync (no duplicate row).
            const payload = e.data.payload || {};
            const inviteeUri = payload.invitee?.uri;
            const eventUri = payload.event?.uri;
            if (inviteeUri) {
              await recordCalendlyBookingServerFn({
                data: {
                  invitee_uri: String(inviteeUri),
                  event_uri: eventUri ? String(eventUri) : undefined,
                  notes: "Booked via embedded Calendly widget on quickuppaistudio.us",
                },
              });
            }
          } catch (err) {
            console.error("Failed to auto-record Calendly booking:", err);
          }

          // Reset and regain fresh Calendly calendar view after 5 seconds
          setTimeout(() => {
            initWidget();
          }, 5000);
        }
      }
    };

    window.addEventListener("message", handleCalendlyMessage);

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

    return () => {
      window.removeEventListener("message", handleCalendlyMessage);
    };
  }, []);

  return (
    <Section id="book-call" className="py-8 sm:py-10 md:py-12 relative overflow-hidden bg-gradient-to-b from-slate-100/90 via-purple-50/30 to-slate-100/95 border-b border-slate-200/80">
      <SectionHeading
        eyebrow="CALENDLY + PAYMENT FLOW"
        title="Treat This as a Core"
        highlight="Conversion System"
        description="Book a direct strategy call with our creative team or choose your streamlined workflow to kick off your project."
        center={true}
      />

      {/* Two-Column Split Layout with Spacious Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-start">
        {/* LEFT COLUMN: Calendly Booking (Compact Height) */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Header & Quick Action Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              </span>
              <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                Book a Strategy Call
              </h3>
            </div>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-3 py-1 text-[11px] sm:text-xs font-semibold text-purple-700 shadow-2xs hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Calendar className="h-3 w-3 text-purple-600" />
              <span>Open in New Tab</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          </div>

          <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">
            Select an open date &amp; time on our calendar. Real 30-minute conversation about your brand, creative hooks, and format recommendations.
          </p>

          {/* Embedded Calendly Container (Compact Size) */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
            <div className="w-full overflow-hidden" style={{ height: "560px" }}>
              <div
                ref={calendlyContainerRef}
                className="calendly-inline-widget"
                data-url={`${calendlyUrl}?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=7c3aed`}
                style={{
                  width: "calc(100% + 20px)",
                  height: "560px",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <iframe
                  src={`${calendlyUrl}?embed_domain=${typeof window !== "undefined" ? window.location.hostname : "quickuppaistudio.us"}&embed_type=Inline&hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=7c3aed`}
                  width="100%"
                  height="560"
                  frameBorder="0"
                  title="Select a Date & Time - Strategy Call"
                  className="border-0"
                  style={{
                    width: "100%",
                    height: "560px",
                    overflowY: "auto",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Website CTA Routing Points with clear space and left border on desktop */}
        <div className="lg:col-span-6 flex flex-col lg:pl-8 xl:pl-12 lg:border-l lg:border-slate-200/80">
          {/* Header */}
          <div className="mb-4 pb-3 border-b border-purple-100/90">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700">
              WEBSITE CTA ROUTING
            </span>
            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 mt-1">
              Direct Action &amp; Conversion Flow
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Every CTA button routes into our automated scheduling or instant checkout engine.
            </p>
          </div>

          {/* Points List Breakdown (Not Cards) */}
          <div className="divide-y divide-slate-200/70 border-y border-slate-200/70">
            {/* 1. Book a Strategy Call */}
            <div
              onClick={() => {
                if (calendlyContainerRef.current) {
                  calendlyContainerRef.current.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.open(calendlyUrl, "_blank");
                }
              }}
              className="group flex items-center justify-between gap-3 py-3 sm:py-3.5 transition-colors hover:bg-purple-50/40 cursor-pointer px-1.5 rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors truncate">
                  Book a Strategy Call
                </span>
              </div>
              <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-purple-50 border border-purple-200/70 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                <span>&rarr;</span>
                <span>Calendly</span>
              </span>
            </div>

            {/* 2. Talk to Our AI Creative Team */}
            <div
              onClick={() => {
                if (calendlyContainerRef.current) {
                  calendlyContainerRef.current.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.open(calendlyUrl, "_blank");
                }
              }}
              className="group flex items-center justify-between gap-3 py-3 sm:py-3.5 transition-colors hover:bg-purple-50/40 cursor-pointer px-1.5 rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors truncate">
                  Talk to Our AI Creative Team
                </span>
              </div>
              <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-purple-50 border border-purple-200/70 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                <span>&rarr;</span>
                <span>Calendly</span>
              </span>
            </div>

            {/* 3. Start Your Project */}
            <div
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center justify-between gap-3 py-3 sm:py-3.5 transition-colors hover:bg-purple-50/40 cursor-pointer px-1.5 rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors truncate">
                  Start Your Project
                </span>
              </div>
              <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-indigo-50 border border-indigo-200/70 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs">
                <span>&rarr;</span>
                <span>Project / Booking Flow</span>
              </span>
            </div>

            {/* 4. Book & Get Started */}
            <div
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center justify-between gap-3 py-3 sm:py-3.5 transition-colors hover:bg-purple-50/40 cursor-pointer px-1.5 rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors truncate">
                  Book &amp; Get Started
                </span>
              </div>
              <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-pink-50 border border-pink-200/70 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-pink-700 group-hover:bg-pink-600 group-hover:text-white transition-all shadow-2xs">
                <span>&rarr;</span>
                <span>Booking + Payment Flow</span>
              </span>
            </div>

            {/* 5. Choose Your Package */}
            <div
              onClick={() => {
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center justify-between gap-3 py-3 sm:py-3.5 transition-colors hover:bg-purple-50/40 cursor-pointer px-1.5 rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors truncate">
                  Choose Your Package
                </span>
              </div>
              <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-2xs">
                <span>&rarr;</span>
                <span>Pricing / Checkout</span>
              </span>
            </div>

            {/* 6. Create an AI UGC Ad */}
            <div
              onClick={() => {
                openCheckoutModal({ itemType: "individual", itemId: "ai_ugc_video" });
              }}
              className="group flex items-center justify-between gap-3 py-3 sm:py-3.5 transition-colors hover:bg-purple-50/40 cursor-pointer px-1.5 rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors truncate">
                  Create an AI UGC Ad
                </span>
              </div>
              <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-purple-50 border border-purple-200/70 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                <span>&rarr;</span>
                <span>AI UGC booking / checkout</span>
              </span>
            </div>

            {/* 7. Create an AI Avatar Video */}
            <div
              onClick={() => {
                openCheckoutModal({ itemType: "individual", itemId: "ai_avatar_video" });
              }}
              className="group flex items-center justify-between gap-3 py-3 sm:py-3.5 transition-colors hover:bg-purple-50/40 cursor-pointer px-1.5 rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors truncate">
                  Create an AI Avatar Video
                </span>
              </div>
              <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-purple-50 border border-purple-200/70 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                <span>&rarr;</span>
                <span>AI Avatar booking / checkout</span>
              </span>
            </div>

            {/* 8. Create Cartoon AI Ad */}
            <div
              onClick={() => {
                openCheckoutModal({ itemType: "individual", itemId: "ai_cartoon_animation" });
              }}
              className="group flex items-center justify-between gap-3 py-3 sm:py-3.5 transition-colors hover:bg-purple-50/40 cursor-pointer px-1.5 rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors truncate">
                  Create Cartoon AI Ad
                </span>
              </div>
              <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-purple-50 border border-purple-200/70 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                <span>&rarr;</span>
                <span>Cartoon booking / checkout</span>
              </span>
            </div>

            {/* 9. Create a Premium AI Ad */}
            <div
              onClick={() => {
                openCheckoutModal({ itemType: "individual", itemId: "hyper_realistic_video" });
              }}
              className="group flex items-center justify-between gap-3 py-3 sm:py-3.5 transition-colors hover:bg-purple-50/40 cursor-pointer px-1.5 rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors truncate">
                  Create a Premium AI Ad
                </span>
              </div>
              <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-purple-50 border border-purple-200/70 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                <span>&rarr;</span>
                <span>Hyper-Realistic booking / checkout</span>
              </span>
            </div>

            {/* 10. Create Your Digital Twin */}
            <div
              onClick={() => {
                openCheckoutModal({ itemType: "individual", itemId: "digital_twin_avatar" });
              }}
              className="group flex items-center justify-between gap-3 py-3 sm:py-3.5 transition-colors hover:bg-purple-50/40 cursor-pointer px-1.5 rounded-lg"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-purple-700 transition-colors truncate">
                  Create Your Digital Twin
                </span>
              </div>
              <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-purple-50 border border-purple-200/70 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                <span>&rarr;</span>
                <span>Digital Twin booking / checkout</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function RecommendedConversionFlows() {
  const flows = [
    {
      badge: "FLOW A",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      accentBorder: "border-purple-200/90 hover:border-purple-400",
      title: "STRATEGY CALL",
      subtitle: "For brands seeking strategic creative direction, format guidance, and customized campaign recommendations.",
      steps: [
        "Website",
        "Book a Strategy Call",
        "Calendly",
        "Strategy Call",
        "Recommended Service / Package",
        "Payment",
        "Project Onboarding",
      ],
      ctaText: "Book Strategy Call",
      ctaAction: () => {
        document.getElementById("book-call")?.scrollIntoView({ behavior: "smooth" });
      },
      ctaIcon: Calendar,
      ctaStyle: "bg-purple-600 hover:bg-purple-700 text-white shadow-xs",
    },
    {
      badge: "FLOW B",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      accentBorder: "border-emerald-300 hover:border-emerald-400",
      popular: true,
      title: "DIRECT $79 PURCHASE",
      subtitle: "Fast-track self-serve checkout to start testing high-converting AI video creatives immediately.",
      steps: [
        "Website",
        "Select Video Type",
        "Select $79 Package",
        "Project Information",
        "Payment",
        "Order Confirmation",
        "Production",
      ],
      ctaText: "Start at $79",
      ctaAction: () => {
        openCheckoutModal({ itemType: "individual", itemId: "ai_ugc_video" });
      },
      ctaIcon: Zap,
      ctaStyle: "bg-gradient-brand text-white shadow-md hover:brightness-110",
    },
    {
      badge: "FLOW C",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
      accentBorder: "border-indigo-200/90 hover:border-indigo-400",
      title: "HIGH-VOLUME CLIENT",
      subtitle: "Enterprise scale and monthly creative volume (30+ ads) with dedicated production workflows.",
      steps: [
        "Website",
        "Pricing",
        "30 / 30+ Videos",
        "Custom Requirement",
        "Strategy Call",
        "Custom Proposal",
        "Payment",
        "Project Onboarding",
      ],
      ctaText: "Custom Volume Inquiry",
      ctaAction: () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      },
      ctaIcon: ArrowRight,
      ctaStyle: "bg-slate-900 hover:bg-slate-800 text-white shadow-xs",
    },
  ];

  return (
    <Section id="conversion-flows" className="py-10 sm:py-14 md:py-16 relative overflow-hidden bg-gradient-to-b from-slate-100/95 via-purple-50/20 to-white border-b border-slate-200/80">
      <SectionHeading
        eyebrow="RECOMMENDED CONVERSION FLOWS"
        title="Clear &amp; Seamless Paths to"
        highlight="Your Next Ad Creative"
        description="Choose the ideal workflow that matches your campaign scale, timeline, and production requirements."
        center={true}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
        {flows.map((flow) => (
          <div
            key={flow.badge}
            className={`relative flex flex-col justify-between rounded-2xl border ${flow.accentBorder} bg-white/95 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 ${
              flow.popular ? "ring-2 ring-purple-500/30" : ""
            }`}
          >
            {flow.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-brand px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                Most Popular
              </div>
            )}

            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${flow.badgeColor}`}>
                  {flow.badge}
                </span>
              </div>

              <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 mb-1.5">
                {flow.title}
              </h3>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed min-h-[36px]">
                {flow.subtitle}
              </p>

              {/* Step by Step Flow Sequence */}
              <div className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                {flow.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-50 text-[11px] font-bold text-purple-700 border border-purple-200/70">
                      {idx === 0 ? "•" : "→"}
                    </span>
                    <span className={idx === flow.steps.length - 1 ? "font-semibold text-purple-950" : ""}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={flow.ctaAction}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${flow.ctaStyle}`}
            >
              <flow.ctaIcon className="h-4 w-4" />
              <span>{flow.ctaText}</span>
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Process() {
  const doubledSteps = [...processSteps, ...processSteps];

  return (
    <section id="process" className="scroll-mt-[72px] relative w-full overflow-hidden bg-gradient-to-b from-purple-50/40 via-white to-purple-50/20 border-y border-purple-100/70 py-14 sm:py-18">
      {/* Centered Heading */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <SectionHeading
          eyebrow="HOW IT WORKS"
          title="From Brief to"
          highlight="Ready-to-Run Creative"
          center={true}
        />
      </div>

      {/* 100% Full-Width Infinite Smooth Looping Track (Left to Right) */}
      <div className="relative mt-8 sm:mt-10 w-full overflow-hidden">
        {/* Left & Right Soft Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Marquee Row */}
        <div className="flex gap-4 sm:gap-5 py-3 animate-marquee-ltr hover:[animation-play-state:paused]">
          {doubledSteps.map((step, i) => {
            return (
              <div
                key={`${step.step}-${i}`}
                className="group relative flex w-[280px] sm:w-[320px] md:w-[340px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 backdrop-blur-md"
              >
                {/* Step Top Bar Accent Line with Smooth Edge Masking */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-brand transition-all duration-500 ease-out group-hover:w-full" />
                <div className="pointer-events-none absolute -top-1 left-0 h-3 w-0 bg-gradient-brand opacity-0 blur-xs transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-40" />

                {/* Ambient Step Number Watermark */}
                <span className="pointer-events-none absolute right-4 top-2 text-4xl font-black text-slate-900/[0.04] transition-all duration-300 group-hover:text-purple-600/15">
                  {step.step}
                </span>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-xs font-black text-purple-700 group-hover:bg-gradient-brand group-hover:text-white transition-colors duration-200">
                      {step.step}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-purple-600 transition-colors duration-200">
                      Step {step.step}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors duration-200">
                    {step.step} — {step.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Button Linked to Contact Form */}
      <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center text-center px-4">
        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-full bg-gradient-brand px-8 py-3.5 text-xs sm:text-sm font-bold text-neon-foreground shadow-lg glow-neon transition-all duration-200 hover:scale-105 hover:brightness-110 cursor-pointer"
        >
          <Zap className="mr-2 h-4 w-4" />
          <span>Start Your Project</span>
        </a>
      </div>
    </section>
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

export function formatUsaPhoneInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const digitsOnly = trimmed.replace(/\D/g, "");

  if (trimmed.startsWith("+")) {
    if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
      const area = digitsOnly.slice(1, 4);
      const mid = digitsOnly.slice(4, 7);
      const last = digitsOnly.slice(7);
      return `+1 (${area}) ${mid}-${last}`;
    }
    return trimmed;
  }

  if (digitsOnly.length === 10) {
    const area = digitsOnly.slice(0, 3);
    const mid = digitsOnly.slice(3, 6);
    const last = digitsOnly.slice(6);
    return `+1 (${area}) ${mid}-${last}`;
  }

  if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
    const area = digitsOnly.slice(1, 4);
    const mid = digitsOnly.slice(4, 7);
    const last = digitsOnly.slice(7);
    return `+1 (${area}) ${mid}-${last}`;
  }

  if (digitsOnly.length > 10) {
    return `+${digitsOnly}`;
  }

  return trimmed;
}

export function LeadFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Section id="contact" className="relative overflow-hidden bg-gradient-to-b from-slate-100/90 via-purple-50/30 to-slate-100/95 border-t border-slate-200/80 pt-10 sm:pt-14 pb-6 sm:pb-8">
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
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="CONTACT / BOOKING"
          title="Let's Create Your Next"
          highlight="Ad"
          description="Tell us what you're selling, who you're targeting, and what you're trying to achieve. We'll help determine the right AI video format and creative direction for your project."
          center={true}
        />

        <div className="panel mx-auto mt-8 max-w-3xl p-6 sm:p-10 shadow-lg border border-slate-200/90 bg-white/95 backdrop-blur-sm rounded-3xl">
          {submitted ? (
            <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <BadgeCheck className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
                Inquiry Submitted Successfully!
              </h3>
              <p className="max-w-md mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
                Thank you for sharing your project details. Our creative strategy team is reviewing your requirement and will get back to you shortly.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="rounded-full border border-slate-200 bg-slate-100 px-5 py-2 text-xs font-semibold text-slate-800 hover:border-purple-300 hover:text-purple-700 transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
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
                const email = String(data.get("email") || "");
                const phone = formatUsaPhoneInput(String(data.get("phone") || ""));
                const business = String(data.get("business") || "");
                const website = String(data.get("website") || "");
                const industry = String(data.get("industry") || "");
                const videoType = String(data.get("videoType") || "");
                const videoQuantity = String(data.get("videoQuantity") || "");
                const requirement = String(data.get("requirement") || "");

                // 1. Send directly to PostgreSQL Database
                let savedLead: any = null;
                try {
                  const res = await submitLeadServerFn({
                    data: {
                      source: "USA - Contact Form",
                      name,
                      email,
                      phone,
                      business,
                      website,
                      industry,
                      videoType,
                      videoQuantity,
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
                  website: website || undefined,
                  industry,
                  video_type: videoType,
                  video_quantity: videoQuantity || undefined,
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

                // Auto-revert form back to normal after 3.5 seconds
                setTimeout(() => {
                  setSubmitted(false);
                }, 3500);
              }}
              className="space-y-4 sm:space-y-5"
            >
              {/* Row 1: Name & Work Email */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="bookingName"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Name*
                  </label>
                  <input
                    id="bookingName"
                    type="text"
                    name="name"
                    required
                    placeholder="Your full name"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label
                    htmlFor="bookingEmail"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Work Email*
                  </label>
                  <input
                    id="bookingEmail"
                    type="email"
                    name="email"
                    required
                    placeholder="you@company.com"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Company / Brand */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="bookingPhone"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Phone*
                  </label>
                  <input
                    id="bookingPhone"
                    type="tel"
                    name="phone"
                    required
                    placeholder="+1 (555) 000-0000"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label
                    htmlFor="bookingCompany"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Company / Brand*
                  </label>
                  <input
                    id="bookingCompany"
                    type="text"
                    name="business"
                    required
                    placeholder="Company or brand name"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 3: Website & Industry */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="bookingWebsite"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Website
                  </label>
                  <input
                    id="bookingWebsite"
                    type="text"
                    name="website"
                    placeholder="https://yourbrand.com or yourbrand.com"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label
                    htmlFor="bookingIndustry"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Industry*
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="bookingIndustry"
                      name="industry"
                      required
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 pr-10 text-base sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer shadow-2xs"
                    >
                      <option value="">Select industry</option>
                      <option value="E-commerce / DTC">E-commerce / DTC</option>
                      <option value="SaaS / AI">SaaS / AI</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Med Spa / Aesthetics">Med Spa / Aesthetics</option>
                      <option value="Agency">Agency</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Row 4: What do you need? & Monthly creative requirement */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="bookingWhatDoYouNeed"
                    className="block text-xs font-bold text-slate-800"
                  >
                    What do you need?*
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="bookingWhatDoYouNeed"
                      name="videoType"
                      required
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 pr-10 text-base sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer shadow-2xs"
                    >
                      <option value="">Select video format / need</option>
                      <option value="AI UGC Video Ads">AI UGC Video Ads</option>
                      <option value="AI Avatar / Presenter Videos">AI Avatar / Presenter Videos</option>
                      <option value="Hyper-Realistic AI Ads">Hyper-Realistic AI Ads</option>
                      <option value="AI Cartoon Animation">AI Cartoon Animation</option>
                      <option value="AI Digital Twin / Clone">AI Digital Twin / Clone</option>
                      <option value="Full Creative Ad Package">Full Creative Ad Package</option>
                      <option value="Not Sure - Need Guidance">Not Sure - Need Guidance</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="bookingMonthlyRequirement"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Monthly creative requirement*
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="bookingMonthlyRequirement"
                      name="videoQuantity"
                      required
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 pr-10 text-base sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer shadow-2xs"
                    >
                      <option value="">Select volume / requirement</option>
                      <option value="1 – 3 Videos (Testing / One-off)">1 – 3 Videos (Testing / One-off)</option>
                      <option value="4 – 8 Videos / month (Starter)">4 – 8 Videos / month (Starter)</option>
                      <option value="9 – 15 Videos / month (Growth)">9 – 15 Videos / month (Growth)</option>
                      <option value="16 – 30+ Videos / month (Scale / High Volume)">16 – 30+ Videos / month (Scale / High Volume)</option>
                      <option value="Custom / Ongoing Retainer">Custom / Ongoing Retainer</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Row 5: Project details */}
              <div>
                <label
                  htmlFor="bookingProjectDetails"
                  className="block text-xs font-bold text-slate-800"
                >
                  Project details*
                </label>
                <textarea
                  id="bookingProjectDetails"
                  name="requirement"
                  rows={4}
                  required
                  placeholder="Tell us what you're selling, who you're targeting, hooks/angles, and what you're trying to achieve..."
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/80 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none shadow-2xs"
                />
              </div>

              {/* Legal Terms & Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1 pb-1">
                <input
                  type="checkbox"
                  id="bookingConsent"
                  name="consent"
                  required
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600 shrink-0"
                />
                <label
                  htmlFor="bookingConsent"
                  className="text-xs text-slate-600 leading-snug cursor-pointer select-none"
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

              {/* CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-brand py-3.5 text-sm sm:text-base font-bold text-neon-foreground shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.01] hover:brightness-110 active:scale-95 disabled:opacity-50 glow-neon cursor-pointer"
              >
                {loading ? "Submitting Inquiry..." : "SUBMIT INQUIRY"}
              </button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}

export function WhatsAppCtaSection() {
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
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:brightness-105 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <a
            href="/#pricing"
            className="inline-flex items-center gap-2 rounded-full border border-purple-400/80 bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition-all hover:border-purple-300 hover:bg-slate-800 hover:scale-105 active:scale-95 group"
          >
            <Zap className="h-4 w-4 text-white shrink-0 group-hover:scale-110" />
            <span>Buy Plan</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const leftFaqs = faqs.slice(0, 8);
  const rightFaqs = faqs.slice(8, 16);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const renderFaqItem = (faq: (typeof faqs)[number], i: number) => {
    const isOpen = openIndex === i;
    return (
      <div
        key={faq.question}
        className={`overflow-hidden rounded-xl border border-slate-200/90 bg-white transition-all duration-200 shadow-xs hover:border-purple-300 ${
          isOpen ? "bg-purple-50/40 border-purple-300/80 shadow-sm" : "hover:bg-slate-50/60"
        }`}
      >
        <button
          type="button"
          onClick={() => toggleFaq(i)}
          className="flex w-full items-center justify-between gap-3 px-4 sm:px-5 py-3.5 text-left text-xs sm:text-sm font-semibold text-slate-900 transition-colors hover:text-purple-700 cursor-pointer"
          aria-expanded={isOpen}
        >
          <span className={isOpen ? "text-purple-700 font-bold" : "text-slate-800"}>
            {faq.question}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-purple-600" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-in fade-in slide-in-from-top-1 duration-200 px-4 sm:px-5 pb-4 pt-1 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-purple-100/60 select-text"
          >
            {faq.answer}
          </div>
        )}
      </div>
    );
  };

  return (
    <Section id="faq" className="relative overflow-hidden bg-aura-diagonal-soft border-y border-purple-100/70 py-14 sm:py-18">
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

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked"
          highlight="Questions"
          center={true}
        />

        {/* 8 - 8 Two-Column Layout */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-start">
          {/* Left Column (0 - 7) */}
          <div className="flex flex-col gap-3 sm:gap-3.5">
            {leftFaqs.map((faq, i) => renderFaqItem(faq, i))}
          </div>

          {/* Right Column (8 - 15) */}
          <div className="flex flex-col gap-3 sm:gap-3.5">
            {rightFaqs.map((faq, i) => renderFaqItem(faq, i + 8))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function CreativeScalingCta() {
  return (
    <section className="relative overflow-hidden border-t border-purple-100/80 bg-gradient-to-b from-white via-purple-50/30 to-slate-50 py-12 sm:py-16 px-4 sm:px-6">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-full max-w-4xl rounded-full bg-gradient-to-r from-purple-400/15 via-indigo-300/15 to-pink-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-purple-300/10 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Eyebrow */}
        <span className="eyebrow">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.6)]"></span>
          </span>
          SCALE CREATIVE PRODUCTION
        </span>

        {/* Headline */}
        <h2 className="mt-3.5 font-heading text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl text-slate-900 max-w-3xl mx-auto">
          Ready to Create More Ads Without Building a{" "}
          <span className="font-serif italic font-bold text-gradient-brand whitespace-nowrap inline-block pr-1.5">
            Bigger Production Team?
          </span>
        </h2>

        {/* Subheadline */}
        <p className="mt-3 text-sm sm:text-base font-semibold text-slate-800">
          Your next creative doesn't need another expensive shoot.
        </p>

        {/* Description */}
        <p className="mx-auto mt-1.5 max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed">
          Give your marketing team more hooks, more concepts, more angles, and more opportunities to test.
        </p>

        {/* CTAs */}
        <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-2.5 text-xs sm:text-sm font-semibold text-neon-foreground shadow-md glow-neon transition-all hover:scale-105 hover:brightness-110 active:scale-95 cursor-pointer"
          >
            <Calendar className="h-4 w-4" />
            <span>Book Your Strategy Call</span>
          </a>

          <a
            href="#pricing"
            className="group inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition-all hover:border-purple-400 hover:bg-purple-50/60 hover:text-purple-700 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>View Pricing</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-purple-600" />
          </a>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:brightness-105 active:scale-95 cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href="#pricing"
            className="inline-flex items-center gap-2 rounded-full border border-purple-400/80 bg-slate-900 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:border-purple-300 hover:bg-slate-800 hover:scale-105 active:scale-95 group cursor-pointer"
          >
            <Zap className="h-4 w-4 text-white shrink-0 group-hover:scale-110" />
            <span>Buy Plan</span>
          </a>
        </div>

        {/* Supporting Lines */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2 border-t border-purple-100/80 pt-5 max-w-xl mx-auto">
          <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-semibold text-purple-800 bg-purple-100/70 border border-purple-200/80 rounded-full px-3.5 py-1 shadow-2xs">
            <span>AI UGC</span>
            <span className="text-purple-400">•</span>
            <span>AI Avatar</span>
            <span className="text-purple-400">•</span>
            <span>AI Cartoon</span>
            <span className="text-purple-400">•</span>
            <span>Hyper-Realistic</span>
            <span className="text-purple-400">•</span>
            <span>Digital Twin</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            From Research to Storyboard to Ready-to-Run Ad.
          </p>
        </div>
      </div>
    </section>
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
  const serviceLinks = [
    { label: "AI UGC Video Ads", href: "#pricing" },
    { label: "AI Avatar Video Ads", href: "#pricing" },
    { label: "AI Cartoon Video Ads", href: "#pricing" },
    { label: "AI Hyper-Realistic Video Ads", href: "#pricing" },
    { label: "AI Digital Twin Video", href: "#pricing" },
    { label: "Digital Twin Setup", href: "#pricing" },
  ];

  const industryLinks = [
    { label: "DTC / E-Commerce", href: "#contact" },
    { label: "SaaS / AI", href: "#contact" },
    { label: "Real Estate", href: "#contact" },
    { label: "Med Spa / Aesthetics", href: "#contact" },
    { label: "Agencies", href: "#contact" },
  ];

  const companyLinks = [
    { label: "About", href: "#top" },
    { label: "Portfolio", href: "#samples" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#process" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
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
        {/* Main Footer Grid: 5 Columns across full width */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6 items-start">
          {/* Col 1: Brand & Tagline & CTA (lg:col-span-4) */}
          <div className="flex flex-col items-start gap-3.5 lg:col-span-4">
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
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
                QUICKUPP AI STUDIO
              </h4>
              <p className="text-sm font-semibold text-neon">{footerTagline}</p>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 sm:text-sm max-w-sm">
              {footerDescription}
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2 text-xs font-semibold text-white shadow-md glow-neon transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Book a Strategy Call</span>
              </a>
            </div>
          </div>

          {/* Col 2: SERVICES (lg:col-span-2) */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
              SERVICES
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
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

          {/* Col 3: INDUSTRIES (lg:col-span-2) */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
              INDUSTRIES
            </h3>
            <ul className="space-y-2">
              {industryLinks.map((link) => (
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

          {/* Col 4: COMPANY (lg:col-span-2) */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
              COMPANY
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
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

          {/* Col 5: Locations & Contact (lg:col-span-2) */}
          <div className="flex flex-col gap-3.5 lg:col-span-2">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
              OUR LOCATIONS
            </h3>
            <div className="flex flex-col gap-2.5 text-xs">
              <a
                href={footerUsaMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-1.5 text-slate-400 hover:text-[#60a5fa] transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-[#60a5fa] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white group-hover:text-[#60a5fa]">
                    USA Office:{" "}
                  </span>
                  <span className="leading-tight block text-[11px] text-slate-400 mt-0.5">{footerUsaAddress}</span>
                </div>
              </a>

              <a
                href={footerCanadaMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-1.5 text-slate-400 hover:text-red-400 transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white group-hover:text-red-400">
                    Canada Office:{" "}
                  </span>
                  <span className="leading-tight block text-[11px] text-slate-400 mt-0.5">{footerCanadaAddress}</span>
                </div>
              </a>
            </div>

            {/* Direct Email and Phone Contact Links */}
            <div className="border-t border-slate-800/80 pt-2.5 flex flex-col gap-1.5 text-xs">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${footerEmail}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-neon"
                title="Send email via Gmail"
              >
                <Mail className="h-3.5 w-3.5 text-neon shrink-0" />
                <span className="truncate text-[11px]">{footerEmail}</span>
              </a>

              <a
                href={`tel:${footerPhone.replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-emerald-400"
                title="Call Quickupp AI Studio"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono text-[11px]">{footerPhone}</span>
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
              Terms &amp; Conditions
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
        href={whatsAppUrl}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-5 md:p-6 backdrop-blur-[4px] animate-in fade-in duration-300">
      <div className="panel relative max-h-[94vh] w-full max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto overflow-x-hidden border-slate-200 bg-white p-5 shadow-2xl sm:p-7 md:p-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-3.5 top-3.5 rounded-full border border-slate-200 bg-slate-100 p-2 text-slate-500 transition-colors hover:border-purple-300 hover:text-slate-900"
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
                const email = String(data.get("email") || "");
                const phone = formatUsaPhoneInput(String(data.get("phone") || ""));
                const business = String(data.get("business") || "");
                const website = String(data.get("website") || "");
                const industry = String(data.get("industry") || "");
                const videoType = String(data.get("videoType") || "");
                const videoQuantity = String(data.get("videoQuantity") || "");
                const requirement = String(data.get("requirement") || "");

                // 1. Send directly to PostgreSQL Database
                let savedLead: any = null;
                try {
                  const res = await submitLeadServerFn({
                    data: {
                      source: "USA - Popup Modal",
                      name,
                      email,
                      phone,
                      business,
                      website,
                      industry,
                      videoType,
                      videoQuantity,
                      requirement,
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
                  website: website || undefined,
                  industry,
                  video_type: videoType,
                  video_quantity: videoQuantity || undefined,
                  requirement,
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
              className="mt-4 space-y-3.5 sm:space-y-4"
            >
              {/* Row 1: Name & Work Email */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="w-full">
                  <label
                    htmlFor="modalName"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Name*
                  </label>
                  <input
                    id="modalName"
                    type="text"
                    name="name"
                    required
                    placeholder="Your full name"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/80 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none shadow-2xs"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="modalEmail"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Work Email*
                  </label>
                  <input
                    id="modalEmail"
                    type="email"
                    name="email"
                    required
                    placeholder="you@company.com"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/80 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Company / Brand */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="w-full">
                  <label
                    htmlFor="modalPhone"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Phone*
                  </label>
                  <input
                    id="modalPhone"
                    type="tel"
                    name="phone"
                    required
                    placeholder="+1 (555) 000-0000"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/80 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none shadow-2xs"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="modalCompany"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Company / Brand*
                  </label>
                  <input
                    id="modalCompany"
                    type="text"
                    name="business"
                    required
                    placeholder="Company or brand name"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/80 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 3: Website & Industry */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="w-full">
                  <label
                    htmlFor="modalWebsite"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Website
                  </label>
                  <input
                    id="modalWebsite"
                    type="text"
                    name="website"
                    placeholder="https://yourbrand.com or yourbrand.com"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/80 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none shadow-2xs"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="modalIndustry"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Industry*
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="modalIndustry"
                      name="industry"
                      required
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/80 px-3 py-2 pr-9 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer shadow-2xs"
                    >
                      <option value="">Select industry</option>
                      <option value="E-commerce / DTC">E-commerce / DTC</option>
                      <option value="SaaS / AI">SaaS / AI</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Med Spa / Aesthetics">Med Spa / Aesthetics</option>
                      <option value="Agency">Agency</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Row 4: What do you need? & Monthly creative requirement */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="w-full">
                  <label
                    htmlFor="modalWhatDoYouNeed"
                    className="block text-xs font-bold text-slate-800"
                  >
                    What do you need?*
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="modalWhatDoYouNeed"
                      name="videoType"
                      required
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/80 px-3 py-2 pr-9 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer shadow-2xs"
                    >
                      <option value="">Select video format / need</option>
                      <option value="AI UGC Video Ads">AI UGC Video Ads</option>
                      <option value="AI Avatar / Presenter Videos">AI Avatar / Presenter Videos</option>
                      <option value="Hyper-Realistic AI Ads">Hyper-Realistic AI Ads</option>
                      <option value="AI Cartoon Animation">AI Cartoon Animation</option>
                      <option value="AI Digital Twin / Clone">AI Digital Twin / Clone</option>
                      <option value="Full Creative Ad Package">Full Creative Ad Package</option>
                      <option value="Not Sure - Need Guidance">Not Sure - Need Guidance</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="modalMonthlyRequirement"
                    className="block text-xs font-bold text-slate-800"
                  >
                    Monthly creative requirement*
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="modalMonthlyRequirement"
                      name="videoQuantity"
                      required
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/80 px-3 py-2 pr-9 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none cursor-pointer shadow-2xs"
                    >
                      <option value="">Select volume / requirement</option>
                      <option value="1 – 3 Videos (Testing / One-off)">1 – 3 Videos (Testing / One-off)</option>
                      <option value="4 – 8 Videos / month (Starter)">4 – 8 Videos / month (Starter)</option>
                      <option value="9 – 15 Videos / month (Growth)">9 – 15 Videos / month (Growth)</option>
                      <option value="16 – 30+ Videos / month (Scale / High Volume)">16 – 30+ Videos / month (Scale / High Volume)</option>
                      <option value="Custom / Ongoing Retainer">Custom / Ongoing Retainer</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Row 5: Project details */}
              <div className="w-full">
                <label
                  htmlFor="modalProjectDetails"
                  className="block text-xs font-bold text-slate-800"
                >
                  Project details*
                </label>
                <textarea
                  id="modalProjectDetails"
                  name="requirement"
                  rows={3}
                  required
                  placeholder="Tell us what you're selling, who you're targeting, hooks/angles, and what you're trying to achieve..."
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/80 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none shadow-2xs"
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

              {/* Alternative Buy Plan Option */}
              <div className="pt-0.5">
                <div className="relative my-2 flex items-center justify-center">
                  <div className="w-full border-t border-slate-200"></div>
                  <span className="absolute bg-white px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    or
                  </span>
                </div>

                <a
                  href="/#pricing"
                  onClick={handleClose}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg border border-purple-400/80 bg-slate-900 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 hover:border-purple-300 active:scale-95 sm:text-sm"
                >
                  <Zap className="h-3.5 w-3.5 text-white shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <span>Explore Packages &amp; Buy Plan</span>
                  <span className="text-xs text-white/80 font-bold transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
