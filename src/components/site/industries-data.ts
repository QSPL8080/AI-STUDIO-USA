export interface IndustryHeroMetric {
  value: string;
  label: string;
}

export interface IndustryBenefitCard {
  iconName: string;
  title: string;
  description: string;
  formatTag: string;
  ctaText: string;
}

export interface IndustryStorySplit {
  eyebrow: string;
  heading: string;
  description: string;
  statValue: string;
  statLabel: string;
  socialProofBadge: string;
  socialProofSubtext: string;
  image: string;
}

export interface IndustryFormatItem {
  name: string;
  price: string;
  turnaround: string;
  description: string;
  benefits: string[];
  popular?: boolean;
}

export interface IndustryFaq {
  question: string;
  answer: string;
}

export interface IndustryData {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  heroHeading: string;
  heroHighlight: string;
  heroSubheading: string;
  heroMetrics: IndustryHeroMetric[];
  mediaVideoUrl: string;
  mediaPosterUrl: string;
  mediaBadge: string;
  introSubhead: string;
  benefitCards: IndustryBenefitCard[];
  story: IndustryStorySplit;
  featuredFormats: IndustryFormatItem[];
  useCases: string[];
  faqs: IndustryFaq[];
  accentColor?: string;
  relatedSlugs: string[];
}

export const allIndustriesList = [
  {
    slug: "healthcare",
    name: "Healthcare & Clinics",
    shortName: "Healthcare",
    tagline: "Doctor-led educational reels, treatment explainers & clinic growth ads",
    icon: "Stethoscope",
    image: "/images/2nd card.png",
    accent: "from-blue-600 to-cyan-500",
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    shortName: "Professional Services",
    tagline: "High-trust executive avatars, thought leadership & B2B explainers",
    icon: "Briefcase",
    image: "/images/9th card.png",
    accent: "from-indigo-600 to-purple-500",
  },
  {
    slug: "it-saas",
    name: "IT & SaaS",
    shortName: "IT & SaaS",
    tagline: "Product demo animations, feature walkthroughs & user acquisition reels",
    icon: "Cpu",
    image: "/images/8th card.png",
    accent: "from-purple-600 to-pink-500",
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    shortName: "Real Estate",
    tagline: "Cinematic 3D property tours, agent avatars & luxury project reels",
    icon: "Building2",
    image: "/images/1st card.png",
    accent: "from-amber-600 to-orange-500",
  },
  {
    slug: "travel-hospitality",
    name: "Travel & Hospitality",
    shortName: "Travel & Hospitality",
    tagline: "Immersive destination experiences, resort highlights & booking reels",
    icon: "Compass",
    image: "/images/10th card.png",
    accent: "from-teal-600 to-emerald-500",
  },
  {
    slug: "home-services",
    name: "Home Services",
    shortName: "Home Services",
    tagline: "Local contractor authority reels, before/after showcases & quote ads",
    icon: "Wrench",
    image: "/images/11th card.png",
    accent: "from-blue-700 to-indigo-600",
  },
  {
    slug: "education",
    name: "Education & Coaching",
    shortName: "Education",
    tagline: "AI tutor reels, animated curriculum explainers & course enrollment ads",
    icon: "GraduationCap",
    image: "/images/7th card.png",
    accent: "from-violet-600 to-purple-600",
  },
  {
    slug: "ecommerce",
    name: "eCommerce & D2C",
    shortName: "eCommerce",
    tagline: "High-converting UGC ads, unboxings & cinematic product commercials",
    icon: "ShoppingBag",
    image: "/images/3rd card.png",
    accent: "from-pink-600 to-rose-500",
  },
  {
    slug: "interior-design",
    name: "Interior Design & Architecture",
    shortName: "Interior Design",
    tagline: "3D aesthetic walkthroughs, room makeover reels & portfolio showcases",
    icon: "Home",
    image: "/images/5th card.png",
    accent: "from-fuchsia-600 to-violet-500",
  },
];

