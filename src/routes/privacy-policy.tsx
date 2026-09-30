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
          "Official Privacy Policy for Quickupp AI Studio, operated by Quickupp Softech LLC. Learn how we collect, use, disclose, retain, and protect your information.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
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
              src="/images/logo.png"
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
              Effective Date: September 30, 2026
            </span>
            <span className="rounded-full bg-surface/80 border border-border/70 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
              Last Updated: September 30, 2026
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Privacy{" "}
            <span className="font-serif italic text-gradient-brand inline-block pr-1.5">
              Policy
            </span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Quickupp AI Studio is operated by <strong className="text-foreground">Quickupp Softech LLC</strong> (&ldquo;Quickupp AI Studio,&rdquo; &ldquo;Quickupp,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
          </p>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            This Privacy Policy explains how we collect, use, disclose, retain, and protect information when you visit our website, communicate with us, purchase our services, submit project information, upload content, or otherwise interact with Quickupp AI Studio.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">Website:</span>{" "}
              <a href="https://quickuppaistudio.us" target="_blank" rel="noopener noreferrer" className="text-neon underline">
                quickuppaistudio.us
              </a>
            </div>
            <div>
              <span className="font-semibold text-foreground">Contact:</span>{" "}
              <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">
                info@quickuppaistudio.us
              </a>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-400 italic">
            By using our website or services, you acknowledge the practices described in this Privacy Policy.
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

        {/* Policy Sections (1 to 26) */}
        <div className="mt-8 space-y-8 text-sm sm:text-base leading-relaxed text-muted-foreground">

          {/* 1. INFORMATION WE COLLECT */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">01.</span>
              Information We Collect
            </h2>
            <p>Depending on how you interact with us, we may collect the following categories of information:</p>

            <div className="space-y-3 pt-2">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">A. Contact and Account Information</h3>
              <p className="text-xs sm:text-sm">This may include:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-xs sm:text-sm">
                <li>Full name</li>
                <li>Business name</li>
                <li>Job title</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Billing information</li>
                <li>Business address</li>
                <li>Website URL</li>
                <li>Social media handles</li>
                <li>Information submitted through contact forms</li>
                <li>Information provided during strategy calls or consultations</li>
              </ul>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/60">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">B. Project and Business Information</h3>
              <p className="text-xs sm:text-sm">When you request our services, you may provide:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-xs sm:text-sm">
                <li>Product or service information</li>
                <li>Brand information</li>
                <li>Target audience information</li>
                <li>Marketing objectives</li>
                <li>Campaign information</li>
                <li>Advertising requirements</li>
                <li>Brand guidelines</li>
                <li>Competitor information</li>
                <li>Scripts</li>
                <li>Creative briefs</li>
                <li>Project instructions</li>
                <li>Feedback and revisions</li>
              </ul>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/60">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">C. Uploaded Content</h3>
              <p className="text-xs sm:text-sm">To provide our services, you may provide or upload:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-xs sm:text-sm">
                <li>Photographs</li>
                <li>Videos</li>
                <li>Audio recordings</li>
                <li>Voice recordings</li>
                <li>Product images</li>
                <li>Product videos</li>
                <li>Logos</li>
                <li>Brand assets</li>
                <li>Marketing materials</li>
                <li>Creative references</li>
                <li>Images or recordings of individuals</li>
                <li>Other content necessary to produce your requested creative</li>
              </ul>
              <p className="text-xs sm:text-sm bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-slate-300 mt-2">
                If you provide content containing another person, you represent that you have the necessary permission, authorization, consent, license, or other lawful basis to provide that content to us for processing.
              </p>
            </div>
          </section>

          {/* 2. DIGITAL TWIN, VOICE AND LIKENESS INFORMATION */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">02.</span>
              Digital Twin, Voice and Likeness Information
            </h2>
            <p>Some of our services involve creating AI-generated or AI-assisted representations of individuals.</p>
            <p>If you purchase or use a Digital Twin, AI Avatar, voice-cloning, or similar service, we may process information such as:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-xs sm:text-sm">
              <li>Photographs</li>
              <li>Video recordings</li>
              <li>Voice recordings</li>
              <li>Voice characteristics</li>
              <li>Appearance and likeness information</li>
              <li>Facial or physical characteristics</li>
              <li>Scripts</li>
              <li>Performance instructions</li>
              <li>Other information necessary to create the requested digital representation</li>
            </ul>
            <p className="text-xs sm:text-sm">
              We use this information only for authorized purposes connected with the requested service, subject to applicable law and the applicable project agreement.
            </p>
            <p className="text-xs sm:text-sm">
              You must have the legal authority and permission required to provide another person&apos;s image, likeness, voice, or other personal information to us. We do not knowingly create or facilitate unauthorized impersonation of another person.
            </p>
            <p className="text-xs sm:text-sm">
              Where applicable law requires specific consent or authorization for biometric information, voice information, facial information, or other sensitive information, we will seek or rely on the legally required authorization before processing such information.
            </p>
          </section>

          {/* 3. INFORMATION COLLECTED AUTOMATICALLY */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">03.</span>
              Information Collected Automatically
            </h2>
            <p>When you visit our website, certain information may be collected automatically, including:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-xs sm:text-sm">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device type</li>
              <li>Operating system</li>
              <li>Approximate location derived from IP address</li>
              <li>Pages visited</li>
              <li>Referring website</li>
              <li>Date and time of visits</li>
              <li>Website interactions</li>
              <li>Device identifiers</li>
              <li>Website performance information</li>
              <li>Cookie and similar technology information</li>
            </ul>
            <p className="text-xs sm:text-sm">
              We use this information for website operation, security, analytics, performance, marketing, and fraud prevention, subject to applicable law and your privacy choices.
            </p>
          </section>

          {/* 4. COOKIES AND TRACKING TECHNOLOGIES */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">04.</span>
              Cookies and Tracking Technologies
            </h2>
            <p>We may use cookies, pixels, tags, scripts, local storage, and similar technologies.</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground">These technologies may be used for:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-xs sm:text-sm">
              <li>Essential website functionality</li>
              <li>Security</li>
              <li>Preferences</li>
              <li>Analytics</li>
              <li>Website performance</li>
              <li>Advertising</li>
              <li>Conversion measurement</li>
              <li>Retargeting</li>
              <li>Campaign attribution</li>
            </ul>
            <p className="text-xs sm:text-sm">
              For additional information, please see our <Link to="/cookie-policy" className="text-neon underline">Cookie Policy</Link>.
            </p>
            <p className="text-xs sm:text-sm">
              Where required by applicable law, we provide mechanisms to manage or opt out of certain cookies, targeted advertising, sale or sharing of personal information, or similar processing.
            </p>
          </section>

          {/* 5. HOW WE USE PERSONAL INFORMATION */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">05.</span>
              How We Use Personal Information
            </h2>
            <p>We may use information we collect to:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-xs sm:text-sm">
              <li>Provide our services.</li>
              <li>Process and manage orders.</li>
              <li>Respond to inquiries.</li>
              <li>Schedule strategy calls.</li>
              <li>Communicate with customers.</li>
              <li>Produce AI video content.</li>
              <li>Create Digital Twins, AI Avatars, UGC-style videos, animations, or other requested creative.</li>
              <li>Process payments.</li>
              <li>Manage customer relationships.</li>
              <li>Provide customer support.</li>
              <li>Improve our website and services.</li>
              <li>Conduct analytics and performance measurement.</li>
              <li>Prevent fraud, abuse, unauthorized access, or other unlawful activity.</li>
              <li>Maintain security.</li>
              <li>Communicate service updates.</li>
              <li>Send marketing communications where permitted by law.</li>
              <li>Comply with legal obligations.</li>
              <li>Establish, exercise, or defend legal claims.</li>
              <li>Protect our rights, property, users, employees, and business.</li>
              <li>Perform other purposes disclosed to you at or before collection or otherwise permitted by applicable law.</li>
            </ul>
          </section>

          {/* 6. LEGAL AND BUSINESS BASES FOR PROCESSING */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">06.</span>
              Legal and Business Bases for Processing
            </h2>
            <p>Depending on the applicable law and circumstances, we may process information because:</p>
            <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm">
              <li>It is necessary to provide a service you requested.</li>
              <li>It is necessary to perform a contract.</li>
              <li>You provided consent.</li>
              <li>It is necessary to comply with a legal obligation.</li>
              <li>It is necessary to protect our legitimate business interests.</li>
              <li>It is necessary for security, fraud prevention, or legal claims.</li>
              <li>Processing is otherwise permitted under applicable law.</li>
            </ul>
          </section>

          {/* 7. HOW WE SHARE INFORMATION */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">07.</span>
              How We Share Information
            </h2>
            <p>We may share information with the following categories of recipients where necessary to operate our business and provide our services:</p>

            <div className="space-y-2 pt-2">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Service Providers</h3>
              <p className="text-xs sm:text-sm">These may include providers for website hosting, cloud storage, AI generation, video production, voice generation, analytics, customer relationship management, email, scheduling, payment processing, customer support, security, and website functionality.</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Professional Advisors</h3>
              <p className="text-xs sm:text-sm">We may disclose information to attorneys, accountants, auditors, insurance providers, consultants, and other professional advisors.</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Legal and Regulatory Authorities</h3>
              <p className="text-xs sm:text-sm">We may disclose information when reasonably necessary to comply with law, respond to legal process, respond to governmental requests, protect rights or safety, investigate fraud or abuse, or establish/defend legal claims.</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Business Transfers</h3>
              <p className="text-xs sm:text-sm">If Quickupp undergoes a merger, acquisition, financing, restructuring, sale of assets, bankruptcy, or similar transaction, personal information may be transferred as part of that transaction, subject to applicable law.</p>
            </div>
          </section>

          {/* 8. AI SERVICE PROVIDERS AND PROCESSORS */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">08.</span>
              AI Service Providers and Processors
            </h2>
            <p>Because our services involve AI-powered production, certain customer-provided content may be processed through third-party technology providers.</p>
            <p className="text-xs sm:text-sm">Depending on the service purchased, these providers may process images, videos, audio, voice recordings, scripts, text, project information, and other creative assets.</p>
            <p className="text-xs sm:text-sm">We seek to use service providers appropriate to the services we provide and to establish contractual or operational safeguards where appropriate. Customers should review the applicable terms of any third-party AI platform where their content may be processed.</p>
          </section>

          {/* 9. PAYMENT INFORMATION */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">09.</span>
              Payment Information
            </h2>
            <p>Payments may be processed through third-party payment processors. We generally do not need to store complete payment-card information on our own systems.</p>
            <p className="text-xs sm:text-sm">Payment processors may collect and process information necessary to process payments, prevent fraud, verify transactions, issue refunds, maintain payment records, and comply with financial and legal obligations. Your use of a third-party payment provider may also be subject to that provider&apos;s privacy policy and terms.</p>
          </section>

          {/* 10. MARKETING COMMUNICATIONS */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">10.</span>
              Marketing Communications
            </h2>
            <p>We may send marketing communications when permitted by applicable law (including email, product announcements, service information, promotions, educational content, and company updates).</p>
            <p className="text-xs sm:text-sm">You may unsubscribe from marketing emails using the unsubscribe mechanism included in the message. Unsubscribing from marketing communications does not necessarily stop transactional or service-related communications.</p>
          </section>

          {/* 11. CHILDREN'S PRIVACY */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">11.</span>
              Children&apos;s Privacy
            </h2>
            <p>Our services are intended for businesses and general audiences and are not directed toward children under 13. We do not knowingly collect personal information from children under 13 for our own commercial purposes.</p>
            <p className="text-xs sm:text-sm">
              If you believe that a child under 13 has provided personal information to us, please contact us at:{" "}
              <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">info@quickuppaistudio.us</a>.
            </p>
            <p className="text-xs text-slate-400">Federal COPPA requirements can apply when websites or online services collect personal information from children under 13, and the FTC updated its COPPA Rule in 2025.</p>
          </section>

          {/* 12. SENSITIVE PERSONAL INFORMATION */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">12.</span>
              Sensitive Personal Information
            </h2>
            <p>Depending on the services requested, information provided to us may include information that is considered sensitive under applicable law (such as biometric information, voice information, precise location, health-related information, information concerning children, or government identifiers).</p>
            <p className="text-xs sm:text-sm">We do not require customers to provide sensitive information unless it is reasonably necessary for the requested service. Please do not provide sensitive information that is unnecessary for your project. Where applicable law requires consent or other authorization for sensitive information, we will process such information in accordance with those requirements.</p>
          </section>

          {/* 13. HEALTH INFORMATION */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">13.</span>
              Health Information
            </h2>
            <p>Quickupp AI Studio is not generally a healthcare provider and does not represent that it is a HIPAA-covered entity or business associate.</p>
            <p className="text-xs sm:text-sm">If you use our services for healthcare, medical, med spa, wellness, or similar marketing, please do not submit protected health information or other sensitive patient information unless an appropriate agreement and legal basis are in place. Customers are responsible for ensuring that any information they provide to us may lawfully be provided and used for the requested project.</p>
            <p className="text-xs text-slate-400">Certain state laws may impose obligations concerning consumer health data even where HIPAA does not apply. For example, Washington&apos;s My Health My Data Act contains specific privacy-policy and consent requirements concerning consumer health data.</p>
          </section>

          {/* 14. BIOMETRIC INFORMATION */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">14.</span>
              Biometric Information
            </h2>
            <p>Certain AI services may involve voice, facial, or other information that may be considered biometric information under certain state laws.</p>
            <p className="text-xs sm:text-sm">Where applicable, we will implement appropriate notice, consent, retention, deletion, and security practices. Customers must not submit biometric information belonging to another person unless they have the necessary legal authorization.</p>
            <p className="text-xs text-slate-400">Certain states have additional biometric requirements. For example, Illinois&apos; Biometric Information Privacy Act contains specific requirements concerning collection, retention, disclosure, and destruction of biometric information, while Texas law requires notice and consent before capturing covered biometric identifiers for commercial purposes.</p>
          </section>

          {/* 15. DATA RETENTION */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">15.</span>
              Data Retention
            </h2>
            <p>We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including providing services, maintaining business records, customer support, accounting, legal compliance, dispute resolution, fraud prevention, security, and enforcing agreements.</p>
            <p className="text-xs sm:text-sm">Retention periods may vary depending on the type of information and purpose for which it was collected. When information is no longer reasonably necessary, we may delete, anonymize, aggregate, or securely dispose of it, subject to applicable legal, contractual, security, or operational requirements.</p>
          </section>

          {/* 16. DATA SECURITY */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">16.</span>
              Data Security
            </h2>
            <p>We use reasonable administrative, technical, and organizational safeguards designed to protect personal information against unauthorized access, destruction, loss, alteration, disclosure, or misuse.</p>
            <p className="text-xs sm:text-sm">Safeguards may include access controls, authentication, limited employee access, secure transmission, vendor controls, data minimization, monitoring, backups, and security procedures. No internet transmission or storage system can be guaranteed to be completely secure.</p>
            <p className="text-xs text-slate-400">The FTC recommends data minimization, appropriate security, restricted access, and secure disposal of personal information.</p>
          </section>

          {/* 17. YOUR U.S. STATE PRIVACY RIGHTS */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">17.</span>
              Your U.S. State Privacy Rights
            </h2>
            <p>Depending on your state of residence and whether the applicable law covers you and our business, you may have certain rights concerning your personal information, including:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-xs sm:text-sm">
              <li>Right to know/access</li>
              <li>Right to confirm whether information is processed</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to delete information</li>
              <li>Right to obtain a portable copy</li>
              <li>Right to opt out of sale of personal information</li>
              <li>Right to opt out of targeted advertising</li>
              <li>Right to opt out of certain profiling</li>
              <li>Right to limit certain processing of sensitive information</li>
              <li>Right to appeal a privacy-request decision</li>
              <li>Right to non-discrimination for exercising applicable privacy rights</li>
            </ul>
            <p className="text-xs text-slate-400">Not every right applies in every state or to every person.</p>
          </section>

          {/* 18. CALIFORNIA RESIDENTS */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">18.</span>
              California Residents
            </h2>
            <p>California residents may have rights under the California Consumer Privacy Act, as amended by the California Privacy Rights Act (&ldquo;CCPA/CPRA&rdquo;), where applicable, including rights to know, access, delete, correct, opt out of sale or sharing, limit certain uses of sensitive personal information, non-discrimination, and opt out of certain automated decision-making/profiling.</p>
            <p className="text-xs sm:text-sm">California recognizes qualifying universal opt-out preference signals, including Global Privacy Control (&ldquo;GPC&rdquo;), for applicable opt-out requests.</p>
            <p className="text-xs sm:text-sm">
              To submit a privacy request, contact:{" "}
              <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">info@quickuppaistudio.us</a>. We may need to verify your identity before completing certain requests.
            </p>
          </section>

          {/* 19. OTHER STATE PRIVACY LAWS */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">19.</span>
              Other State Privacy Laws
            </h2>
            <p>Depending on applicability, this Privacy Policy is intended to address consumer privacy rights under applicable laws including California, Colorado, Connecticut, Delaware, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, and Virginia privacy acts.</p>
            <p className="text-xs sm:text-sm">These laws have different applicability thresholds, exemptions, definitions, deadlines, and rights. We apply applicable requirements based on the law governing the specific processing activity and consumer.</p>
            <p className="text-xs text-slate-400">For example, Nebraska&apos;s law requires covered controllers to provide a reasonably accessible and clear privacy notice describing categories of data, purposes, rights, sharing, and methods for exercising rights.</p>
          </section>

          {/* 20. HOW TO SUBMIT A PRIVACY REQUEST */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">20.</span>
              How to Submit a Privacy Request
            </h2>
            <p>To exercise an applicable privacy right, contact:</p>
            <div className="bg-surface/40 border border-border/60 rounded-xl p-4 text-xs sm:text-sm space-y-1.5">
              <p><span className="font-semibold text-foreground">Email:</span> <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">info@quickuppaistudio.us</a></p>
              <p><span className="font-semibold text-foreground">Subject line:</span> Privacy Rights Request</p>
              <p className="text-slate-400 mt-2"><strong className="text-foreground">Please include:</strong> Your name, Email address, State of residence, Type of request, and relevant details necessary for us to locate your information.</p>
            </div>
            <p className="text-xs sm:text-sm">We may request information reasonably necessary to verify your identity and protect against fraudulent requests. Where required by applicable law, we will provide instructions for appealing a denied request.</p>
          </section>

          {/* 21. AUTHORIZED AGENTS */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">21.</span>
              Authorized Agents
            </h2>
            <p>Where permitted by applicable law, you may authorize another person to submit a privacy request on your behalf. We may require appropriate documentation establishing the agent&apos;s authority and may take reasonable steps to verify the identity of the individual making the request.</p>
          </section>

          {/* 22. NON-DISCRIMINATION */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">22.</span>
              Non-Discrimination
            </h2>
            <p>We will not discriminate against consumers for exercising privacy rights where prohibited by applicable law. This does not prevent us from applying differences that are expressly permitted by applicable law.</p>
          </section>

          {/* 23. THIRD-PARTY WEBSITES */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">23.</span>
              Third-Party Websites
            </h2>
            <p>Our website may contain links to third-party websites, platforms, payment providers, scheduling services, social networks, or other services. We are not responsible for the privacy practices of third parties. You should review their respective privacy policies before providing information.</p>
          </section>

          {/* 24. INTERNATIONAL DATA TRANSFERS */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">24.</span>
              International Data Transfers
            </h2>
            <p>Quickupp AI Studio operates through a U.S. entity and may work with service providers or personnel located in countries other than the country in which you reside. As a result, personal information may be processed or stored outside your state or country. We take reasonable steps to manage such processing in accordance with applicable law and our contractual obligations.</p>
          </section>

          {/* 25. CHANGES TO THIS PRIVACY POLICY */}
          <section className="space-y-3 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">25.</span>
              Changes to This Privacy Policy
            </h2>
            <p>We may update this Privacy Policy periodically. When we make changes, we will update the &ldquo;Last Updated&rdquo; date. If required by applicable law, we will provide additional notice or obtain consent for material changes.</p>
          </section>

          {/* 26. CONTACT US */}
          <section className="space-y-4 rounded-2xl border border-border/70 bg-surface/20 p-6 sm:p-7">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <span className="font-mono text-neon text-base sm:text-lg">26.</span>
              Contact Us
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <p className="font-semibold text-foreground">Quickupp Softech LLC / Quickupp AI Studio</p>
                <p>Website: <a href="https://quickuppaistudio.us" target="_blank" rel="noopener noreferrer" className="text-neon underline">quickuppaistudio.us</a></p>
                <p>Email: <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">info@quickuppaistudio.us</a></p>
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-foreground">For privacy-related questions or requests:</p>
                <p>Email: <a href="mailto:info@quickuppaistudio.us" className="text-neon underline">info@quickuppaistudio.us</a></p>
                <p>Subject: Privacy Rights Request</p>
              </div>
            </div>
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
                href={`https://wa.me/13027545679?text=${encodeURIComponent(
                  "Hello Quickupp AI Studio Team,\n\nI have a question regarding the Privacy Policy on quickuppaistudio.us.\n\nQuickupp AI Studio USA\nWebsite: https://quickuppaistudio.us\nAddress: 8 The Green, Suite A, Dover, Delaware - 19901, USA\nEmail: info@quickuppaistudio.us",
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

