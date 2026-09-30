import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Film,
  Calendar,
  Zap,
  Info,
} from "lucide-react";
import {
  Header,
  Footer,
  FloatingWhatsAppButton,
  QuotePopupModal,
  CheckoutModal,
  openCheckoutModal,
} from "@/components/site/sections";
import { NeonButton } from "@/components/site/ui";
import {
  portfolioItems,
  portfolioFilters,
  type PortfolioCategory,
  calendlyUrl,
} from "@/components/site/data";

const title = "Portfolio - AI Video Production Examples | Quickupp AI Studio";
const description =
  "Explore AI-powered video concepts created across e-commerce, beauty, fashion, fitness, technology, food, lifestyle, and other high-growth categories.";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://quickuppaistudio.us/portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
  }),
  component: PortfolioPage,
});

function VideoCard({ item }: { item: (typeof portfolioItems)[number] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
          if (item.videoUrl && !video.src) {
            video.src = item.videoUrl;
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
      { threshold: 0.15, rootMargin: "50px 0px 50px 0px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [item.videoUrl]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <article className="group flex flex-col w-full max-w-[340px] rounded-2xl border border-slate-200 bg-white p-3.5 shadow-md hover:shadow-xl transition-all duration-300 hover:border-purple-300">
      {/* Video Container */}
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-slate-950">
        {item.videoUrl ? (
          <>
            <video
              ref={videoRef}
              muted={isMuted}
              loop
              playsInline
              preload="none"
              className="h-full w-full object-cover pointer-events-none"
            />

            {/* Shimmer Placeholder */}
            {!srcLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0e0820] via-[#1a0a2e] to-[#0e0820] animate-pulse pointer-events-none" />
            )}

            {/* Click to Play/Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 h-full w-full cursor-pointer z-10 bg-transparent border-0"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            />

            {/* Sound Toggle Button */}
            <button
              type="button"
              onClick={toggleMute}
              className="absolute top-2.5 right-2.5 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 hover:bg-purple-600 shadow cursor-pointer"
              title={isMuted ? "Unmute sound" : "Mute sound"}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>

            {/* Center Play/Pause indicator */}
            <div
              className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-opacity duration-200 ${
                !isPlaying ? "opacity-100 bg-black/30" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-600/90 text-white shadow-lg backdrop-blur-md">
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="relative h-full w-full bg-gradient-to-br from-[#120b24] via-[#1a0f35] to-[#0c0618] flex flex-col items-center justify-center p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-300 shadow-inner mb-3">
              <Film className="h-6 w-6 text-purple-300 animate-pulse" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-purple-900/80 border border-purple-400/30 text-[11px] font-bold text-purple-200 uppercase tracking-wider shadow-sm">
              Coming Soon
            </span>
            <p className="mt-2 text-xs text-slate-400 font-medium">
              {item.format} Preview
            </p>
          </div>
        )}
      </div>

      {/* Card Details Section */}
      <div className="pt-3.5 px-1 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5 justify-between">
            <span className="inline-flex items-center rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide">
              Format: {item.format}
            </span>
            {item.isSpecConcept && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-300/80 text-amber-800 px-2 py-0.5 text-[10px] font-semibold tracking-wide">
                <Info className="h-3 w-3 shrink-0 text-amber-600" />
                <span>{item.specLabel || "SPEC AD / UNOFFICIAL CONCEPT"}</span>
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-slate-900">
            Industry: <span className="text-purple-700 font-semibold">{item.industry}</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function PortfolioPage() {
  const [selectedFilter, setSelectedFilter] = useState<PortfolioCategory>("All");

  const filteredItems = portfolioItems.filter((item) => {
    if (selectedFilter === "All") return true;
    return item.format === selectedFilter;
  });

  return (
    <div id="top" className="min-h-screen w-full overflow-x-clip bg-background text-foreground flex flex-col justify-between">
      <Header />

      <main id="main-content" className="pt-20 md:pt-24 pb-16 flex-1">
        {/* Page Hero Section */}
        <div className="bg-gradient-to-b from-purple-50/40 via-white to-transparent py-8 sm:py-10 md:py-12 border-b border-purple-100/60">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-1.5 mb-2.5">
              <span className="eyebrow text-[11px] py-0.5 px-3">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-600 shadow-[0_0_6px_rgba(147,51,234,0.6)]"></span>
                </span>
                PORTFOLIO
              </span>
            </div>

            <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              See What AI Creative{" "}
              <span className="font-serif italic text-gradient-brand pr-1">
                Can Look Like
              </span>
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Explore AI-powered video concepts created across e-commerce, beauty, fashion, fitness, technology, food, lifestyle, and other high-growth categories.
            </p>

            {/* Portfolio Filters */}
            <div className="mt-5 sm:mt-7">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                PORTFOLIO FILTERS
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                {portfolioFilters.map((filter) => {
                  const isActive = selectedFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedFilter(filter)}
                      className={`rounded-full px-3 sm:px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-gradient-brand text-white shadow-sm glow-neon scale-105"
                          : "bg-white text-slate-700 border border-slate-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 justify-items-center">
            {filteredItems.map((item, idx) => (
              <VideoCard key={`${item.format}-${item.title}-${idx}`} item={item} />
            ))}
          </div>

          {/* Spec Concept Notice Disclaimer */}
          <div className="mt-12 rounded-2xl border border-purple-200/70 bg-purple-50/50 p-4 sm:p-5 text-center max-w-3xl mx-auto text-xs text-slate-600 leading-relaxed">
            <div className="flex items-center justify-center gap-2 font-bold text-slate-800 mb-1">
              <Info className="h-4 w-4 text-purple-600" />
              <span>SPEC CONCEPT NOTICE</span>
            </div>
            <p>
              If a portfolio video uses a real brand but was not commissioned by that brand: <strong>AI VIDEO SPEC CONCEPT</strong> or <strong>SPEC AD / UNOFFICIAL CONCEPT</strong>. Do not imply that the featured brand is a Quickupp AI Studio client unless it actually is.
            </p>
          </div>

          {/* Bottom Call to Action Section (Light Theme) */}
          <div className="mt-12 sm:mt-14 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50/90 via-white to-pink-50/60 border border-purple-200/80 p-6 sm:p-8 md:p-10 text-center shadow-md relative">
            <div className="relative z-10 max-w-xl mx-auto space-y-2.5">
              <span className="eyebrow text-[11px] py-0.5 px-3">
                <Sparkles className="h-3 w-3 text-purple-600" />
                Start Creating Today
              </span>
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Want Something Like This for Your Brand?
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                Get custom high-converting AI creator videos, avatar ads, and 3D product visuals produced in 48–72 hours.
              </p>

              <div className="pt-2.5 flex flex-wrap justify-center gap-2.5 sm:gap-3">
                <NeonButton
                  variant="primary"
                  size="md"
                  onClick={() => openCheckoutModal({ itemType: "package" })}
                  className="!rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md glow-neon"
                >
                  <Zap className="mr-1.5 h-3.5 w-3.5" />
                  <span>Start Your AI Video Project</span>
                </NeonButton>
                <NeonButton
                  href={calendlyUrl}
                  variant="ghost"
                  size="md"
                  className="!rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold bg-white border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 shadow-xs"
                >
                  <Calendar className="mr-1.5 h-3.5 w-3.5 text-purple-600" />
                  <span>Book a Strategy Call</span>
                </NeonButton>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
      <QuotePopupModal />
      <CheckoutModal />
    </div>
  );
}