export const industriesData: Record<string, IndustryData> = {
  healthcare: {
    slug: "healthcare",
    name: "Healthcare & Clinics",
    shortName: "Healthcare",
    tagline: "AI Video Production for Healthcare, Clinics & Medical Practices",
    heroHeading: "Scale Patient Trust & Clinic Bookings with",
    heroHighlight: "Cinematic AI Medical Videos",
    heroSubheading:
      "Transform complex medical treatments, dental procedures, and health advice into engaging 9:16 reels. From doctor-led digital twin updates to authentic AI UGC, scale your patient acquisition without time-consuming filming sessions.",
    heroMetrics: [
      { value: "4.8x", label: "Patient Engagement Rate" },
      { value: "72h", label: "Turnaround From Script to Video" },
      { value: "96%", label: "Treatment Plan Comprehension" },
    ],
    mediaVideoUrl: "/videos/UGC%20Sample%20new.mp4?v=1",
    mediaPosterUrl: "/images/2nd card.png",
    mediaBadge: "Featured Healthcare Production",
    introSubhead:
      "We guide healthcare providers and specialty clinics with clarity — from HIPAA-conscious scripting to viral patient education.",
    benefitCards: [
      {
        iconName: "Stethoscope",
        title: "Patient Education Reels",
        description:
          "Break down complex treatments, dental implant procedures, dermatology routines, and post-op care into crisp, reassuring 60-second visual explainers.",
        formatTag: "AI UGC & Explainer",
        ctaText: "Explore Healthcare UGC ↘",
      },
      {
        iconName: "UserCheck",
        title: "Doctor Digital Twins",
        description:
          "Clone your lead physician or surgeon once to produce unlimited weekly medical tips, clinic announcements, and Q&As without booking studio hours.",
        formatTag: "Digital Twin & Voice",
        ctaText: "Explore Digital Twin ↘",
      },
      {
        iconName: "ShieldCheck",
        title: "Clinic Authority & Trust Ads",
        description:
          "Highlight clinic technology, sterilization standards, and patient transformation testimonials to boost local appointment booking conversion.",
        formatTag: "AI Avatar Presenter",
        ctaText: "Explore Clinic Ads ↘",
      },
    ],
    story: {
      eyebrow: "Trusted Healthcare Video Partner",
      heading: "Experience medical authority, patient reassurance and consistent practice growth",
      description:
        "Quickupp AI Studio crafts medically accurate, visually captivating AI video content that demystifies procedures and builds instant rapport. Our end-to-end service includes medical research, scriptwriting, hyper-realistic avatars, multi-language lip-sync, and social-first 9:16 formatting.",
      statValue: "350+",
      statLabel: "Healthcare & Dental Reels Delivered",
      socialProofBadge: "120+ Medical Clinics Scaled",
      socialProofSubtext: "4.9/5 Provider Satisfaction Rating",
      image: "/images/2nd card.png",
    },
    featuredFormats: [
      {
        name: "AI UGC Medical Creator",
        price: "$79",
        turnaround: "48–72 Hrs",
        description: "Patient perspective reviews, dental routine showcases, and symptom-to-solution reels.",
        benefits: ["Script included", "Authentic creator avatar", "Sound design & captions", "1 revision"],
        popular: true,
      },
      {
        name: "Doctor Digital Twin",
        price: "$179",
        turnaround: "72 Hrs",
        description: "Weekly clinical updates and preventative advice powered by your exact likeness and voice clone.",
        benefits: ["Your approved likeness", "Natural voice clone", "Weekly scalability", "Zero studio time"],
      },
      {
        name: "AI Medical Presenter",
        price: "$99",
        turnaround: "48–72 Hrs",
        description: "Professional medical avatar presenters explaining insurance, treatments, and clinic policies.",
        benefits: ["Professional scrub/lab attire", "Medical script included", "9:16 mobile format", "HD 1080p"],
      },
    ],
    useCases: [
      "Dental Implant & Smile Makeover Explainers",
      "Doctor-Led Preventative Health Tips",
      "Clinic Facility & Sterile Environment Tours",
      "Patient FAQ & Insurance Breakdown Reels",
      "Dermatology Skincare Routine Demonstrations",
      "Post-Surgery Recovery Guidance Videos",
      "New Clinic Branch Launch Promotions",
      "Specialist Physician Introduction Reels",
    ],
    faqs: [
      {
        question: "How do you ensure medical accuracy and HIPAA compliance?",
        answer:
          "All video scripts are created based on your clinic's approved clinical guidelines or materials provided by your team. We never use real patient identifiable health information without explicit written consent.",
      },
      {
        question: "Can we create a digital twin of our chief doctor or dental surgeon?",
        answer:
          "Yes! We provide complete Digital Twin setup including 4K video facial training and AI voice cloning, enabling you to generate recurring patient advice videos in minutes without the doctor needing to step in front of a camera again.",
      },
      {
        question: "What video formats perform best for healthcare practices on social media?",
        answer:
          "Problem-to-solution AI UGC reels and 60-second doctor avatar explainers achieve the highest watch time and comment engagement on Instagram Reels and TikTok.",
      },
      {
        question: "Can videos be produced in multiple languages for diverse patient demographics?",
        answer:
          "Absolutely. Our AI engine supports natural voiceovers and accurate lip-sync in 30+ languages, allowing you to reach Spanish, Mandarin, Hindi, and other language communities effortlessly.",
      },
    ],
    relatedSlugs: ["professional-services", "home-services", "education"],
  },

  "professional-services": {
    slug: "professional-services",
    name: "Professional Services",
    shortName: "Professional Services",
    tagline: "AI Video Production for Legal, Financial, Consulting & Corporate Advisory",
    heroHeading: "Elevate Executive Authority & Client Acquisition with",
    heroHighlight: "AI-Powered Advisory Reels",
    heroSubheading:
      "Position your firm as the definitive industry authority. Produce high-end executive thought leadership, legal case breakdown videos, and wealth advisory explainers in rapid 48-72h sprints.",
    heroMetrics: [
      { value: "3.9x", label: "Qualified Inbound Leads" },
      { value: "48h", label: "Rapid Production Turnaround" },
      { value: "98%", label: "Executive Brand Retention" },
    ],
    mediaVideoUrl: "/videos/Avtar%20Sample%20new.mp4?v=1",
    mediaPosterUrl: "/images/9th card.png",
    mediaBadge: "Featured Advisory Production",
    introSubhead:
      "We help law firms, financial advisors, and consultancy practices dominate modern digital channels with polished, high-trust video assets.",
    benefitCards: [
      {
        iconName: "Briefcase",
        title: "Executive Thought Leadership",
        description:
          "Translate intricate regulatory changes, tax strategies, and corporate governance updates into concise, engaging executive perspectives.",
        formatTag: "AI Digital Twin & Avatar",
        ctaText: "Explore Executive Reels ↘",
      },
      {
        iconName: "FileText",
        title: "Case Studies & Client Proof",
        description:
          "Showcase client outcomes, transaction milestones, and advisory wins through animated metrics and professional voiceovers.",
        formatTag: "Hyper-Realistic Commercial",
        ctaText: "Explore Case Reels ↘",
      },
      {
        iconName: "Scale",
        title: "Consultation Funnel Ads",
        description:
          "High-converting 9:16 paid ads built specifically to drive high-net-worth calls, strategy bookings, and inbound corporate RFPs.",
        formatTag: "Presenter Spokesperson",
        ctaText: "Explore Advisory Ads ↘",
      },
    ],
    story: {
      eyebrow: "Trusted Corporate Advisory Partner",
      heading: "Experience sophisticated visual communication and steady institutional growth",
      description:
        "High-stakes professional firms cannot compromise on presentation. Quickupp AI Studio combines corporate-grade scripting with photorealistic digital avatars and premium kinetic typography to deliver videos that command respect from corporate boards to private clients.",
      statValue: "420+",
      statLabel: "Advisory & Corporate Reels Delivered",
      socialProofBadge: "85+ Legal & Financial Firms Scaled",
      socialProofSubtext: "100% Brand Consistency Guarantee",
      image: "/images/9th card.png",
    },
    featuredFormats: [
      {
        name: "Executive AI Avatar",
        price: "$99",
        turnaround: "48–72 Hrs",
        description: "Sharp suited professional avatars delivering legal, financial, and management insights.",
        benefits: ["Corporate script included", "Custom studio background", "B2B motion graphics", "1 revision"],
        popular: true,
      },
      {
        name: "Partner Digital Twin",
        price: "$179",
        turnaround: "72 Hrs",
        description: "Scale the personal brand of your managing partners without taking time away from billable hours.",
        benefits: ["Exact voice matching", "High-retention delivery", "Bi-weekly video pipeline", "Full commercial rights"],
      },
      {
        name: "Animated Infographic Reel",
        price: "$79",
        turnaround: "48 Hrs",
        description: "Visual breakdown of complex market reports, tax tables, and compliance checklists.",
        benefits: ["Custom motion charts", "Premium sound design", "Full HD format", "Fast 48h turnaround"],
      },
    ],
    useCases: [
      "Tax Planning & Wealth Management Insights",
      "Corporate Law & Regulatory Update Summaries",
      "Executive Onboarding & Training Overviews",
      "M&A and Transaction Milestone Announcements",
      "Consulting Framework & Methodology Explainers",
      "B2B LinkedIn Thought Leadership Reels",
      "Free Consultation Call Booking Ads",
      "Client Testimonial & Outcome Showcases",
    ],
    faqs: [
      {
        question: "How do you maintain the refined tone required for luxury or corporate advisory?",
        answer:
          "Our copywriters specialize in B2B and institutional messaging. Every script is meticulously drafted to uphold executive sophistication, regulatory compliance, and brand prestige.",
      },
      {
        question: "Can our partners review and edit scripts before video rendering?",
        answer:
          "Yes. Full script approval is built into our streamlined workflow. Video generation only commences once your team has reviewed and signed off on the copy.",
      },
      {
        question: "Can these videos be formatted for LinkedIn and YouTube as well as 9:16?",
        answer:
          "While our standard package is optimized for 9:16 mobile feeds (Instagram, Shorts, LinkedIn vertical), we can easily provide 16:9 widescreen or 1:1 square cuts upon request.",
      },
      {
        question: "How quickly can we scale from 1 video to a weekly content pipeline?",
        answer:
          "With our Growth and Enterprise packages, we deliver 10 to 30 custom videos every month on predictable schedules, giving your firm a continuous social presence.",
      },
    ],
    relatedSlugs: ["it-saas", "healthcare", "real-estate"],
  },

  "it-saas": {
    slug: "it-saas",
    name: "IT & SaaS",
    shortName: "IT & SaaS",
    tagline: "AI Video Production for SaaS Products, Software Platforms & Tech Startups",
    heroHeading: "Accelerate Product Signups & Feature Adoption with",
    heroHighlight: "High-Velocity AI Tech Reels",
    heroSubheading:
      "Turn complex software workflows, API capabilities, and product updates into viral, high-converting video assets. Boost trial signups, reduce onboarding churn, and scale your user acquisition.",
    heroMetrics: [
      { value: "5.2x", label: "Increase in Trial Signups" },
      { value: "65%", label: "Lower Video Production CAC" },
      { value: "72h", label: "Sprint Delivery for Launches" },
    ],
    mediaVideoUrl: "/videos/Cartoon%20Sample.mp4?v=2",
    mediaPosterUrl: "/images/8th card.png",
    mediaBadge: "Featured SaaS Production",
    introSubhead:
      "We help engineering-led software companies convert technical brilliance into frictionless, high-converting visual stories.",
    benefitCards: [
      {
        iconName: "Cpu",
        title: "Product Feature Explainers",
        description:
          "Highlight newly shipped features, dashboard workflows, and AI integrations with dynamic animated screen simulations and punchy voiceovers.",
        formatTag: "AI Cartoon & Animated",
        ctaText: "Explore SaaS Explainers ↘",
      },
      {
        iconName: "Zap",
        title: "Problem → Solution UGC Ads",
        description:
          "Show real-world workflow frustration transformed into instant productivity through your software tool.",
        formatTag: "AI Creator UGC",
        ctaText: "Explore SaaS Ads ↘",
      },
      {
        iconName: "Sparkles",
        title: "Founder Product Updates",
        description:
          "Release regular product updates and release notes presented by a photorealistic AI clone of your founder or product lead.",
        formatTag: "Digital Twin & Avatar",
        ctaText: "Explore Founder Clones ↘",
      },
    ],
    story: {
      eyebrow: "Trusted Tech Growth Partner",
      heading: "Experience agile video creation tailored for fast-moving software roadmaps",
      description:
        "In SaaS, speed to market is everything. Quickupp AI Studio eliminates the weeks spent coordinating studio agencies, screen recorders, and voice talent. We turn your product release notes into high-impact launch videos in 48-72 hours.",
      statValue: "680+",
      statLabel: "SaaS & Tech Videos Delivered",
      socialProofBadge: "210+ Software Startups Scaled",
      socialProofSubtext: "4.8x Average Return on Ad Spend",
      image: "/images/8th card.png",
    },
    featuredFormats: [
      {
        name: "AI Cartoon & 3D Explainer",
        price: "$79",
        turnaround: "48–72 Hrs",
        description: "Engaging animated characters navigating software pain points with delightful visual metaphors.",
        benefits: ["Concept & storyboard", "Custom character animation", "Punchy SFX & music", "1 revision"],
        popular: true,
      },
      {
        name: "AI Creator Software Demo",
        price: "$79",
        turnaround: "48 Hrs",
        description: "Authentic tech creator reaction videos reviewing your SaaS interface and key value props.",
        benefits: ["Creator persona selection", "Screen integration", "Subtitles & hooks", "9:16 ad ready"],
      },
      {
        name: "Hyper-Realistic Tech Ad",
        price: "$149",
        turnaround: "72 Hrs",
        description: "Cinematic, futuristic commercial style visuals designed for high-budget social ad campaigns.",
        benefits: ["CGI futuristic aesthetics", "Multi-layer sound design", "Ultra 1080p rendering", "Multi-cut formats"],
      },
    ],
    useCases: [
      "New Feature & Major Release Announcements",
      "Software Problem → Solution Direct Response Ads",
      "Interactive Dashboard & Workflow Walkthroughs",
      "Founder Roadmap & Vision Update Reels",
      "Competitor Comparison & Migration Explainers",
      "Self-Serve Onboarding Micro-Tutorials",
      "Product Hunt & Launch Campaign Teasers",
      "Customer ROI & Metric Breakthrough Spotlights",
    ],
    faqs: [
      {
        question: "Can you include real screenshots and UI mockups from our app?",
        answer:
          "Yes! You can provide screenshots, Figma links, or screen recordings, and we seamlessly blend them with our AI avatars, animated elements, and custom transitions.",
      },
      {
        question: "Do you write technical scripts that sound natural to developers and founders?",
        answer:
          "Yes. Our creative team has deep tech domain expertise, ensuring your scripts strike the perfect balance between technical accuracy and high-converting marketing hooks.",
      },
      {
        question: "Can we use these videos for Paid TikTok, Meta Ads, and LinkedIn Ads?",
        answer:
          "Yes. All videos are rendered in crisp 9:16 with high-contrast subtitles, energetic sound effects, and strong CTA bumpers optimized for social ad performance.",
      },
      {
        question: "How do revisions work for tech product videos?",
        answer:
          "Every order includes 1 complete revision based on the approved script. We ensure character movements, audio sync, and graphic callouts align exactly with your expectations.",
      },
    ],
    relatedSlugs: ["professional-services", "education", "ecommerce"],
  },

  "real-estate": {
    slug: "real-estate",
    name: "Real Estate & Development",
    shortName: "Real Estate",
    tagline: "AI Video Production for Real Estate Agents, Brokers & Property Developers",
    heroHeading: "Sell Luxury Properties & Attract High-Value Buyers with",
    heroHighlight: "Cinematic AI Real Estate Reels",
    heroSubheading:
      "Transform architectural renders, floor plans, and listing photos into breathtaking 3D walkthroughs and presenter-led property showcase reels that command buyer attention.",
    heroMetrics: [
      { value: "4.5x", label: "Property Inquiry Surge" },
      { value: "72h", label: "Listing-to-Video Speed" },
      { value: "$180M+", label: "Property Value Promoted" },
    ],
    mediaVideoUrl: "/videos/Portfolio%203.mp4",
    mediaPosterUrl: "/images/1st card.png",
    mediaBadge: "Featured Luxury Real Estate Showcase",
    introSubhead:
      "We empower top-producing real estate brokers and luxury developers to market properties with world-class cinematic video.",
    benefitCards: [
      {
        iconName: "Building2",
        title: "Virtual Property Showcases",
        description:
          "Generate ultra-fluid 3D flythroughs and cinematic room transitions from 2D photos or architectural renders with luxury studio lighting.",
        formatTag: "Hyper-Realistic AI",
        ctaText: "Explore Property Tours ↘",
      },
      {
        iconName: "UserCheck",
        title: "Realtor AI Presenter Clones",
        description:
          "Keep your agency top-of-mind by cloning your lead broker to host listing walkthroughs and local market updates 24/7.",
        formatTag: "Digital Twin & Avatar",
        ctaText: "Explore Agent Clones ↘",
      },
      {
        iconName: "Compass",
        title: "Neighborhood & Lifestyle Reels",
        description:
          "Showcase nearby gourmet dining, private schools, and luxury amenities to paint an irresistible lifestyle for prospective buyers.",
        formatTag: "AI UGC & Cinematics",
        ctaText: "Explore Lifestyle Ads ↘",
      },
    ],
    story: {
      eyebrow: "Trusted Real Estate Studio",
      heading: "Experience cinematic property storytelling that accelerates listings to closed deals",
      description:
        "High-net-worth buyers expect immersive visual experiences. Quickupp AI Studio crafts broadcast-quality reels with hyper-realistic textures, ambient luxury soundscapes, and magnetic presenter avatars that turn casual scrollers into committed showings.",
      statValue: "$180M+",
      statLabel: "Total Property Inventory Marketed",
      socialProofBadge: "150+ Agencies & Developers",
      socialProofSubtext: "98% Positive Buyer Feedback",
      image: "/images/1st card.png",
    },
    featuredFormats: [
      {
        name: "Hyper-Realistic Property Film",
        price: "$149",
        turnaround: "72 Hrs",
        description: "Cinematic lighting, drone perspective simulations, and architectural walkthroughs.",
        benefits: ["3D environment rendering", "Ambient luxury soundtrack", "Property spec callouts", "1 revision"],
        popular: true,
      },
      {
        name: "Broker AI Digital Twin",
        price: "$179",
        turnaround: "72 Hrs",
        description: "Personalized agent reels presenting new MLS listings and weekly local market trends.",
        benefits: ["Your likeness & voice clone", "Instant listing updates", "Local market authority", "Zero shooting hassle"],
      },
      {
        name: "AI Avatar Listing Tour",
        price: "$99",
        turnaround: "48–72 Hrs",
        description: "Professional presenter avatar guiding buyers through property highlights, layout, and amenities.",
        benefits: ["Tailored realtor script", "Floorplan graphic overlays", "Dynamic text popups", "Multi-language audio"],
      },
    ],
    useCases: [
      "Luxury Villa & Penthouse Virtual Walkthroughs",
      "Off-Plan Developer Launch & Pre-Construction Teasers",
      "Monthly Neighborhood Market Update Reports",
      "Open House Event Invitations & RSVP Boosters",
      "Commercial Real Estate & Office Space Tours",
      "First-Time Homebuyer Tip & Financing Explainer Reels",
      "Just Listed & Just Sold Showcase Campaigns",
      "Brokerage Brand Awareness & Recruiting Reels",
    ],
    faqs: [
      {
        question: "Can you create video tours from architectural renders and 2D floorplans?",
        answer:
          "Yes! Our hyper-realistic AI pipeline can synthesize realistic motion and 3D depth from architectural blueprints, interior renders, and still photos.",
      },
      {
        question: "How do agent digital twins work for multiple listings?",
        answer:
          "Once we train your digital twin, you simply submit the listing details and photos. We generate a custom video of you presenting the property in under 48 hours.",
      },
      {
        question: "Can you add custom agency branding, contact info, and MLS badges?",
        answer:
          "Yes, all videos include your agency logo, broker license details, phone numbers, and custom color accents.",
      },
      {
        question: "Are these videos formatted for Instagram Reels and TikTok ads?",
        answer:
          "Yes, every reel is delivered in 9:16 vertical resolution, optimized for maximum retention with viral audio pacing and subtitles.",
      },
    ],
    relatedSlugs: ["interior-design", "travel-hospitality", "professional-services"],
  },

  "travel-hospitality": {
    slug: "travel-hospitality",
    name: "Travel & Hospitality",
    shortName: "Travel & Hospitality",
    tagline: "AI Video Production for Resorts, Boutique Hotels, Airlines & Tour Operators",
    heroHeading: "Ignite Wanderlust & Boost Direct Bookings with",
    heroHighlight: "Immersive AI Travel Reels",
    heroSubheading:
      "Captivate global travelers with cinematic destination visuals, virtual resort tours, and authentic creator-style travel reviews. Elevate your direct bookings without organizing costly overseas shoots.",
    heroMetrics: [
      { value: "6.1x", label: "Social Video Shares" },
      { value: "48h", label: "Seasonal Campaign Turnaround" },
      { value: "32%", label: "Direct Booking Lift" },
    ],
    mediaVideoUrl: "/videos/Portfolio%204.mp4",
    mediaPosterUrl: "/images/10th card.png",
    mediaBadge: "Featured Hospitality Showcase",
    introSubhead:
      "We help luxury resorts, boutique travel brands, and adventure operators turn dream destinations into booked itineraries.",
    benefitCards: [
      {
        iconName: "Compass",
        title: "Destination Immersion Reels",
        description:
          "Transport travelers into sun-drenched beaches, scenic alpine retreats, and vibrant cultural landmarks with cinematic AI rendering.",
        formatTag: "Hyper-Realistic AI",
        ctaText: "Explore Travel Films ↘",
      },
      {
        iconName: "ShoppingBag",
        title: "Creator Travel UGC",
        description:
          "Deliver authentic traveler reviews, room tour vlogs, and itinerary recommendations that spark immediate holiday bookings.",
        formatTag: "AI Creator UGC",
        ctaText: "Explore Travel UGC ↘",
      },
      {
        iconName: "Sparkles",
        title: "Hotel Concierge Avatars",
        description:
          "Deploy multilingual AI concierges presenting dining menus, spa packages, and exclusive seasonal resort offers.",
        formatTag: "AI Avatar Presenter",
        ctaText: "Explore Concierge Reels ↘",
      },
    ],
    story: {
      eyebrow: "Trusted Hospitality Media Partner",
      heading: "Experience sensory destination storytelling that fills rooms all year round",
      description:
        "Travel decisions are purely emotional. Quickupp AI Studio combines breathtaking environmental generation with authentic creator voices and immersive sound design, creating irresistible reels that make audiences stop scrolling and book their next getaway.",
      statValue: "520+",
      statLabel: "Travel & Hospitality Reels Produced",
      socialProofBadge: "90+ Resorts & Tour Operators",
      socialProofSubtext: "4.9/5 Guest Engagement Rating",
      image: "/images/10th card.png",
    },
    featuredFormats: [
      {
        name: "AI Travel Creator UGC",
        price: "$79",
        turnaround: "48–72 Hrs",
        description: "Travel blogger style reviews, packing routines, and top-5 hidden gem itinerary reels.",
        benefits: ["Travel creator avatar", "Dynamic lifestyle audio", "Captions & location tags", "1 revision"],
        popular: true,
      },
      {
        name: "Hyper-Realistic Resort Film",
        price: "$149",
        turnaround: "72 Hrs",
        description: "Cinematic drone shots, poolside golden hour ambiance, and luxury suite showcases.",
        benefits: ["4K HDR visual depth", "Bespoke ambient audio", "Direct booking CTA", "Full commercial license"],
      },
      {
        name: "Multilingual AI Concierge",
        price: "$99",
        turnaround: "48–72 Hrs",
        description: "Present hotel amenities and dining experiences across English, French, German, Spanish, and Arabic.",
        benefits: ["Multilingual lip-sync", "Staff attire options", "Amenity callouts", "Seasonal updates"],
      },
    ],
    useCases: [
      "Luxury Resort Suite & Infinity Pool Showcase",
      "Weekend Getaway & Itinerary Recommendation Vlogs",
      "Seasonal Holiday Discount & Flash Sale Promos",
      "Fine Dining & Chef's Special Menu Spotlights",
      "Wellness Retreat & Spa Experience Walkthroughs",
      "Adventure Tour & Excursion Experience Teasers",
      "Direct Booking vs OTA Price Advantage Explainers",
      "Local Culture & Nightlife Guide Reels",
    ],
    faqs: [
      {
        question: "Can you create videos featuring our actual resort photos and pool views?",
        answer:
          "Yes! We integrate your real property photography and video clips with AI enhancement, camera motion, and creator avatars.",
      },
      {
        question: "Can we produce seasonal campaigns (Summer, Winter, Holiday) quickly?",
        answer:
          "Yes. Our rapid 48-72h production model allows you to launch timely holiday campaigns without weeks of advance planning.",
      },
      {
        question: "How do you handle multi-language content for international guests?",
        answer:
          "We can generate the same video in 10+ different languages with flawless native accents and lip-sync, saving thousands on localization.",
      },
      {
        question: "Can we order multiple reels for different amenities (Spa, Dining, Rooms)?",
        answer:
          "Yes, our Growth and Scale packages let you produce 10 to 15 distinct reels covering every facet of your hospitality property.",
      },
    ],
    relatedSlugs: ["real-estate", "interior-design", "ecommerce"],
  },

  "home-services": {
    slug: "home-services",
    name: "Home Services & Contractors",
    shortName: "Home Services",
    tagline: "AI Video Production for Roofing, Solar, HVAC, Plumbing & Remodeling",
    heroHeading: "Dominate Local Markets & Fill Your Project Schedule with",
    heroHighlight: "High-Trust Contractor Reels",
    heroSubheading:
      "Transform homeowner skepticism into eager estimate requests. Produce authentic before/after showcases, emergency repair explainers, and local authority ads that generate exclusive quote leads.",
    heroMetrics: [
      { value: "3.8x", label: "More Estimate Requests" },
      { value: "48h", label: "Fast Video Ad Turnaround" },
      { value: "45%", label: "Lower Cost Per Lead" },
    ],
    mediaVideoUrl: "/videos/Portfolio%202.mp4",
    mediaPosterUrl: "/images/11th card.png",
    mediaBadge: "Featured Home Services Campaign",
    introSubhead:
      "We help residential service pros, roofing contractors, and solar installers win more local jobs with high-trust video marketing.",
    benefitCards: [
      {
        iconName: "Wrench",
        title: "Before & After Transformations",
        description:
          "Showcase dramatic roof replacements, kitchen renovations, and HVAC upgrades with high-energy visual reveals.",
        formatTag: "AI Creator & Motion",
        ctaText: "Explore Transformation Reels ↘",
      },
      {
        iconName: "ShieldCheck",
        title: "Homeowner Trust & Warning Ads",
        description:
          "Educate homeowners on subtle warning signs (roof leaks, AC failure, electrical risks) before emergencies strike.",
        formatTag: "AI Presenter Spokesperson",
        ctaText: "Explore Warning Ads ↘",
      },
      {
        iconName: "Zap",
        title: "Seasonal Promo & Rebate Reels",
        description:
          "Promote government tax credits, seasonal tune-up discounts, and 0% financing options to spur immediate phone calls.",
        formatTag: "AI UGC Direct Response",
        ctaText: "Explore Offer Ads ↘",
      },
    ],
    story: {
      eyebrow: "Trusted Contractor Media Partner",
      heading: "Experience local authority and a consistent pipeline of high-margin homeowner jobs",
      description:
        "Homeowners buy from contractors they trust. Quickupp AI Studio crafts relatable, authentic video ads that highlight your licensing, craftsmanship, and verified customer reviews, turning casual local scrollers into confirmed in-home estimates.",
      statValue: "390+",
      statLabel: "Contractor & Trade Videos Produced",
      socialProofBadge: "110+ Home Service Companies",
      socialProofSubtext: "4.8/5 Client Lead Quality Rating",
      image: "/images/11th card.png",
    },
    featuredFormats: [
      {
        name: "Homeowner Problem → Solution UGC",
        price: "$79",
        turnaround: "48–72 Hrs",
        description: "Relatable homeowner avatar sharing relief after your company solved their emergency repair.",
        benefits: ["Direct response script", "Local hook customization", "Subtitles & sound effects", "1 revision"],
        popular: true,
      },
      {
        name: "Contractor AI Spokesperson",
        price: "$99",
        turnaround: "48–72 Hrs",
        description: "Friendly, professional contractor avatar explaining warranties, financing, and project timelines.",
        benefits: ["Branded workwear styling", "Service guarantee callouts", "Clear phone/quote CTA", "HD vertical format"],
      },
      {
        name: "Animated Rebate & Financing Explainer",
        price: "$79",
        turnaround: "48 Hrs",
        description: "Engaging animated walkthrough of solar incentives, HVAC rebates, and affordable payment plans.",
        benefits: ["Simple math animations", "High conversion pacing", "Instant 48h delivery", "Ad platform ready"],
      },
    ],
    useCases: [
      "Roof Storm Damage Inspection Free Offer Ads",
      "Summer AC & Winter Heating Tune-Up Promos",
      "Solar Panel Government Tax Credit Explainers",
      "Kitchen & Bathroom Remodel Transformation Reveals",
      "Emergency Plumbing & Water Heater Repair Reels",
      "Financing & Low Monthly Payment Breakdown Videos",
      "Contractor License, Insurance & Trust Proof Reels",
      "Local Customer Testimonial & Review Highlights",
    ],
    faqs: [
      {
        question: "Can these videos target specific cities and zip codes?",
        answer:
          "Yes! We tailor the script hooks and text overlays to mention your specific city, county, or service territory for maximum local resonance.",
      },
      {
        question: "How do these video ads perform on Meta (Facebook/Instagram) & TikTok?",
        answer:
          "Home services UGC video ads typically generate 40-60% cheaper cost-per-lead compared to static image ads because they build emotional rapport and trust.",
      },
      {
        question: "Can we provide photos of our past jobs to include in the video?",
        answer:
          "Absolutely. We incorporate your real job site photos into dynamic before-and-after split screens and motion graphics.",
      },
      {
        question: "How fast can we get an ad campaign live for an incoming storm season?",
        answer:
          "With our standard 48-72h delivery, you can have high-converting storm response ads live before the weather clears.",
      },
    ],
    relatedSlugs: ["real-estate", "professional-services", "interior-design"],
  },

  education: {
    slug: "education",
    name: "Education & Coaching",
    shortName: "Education",
    tagline: "AI Video Production for Online Courses, Coaches, Universities & EdTech",
    heroHeading: "Scale Student Enrollments & Course Retention with",
    heroHighlight: "Engaging AI Learning Reels",
    heroSubheading:
      "Transform curriculum concepts, masterclass promotions, and student breakthroughs into viral bite-sized lessons. Deliver world-class animated lessons and creator-led enrollment ads at scale.",
    heroMetrics: [
      { value: "4.7x", label: "Course Enrollment Lift" },
      { value: "85%", label: "Lesson Completion Rate" },
      { value: "48h", label: "Curriculum Turnaround" },
    ],
    mediaVideoUrl: "/videos/Avtar%20Sample%20new.mp4?v=1",
    mediaPosterUrl: "/images/7th card.png",
    mediaBadge: "Featured EdTech Showcase",
    introSubhead:
      "We help edtech founders, online academies, and executive coaches turn complex knowledge into addictive, high-retention video lessons.",
    benefitCards: [
      {
        iconName: "GraduationCap",
        title: "Bite-Sized Lesson Reels",
        description:
          "Break down complex academic theories, language drills, or coding fundamentals into punchy 60-second animated micro-lessons.",
        formatTag: "AI Cartoon & Animated",
        ctaText: "Explore Animated Lessons ↘",
      },
      {
        iconName: "UserCheck",
        title: "Instructor AI Digital Twins",
        description:
          "Clone your head instructor to record hundreds of modular course lessons, Q&A responses, and weekly student updates effortlessly.",
        formatTag: "Digital Twin & Voice",
        ctaText: "Explore Instructor Clones ↘",
      },
      {
        iconName: "Sparkles",
        title: "Student Enrollment Ads",
        description:
          "High-converting student transformation reels that showcase career breakthroughs, salary increases, and certificate prestige.",
        formatTag: "AI UGC Creator",
        ctaText: "Explore Enrollment Ads ↘",
      },
    ],
    story: {
      eyebrow: "Trusted EdTech Media Partner",
      heading: "Experience pedagogical clarity and explosive enrollment growth",
      description:
        "Attention spans are shorter than ever. Quickupp AI Studio combines cognitive visual storytelling with charismatic AI presenters and kinetic motion graphics, ensuring your educational content educates, entertains, and converts scrollers into committed students.",
      statValue: "750+",
      statLabel: "Educational & Coaching Reels Delivered",
      socialProofBadge: "180+ Academies & Coaches",
      socialProofSubtext: "4.9/5 Student Rating",
      image: "/images/7th card.png",
    },
    featuredFormats: [
      {
        name: "AI Cartoon Explainer Lesson",
        price: "$79",
        turnaround: "48–72 Hrs",
        description: "Engaging animated characters breaking down historical, scientific, or business concepts.",
        benefits: ["Educational concept script", "Engaging visual diagrams", "Lively sound effects", "1 revision"],
        popular: true,
      },
      {
        name: "Instructor AI Digital Twin",
        price: "$179",
        turnaround: "72 Hrs",
        description: "Scale course production by generating video lessons directly from your written curriculum.",
        benefits: ["Instructor likeness clone", "Natural voice match", "Unlimited lesson scalability", "HD export"],
      },
      {
        name: "Student Transformation UGC",
        price: "$79",
        turnaround: "48 Hrs",
        description: "Authentic student testimonial reels sharing career breakthroughs and course review highlights.",
        benefits: ["Relatable student avatar", "Proof screenshot callouts", "Course CTA bumper", "9:16 vertical"],
      },
    ],
    useCases: [
      "Micro-Lesson Tutorials & Skill Breakdowns",
      "Free Masterclass & Webinar Registration Reels",
      "Course Curriculum Overview & Syllabus Teasers",
      "Student Career Transformation Testimonials",
      "Language Pronunciation & Vocabulary Shorts",
      "Coding & Software Tool Micro-Tutorials",
      "Instructor Introduction & Personal Branding Reels",
      "Limited-Time Early Bird Discount Promotions",
    ],
    faqs: [
      {
        question: "Can we build an entire 20-lesson course module with AI avatars?",
        answer:
          "Yes! Many academies use our Growth and Enterprise packages to generate entire video curriculums in days instead of spending months in a studio.",
      },
      {
        question: "Can the videos be rendered with dual-language subtitles?",
        answer:
          "Yes, we can provide animated on-screen subtitles in English, Spanish, French, German, and 25+ other languages for international students.",
      },
      {
        question: "How do you ensure the tone matches academic or executive coaching standards?",
        answer:
          "We calibrate the script, pacing, avatar styling, and background environment to perfectly match your target audience (K-12, university, or corporate executive).",
      },
      {
        question: "Do we retain full commercial ownership of all video assets?",
        answer:
          "Yes, you receive 100% full commercial rights to use the videos inside your paid courses, YouTube channels, and ad campaigns.",
      },
    ],
    relatedSlugs: ["it-saas", "professional-services", "healthcare"],
  },

  ecommerce: {
    slug: "ecommerce",
    name: "eCommerce & D2C Brands",
    shortName: "eCommerce",
    tagline: "AI Video Production for D2C Brands, Shopify Stores & Amazon Sellers",
    heroHeading: "Supercharge ROAS & Scale Viral Product Sales with",
    heroHighlight: "High-Converting AI UGC Ads",
    heroSubheading:
      "Generate high-energy creator unboxings, problem→solution hooks, and 3D product commercials without shipping physical samples or negotiating expensive creator contracts.",
    heroMetrics: [
      { value: "5.4x", label: "Average Campaign ROAS" },
      { value: "48h", label: "Delivery Per Video Creative" },
      { value: "-52%", label: "Customer Acquisition Cost" },
    ],
    mediaVideoUrl: "/videos/Portfolio%201.mp4",
    mediaPosterUrl: "/images/3rd card.png",
    mediaBadge: "Featured D2C Brand Campaign",
    introSubhead:
      "We help direct-to-consumer brands and fast-scaling Shopify merchants pump out high-converting video ad creatives every single week.",
    benefitCards: [
      {
        iconName: "ShoppingBag",
        title: "AI UGC Product Reviews",
        description:
          "Deploy diverse, hyper-authentic creator avatars demonstrating product benefits, morning routines, and unboxing reactions.",
        formatTag: "AI Creator UGC",
        ctaText: "Explore D2C UGC ↘",
      },
      {
        iconName: "Sparkles",
        title: "Hyper-Realistic Commercials",
        description:
          "Produce luxury studio commercial spots with macro product angles, dynamic particle simulations, and 3D liquid physics.",
        formatTag: "Hyper-Realistic 3D",
        ctaText: "Explore 3D Commercials ↘",
      },
      {
        iconName: "Zap",
        title: "Viral TikTok & Reel Hooks",
        description:
          "Test 10+ hook variations per product to discover the winning creative angle and scale your ad spend profitably.",
        formatTag: "Direct Response Video",
        ctaText: "Explore Hook Variations ↘",
      },
    ],
    story: {
      eyebrow: "Trusted D2C Creative Engine",
      heading: "Experience creative velocity that beats ad fatigue and scales revenue",
      description:
        "Modern eCommerce algorithms demand endless fresh creative iterations. Quickupp AI Studio gives you a scalable video production pipeline that outputs 10 to 30 high-converting reels every month, cutting your production costs by up to 80% while boosting ROAS.",
      statValue: "1,200+",
      statLabel: "eCommerce & D2C Video Ads Produced",
      socialProofBadge: "340+ D2C Brands Scaled",
      socialProofSubtext: "5.4x Average Verified ROAS",
      image: "/images/3rd card.png",
    },
    featuredFormats: [
      {
        name: "AI UGC Direct Response Ad",
        price: "$79",
        turnaround: "48–72 Hrs",
        description: "Problem → Solution hook, product demonstration, and urgent discount CTA.",
        benefits: ["Direct response script", "Viral hook variations", "Subtitles & sound effects", "1 revision"],
        popular: true,
      },
      {
        name: "Hyper-Realistic 3D Product Ad",
        price: "$149",
        turnaround: "72 Hrs",
        description: "Cinematic commercial grade studio lighting, fluid motion, and macro luxury closeups.",
        benefits: ["3D product rendering", "Studio lighting physics", "Commercial sound design", "Full HD export"],
      },
      {
        name: "Founder Brand Story Reel",
        price: "$179",
        turnaround: "72 Hrs",
        description: "Showcase the origin story, craftsmanship, and mission behind your brand through founder avatars.",
        benefits: ["Founder likeness clone", "Emotional storytelling", "Multi-channel format", "High retention"],
      },
    ],
    useCases: [
      "Product Unboxing & First Impression Reactions",
      "Problem → Solution Direct Response Ad Variations",
      "Morning / Evening Daily Routine Product Showcases",
      "Competitor Breakdown & 'Why We Switched' Reels",
      "Seasonal Flash Sale & Black Friday Promotional Ads",
      "Macro Luxury Commercials for Cosmetics & Jewellery",
      "TikTok Organic Style 'POV' & Relatable Skit Videos",
      "Post-Purchase Thank You & Unboxing Guidance",
    ],
    faqs: [
      {
        question: "Do I need to ship physical product samples to your studio?",
        answer:
          "No! You can simply upload clean product photos, packaging artwork, or 3D CAD files. Our AI engine places your product seamlessly into realistic lifestyle scenes.",
      },
      {
        question: "Can we test multiple different creator demographics for the same product?",
        answer:
          "Yes! We can render the exact same script across multiple AI creator ages, ethnicities, and genders to find which demographic yields the highest conversion for your brand.",
      },
      {
        question: "How quickly can we get 10 variations for a TikTok / Meta ad test?",
        answer:
          "With our Growth package (10 videos), you receive all 10 creatives within 7 days, ready to plug directly into your Meta Ads Manager or TikTok Ads account.",
      },
      {
        question: "Can you include on-screen review screenshots and trust badges?",
        answer:
          "Yes, we can include Trustpilot ratings, press mentions (Forbes, Vogue, etc.), customer quote popups, and custom discount code overlays.",
      },
    ],
    relatedSlugs: ["interior-design", "healthcare", "it-saas"],
  },

  "interior-design": {
    slug: "interior-design",
    name: "Interior Design & Architecture",
    shortName: "Interior Design",
    tagline: "AI Video Production for Interior Designers, Architects & Luxury Home Brands",
    heroHeading: "Showcase Aesthetic Spaces & Attract Luxury Clients with",
    heroHighlight: "Cinematic AI Design Reels",
    heroSubheading:
      "Transform 2D blueprints, mood boards, and render stills into breathtaking cinematic room walkthroughs, lighting transitions, and high-converting designer portfolio reels.",
    heroMetrics: [
      { value: "4.9x", label: "Higher Portfolio Engagement" },
      { value: "72h", label: "Project Render to Video" },
      { value: "100%", label: "Photorealistic Aesthetic" },
    ],
    mediaVideoUrl: "/videos/Hyper%20Realistic%20Sample.mp4",
    mediaPosterUrl: "/images/5th card.png",
    mediaBadge: "Featured Architecture & Interior Showcase",
    introSubhead:
      "We help elite interior designers and architectural studios present dream spaces with cinematic elegance and motion.",
    benefitCards: [
      {
        iconName: "Home",
        title: "3D Room Walkthroughs",
        description:
          "Turn static 3D interior renders into ultra-fluid camera pans, showcasing natural sunlight shifts, textures, and bespoke furniture.",
        formatTag: "Hyper-Realistic AI",
        ctaText: "Explore Walkthroughs ↘",
      },
      {
        iconName: "Palette",
        title: "Material & Moodboard Reels",
        description:
          "Highlight fabric selections, marble vein details, and custom lighting fixtures with macro luxury closeups and soft acoustic scores.",
        formatTag: "Cinematic Showcase",
        ctaText: "Explore Material Reels ↘",
      },
      {
        iconName: "UserCheck",
        title: "Designer Vision Clones",
        description:
          "Clone your lead designer to explain design philosophy, project transformations, and architectural concepts to high-net-worth clients.",
        formatTag: "Digital Twin & Avatar",
        ctaText: "Explore Designer Clones ↘",
      },
    ],
    story: {
      eyebrow: "Trusted Design Media Partner",
      heading: "Experience sophisticated visual aesthetics that command premium design fees",
      description:
        "Interior design is about ambiance, texture, and emotion. Quickupp AI Studio crafts broadcast-quality reels with warm organic lighting, soothing ambient sound design, and elegant kinetic typography that elevate your studio's brand into the luxury echelon.",
      statValue: "310+",
      statLabel: "Interior & Architecture Reels Produced",
      socialProofBadge: "75+ Design Studios Scaled",
      socialProofSubtext: "99% Client Aesthetic Approval",
      image: "/images/5th card.png",
    },
    featuredFormats: [
      {
        name: "Hyper-Realistic Room Cinema",
        price: "$149",
        turnaround: "72 Hrs",
        description: "Fluid camera paths, golden hour lighting transitions, and architectural depth of field.",
        benefits: ["4K HDR visual depth", "Bespoke ambient soundtrack", "Design callouts", "1 revision"],
        popular: true,
      },
      {
        name: "Designer Digital Twin Reel",
        price: "$179",
        turnaround: "72 Hrs",
        description: "Lead architect or interior designer presenting project concepts and client transformation stories.",
        benefits: ["Exact likeness & voice clone", "Luxury studio backdrop", "Personal brand scaling", "HD export"],
      },
      {
        name: "Before/After Renovation Reveal",
        price: "$79",
        turnaround: "48–72 Hrs",
        description: "Dramatic split-screen reveals showing dated rooms transformed into contemporary masterpieces.",
        benefits: ["Smooth wipe transitions", "Engaging pacing", "Social media ready", "Quick 48h turnaround"],
      },
    ],
    useCases: [
      "Luxury Living Room & Master Suite 3D Walkthroughs",
      "Before & After Home Renovation Transformation Reveals",
      "Material, Stone & Custom Joinery Macro Spotlights",
      "Designer Project Walkthrough & Concept Storytelling",
      "Commercial Architecture & Hospitality Space Previews",
      "Design Trends & Color Palette Forecast Reels",
      "High-Net-Worth Client Inquiry & Consultation Ads",
      "Boutique Furniture & Lighting Collection Launches",
    ],
    faqs: [
      {
        question: "Can you generate video motion from SketchUp, 3ds Max, or Lumion still renders?",
        answer:
          "Yes! We take your static 3D render images and synthesize continuous camera motion, natural light progression, and atmospheric depth.",
      },
      {
        question: "How do you ensure the video aesthetics match our high-end studio brand?",
        answer:
          "We carefully curate typography, color grading, and acoustic soundtracks to reflect the minimalism, warmth, and refinement of your architectural portfolio.",
      },
      {
        question: "Can we include the designer's voice explaining the project?",
        answer:
          "Yes. You can either provide an audio recording, or we can train an AI voice clone of the designer to narrate the walkthrough seamlessly.",
      },
      {
        question: "Are these videos suitable for Instagram Reels, Pinterest, and website hero banners?",
        answer:
          "Yes, we provide 9:16 vertical files for Reels/TikTok/Pinterest and can also render widescreen 16:9 for your website portfolio.",
      },
    ],
    relatedSlugs: ["real-estate", "travel-hospitality", "ecommerce"],
  },
};

