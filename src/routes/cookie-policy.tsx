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
          "Official Cookie Policy for Quickupp AI Studio, operated by Quickupp Softech LLC. Learn how cookies and tracking technologies are used.",
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
              className="h-9 md:h-10 w-auto object-contain"
              width={125}
              height={40}
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
              Effective Date: September 18, 2026
            </span>
            <span className="rounded-full bg-surface/80 border border-border/70 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
              Last Updated: September 18, 2026
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Cookie{" "}
            <span className="font-serif italic text-gradient-brand inline-block pr-1.5">
              Policy
            </span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            This Cookie Policy explains how Quickupp AI Studio uses cookies and similar technologies on <strong className="text-foreground">quickuppaistudio.us</strong>. Quickupp AI Studio is operated by <strong className="text-foreground">Quickupp Softech LLC</strong>.
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

        {/* Company Information Box */}
        <div className="my-8 rounded-xl border border-border/70 bg-surface/40 p-5 sm:p-6">
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase text-neon">
            1. Company Information
          </h2>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-muted-foreground">
            <div><span className="font-semibold text-foreground">Legal Entity:</span> Quickupp Softech LLC</div>
            <div><span className="font-semibold text-foreground">Brand:</span> Quickupp AI Studio</div>
            <div><span className="font-semibold text-foreground">Business Address:</span> 8 The Green, Suite A, Dover, DE 19901, USA</div>
            <div><span className="font-semibold text-foreground">Website:</span> <a href="https://www.quickuppaistudio.us/" target="_blank" rel="noopener noreferrer" className="text-neon underline">https://www.quickuppaistudio.us/</a></div>
            <div className="sm:col-span-2"><span className="font-semibold text-foreground">Email:</span> <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">info@quickuppaistudio.us</a></div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-muted-foreground">
          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">02.</span>
              What Are Cookies?
            </h2>
            <p>
              Cookies are small text files that websites may place on your device when you visit a website. Cookies allow websites to recognize your browser and remember certain information.
            </p>
            <p>
              We may also use technologies similar to cookies, including pixels, web beacons, tags, scripts, local storage, tracking technologies, and advertising identifiers. For simplicity, this Cookie Policy refers to these technologies collectively as &ldquo;cookies.&rdquo;
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">03.</span>
              Why We Use Cookies
            </h2>
            <p>We may use cookies and similar technologies for purposes including:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-xs sm:text-sm">
              <li>Operating our website &amp; maintaining security</li>
              <li>Remembering preferences &amp; settings</li>
              <li>Understanding website usage &amp; navigation</li>
              <li>Improving website performance &amp; user experience</li>
              <li>Measuring marketing campaigns &amp; advertising effectiveness</li>
              <li>Supporting personalized advertising</li>
              <li>Preventing fraud and unauthorized activity</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">04.</span>
              Types of Cookies We May Use
            </h2>

            <div className="space-y-2 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h3 className="text-base font-semibold text-foreground">A. Strictly Necessary Cookies</h3>
              <p className="text-xs sm:text-sm">
                These cookies are necessary for the website to operate correctly, supporting security, page functionality, form submissions, session management, and consent preferences. Because they are necessary, they cannot be disabled via our consent banner.
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h3 className="text-base font-semibold text-foreground">B. Functional Cookies</h3>
              <p className="text-xs sm:text-sm">
                Functional cookies remember choices and preferences such as language, region, or previously selected UI settings to provide an enhanced and personalized experience.
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h3 className="text-base font-semibold text-foreground">C. Analytics Cookies</h3>
              <p className="text-xs sm:text-sm">
                Analytics cookies help us understand how visitors interact with our website by gathering metrics on pages visited, time spent, traffic sources, and navigation patterns.
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h3 className="text-base font-semibold text-foreground">D. Advertising and Marketing Cookies</h3>
              <p className="text-xs sm:text-sm">
                Advertising cookies help measure advertising campaigns, track conversions, build target audiences, and deliver relevant promotions across platforms.
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h3 className="text-base font-semibold text-foreground">E. Social Media Technologies</h3>
              <p className="text-xs sm:text-sm">
                Our website may include social media features or tracking technologies provided by third-party platforms allowing them to receive interaction data in accordance with their privacy policies.
              </p>
            </div>
          </section>

          {/* Section 5 & 6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <section className="space-y-2.5 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <span className="font-mono text-neon">05.</span> Third-Party Cookies
              </h2>
              <p className="text-xs sm:text-sm">
                Some cookies are placed by third-party providers (analytics, advertising, payment, hosting, and security partners). These providers may change over time as our platform evolves.
              </p>
            </section>

            <section className="space-y-2.5 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <span className="font-mono text-neon">06.</span> Cookie Consent
              </h2>
              <p className="text-xs sm:text-sm">
                Where required by applicable law, we provide mechanisms allowing visitors to accept, reject, or customize non-essential cookies. Essential cookies continue to operate where necessary.
              </p>
            </section>
          </div>

          {/* Section 7, 8, 9, 10: Privacy Rights */}
          <section className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">07â€“10.</span>
              Your Privacy Choices &amp; Global Privacy Control (GPC)
            </h2>
            <p>
              Depending on your location (including California under the CCPA and other U.S. states), you may have rights to opt out of targeted advertising, sale, or sharing of personal information. Where required by law, we recognize and process Universal Opt-Out Preference Signals such as Global Privacy Control (GPC).
            </p>
          </section>

          {/* Section 11 & 12 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <section className="space-y-2.5 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <span className="font-mono text-neon">11.</span> Browser Controls
              </h2>
              <p className="text-xs sm:text-sm">
                Most web browsers allow you to manage, block, or delete cookies in your settings. Note that disabling certain cookies may affect website functionality.
              </p>
            </section>

            <section className="space-y-2.5 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <span className="font-mono text-neon">12.</span> Do Not Track (DNT)
              </h2>
              <p className="text-xs sm:text-sm">
                Because there is no universally accepted industry standard for DNT signals, our website responds primarily to legally recognized mechanisms like GPC.
              </p>
            </section>
          </div>

          {/* Section 13, 14, 15 */}
          <section className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">13â€“15.</span>
              Retention, Policy Changes &amp; Legal Relationship
            </h2>
            <p className="text-xs sm:text-sm">
              Cookies remain on your device as session cookies (until browser closes) or persistent cookies (until expiration/deletion). We may update this Cookie Policy periodically. This policy should be read alongside our <Link to="/privacy-policy" className="text-neon underline font-medium">Privacy Policy</Link> and <Link to="/terms" className="text-neon underline font-medium">Terms &amp; Conditions</Link>.
            </p>
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
                Contact our privacy compliance team at <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">info@quickuppaistudio.us</a>.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <a
                href="https://wa.me/918177828748?text=Hi%20Quickupp%20AI%20Studio%2C%20I%20have%20a%20question%20regarding%20Cookies%20and%20Privacy."
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