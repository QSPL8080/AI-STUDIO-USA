import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Shield, FileText, Cookie } from "lucide-react";
import { Footer, FloatingWhatsAppButton } from "@/components/site/sections";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Quickupp AI Studio" },
      {
        name: "description",
        content:
          "Official Terms & Conditions governing your access to and use of Quickupp AI Studio services, operated by Quickupp Softech LLC.",
      },
    ],
  }),
  component: TermsPage,
});

export function TermsPage() {
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
              Legal Documentation
            </span>
            <span className="rounded-full bg-surface/80 border border-border/70 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
              Effective Date: September 30, 2026
            </span>
            <span className="rounded-full bg-surface/80 border border-border/70 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
              Last Updated: September 30, 2026
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Terms &amp;{" "}
            <span className="font-serif italic text-gradient-brand inline-block pr-1.5">
              Conditions
            </span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the Quickupp AI Studio website and services.
          </p>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Quickupp AI Studio is operated by <strong className="text-foreground">Quickupp Softech LLC</strong> (&ldquo;Quickupp,&rdquo; &ldquo;Quickupp AI Studio,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
          </p>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            By accessing our website, purchasing our services, submitting a project, or otherwise using our services, you agree to these Terms. If you do not agree with these Terms, do not use our website or services.
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-neon/50 bg-neon/10 px-3 py-1.5 text-xs font-semibold text-neon transition-all"
            >
              <FileText className="h-3.5 w-3.5 text-neon" />
              <span>Terms &amp; Conditions</span>
            </Link>
            <Link
              to="/cookie-policy"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-neon hover:text-foreground"
            >
              <Cookie className="h-3.5 w-3.5 text-neon" />
              <span>Cookie Policy</span>
            </Link>
          </div>
        </div>

        {/* Legal Sections (1 to 32) */}
        <div className="mt-8 space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">

          {/* 1. OUR SERVICES */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                01
              </span>
              OUR SERVICES
            </h2>
            <p>
              Quickupp AI Studio provides AI-assisted creative production services, including:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>AI UGC Video Ads</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>AI Avatar Video Ads</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>AI Cartoon Video Ads</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>AI Hyper-Realistic Video Ads</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>AI Digital Twin Video</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Digital Twin Setup</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Creative research</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Creative strategy</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Hooks and angles</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Concepts</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Script writing</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Storyboarding</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>AI production</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Video editing</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Voiceover</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Sound design</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Captions</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Other creative production services</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              The exact scope of a project will depend on the package, proposal, order, project brief, or other written agreement applicable to that project.
            </p>
          </section>

          {/* 2. AI-GENERATED CONTENT */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                02
              </span>
              AI-GENERATED CONTENT
            </h2>
            <p>
              Our services may use artificial intelligence, machine-learning systems, generative AI tools, automated systems, and third-party technology.
            </p>
            <p>
              AI-generated content may contain inaccuracies, inconsistencies, artifacts, or other errors.
            </p>
            <p>
              We will use reasonable production and quality-control processes, but we do not guarantee that every AI-generated element will be completely accurate or indistinguishable from real-world content.
            </p>
            <p className="text-xs sm:text-sm font-medium text-foreground">
              You are responsible for reviewing final content before publishing or using it in advertising.
            </p>
          </section>

          {/* 3. CREATIVE PRODUCTION PROCESS */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                03
              </span>
              CREATIVE PRODUCTION PROCESS
            </h2>
            <p>
              Our standard creative workflow may include:
            </p>
            <div className="rounded-xl border border-border/60 bg-surface/40 p-4 text-xs sm:text-sm font-mono text-foreground flex flex-wrap items-center gap-2">
              <span className="text-neon">Research</span> →
              <span className="text-neon">Strategy</span> →
              <span className="text-neon">Hooks</span> →
              <span className="text-neon">Concepts</span> →
              <span className="text-neon">Scripts</span> →
              <span className="text-neon">Storyboard</span> →
              <span className="text-neon">AI Production</span> →
              <span className="text-neon">Editing</span> →
              <span className="text-neon">Sound Design</span> →
              <span className="text-neon">Quality Control</span> →
              <span className="text-emerald-400 font-bold">Delivery</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              The exact workflow may vary depending on the service purchased.
            </p>
          </section>

          {/* 4. CLIENT RESPONSIBILITIES */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                04
              </span>
              CLIENT RESPONSIBILITIES
            </h2>
            <p>
              You agree to provide accurate and complete information necessary for your project.
            </p>
            <p>You are responsible for providing:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2 list-none text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Accurate product information</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Accurate claims</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Brand guidelines</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Logos and assets</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Product images/videos</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Scripts or messaging where applicable</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Appropriate permissions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Necessary approvals</span>
              </li>
              <li className="flex items-center gap-2 sm:col-span-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                <span>Accurate contact and billing information</span>
              </li>
            </ul>
            <p className="text-xs sm:text-sm text-amber-400/90 font-medium">
              Delays caused by missing, inaccurate, or late information may affect delivery timelines.
            </p>
          </section>

          {/* 5. CLIENT CONTENT AND RIGHTS */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                05
              </span>
              CLIENT CONTENT AND RIGHTS
            </h2>
            <p>
              You retain ownership of the content and materials you provide to us, subject to any rights you grant us to perform the services.
            </p>
            <p>
              You represent and warrant that you have all rights, licenses, permissions, consents, and authorizations necessary for us to use the materials you provide.
            </p>
            <p>This includes, where applicable:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Copyright</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Trademark rights</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Publicity rights</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Privacy rights</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Image/likeness rights</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Voice rights</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Music licenses</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Model releases</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Creator permissions</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Product rights</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 sm:col-span-2">Third-party content permissions</div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-rose-400">
              You must not provide content that you do not have permission to use.
            </p>
          </section>

          {/* 6. DIGITAL TWIN AND VOICE AUTHORIZATION */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                06
              </span>
              DIGITAL TWIN AND VOICE AUTHORIZATION
            </h2>
            <p>
              If you request a Digital Twin, AI Avatar, voice clone, or similar service involving a real person, you confirm that you have the authority and necessary permission to use that person&rsquo;s:
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-2 list-none text-xs sm:text-sm">
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Image</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Likeness</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Voice</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Video</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Audio</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Name</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Performance</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Other identifying characteristics</li>
            </ul>
            <p className="text-xs sm:text-sm text-foreground bg-surface/60 border border-border/60 p-3 rounded-xl">
              You may not use our services to create unauthorized impersonations, fraudulent identities, deceptive endorsements, or content intended to mislead people about the identity or participation of another person.
            </p>
          </section>

          {/* 7. PROHIBITED USES */}
          <section className="space-y-4 rounded-2xl border border-rose-500/30 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 font-mono text-xs font-bold text-rose-400">
                07
              </span>
              PROHIBITED USES
            </h2>
            <p>You may not use our services to create or distribute content that:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2 list-none text-xs sm:text-sm">
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Is illegal</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Facilitates fraud</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Impersonates another person without authorization</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Uses someone&rsquo;s likeness or voice without appropriate authorization</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Creates deceptive fake testimonials</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Creates fabricated customer experiences presented as genuine</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Infringes intellectual property rights</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Violates privacy rights</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Violates publicity rights</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Facilitates harassment or abuse</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Contains unlawful discriminatory content</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Facilitates criminal activity</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Misrepresents regulated products or services</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Violates advertising laws</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Violates applicable platform policies</li>
              <li className="flex items-center gap-2 text-rose-900 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" /> Attempts to bypass legal or regulatory requirements</li>
            </ul>
            <p className="text-xs sm:text-sm">
              We may refuse or discontinue a project that we reasonably believe creates legal, ethical, safety, or compliance risks.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              The FTC&rsquo;s current reviews/testimonials rule addresses deceptive reviews and testimonials, including certain AI-generated fake reviews and testimonials.
            </p>
          </section>

          {/* 8. ADVERTISING AND MARKETING COMPLIANCE */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                08
              </span>
              ADVERTISING AND MARKETING COMPLIANCE
            </h2>
            <p>
              Quickupp provides creative production services.
            </p>
            <p>
              Unless expressly agreed otherwise in writing, Quickupp does not guarantee that a particular advertisement will comply with every law, regulation, industry rule, advertising platform policy, or claim-substantiation requirement applicable to your business.
            </p>
            <p>
              You remain responsible for ensuring that your final advertisements comply with applicable requirements.
            </p>
            <p>This is especially important for:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Healthcare</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Medical services</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Med spas</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Financial services</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Supplements</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Cosmetics</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Children&rsquo;s products</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Real estate</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Legal services</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Insurance</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Regulated products</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Testimonials</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 sm:col-span-3">Influencer advertising</div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-foreground">
              You should obtain appropriate legal or regulatory review when necessary.
            </p>
          </section>

          {/* 9. TESTIMONIALS AND REVIEWS */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                09
              </span>
              TESTIMONIALS AND REVIEWS
            </h2>
            <p>
              You may not instruct Quickupp to create a fictional customer testimonial and present it as the genuine experience of a real customer.
            </p>
            <p>
              AI avatars, actors, fictional characters, or other simulated presenters may be used for advertising where lawful, but they must not be used to falsely represent a person&rsquo;s genuine experience.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              The FTC&rsquo;s 2024 rule prohibits certain fake or false consumer reviews and testimonials, including certain AI-generated fake testimonials.
            </p>
          </section>

          {/* 10. STORYBOARDS AND CREATIVE APPROVAL */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                10
              </span>
              STORYBOARDS AND CREATIVE APPROVAL
            </h2>
            <p>
              Where applicable, Quickupp may provide a storyboard before production.
            </p>
            <p>A storyboard may include:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Scene descriptions</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Camera direction</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Character actions</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Product placement</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Backgrounds</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Text</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Timing</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Transitions</div>
            </div>
            <p className="text-xs sm:text-sm">
              Client approval of a storyboard, script, concept, or production direction may authorize Quickupp to proceed with production.
            </p>
          </section>

          {/* 11. REVISIONS */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                11
              </span>
              REVISIONS
            </h2>
            <p>
              The number and scope of revisions depend on the package or project agreement.
            </p>
            <p>Unless otherwise stated:</p>
            <ul className="space-y-2 pl-2 list-none text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0 mt-1.5" />
                <span>Minor revisions may be included where specified.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0 mt-1.5" />
                <span>Major creative changes may require additional charges.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0 mt-1.5" />
                <span>Changes to an approved script or storyboard after production begins may require additional production time or fees.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0 mt-1.5" />
                <span>Changes requested because of inaccurate information supplied by the client may be treated as additional work.</span>
              </li>
            </ul>
          </section>

          {/* 12. DELIVERY TIMES */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                12
              </span>
              DELIVERY TIMES
            </h2>
            <p>Estimated delivery timelines will depend on:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Project scope</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Video format</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Number of videos</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Client responsiveness</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Approval time</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Third-party technology</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 sm:col-span-2">Production complexity</div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Any stated delivery timeframe is an estimate unless expressly guaranteed in writing.
            </p>
          </section>

          {/* 13. PRICING */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                13
              </span>
              PRICING
            </h2>
            <p>Current website pricing may include:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="rounded-xl border border-border/60 bg-surface/40 p-3">
                <div className="text-muted-foreground">AI UGC</div>
                <div className="text-base font-bold text-foreground">starting at $79</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-surface/40 p-3">
                <div className="text-muted-foreground">AI Avatar</div>
                <div className="text-base font-bold text-foreground">starting at $79</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-surface/40 p-3">
                <div className="text-muted-foreground">AI Cartoon</div>
                <div className="text-base font-bold text-foreground">starting at $79</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-surface/40 p-3">
                <div className="text-muted-foreground">AI Hyper-Realistic</div>
                <div className="text-base font-bold text-foreground">starting at $149</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-surface/40 p-3">
                <div className="text-muted-foreground">AI Digital Twin</div>
                <div className="text-base font-bold text-foreground">starting at $179</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-surface/40 p-3">
                <div className="text-muted-foreground">Digital Twin Setup</div>
                <div className="text-base font-bold text-neon">$499</div>
              </div>
            </div>
            <p className="pt-1">Actual pricing may vary depending on:</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pl-2 list-none text-xs sm:text-sm">
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Scope</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Customization</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Quantity</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Complexity</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Rush requirements</li>
              <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Additional services</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-400">
              The price presented during checkout, proposal, or written order confirmation controls the applicable transaction.
            </p>
          </section>

          {/* 14. PAYMENT */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                14
              </span>
              PAYMENT
            </h2>
            <p>
              Payment must be made using the payment methods offered during checkout or otherwise agreed in writing.
            </p>
            <p>
              You authorize us or our payment processor to charge the applicable amount.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              Taxes, transaction fees, or other applicable charges may apply.
            </p>
          </section>

          {/* 15. REFUNDS AND CANCELLATIONS */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                15
              </span>
              REFUNDS AND CANCELLATIONS
            </h2>
            <p>
              Unless otherwise stated in a project-specific agreement or required by applicable law:
            </p>
            <ul className="space-y-2 pl-2 list-none text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0 mt-1.5" />
                <span>Customized production work may become non-refundable once production has commenced.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0 mt-1.5" />
                <span>Completed and approved work is generally non-refundable.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0 mt-1.5" />
                <span>Cancellation requests should be submitted as soon as possible.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0 mt-1.5" />
                <span>Refund eligibility may depend on the stage of production.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0 mt-1.5" />
                <span>Where a separate service-specific refund policy applies, that policy will control.</span>
              </li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-400">
              Nothing in these Terms is intended to exclude any non-waivable consumer right.
            </p>
          </section>

          {/* 16. INTELLECTUAL PROPERTY */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                16
              </span>
              INTELLECTUAL PROPERTY
            </h2>
            <div className="space-y-3">
              <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
                <h3 className="font-semibold text-foreground text-sm">Client Materials</h3>
                <p className="mt-1 text-xs sm:text-sm">You retain ownership of materials you provide to us.</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
                <h3 className="font-semibold text-foreground text-sm">Final Deliverables</h3>
                <p className="mt-1 text-xs sm:text-sm">
                  Subject to full payment and any third-party restrictions, you receive the rights specified in your applicable order, proposal, or project agreement.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
                <h3 className="font-semibold text-foreground text-sm">Third-Party Materials</h3>
                <p className="mt-1 text-xs sm:text-sm">Some projects may use third-party:</p>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                  <span className="rounded bg-surface/80 p-1.5 text-center">AI models</span>
                  <span className="rounded bg-surface/80 p-1.5 text-center">Stock assets</span>
                  <span className="rounded bg-surface/80 p-1.5 text-center">Music</span>
                  <span className="rounded bg-surface/80 p-1.5 text-center">Fonts</span>
                  <span className="rounded bg-surface/80 p-1.5 text-center">Software</span>
                  <span className="rounded bg-surface/80 p-1.5 text-center">Voice systems</span>
                  <span className="rounded bg-surface/80 p-1.5 text-center">Images</span>
                  <span className="rounded bg-surface/80 p-1.5 text-center">Video elements</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Third-party terms may apply to those elements. Quickupp cannot transfer rights that it does not own.
                </p>
              </div>
            </div>
          </section>

          {/* 17. AI MODEL AND THIRD-PARTY TECHNOLOGY LIMITATIONS */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                17
              </span>
              AI MODEL AND THIRD-PARTY TECHNOLOGY LIMITATIONS
            </h2>
            <p>
              AI systems are operated by third-party providers and may change over time.
            </p>
            <p>Models may:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 list-none text-xs sm:text-sm">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Change</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Become unavailable</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Produce different outputs</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Have usage restrictions</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Impose content restrictions</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Experience outages</li>
              <li className="flex items-center gap-2 sm:col-span-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Change commercial terms</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-400">
              We may substitute technology providers or production methods when reasonably necessary to provide the service.
            </p>
          </section>

          {/* 18. PORTFOLIO AND MARKETING USE */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                18
              </span>
              PORTFOLIO AND MARKETING USE
            </h2>
            <p>
              Unless you specifically request otherwise in writing, Quickupp may request permission to display completed work in:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Portfolio</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Website</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Social media</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Presentations</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Case studies</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Marketing materials</div>
            </div>
            <p className="text-xs sm:text-sm">
              We will not intentionally disclose confidential information that you have specifically identified as confidential without authorization.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              For confidential or NDA-covered projects, the applicable confidentiality agreement controls.
            </p>
          </section>

          {/* 19. CONFIDENTIALITY */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                19
              </span>
              CONFIDENTIALITY
            </h2>
            <p>
              Each party agrees to use reasonable care to protect confidential information received from the other party.
            </p>
            <p>Confidential information does not include information that:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 list-none text-xs sm:text-sm">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Is publicly available</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Was already lawfully known</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Is independently developed</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Is received lawfully from another source</li>
              <li className="flex items-center gap-2 sm:col-span-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Must be disclosed by law</li>
            </ul>
          </section>

          {/* 20. THIRD-PARTY SERVICES */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                20
              </span>
              THIRD-PARTY SERVICES
            </h2>
            <p>Our website and services may depend on third-party services such as:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Payment processors</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Scheduling platforms</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">AI platforms</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Cloud storage</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Analytics providers</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2">Email providers</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 sm:col-span-2">Hosting providers</div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              We are not responsible for outages or failures caused by third-party providers beyond our reasonable control.
            </p>
          </section>

          {/* 21. WEBSITE USE */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                21
              </span>
              WEBSITE USE
            </h2>
            <p>You agree not to:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2 list-none text-xs sm:text-sm">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> Attempt unauthorized access</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> Interfere with website operation</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> Introduce malware</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> Scrape or copy protected website content without permission</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> Reverse engineer restricted systems</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> Use the website for unlawful purposes</li>
              <li className="flex items-center gap-2 sm:col-span-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> Attempt to circumvent security controls</li>
            </ul>
          </section>

          {/* 22. NO GUARANTEE OF AD PERFORMANCE */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                22
              </span>
              NO GUARANTEE OF AD PERFORMANCE
            </h2>
            <p>We do not guarantee:</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Leads</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Sales</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Revenue</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">ROAS</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Click-through rate</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Conversion rate</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Advertising approval</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Platform performance</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Viral performance</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2 text-center">Business results</div>
            </div>
            <p className="pt-2">Creative performance depends on many factors outside our control, including:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs text-slate-400">
              <div>• Offer</div>
              <div>• Pricing</div>
              <div>• Audience</div>
              <div>• Landing page</div>
              <div>• Product</div>
              <div>• Market</div>
              <div>• Advertising budget</div>
              <div>• Competition</div>
              <div>• Platform algorithms</div>
              <div className="sm:col-span-3">• Campaign structure</div>
            </div>
          </section>

          {/* 23. DISCLAIMERS */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                23
              </span>
              DISCLAIMERS
            </h2>
            <p>
              Our website and services are provided on an &ldquo;as available&rdquo; and &ldquo;as is&rdquo; basis to the maximum extent permitted by applicable law.
            </p>
            <p>We do not guarantee that:</p>
            <ul className="space-y-1.5 pl-2 list-none text-xs sm:text-sm">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> The website will always be available.</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> AI systems will always operate without errors.</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Services will always be uninterrupted.</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Generated content will always be error-free.</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> Third-party platforms will remain available.</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" /> A particular marketing outcome will occur.</li>
            </ul>
          </section>

          {/* 24. LIMITATION OF LIABILITY */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                24
              </span>
              LIMITATION OF LIABILITY
            </h2>
            <p>
              To the maximum extent permitted by applicable law, Quickupp will not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages arising from use of the website or services.
            </p>
            <p>
              To the extent permitted by law, our aggregate liability relating to a specific service will not exceed the amount actually paid to Quickupp for that service giving rise to the claim.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              Nothing in these Terms limits liability that cannot legally be limited or excluded under applicable law.
            </p>
          </section>

          {/* 25. INDEMNIFICATION */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                25
              </span>
              INDEMNIFICATION
            </h2>
            <p>
              To the extent permitted by applicable law, you agree to defend, indemnify, and hold harmless Quickupp, its affiliates, officers, employees, contractors, and service providers from claims, losses, liabilities, damages, costs, and expenses arising from:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5">Your misuse of the services</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5">Your violation of these Terms</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5">Your violation of another person&rsquo;s rights</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5">Content you provide</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5">Unauthorized likeness or voice use</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5">Your advertising claims</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5">Your violation of applicable laws</div>
              <div className="rounded-lg border border-border/50 bg-surface/40 p-2.5">Your infringement of intellectual property rights</div>
            </div>
          </section>

          {/* 26. TERMINATION */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                26
              </span>
              TERMINATION
            </h2>
            <p>We may suspend or terminate access to our services if:</p>
            <ul className="space-y-1.5 pl-2 list-none text-xs sm:text-sm">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> You violate these Terms.</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> You fail to pay amounts due.</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> You provide unlawful content.</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> You request prohibited content.</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> Continued performance creates unreasonable legal or security risk.</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" /> Required by law.</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-400">
              Termination does not affect provisions that by their nature should survive termination.
            </p>
          </section>

          {/* 27. GOVERNING LAW */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                27
              </span>
              GOVERNING LAW
            </h2>
            <p>
              These Terms are governed by the laws of the <strong className="text-foreground">State of Delaware</strong>, without regard to conflict-of-law principles, except to the extent applicable law requires otherwise.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              Nothing in these Terms is intended to eliminate or restrict mandatory consumer protections that cannot legally be waived.
            </p>
          </section>

          {/* 28. DISPUTES */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                28
              </span>
              DISPUTES
            </h2>
            <p>
              Before filing a formal claim, the parties agree to attempt in good faith to resolve the dispute by contacting the other party.
            </p>
            <div className="rounded-xl border border-border/60 bg-surface/40 p-3.5 text-xs sm:text-sm">
              <span className="text-muted-foreground">Send dispute notices to: </span>
              <a href="mailto:info@quickuppaistudio.us" className="text-neon underline font-medium">
                info@quickuppaistudio.us
              </a>
            </div>
            <p>
              Where legally permitted, disputes may be brought in the appropriate state or federal courts located in Delaware.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              Nothing in this section prevents a consumer from exercising a non-waivable right under applicable law.
            </p>
          </section>

          {/* 29. CHANGES TO THESE TERMS */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                29
              </span>
              CHANGES TO THESE TERMS
            </h2>
            <p>
              We may update these Terms from time to time.
            </p>
            <p>
              Updated Terms become effective when posted unless a different effective date is specified.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              Your continued use of the services after an update constitutes acceptance to the extent permitted by law.
            </p>
          </section>

          {/* 30. SEVERABILITY */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                30
              </span>
              SEVERABILITY
            </h2>
            <p>
              If any provision of these Terms is determined to be invalid or unenforceable, the remaining provisions will remain in effect to the extent permitted by law.
            </p>
          </section>

          {/* 31. ENTIRE AGREEMENT */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/10 font-mono text-xs font-bold text-neon">
                31
              </span>
              ENTIRE AGREEMENT
            </h2>
            <p>
              These Terms, together with any applicable proposal, order, service-specific terms, privacy policy, and other written agreement, constitute the agreement governing your use of our services.
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              If there is a conflict between these Terms and a signed written agreement, the signed written agreement controls to the extent of the conflict.
            </p>
          </section>

          {/* 32. CONTACT */}
          <section className="space-y-4 rounded-2xl border border-neon/40 bg-surface/40 p-6 sm:p-7 shadow-lg shadow-neon/5">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon/20 font-mono text-xs font-bold text-neon">
                32
              </span>
              CONTACT
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="font-semibold text-foreground text-base">Quickupp Softech LLC</div>
              <div className="text-muted-foreground">Quickupp AI Studio</div>
              <div>
                <span className="text-muted-foreground">Website: </span>
                <a href="https://quickuppaistudio.us" target="_blank" rel="noopener noreferrer" className="text-neon underline">
                  quickuppaistudio.us
                </a>
              </div>
              <div>
                <span className="text-muted-foreground">Email: </span>
                <a href="mailto:info@quickuppaistudio.us" className="text-neon underline font-medium">
                  info@quickuppaistudio.us
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
                Have questions regarding our Terms &amp; Conditions?
              </h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Our team is available at <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">info@quickuppaistudio.us</a> or via WhatsApp to assist you.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/13027545679?text=${encodeURIComponent(
                  "Hello Quickupp AI Studio Team,\n\nI have a question regarding the Terms & Conditions on quickuppaistudio.us.\n\nQuickupp AI Studio USA\nWebsite: https://quickuppaistudio.us\nAddress: 8 The Green, Suite A, Dover, Delaware - 19901, USA\nEmail: info@quickuppaistudio.us",
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
