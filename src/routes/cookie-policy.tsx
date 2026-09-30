import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Shield, FileText, Cookie } from "lucide-react";
import { Footer, FloatingWhatsAppButton } from "@/components/site/sections";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy | Quickupp AI Studio" },
      {
        name: "description",
        content:
          "Official Cookie Policy for Quickupp AI Studio, operated by Quickupp Softech LLC. Learn how we use cookies and tracking technologies on quickuppaistudio.us.",
      },
    ],
  }),
  component: CookiePolicyPage,
});

export function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-neon selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <Link
            to="/"
            className="-ml-3 sm:-ml-5 flex items-center transition-opacity hover:opacity-90"
          >
            <img
              src="/images/LOGO 1.png"
              alt="Quickupp AI Studio logo"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/50 px-4 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-neon hover:text-neon sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-4xl px-5 py-10 md:py-14">
        {/* Document Header */}
        <div className="border-b border-border/60 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-neon" />
              Cookie &amp; Tracking Policy
            </span>
            <span className="rounded-full bg-surface/80 border border-border/70 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
              Effective Date: September 30, 2026
            </span>
            <span className="rounded-full bg-surface/80 border border-border/70 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
              Last Updated: September 30, 2026
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Cookie{" "}
            <span className="font-serif italic text-gradient-brand inline-block pr-1.5">
              Policy
            </span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            This Cookie Policy explains how Quickupp AI Studio, operated by <strong className="text-foreground">Quickupp Softech LLC</strong> (&ldquo;Quickupp,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), uses cookies and similar technologies on <strong className="text-foreground">quickuppaistudio.us</strong>.
          </p>

          {/* Policy Navigation Tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-2 pt-2">
            <Link
              to="/privacy-policy"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-neon hover:text-foreground"
            >
              <Shield className="h-3.5 w-3.5 text-neon" />
              <span>Privacy Policy</span>
            </Link>
            <Link
              to="/terms"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-neon hover:text-foreground"
            >
              <FileText className="h-3.5 w-3.5 text-neon" />
              <span>Terms &amp; Conditions</span>
            </Link>
            <Link
              to="/cookie-policy"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neon/50 bg-neon/10 px-3 py-1.5 text-xs font-semibold text-neon transition-all"
            >
              <Cookie className="h-3.5 w-3.5 text-neon" />
              <span>Cookie Policy</span>
            </Link>
          </div>
        </div>

        {/* Legal Sections (1 to 12) */}
        <div className="mt-8 space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">

          {/* 1. WHAT ARE COOKIES? */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                01
              </span>
              WHAT ARE COOKIES?
            </h2>
            <p>
              Cookies are small text files or similar technologies that may be stored on your browser or device when you visit a website.
            </p>
            <p>Cookies can help websites:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Operate properly</span>
              </div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Remember preferences</span>
              </div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Understand website usage</span>
              </div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Measure advertising</span>
              </div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Improve performance</span>
              </div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Provide security</span>
              </div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Personalize experiences</span>
              </div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Measure conversions</span>
              </div>
            </div>
          </section>

          {/* 2. TYPES OF TECHNOLOGIES WE MAY USE */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                02
              </span>
              TYPES OF TECHNOLOGIES WE MAY USE
            </h2>
            <p>We may use:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center font-medium text-foreground">Cookies</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center font-medium text-foreground">Pixels</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center font-medium text-foreground">Web beacons</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center font-medium text-foreground">Tags</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center font-medium text-foreground">Scripts</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center font-medium text-foreground">Local storage</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center font-medium text-foreground">Device identifiers</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center font-medium text-foreground">Similar tracking technologies</div>
            </div>
          </section>

          {/* 3. CATEGORIES OF COOKIES */}
          <section className="space-y-5 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                03
              </span>
              CATEGORIES OF COOKIES
            </h2>

            {/* A. Strictly Necessary Cookies */}
            <div className="rounded-xl border border-border/60 bg-surface/40 p-5 space-y-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-neon" />
                A. Strictly Necessary Cookies
              </h3>
              <p className="text-xs sm:text-sm">
                These cookies are required for essential website functions.
              </p>
              <p className="text-xs sm:text-sm">They may support:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="rounded bg-surface/80 p-2 text-center">Security</div>
                <div className="rounded bg-surface/80 p-2 text-center">Session management</div>
                <div className="rounded bg-surface/80 p-2 text-center">Form functionality</div>
                <div className="rounded bg-surface/80 p-2 text-center">Checkout</div>
                <div className="rounded bg-surface/80 p-2 text-center">Authentication</div>
                <div className="rounded bg-surface/80 p-2 text-center">Load balancing</div>
                <div className="rounded bg-surface/80 p-2 text-center">Fraud prevention</div>
                <div className="rounded bg-surface/80 p-2 text-center">Basic website operation</div>
              </div>
              <p className="text-xs text-slate-400 pt-1">
                These technologies generally cannot be disabled through our cookie preference tool where they are necessary for the website to function.
              </p>
            </div>

            {/* B. Functional Cookies */}
            <div className="rounded-xl border border-border/60 bg-surface/40 p-5 space-y-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-neon" />
                B. Functional Cookies
              </h3>
              <p className="text-xs sm:text-sm">
                Functional technologies may remember choices such as:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div className="rounded bg-surface/80 p-2 text-center">Language</div>
                <div className="rounded bg-surface/80 p-2 text-center">Region</div>
                <div className="rounded bg-surface/80 p-2 text-center">Preferences</div>
                <div className="rounded bg-surface/80 p-2 text-center">Previously selected options</div>
                <div className="rounded bg-surface/80 p-2 text-center">Website settings</div>
              </div>
              <p className="text-xs text-slate-400 pt-1">
                Where required by applicable law, these technologies will be subject to your preferences.
              </p>
            </div>

            {/* C. Analytics Cookies */}
            <div className="rounded-xl border border-border/60 bg-surface/40 p-5 space-y-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-neon" />
                C. Analytics Cookies
              </h3>
              <p className="text-xs sm:text-sm">
                Analytics technologies help us understand how visitors use our website.
              </p>
              <p className="text-xs sm:text-sm">They may help us understand:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 list-none text-xs sm:text-sm">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Which pages are visited</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> How users navigate the website</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> How long visitors remain on pages</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Which content performs well</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Whether pages are functioning correctly</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> How visitors arrive at our website</li>
              </ul>
              <p className="text-xs text-slate-400 pt-1">
                We may use third-party analytics providers for these purposes.
              </p>
            </div>

            {/* D. Advertising and Targeting Technologies */}
            <div className="rounded-xl border border-border/60 bg-surface/40 p-5 space-y-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-neon" />
                D. Advertising and Targeting Technologies
              </h3>
              <p className="text-xs sm:text-sm">
                Advertising technologies may be used to:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 list-none text-xs sm:text-sm">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Measure advertising campaigns</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Track conversions</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Understand campaign performance</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Build advertising audiences</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Deliver relevant advertisements</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Retarget website visitors</li>
                <li className="flex items-center gap-2 sm:col-span-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Measure interactions with advertisements</li>
              </ul>
              <p className="text-xs sm:text-sm text-foreground pt-1">
                Depending on applicable law, these activities may constitute &ldquo;sale,&rdquo; &ldquo;sharing,&rdquo; targeted advertising, or similar regulated processing.
              </p>
              <p className="text-xs text-neon font-medium">
                Where required, we provide mechanisms to opt out.
              </p>
            </div>
          </section>

          {/* 4. THIRD-PARTY TECHNOLOGIES */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                04
              </span>
              THIRD-PARTY TECHNOLOGIES
            </h2>
            <p>
              Third-party providers may place cookies or similar technologies on our website.
            </p>
            <p>Depending on the tools we use, these may include providers for:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center">Analytics</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center">Advertising</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center">Social media</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center">Video</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center">Payment processing</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center">Scheduling</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center">Website performance</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center">Security</div>
            </div>
            <p className="text-xs sm:text-sm">
              Third-party providers may process information according to their own privacy policies.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              The exact providers used on our website may change over time.
            </p>
          </section>

          {/* 5. COOKIE PREFERENCES */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                05
              </span>
              COOKIE PREFERENCES
            </h2>
            <p>
              Where required or appropriate, our website may provide a cookie preference center allowing you to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Accept optional cookies</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Reject optional cookies</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Manage analytics cookies</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Manage advertising cookies</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5 sm:col-span-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Change your preferences</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Your preferences may be stored so that we can honor your choices.
            </p>
          </section>

          {/* 6. GLOBAL PRIVACY CONTROL AND OPT-OUT SIGNALS */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                06
              </span>
              GLOBAL PRIVACY CONTROL AND OPT-OUT SIGNALS
            </h2>
            <p>
              Where applicable, we recognize qualifying universal opt-out preference signals required by law.
            </p>
            <p>
              For example, California requires covered businesses to honor qualifying opt-out preference signals such as Global Privacy Control for applicable sale/sharing opt-outs. Colorado also provides for universal opt-out mechanisms, and Connecticut requires covered businesses to honor qualifying universal opt-out signals.
            </p>
            <p className="text-xs sm:text-sm text-foreground bg-surface/60 border border-border/60 p-3.5 rounded-xl font-medium">
              Where required, we will treat an applicable signal as a request to opt out of the processing covered by that signal.
            </p>
          </section>

          {/* 7. HOW TO CONTROL COOKIES THROUGH YOUR BROWSER */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                07
              </span>
              HOW TO CONTROL COOKIES THROUGH YOUR BROWSER
            </h2>
            <p>Most browsers allow you to:</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center">View cookies</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center">Delete cookies</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center">Block cookies</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center">Restrict cookies</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5 text-center sm:col-span-1">Receive alerts</div>
            </div>
            <p className="text-xs sm:text-sm text-amber-400/90 font-medium">
              Blocking certain cookies may affect website functionality.
            </p>
          </section>

          {/* 8. DO-NOT-TRACK */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                08
              </span>
              DO-NOT-TRACK
            </h2>
            <p>
              Some browsers offer a &ldquo;Do Not Track&rdquo; setting.
            </p>
            <p>
              Because there is currently no universally accepted technical standard governing all Do Not Track signals, our website may not respond to every browser-based Do Not Track signal.
            </p>
            <p className="text-xs sm:text-sm text-foreground font-medium">
              Where applicable law requires recognition of a qualifying opt-out preference signal, we will honor it as required by law.
            </p>
          </section>

          {/* 9. CALIFORNIA RESIDENTS */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                09
              </span>
              CALIFORNIA RESIDENTS
            </h2>
            <p>
              California residents may have rights concerning certain online tracking activities, including rights relating to the sale or sharing of personal information and targeted advertising.
            </p>
            <p>
              Depending on our processing activities and applicable law, advertising and analytics technologies may constitute regulated &ldquo;sharing&rdquo; or other processing.
            </p>
            <p className="text-xs sm:text-sm text-neon font-medium">
              California recognizes Global Privacy Control and other qualifying universal opt-out preference signals for applicable requests.
            </p>
          </section>

          {/* 10. OTHER U.S. STATES */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                10
              </span>
              OTHER U.S. STATES
            </h2>
            <p>
              Various U.S. states provide consumers with rights concerning targeted advertising, sale of personal data, profiling, and universal opt-out preference signals.
            </p>
            <p>These include, depending on applicability:</p>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Colorado</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Connecticut</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">California</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Delaware</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Indiana</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Kentucky</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Maryland</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Minnesota</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Montana</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Nebraska</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">New Hampshire</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">New Jersey</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Oregon</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Rhode Island</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Tennessee</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Texas</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Utah</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Virginia</div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              The exact rights and requirements differ by state and may depend on the business, data processed, consumer, and applicable thresholds.
            </p>
          </section>

          {/* 11. CHANGES TO THIS COOKIE POLICY */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                11
              </span>
              CHANGES TO THIS COOKIE POLICY
            </h2>
            <p>
              We may update this Cookie Policy from time to time.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              Changes will be posted on this page with an updated &ldquo;Last Updated&rdquo; date.
            </p>
          </section>

          {/* 12. CONTACT US */}
          <section className="space-y-4 rounded-2xl border border-neon/40 bg-surface/40 p-6 sm:p-7 shadow-lg shadow-neon/5">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/20 font-mono text-xs font-bold text-neon">
                12
              </span>
              CONTACT US
            </h2>
            <p>
              If you have questions about our use of cookies or tracking technologies, contact:
            </p>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="font-semibold text-foreground text-base">Quickupp Softech LLC / Quickupp AI Studio</div>
              <div>
                <span className="text-muted-foreground">Email: </span>
                <a href="mailto:info@quickuppaistudio.us" className="text-neon underline font-medium">
                  info@quickuppaistudio.us
                </a>
              </div>
              <div>
                <span className="text-muted-foreground">Website: </span>
                <a href="https://quickuppaistudio.us" target="_blank" rel="noopener noreferrer" className="text-neon underline">
                  quickuppaistudio.us
                </a>
              </div>
            </div>
          </section>

        </div>

        {/* Contact & Support Section */}
        <div className="mt-14 rounded-2xl border border-border/70 bg-surface/30 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <h3 className="text-base font-semibold text-foreground sm:text-lg">
                Have questions about our Cookie Policy?
              </h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Contact our privacy compliance team at <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">info@quickuppaistudio.us</a> or via WhatsApp.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/13027545679?text=${encodeURIComponent(
                  "Hello Quickupp AI Studio Team,\n\nI have a question regarding Cookies and Privacy on quickuppaistudio.us.\n\nQuickupp AI Studio USA\nWebsite: https://quickuppaistudio.us\nAddress: 8 The Green, Suite A, Dover, Delaware - 19901, USA\nEmail: info@quickuppaistudio.us",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2 text-xs font-bold text-neon-foreground shadow-md transition-all hover:brightness-110 sm:text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-all hover:border-neon hover:text-neon sm:text-sm"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}