export function getIndustryBySlug(slug: string): IndustryData | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();

  if (industriesData[normalized]) {
    return industriesData[normalized];
  }

  const aliasMap: Record<string, string> = {
    clinics: "healthcare",
    "healthcare-clinics": "healthcare",
    medical: "healthcare",
    dental: "healthcare",
    "doctors-clinics": "healthcare",
    "professional-service": "professional-services",
    legal: "professional-services",
    finance: "professional-services",
    consulting: "professional-services",
    saas: "it-saas",
    tech: "it-saas",
    software: "it-saas",
    realestate: "real-estate",
    property: "real-estate",
    travel: "travel-hospitality",
    hospitality: "travel-hospitality",
    tourism: "travel-hospitality",
    resorts: "travel-hospitality",
    contractors: "home-services",
    "home-service": "home-services",
    roofing: "home-services",
    solar: "home-services",
    hvac: "home-services",
    coaching: "education",
    edtech: "education",
    courses: "education",
    d2c: "ecommerce",
    "e-commerce": "ecommerce",
    shopify: "ecommerce",
    interior: "interior-design",
    architecture: "interior-design",
    "interior-designer": "interior-design",
  };

  if (aliasMap[normalized] && industriesData[aliasMap[normalized]]) {
    return industriesData[aliasMap[normalized]];
  }

  return undefined;
}
