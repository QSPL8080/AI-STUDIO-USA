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
          "Official Terms & Conditions governing your use of Quickupp AI Studio services, operated by Quickupp Softech LLC.",
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
              Legal Documentation
            </span>
            <span className="rounded-full bg-surface/80 border border-border/70 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
              Effective Date: September 18, 2026
            </span>
            <span className="rounded-full bg-surface/80 border border-border/70 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
              Last Updated: September 18, 2026
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Terms &amp;{" "}
            <span className="font-serif italic text-gradient-brand inline-block pr-1.5">
              Conditions
            </span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            These Terms &amp; Conditions (“Terms”) govern your access to and use of the Quickupp AI Studio website and services. Quickupp AI Studio is operated by <strong className="text-foreground">Quickupp Softech LLC</strong>, a Delaware company.
          </p>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            By accessing our website, requesting a quotation, placing an order, making a payment, or using our services, you agree to these Terms. If you do not agree with these Terms, please do not use our services.
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

        {/* Company Quick Summary Box */}
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

        {/* Legal Sections */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-muted-foreground">
          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">02.</span>
              Our Services
            </h2>
            <p>
              Quickupp AI Studio provides AI-powered creative and video production services, which may include:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 list-disc text-xs sm:text-sm">
              <li>AI UGC videos</li>
              <li>AI Avatar videos</li>
              <li>AI spokesperson videos</li>
              <li>AI Cartoon videos</li>
              <li>Hyper-realistic AI videos</li>
              <li>Digital Clone videos</li>
              <li>Voice-cloning services</li>
              <li>Product videos &amp; demonstrations</li>
              <li>Social-media videos</li>
              <li>Advertising creatives &amp; Promotional videos</li>
              <li>Explainer videos &amp; Brand videos</li>
              <li>Other AI-assisted creative production services</li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-400 pt-1">
              Specific deliverables, pricing, timelines, revisions, and specifications may be described in an individual quotation, proposal, order, invoice, or written agreement.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">03.</span>
              AI-Generated Content
            </h2>
            <p>
              Our services may use artificial intelligence, machine-learning systems, synthetic media, avatars, voice synthesis, generative video, image generation, and other automated technologies.
            </p>
            <p>
              AI-generated content may contain inaccuracies, inconsistencies, artifacts, or unexpected results. Customers are responsible for reviewing all content before publishing, advertising, distributing, or using it commercially.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">04.</span>
              Digital Clones, Voice Clones and AI Avatars
            </h2>
            <p>
              Digital Clone, voice-cloning, AI-avatar, and similar services may involve processing a real person's image, voice, likeness, or other identifying characteristics. You represent and warrant that:
            </p>
            <ul className="space-y-1.5 pl-5 list-disc text-xs sm:text-sm">
              <li>You have obtained all necessary permissions and authorizations.</li>
              <li>You have the right to provide the relevant materials to Quickupp.</li>
              <li>The requested use does not violate another person's rights.</li>
              <li>The requested content is not intended to facilitate fraud, impersonation, identity theft, or other unlawful conduct.</li>
            </ul>
            <p>
              Quickupp may request proof of authorization. We may refuse or discontinue a Digital Clone or voice-cloning project where we reasonably believe the required authorization is absent or the requested use may violate applicable law or these Terms.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">05.</span>
              Customer-Provided Materials
            </h2>
            <p>
              Customers may provide images, videos, audio, voice recordings, logos, product information, scripts, brand guidelines, written content, music, graphics, and other creative materials.
            </p>
            <p>
              You are responsible for ensuring that you have the necessary rights, licenses, consents, and permissions to use and provide these materials.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">06.</span>
              Prohibited Content and Uses
            </h2>
            <p>
              You may not use our services to create or distribute content intended to facilitate:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5 list-disc text-xs sm:text-sm">
              <li>Fraud or identity theft</li>
              <li>Unauthorized impersonation</li>
              <li>Non-consensual Digital Clones or voice cloning</li>
              <li>Fake testimonials presented as genuine</li>
              <li>Deceptive endorsements</li>
              <li>Illegal deepfakes or non-consensual intimate imagery</li>
              <li>Harassment or defamation</li>
              <li>Infringement of intellectual-property rights</li>
              <li>Unlawful discrimination or illegal activities</li>
              <li>Misleading political or election-related deception</li>
              <li>Other unlawful activity</li>
            </ul>
            <p className="text-xs sm:text-sm">
              We reserve the right to refuse any project that violates these Terms, applicable law, or our internal safety requirements.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">07.</span>
              Customer Representations
            </h2>
            <p>By ordering our services, you represent that:</p>
            <ul className="space-y-1.5 pl-5 list-disc text-xs sm:text-sm">
              <li>You are legally permitted to enter into the agreement.</li>
              <li>The information you provide is accurate.</li>
              <li>You have rights to materials supplied to us.</li>
              <li>You have obtained required permissions for individuals appearing in the content.</li>
              <li>Your requested content will not knowingly violate applicable law.</li>
              <li>Your requested content will not knowingly infringe third-party rights.</li>
            </ul>
          </section>

          {/* Section 8 & 9 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <section className="space-y-2.5 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <span className="font-mono text-neon">08.</span> Client Approval
              </h2>
              <p className="text-xs sm:text-sm">
                Customers are responsible for reviewing project materials before final approval. Once the customer approves the script, concept, voice, avatar, visual direction, or final video, Quickupp may proceed with production based on that approval. Customers are responsible for ensuring that final content accurately reflects their intended claims, branding, products, services, and representations.
              </p>
            </section>

            <section className="space-y-2.5 rounded-xl border border-border/70 bg-surface/20 p-5">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <span className="font-mono text-neon">09.</span> Revisions
              </h2>
              <p className="text-xs sm:text-sm">
                The number of revisions included in a project will depend on the applicable quotation, package, proposal, or agreement. Additional revisions or changes outside the agreed scope may result in additional charges. Changes requested after production has substantially begun may also result in additional fees or revised delivery timelines.
              </p>
            </section>
          </div>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">10.</span>
              Delivery Timelines
            </h2>
            <p>
              Estimated delivery timelines will be communicated during the sales or production process. Delivery times may vary depending on project complexity, customer response time, availability of required materials, revision requests, third-party technology, technical issues, or approval delays.
            </p>
            <p>
              Unless expressly guaranteed in writing, delivery dates are estimates rather than guaranteed deadlines.
            </p>
          </section>

          {/* Section 11, 12, 13, 14 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-foreground"><span className="font-mono text-neon">11.</span> Pricing</h3>
              <p className="text-xs sm:text-sm">Prices are communicated via our website, quotation, proposal, or invoice. Prices are in the specified currency; applicable taxes may be added where required. Custom projects may receive individually negotiated pricing.</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-foreground"><span className="font-mono text-neon">12.</span> Payment</h3>
              <p className="text-xs sm:text-sm">Payment terms are specified in the quotation, invoice, order, or agreement. We may require advance payment before production begins. Failure to make payment may result in suspension or cancellation.</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-foreground"><span className="font-mono text-neon">13.</span> Final Delivery</h3>
              <p className="text-xs sm:text-sm">Final production files are delivered after all required payments have been received. Quickupp may withhold final deliverables where outstanding amounts remain unpaid.</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-foreground"><span className="font-mono text-neon">14.</span> Refunds and Cancellations</h3>
              <p className="text-xs sm:text-sm">Because services involve customized creative production and AI processing, refund eligibility depends on the stage of production and specific agreement terms.</p>
            </div>
          </div>

          {/* Section 15 & 16 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">15 &amp; 16.</span>
              Intellectual Property &amp; AI Output Ownership
            </h2>
            <p>
              Customers retain ownership of materials they provide to Quickupp, subject to the rights necessary for us to provide the services. Upon receipt of full payment, customers generally receive the agreed deliverables according to the applicable project agreement.
            </p>
            <p>
              Third-party materials, software, AI models, stock assets, fonts, music, trademarks, and other third-party content remain subject to their respective licenses and rights. AI-generated outputs may be subject to legal limitations regarding copyright, ownership, and exclusive rights. Quickupp does not guarantee that every AI-generated element qualifies for copyright protection or exclusive rights.
            </p>
          </section>

          {/* Section 17 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">17.</span>
              Third-Party Technology
            </h2>
            <p>
              Our services may depend on third-party technologies, including AI platforms, cloud platforms, video/voice generation systems, hosting providers, payment processors, analytics, and storage systems. We are not responsible for failures caused solely by third-party systems outside our reasonable control.
            </p>
          </section>

          {/* Section 18 & 19 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">18 &amp; 19.</span>
              Advertising Claims, Testimonials &amp; AI UGC
            </h2>
            <p>
              Quickupp provides creative production services but does not guarantee the performance of advertisements or marketing campaigns (such as leads, sales, ROI, conversion rates, revenue, or platform approval) unless expressly agreed in writing.
            </p>
            <p>
              Customers must not present AI-generated actors, avatars, or synthetic UGC as genuine customer testimonials when doing so would be deceptive or unlawful. Customers are responsible for ensuring appropriate disclosure and compliance with advertising and endorsement requirements.
            </p>
          </section>

          {/* Section 20 & 21 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">20 &amp; 21.</span>
              Healthcare Content &amp; Customer Responsibility
            </h2>
            <p>
              Customers operating in healthcare or related industries must ensure content complies with applicable healthcare and advertising laws. Customers should not provide protected health information (PHI) without contractual safeguards. Quickupp does not provide legal, medical, regulatory, or compliance advice.
            </p>
            <p>
              Customers are solely responsible for reviewing all final content, confirming factual accuracy, licensing rights, required permissions, talent releases, Digital Clone authorizations, and regulatory compliance.
            </p>
          </section>

          {/* Section 22, 23, 24, 25, 26 */}
          <section className="space-y-4 pt-2">
            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-base font-bold text-foreground"><span className="font-mono text-neon">22.</span> Right to Refuse Service</h3>
              <p className="text-xs sm:text-sm">Quickupp may refuse, suspend, or terminate a project if we reasonably believe the project violates these Terms, lacks authorization, involves unlawful or deceptive content, or creates legal/security risks.</p>
            </div>

            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-base font-bold text-foreground"><span className="font-mono text-neon">23.</span> Confidentiality</h3>
              <p className="text-xs sm:text-sm">Where commercially reasonable, we treat confidential customer information as confidential. Separate NDAs may be executed for projects requiring additional protections.</p>
            </div>

            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-base font-bold text-foreground"><span className="font-mono text-neon">24 &amp; 25.</span> Warranties &amp; Limitation of Liability</h3>
              <p className="text-xs sm:text-sm">To the maximum extent permitted by law, services are provided without guarantees that AI outputs are uninterrupted or error-free. Quickupp Softech LLC will not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages.</p>
            </div>

            <div className="rounded-xl border border-border/70 bg-surface/20 p-5 space-y-2">
              <h3 className="text-base font-bold text-foreground"><span className="font-mono text-neon">26.</span> Indemnification</h3>
              <p className="text-xs sm:text-sm">You agree to defend, indemnify, and hold harmless Quickupp Softech LLC, affiliates, and personnel from claims, damages, or costs arising from materials you provide, your violation of these Terms, third-party rights, or applicable law.</p>
            </div>
          </section>

          {/* Section 27 to 34 */}
          <section className="space-y-3 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">27–34.</span>
              General Legal Provisions
            </h2>
            <div className="space-y-3 text-xs sm:text-sm">
              <p><strong className="text-foreground">Privacy &amp; Cookies:</strong> Our collection of personal data and cookies is governed by our separate <Link to="/privacy-policy" className="text-neon underline">Privacy Policy</Link> and <Link to="/cookie-policy" className="text-neon underline">Cookie Policy</Link>.</p>
              <p><strong className="text-foreground">Changes to Terms:</strong> We may update these Terms from time to time. The updated version will be posted on our website with a revised “Last Updated” date.</p>
              <p><strong className="text-foreground">Governing Law:</strong> These Terms are governed by applicable law, and disputes will be handled in courts having jurisdiction over Quickupp Softech LLC.</p>
              <p><strong className="text-foreground">Entire Agreement:</strong> These Terms, together with applicable quotations, proposals, invoices, and policies, constitute the entire agreement between the parties.</p>
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
                Our support team is available at <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">info@quickuppaistudio.us</a> or via WhatsApp to assist you.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/918177828748?text=${encodeURIComponent(
                  "Hello Quickupp AI Studio Team,\n\nI have a question regarding the Terms & Conditions on quickuppaistudio.us.",
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
