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
    <article className="group relative flex aspect-[9/16] w-full max-w-[340px] flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200/80 bg-slate-950 p-4 sm:p-5 shadow-xl transition-all duration-300 hover:border-purple-400/80 hover:shadow-[0_0_35px_-5px_rgba(168,85,247,0.35)]">
      {/* Background Video */}
      {item.videoUrl && (
        <video
          ref={videoRef}
          muted={isMuted}
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />
      )}

      {/* Loading shimmer */}
      {item.videoUrl && !srcLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e0820] via-[#1a0a2e] to-[#0e0820] animate-pulse pointer-events-none" />
      )}

      {/* Image Fallback (e.g. Digital Twin) */}
      {!item.videoUrl && item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.title || item.industry}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      )}

      {/* Coming Soon state if neither */}
      {!item.videoUrl && !item.imageUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900 text-slate-400">
          <Film className="h-10 w-10 text-purple-400/60" />
          <p className="text-xs font-semibold tracking-wider uppercase">Preview Coming Soon</p>
        </div>
      )}

      {/* Click-to-play overlay */}
      {item.videoUrl && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 h-full w-full cursor-pointer z-10 bg-transparent border-0"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/60 pointer-events-none z-10" />

      {/* Top Controls (Mute button only) */}
      <div className="z-20 flex items-center justify-end w-full">
        {item.videoUrl && (
          <button
            type="button"
            onClick={toggleMute}
            className="relative z-30 inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full p-2 bg-black/60 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 hover:bg-purple-600 shadow cursor-pointer"
            title={isMuted ? "Unmute sound" : "Mute sound"}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* Center Play/Pause hover indicator */}
      {item.videoUrl && (
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-opacity duration-200 ${
            !isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/90 text-white shadow-lg backdrop-blur-md transition-transform group-hover:scale-110">
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white" />
            ) : (
              <Play className="ml-0.5 h-5 w-5 text-white fill-white" />
            )}
          </div>
        </div>
      )}

      {/* Bottom Metadata */}
      <div className="z-20 space-y-1 rounded-xl bg-black/60 p-3 backdrop-blur-sm border border-white/10 w-full pointer-events-none">
        <div className="text-xs sm:text-sm font-bold text-neon">
          Industry: {item.industry}
        </div>
        <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>
    </article>
  );
}

function PortfolioPage() {
  return (
    <div id="top" className="min-h-screen w-full overflow-x-clip bg-background text-foreground flex flex-col justify-between">
      <Header />

      <main id="main-content" className="pt-20 md:pt-24 pb-16 flex-1">
        {/* Page Hero Section */}
        <div className="bg-gradient-to-b from-purple-50/40 via-white to-transparent py-12 sm:py-16 md:py-20 border-b border-purple-100/60">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="eyebrow">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.6)]"></span>
                </span>
                18. PORTFOLIO
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              See What AI Creative{" "}
              <span className="font-serif italic text-gradient-brand pr-1">
                Can Look Like
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Explore AI-powered video concepts created across e-commerce, beauty, fashion, fitness, technology, food, lifestyle, and other high-growth categories.
            </p>
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 justify-items-center">
            {portfolioItems.map((item, idx) => (
              <VideoCard key={`${item.title}-${idx}`} item={item} />
            ))}
          </div>

          {/* Bottom Call to Action Section */}
          <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white p-8 sm:p-12 md:p-16 text-center shadow-2xl relative">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-purple-300 border border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                Start Creating Today
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                Want Something Like This for Your Brand?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Get custom high-converting AI creator videos, avatar ads, and 3D product visuals produced in 48–72 hours.
              </p>

              <div className="pt-4 flex flex-wrap justify-center gap-3 sm:gap-4">
                <NeonButton
                  variant="primary"
                  size="lg"
                  onClick={() => openCheckoutModal({ itemType: "package" })}
                  className="!rounded-full px-8 py-3.5 shadow-lg shadow-purple-500/30"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  <span>Start Your AI Video Project</span>
                </NeonButton>
                <NeonButton
                  href={calendlyUrl}
                  variant="ghost"
                  size="lg"
                  className="!rounded-full px-8 py-3.5 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                >
                  <Calendar className="mr-2 h-4 w-4 text-purple-300" />
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

