import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Shield, FileText, Cookie } from "lucide-react";
import { Footer, FloatingWhatsAppButton } from "@/components/site/sections";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Quickupp AI Studio" },
      {
        name: "description",
        content:
          "Official Privacy Policy for Quickupp AI Studio, operated by Quickupp Softech LLC. Learn how we collect, use, and protect your information.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

export function PrivacyPolicyPage() {
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
              Privacy &amp; Data Protection
            </span>
            <span className="rounded-full bg-surface/80 border border-border/70 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
              Effective Date: September 18, 2026
            </span>
            <span className="rounded-full bg-surface/80 border border-border/70 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
              Last Updated: September 18, 2026
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Privacy{" "}
            <span className="font-serif italic text-gradient-brand inline-block pr-1.5">
              Policy
            </span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Quickupp AI Studio (“Quickupp AI Studio,” “Quickupp,” “we,” “us,” or “our”) is operated by <strong className="text-foreground">Quickupp Softech LLC</strong>.
          </p>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            This Privacy Policy explains how we collect, use, disclose, retain, and protect personal information when you visit our website, use our services, communicate with us, or otherwise interact with Quickupp AI Studio. By using our website or services, you acknowledge the practices described in this Privacy Policy.
          </p>

          {/* Policy Navigation Tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-2 pt-2">
            <Link
              to="/privacy-policy"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neon/50 bg-neon/10 px-3 py-1.5 text-xs font-semibold text-neon transition-all"
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-neon hover:text-foreground"
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
            <div className="sm:col-span-2"><span className="font-semibold text-foreground">Privacy &amp; Customer Support Email:</span> <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">info@quickuppaistudio.us</a></div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-muted-foreground">
          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">02.</span>
              Information We Collect
            </h2>
            <p>Depending on how you interact with us, we may collect the following categories of information:</p>

            <div className="space-y-4 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h3 className="text-base font-semibold text-foreground">A. Information You Provide Directly</h3>
              <p className="text-xs sm:text-sm">This may include:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-xs sm:text-sm">
                <li>Full name &amp; Business or company name</li>
                <li>Job title or professional information</li>
                <li>Email address &amp; Telephone number</li>
                <li>Billing and invoicing information</li>
                <li>Mailing or business address</li>
                <li>Website and social media information</li>
                <li>Project requirements &amp; Communications with our team</li>
                <li>Information submitted through contact forms</li>
                <li>Information submitted through quotation or consultation requests</li>
              </ul>
            </div>

            <div className="space-y-4 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h3 className="text-base font-semibold text-foreground">B. AI Production Information</h3>
              <p className="text-xs sm:text-sm">If you purchase or request our AI video services, you may provide:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-xs sm:text-sm">
                <li>Photographs &amp; Video recordings</li>
                <li>Voice recordings &amp; Voice samples</li>
                <li>Facial images &amp; Scripts</li>
                <li>Product images &amp; Product videos</li>
                <li>Brand assets, Logos &amp; Marketing materials</li>
                <li>Personal likeness information</li>
                <li>Digital-avatar reference material</li>
                <li>Other information required to create AI-generated content</li>
              </ul>
            </div>

            <div className="space-y-3 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h3 className="text-base font-semibold text-foreground">C. Digital Clone / AI Avatar Information</h3>
              <p className="text-xs sm:text-sm">
                If you use our Digital Clone, AI Avatar, voice cloning, or similar services, we may process information necessary to create or operate the requested digital representation (such as image, facial appearance, voice, speech patterns, video/audio recordings, name, and likeness).
              </p>
              <p className="text-xs sm:text-sm">
                You represent that you have the necessary rights, permissions, and authorizations to provide such information to us. We may require evidence of authorization before creating or processing a Digital Clone, voice clone, avatar, or similar representation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
                <h3 className="text-base font-semibold text-foreground">D. Payment Information</h3>
                <p className="text-xs sm:text-sm">
                  Payments are processed via third-party payment providers. We receive limited payment metadata (status, amount, currency, billing info). We generally do not store complete payment-card numbers.
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
                <h3 className="text-base font-semibold text-foreground">E. Automatically Collected Information</h3>
                <p className="text-xs sm:text-sm">
                  Includes IP address, browser type, device type, operating system, approximate geographic info, pages visited, referring URL, date/time, and cookies.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">03.</span>
              Information Received from Third Parties
            </h2>
            <p>
              We may receive information from payment processors, advertising platforms (Meta, Google, LinkedIn, TikTok), analytics providers, social media platforms, business partners, lead-generation platforms, CRM systems, AI service providers, and cloud-storage providers.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">04.</span>
              How We Use Personal Information
            </h2>
            <p>We may use personal information for purposes including:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-xs sm:text-sm">
              <li>Providing our video production &amp; creative services</li>
              <li>Creating AI-generated videos, avatars, and UGC content</li>
              <li>Creating Digital Clones and voice cloning</li>
              <li>Communicating about projects, quotations, and proposals</li>
              <li>Processing payments and managing customer accounts</li>
              <li>Delivering completed projects and customer support</li>
              <li>Improving website and services</li>
              <li>Preventing fraud, maintaining security, and enforcing agreements</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          {/* Section 5 & 6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <section className="space-y-2.5 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <span className="font-mono text-neon">05.</span> AI Content &amp; Personal Info
              </h2>
              <p className="text-xs sm:text-sm">
                Customer materials may be processed using third-party AI, cloud, editing, and storage technologies solely to produce requested assets. We do not knowingly create non-consensual Digital Clones or voice clones.
              </p>
            </section>

            <section className="space-y-2.5 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <span className="font-mono text-neon">06.</span> Third-Party Info Responsibility
              </h2>
              <p className="text-xs sm:text-sm">
                If you provide information relating to another person (photograph, voice, likeness), you are strictly responsible for ensuring you possess appropriate legal authority and consent.
              </p>
            </section>
          </div>

          {/* Section 7 & 8 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">07 &amp; 08.</span>
              Cookies, Tracking &amp; Advertising
            </h2>
            <p>
              We use cookies, pixels, tags, and similar technologies for website functionality, security, analytics, and advertising. For detailed information, please see our separate <Link to="/cookie-policy" className="text-neon underline font-medium">Cookie Policy</Link>.
            </p>
            <p>
              We partner with third parties (e.g. Meta, Google, LinkedIn, TikTok) for marketing and analytics. Where legally required, we provide appropriate opt-out mechanisms.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">09.</span>
              How We Share Personal Information
            </h2>
            <p>
              We may disclose personal information to service providers strictly necessary to operate our business (AI technology providers, video production platforms, cloud storage, payment processors, hosting, CRM, analytics, IT/security, and legal authorities when required by law). We do not permit service providers to use data for unrelated purposes.
            </p>
          </section>

          {/* Section 10 to 14 */}
          <section className="space-y-4 pt-2">
            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-base font-bold text-foreground"><span className="font-mono text-neon">10.</span> Sale, Sharing &amp; Targeted Advertising</h3>
              <p className="text-xs sm:text-sm">We do not sell personal information for money. However, certain online tracking may be considered &ldquo;sharing&rdquo; or &ldquo;targeted advertising&rdquo; under specific state privacy laws. You have the right to opt out where applicable.</p>
            </div>

            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-base font-bold text-foreground"><span className="font-mono text-neon">12 &amp; 13.</span> Sensitive &amp; Health Information</h3>
              <p className="text-xs sm:text-sm">We do not collect sensitive personal data unless strictly required. Unless expressly agreed in writing, Quickupp is not intended to process Protected Health Information (PHI) subject to HIPAA. Please do not submit patient records without prior contractual safeguards.</p>
            </div>

            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-base font-bold text-foreground"><span className="font-mono text-neon">14.</span> Children&apos;s Privacy</h3>
              <p className="text-xs sm:text-sm">Our services are intended for businesses and adults. We do not knowingly collect personal information from children under 13.</p>
            </div>
          </section>

          {/* Section 15, 16, 17 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-foreground"><span className="font-mono text-neon">15.</span> Data Retention</h3>
              <p className="text-xs sm:text-sm">We retain personal data only as long as necessary for services, business records, security, and legal obligations.</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-foreground"><span className="font-mono text-neon">16.</span> Data Security</h3>
              <p className="text-xs sm:text-sm">We use administrative, technical, and organizational measures to safeguard data against unauthorized access or loss.</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-foreground"><span className="font-mono text-neon">17.</span> International Transfers</h3>
              <p className="text-xs sm:text-sm">Personal data may be processed in the USA, India, or other countries where our team and technology providers operate.</p>
            </div>
          </div>

          {/* Section 18, 19, 20: Privacy Rights */}
          <section className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">18–23.</span>
              State &amp; California Privacy Rights (CCPA / GPC)
            </h2>
            <p>
              Depending on your state of residence, you may have rights to know, access, correct, delete, or port your personal information, as well as opt out of sales/sharing or targeted advertising without discrimination. We honor Global Privacy Control (GPC) universal opt-out signals where required.
            </p>
            <div className="rounded-xl border border-border/70 bg-surface/40 p-4 text-xs sm:text-sm space-y-2">
              <p className="font-semibold text-foreground">To submit a privacy request or appeal a decision:</p>
              <p>Email: <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">info@quickuppaistudio.us</a> with your name, email, and description of your request.</p>
            </div>
          </section>

          {/* Section 24 to 28 */}
          <section className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">24–28.</span>
              Additional Provisions &amp; Policy Updates
            </h2>
            <p className="text-xs sm:text-sm">
              You can unsubscribe from marketing communications at any time. We may update this Privacy Policy periodically; changes become effective upon posting with the updated date.
            </p>
          </section>
        </div>

        {/* Contact & Support Section */}
        <div className="mt-14 rounded-2xl border border-border/70 bg-surface/30 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <h3 className="text-base font-semibold text-foreground sm:text-lg">
                Have questions about our Privacy Policy?
              </h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Contact our privacy compliance team at <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">info@quickuppaistudio.us</a>.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/918177828748?text=${encodeURIComponent(
                  "Hello Quickupp AI Studio Team,\n\nI have a question regarding the Privacy Policy on quickuppaistudio.us.",
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

