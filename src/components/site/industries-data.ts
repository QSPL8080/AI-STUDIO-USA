export interface IndustryHeroMetric {
  value: string;
  label: string;
}

export interface IndustryBenefitCard {
  iconUrl?: string;
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
  heroImageUrl: string;
  mediaVideoUrl?: string;
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
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    accent: "from-blue-600 to-cyan-500",
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    shortName: "Professional Services",
    tagline: "High-trust executive avatars, thought leadership & B2B explainers",
    icon: "Briefcase",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    accent: "from-indigo-600 to-purple-500",
  },
  {
    slug: "it-saas",
    name: "IT & SaaS",
    shortName: "IT & SaaS",
    tagline: "Product demo animations, feature walkthroughs & user acquisition reels",
    icon: "Cpu",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
    accent: "from-purple-600 to-pink-500",
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    shortName: "Real Estate",
    tagline: "Cinematic 3D property tours, agent avatars & luxury project reels",
    icon: "Building2",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    accent: "from-amber-600 to-orange-500",
  },
  {
    slug: "travel-hospitality",
    name: "Travel & Hospitality",
    shortName: "Travel & Hospitality",
    tagline: "Immersive destination experiences, resort highlights & booking reels",
    icon: "Compass",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    accent: "from-teal-600 to-emerald-500",
  },
  {
    slug: "home-services",
    name: "Home Services",
    shortName: "Home Services",
    tagline: "Local contractor authority reels, before/after showcases & quote ads",
    icon: "Wrench",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    accent: "from-blue-700 to-indigo-600",
  },
  {
    slug: "education",
    name: "Education & Coaching",
    shortName: "Education",
    tagline: "AI tutor reels, animated curriculum explainers & course enrollment ads",
    icon: "GraduationCap",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    accent: "from-violet-600 to-purple-600",
  },
  {
    slug: "ecommerce",
    name: "eCommerce & D2C",
    shortName: "eCommerce",
    tagline: "High-converting UGC ads, unboxings & cinematic product commercials",
    icon: "ShoppingBag",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    accent: "from-pink-600 to-rose-500",
  },
  {
    slug: "interior-design",
    name: "Interior Design & Architecture",
    shortName: "Interior Design",
    tagline: "3D aesthetic walkthroughs, room makeover reels & portfolio showcases",
    icon: "Home",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    accent: "from-fuchsia-600 to-violet-500",
  },
];

export const industriesData: Record<string, IndustryData> = {
  healthcare: {
    slug: "healthcare",
    name: "Healthcare & Clinics",
    shortName: "Healthcare",
    tagline: "Doctor-led educational reels, treatment explainers & clinic growth ads",
    heroHeading: "Scale patient trust & clinic bookings with",
    heroHighlight: "trusted AI healthcare videos",
    heroSubheading:
      "Transform complex medical treatments, dental procedures, and health advice into engaging 9:16 reels. Scale patient acquisition and appointment bookings without studio filming.",
    heroMetrics: [
      { value: "235K+", label: "Patients Reached & Educated" },
      { value: "85%", label: "Appointment Growth Rate" },
      { value: "96%", label: "Treatment Comprehension" },
    ],
    heroImageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80",
    mediaVideoUrl: "/videos/UGC%20Sample%20new.mp4?v=1",
    mediaBadge: "Featured Healthcare Production",
    introSubhead: "We guide healthcare providers and clinics with clarity — from script to scale.",
    benefitCards: [
      {
        iconName: "Stethoscope",
        title: "Your patient's needs",
        description: "Ensure patients understand treatments, dental procedures, and post-care clearly in under 60 seconds.",
        formatTag: "Patient Education",
        ctaText: "Read more ↘",
      },
      {
        iconName: "UserCheck",
        title: "Doctor digital twin",
        description: "Clone your chief doctor once to produce weekly medical tips, clinic advice, and Q&As without studio time.",
        formatTag: "Doctor AI Clone",
        ctaText: "Read more ↘",
      },
      {
        iconName: "ShieldCheck",
        title: "Clinic trust & ads",
        description: "Reliable video ads to build authority, showcase hygiene standards, and drive local patient appointments.",
        formatTag: "Medical Video Ads",
        ctaText: "Read more ↘",
      },
    ],
    story: {
      eyebrow: "Our story",
      heading: "Experience medical authority transparency and true commitment",
      description:
        "We stand by our promise to deliver dependable healthcare video solutions, medically accurate communication, and unwavering creative support, ensuring your clinic builds unshakeable trust across social media.",
      statValue: "35+",
      statLabel: "Specialist Clinics & Hospitals Scaled",
      socialProofBadge: "50K+ happy patients reached",
      socialProofSubtext: "4.9/5 Provider Satisfaction Rating",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80",
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
        answer: "All video scripts are created based on your clinic's approved clinical guidelines. We never use real patient identifiable health information without explicit consent.",
      },
      {
        question: "Can we create a digital twin of our chief doctor or dental surgeon?",
        answer: "Yes! We provide complete Digital Twin setup including 4K video facial training and AI voice cloning, enabling you to generate recurring patient advice videos in minutes.",
      },
      {
        question: "What video formats perform best for healthcare practices?",
        answer: "Problem-to-solution AI UGC reels and 60-second doctor avatar explainers achieve the highest watch time and comment engagement on Instagram Reels and TikTok.",
      },
      {
        question: "Can videos be produced in multiple languages?",
        answer: "Yes! Our AI engine supports natural voiceovers and accurate lip-sync in 30+ languages, allowing you to reach Spanish, Mandarin, Hindi, and other language communities effortlessly.",
      },
    ],
    relatedSlugs: ["professional-services", "home-services", "education"],
  },

  "professional-services": {
    slug: "professional-services",
    name: "Professional Services",
    shortName: "Professional Services",
    tagline: "High-trust executive avatars, thought leadership & B2B explainers",
    heroHeading: "Elevate executive authority & client acquisition with",
    heroHighlight: "trusted AI advisory videos",
    heroSubheading:
      "Position your firm as the definitive industry authority. Produce high-end executive thought leadership, legal case breakdown videos, and wealth advisory explainers in rapid 48-72h sprints.",
    heroMetrics: [
      { value: "180K+", label: "Corporate Executives Reached" },
      { value: "85%", label: "Client Inbound Growth" },
      { value: "98%", label: "Brand Prestige Retention" },
    ],
    heroImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    mediaVideoUrl: "/videos/Avtar%20Sample%20new.mp4?v=1",
    mediaBadge: "Featured Advisory Production",
    introSubhead: "We guide legal, financial, and consultancy firms with clarity — from brief to boardroom.",
    benefitCards: [
      {
        iconName: "Briefcase",
        title: "Executive thought leadership",
        description: "Translate complex regulatory changes, tax strategies, and governance updates into concise perspectives.",
        formatTag: "Executive Avatars",
        ctaText: "Read more ↘",
      },
      {
        iconName: "Scale",
        title: "Partner digital twin",
        description: "Scale your managing partner's personal brand without taking billable hours away from high-stakes clients.",
        formatTag: "Partner Clone",
        ctaText: "Read more ↘",
      },
      {
        iconName: "ShieldCheck",
        title: "High-net-worth funnel ads",
        description: "Reliable 9:16 video ads built specifically to drive qualified strategy bookings and corporate RFPs.",
        formatTag: "Advisory Ads",
        ctaText: "Read more ↘",
      },
    ],
    story: {
      eyebrow: "Our story",
      heading: "Experience sophisticated authority transparency and true commitment",
      description:
        "High-stakes professional firms cannot compromise on presentation. We combine corporate-grade scripting with photorealistic digital avatars and premium kinetic typography to deliver videos that command respect.",
      statValue: "40+",
      statLabel: "Legal & Advisory Practices Scaled",
      socialProofBadge: "85+ Corporate Clients",
      socialProofSubtext: "100% Brand Consistency",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80",
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
        question: "How do you maintain the refined tone required for corporate advisory?",
        answer: "Our copywriters specialize in B2B and institutional messaging. Every script is drafted to uphold executive sophistication, compliance, and brand prestige.",
      },
      {
        question: "Can our partners review and approve scripts before video generation?",
        answer: "Yes. Script approval is required before production starts. Video generation only begins once your team has signed off.",
      },
      {
        question: "Can these videos be formatted for LinkedIn vertical video?",
        answer: "Yes, our standard package is optimized for 9:16 vertical feeds (Instagram, Shorts, LinkedIn vertical), and we can also provide 16:9 widescreen upon request.",
      },
      {
        question: "How quickly can we scale to regular monthly video releases?",
        answer: "With our Growth and Enterprise packages, we deliver 10 to 30 custom videos every month on predictable schedules.",
      },
    ],
    relatedSlugs: ["it-saas", "healthcare", "real-estate"],
  },

  "it-saas": {
    slug: "it-saas",
    name: "IT & SaaS",
    shortName: "IT & SaaS",
    tagline: "Product demo animations, feature walkthroughs & user acquisition reels",
    heroHeading: "Accelerate software signups & feature adoption with",
    heroHighlight: "trusted AI tech demo videos",
    heroSubheading:
      "Turn complex software workflows, API capabilities, and product updates into viral, high-converting video assets. Boost trial signups and reduce onboarding churn.",
    heroMetrics: [
      { value: "520K+", label: "Software Impressions Delivered" },
      { value: "85%", label: "Trial Signup Velocity" },
      { value: "65%", label: "Lower Video Production CAC" },
    ],
    heroImageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
    mediaVideoUrl: "/videos/Cartoon%20Sample.mp4?v=2",
    mediaBadge: "Featured SaaS Production",
    introSubhead: "We guide software companies and tech founders with clarity — from release notes to viral reach.",
    benefitCards: [
      {
        iconName: "Cpu",
        title: "Feature walkthroughs",
        description: "Highlight newly shipped features, dashboard workflows, and AI integrations with dynamic animated screen simulations.",
        formatTag: "SaaS Animated Explainers",
        ctaText: "Read more ↘",
      },
      {
        iconName: "Zap",
        title: "Problem → Solution UGC",
        description: "Show real-world workflow frustration transformed into instant productivity through your software tool.",
        formatTag: "Creator Tech Reviews",
        ctaText: "Read more ↘",
      },
      {
        iconName: "Sparkles",
        title: "Founder roadmap reels",
        description: "Release regular product updates presented by a photorealistic AI clone of your founder or product lead.",
        formatTag: "Founder Clones",
        ctaText: "Read more ↘",
      },
    ],
    story: {
      eyebrow: "Our story",
      heading: "Experience engineering clarity transparency and true commitment",
      description:
        "In SaaS, speed to market is everything. We eliminate the weeks spent coordinating screen recorders, voice actors, and video editors, turning your product roadmaps into high-impact launch videos in 48-72 hours.",
      statValue: "680+",
      statLabel: "SaaS & Tech Video Ads Delivered",
      socialProofBadge: "210+ Startups Scaled",
      socialProofSubtext: "4.8x Return on Ad Spend",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
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
        answer: "Yes! You can provide screenshots or screen recordings, and we seamlessly blend them with our AI avatars and animated UI overlays.",
      },
      {
        question: "Do you write technical scripts that sound natural to developers?",
        answer: "Yes. Our creative team has deep tech domain expertise, ensuring your scripts strike the perfect balance between technical accuracy and high conversion.",
      },
      {
        question: "Can we use these videos for Paid Meta Ads, TikTok, and YouTube Shorts?",
        answer: "Yes. All videos are delivered in 9:16 with high-contrast subtitles, sound design, and strong CTA bumpers.",
      },
      {
        question: "How do revisions work for tech product videos?",
        answer: "Every order includes 1 complete revision based on the approved script to ensure avatar movements and screen overlays match your specifications.",
      },
    ],
    relatedSlugs: ["professional-services", "education", "ecommerce"],
  },

  "real-estate": {
    slug: "real-estate",
    name: "Real Estate & Development",
    shortName: "Real Estate",
    tagline: "Cinematic 3D property tours, agent avatars & luxury project reels",
    heroHeading: "Sell luxury properties & attract high-value buyers with",
    heroHighlight: "trusted AI real estate videos",
    heroSubheading:
      "Transform architectural renders, floor plans, and listing photos into breathtaking 3D walkthroughs and presenter-led property showcase reels that command buyer attention.",
    heroMetrics: [
      { value: "310K+", label: "Prospective Buyers Reached" },
      { value: "85%", label: "Showing Inquiry Increase" },
      { value: "95%", label: "Listing Engagement Rate" },
    ],
    heroImageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    mediaVideoUrl: "/videos/Portfolio%203.mp4",
    mediaBadge: "Featured Luxury Real Estate Showcase",
    introSubhead: "We guide top-producing brokers and developers with clarity — from render to closing.",
    benefitCards: [
      {
        iconName: "Building2",
        title: "Virtual property tours",
        description: "Generate ultra-fluid 3D flythroughs and room transitions from 2D photos or renders with luxury lighting.",
        formatTag: "3D Virtual Tours",
        ctaText: "Read more ↘",
      },
      {
        iconName: "UserCheck",
        title: "Realtor AI presenter clone",
        description: "Host listing walkthroughs and local market updates 24/7 with a digital twin of your lead broker.",
        formatTag: "Broker Clones",
        ctaText: "Read more ↘",
      },
      {
        iconName: "Compass",
        title: "Neighborhood lifestyle ads",
        description: "Showcase nearby dining, schools, and amenities to paint an irresistible lifestyle for high-net-worth buyers.",
        formatTag: "Lifestyle Reels",
        ctaText: "Read more ↘",
      },
    ],
    story: {
      eyebrow: "Our story",
      heading: "Experience architectural elegance transparency and true commitment",
      description:
        "High-net-worth buyers expect immersive visual experiences. We craft broadcast-quality reels with hyper-realistic textures, ambient luxury soundscapes, and magnetic presenter avatars that turn casual scrollers into committed showings.",
      statValue: "$180M+",
      statLabel: "Total Property Inventory Promoted",
      socialProofBadge: "150+ Agencies & Developers",
      socialProofSubtext: "98% Positive Buyer Feedback",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80",
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
        answer: "Yes! Our hyper-realistic AI pipeline can synthesize realistic motion and 3D depth from blueprints, interior renders, and still photos.",
      },
      {
        question: "How do agent digital twins work for multiple listings?",
        answer: "Once we train your digital twin, you simply submit the listing details and photos. We generate a custom video of you presenting the property in under 48 hours.",
      },
      {
        question: "Can you add custom agency branding and MLS badges?",
        answer: "Yes, all videos include your agency logo, broker license details, phone numbers, and custom color accents.",
      },
      {
        question: "Are these videos formatted for Instagram Reels and TikTok ads?",
        answer: "Yes, every reel is delivered in 9:16 vertical resolution, optimized for maximum retention with viral audio pacing and subtitles.",
      },
    ],
    relatedSlugs: ["interior-design", "travel-hospitality", "professional-services"],
  },

  "travel-hospitality": {
    slug: "travel-hospitality",
    name: "Travel & Hospitality",
    shortName: "Travel & Hospitality",
    tagline: "Immersive destination experiences, resort highlights & booking reels",
    heroHeading: "Ignite wanderlust & direct bookings with",
    heroHighlight: "trusted AI travel videos",
    heroSubheading:
      "Captivate global travelers with cinematic destination visuals, virtual resort tours, and authentic creator-style travel reviews without expensive overseas filming crews.",
    heroMetrics: [
      { value: "450K+", label: "Travel Impressions Delivered" },
      { value: "85%", label: "Direct Booking Lift" },
      { value: "95%", label: "Wanderlust Engagement" },
    ],
    heroImageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
    mediaVideoUrl: "/videos/Portfolio%204.mp4",
    mediaBadge: "Featured Hospitality Showcase",
    introSubhead: "We guide luxury resorts and travel brands with clarity — from dream to destination.",
    benefitCards: [
      {
        iconName: "Compass",
        title: "Destination immersion",
        description: "Transport travelers into sun-drenched beaches and alpine retreats with cinematic atmospheric AI rendering.",
        formatTag: "Destination Films",
        ctaText: "Read more ↘",
      },
      {
        iconName: "ShoppingBag",
        title: "Traveler creator UGC",
        description: "Deliver authentic traveler reviews, room tour vlogs, and itinerary recommendations that spark immediate bookings.",
        formatTag: "Creator Travel UGC",
        ctaText: "Read more ↘",
      },
      {
        iconName: "Sparkles",
        title: "Multilingual concierge",
        description: "Deploy AI concierges presenting dining menus, spa packages, and exclusive seasonal resort offers in 10+ languages.",
        formatTag: "Concierge Avatars",
        ctaText: "Read more ↘",
      },
    ],
    story: {
      eyebrow: "Our story",
      heading: "Experience sensory hospitality transparency and true commitment",
      description:
        "Travel decisions are purely emotional. We combine breathtaking environmental generation with authentic creator voices and immersive sound design, creating irresistible reels that fill rooms all year round.",
      statValue: "520+",
      statLabel: "Travel & Hospitality Reels Produced",
      socialProofBadge: "90+ Luxury Resorts Scaled",
      socialProofSubtext: "4.9/5 Guest Experience Rating",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80",
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
        question: "Can you create videos featuring our actual resort photos?",
        answer: "Yes! We integrate your real property photography with AI enhancement, realistic camera motion, and creator avatars.",
      },
      {
        question: "Can we produce seasonal campaigns quickly?",
        answer: "Yes. Our rapid 48-72h production model allows you to launch timely holiday campaigns without weeks of advance planning.",
      },
      {
        question: "How do you handle multi-language content for international guests?",
        answer: "We generate the same video in 10+ languages with native accents and lip-sync, saving thousands on localization.",
      },
      {
        question: "Can we order multiple reels for different amenities?",
        answer: "Yes, our packages let you produce 10 to 15 distinct reels covering dining, spa, pool, and room amenities.",
      },
    ],
    relatedSlugs: ["real-estate", "interior-design", "ecommerce"],
  },

  "home-services": {
    slug: "home-services",
    name: "Home Services & Contractors",
    shortName: "Home Services",
    tagline: "Local contractor authority reels, before/after showcases & quote ads",
    heroHeading: "Dominate local territories & estimate requests with",
    heroHighlight: "trusted AI contractor videos",
    heroSubheading:
      "Transform homeowner skepticism into eager estimate requests. Produce authentic before/after showcases, emergency repair explainers, and local authority ads that win exclusive jobs.",
    heroMetrics: [
      { value: "290K+", label: "Local Homeowners Reached" },
      { value: "85%", label: "Estimate Request Lift" },
      { value: "45%", label: "Lower Cost Per Lead" },
    ],
    heroImageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
    mediaVideoUrl: "/videos/Portfolio%202.mp4",
    mediaBadge: "Featured Home Services Campaign",
    introSubhead: "We guide roofing, HVAC, solar, and remodeling pros with clarity — from estimate to job booked.",
    benefitCards: [
      {
        iconName: "Wrench",
        title: "Before & after reveals",
        description: "Showcase dramatic roof replacements, kitchen renovations, and HVAC upgrades with high-energy visual reveals.",
        formatTag: "Transformation Reels",
        ctaText: "Read more ↘",
      },
      {
        iconName: "ShieldCheck",
        title: "Homeowner warning ads",
        description: "Educate homeowners on subtle warning signs (roof leaks, AC failure, electrical risks) before emergencies strike.",
        formatTag: "Warning Ads",
        ctaText: "Read more ↘",
      },
      {
        iconName: "Zap",
        title: "Seasonal rebate reels",
        description: "Promote government tax credits, seasonal tune-up discounts, and 0% financing to spur immediate calls.",
        formatTag: "Offer Ads",
        ctaText: "Read more ↘",
      },
    ],
    story: {
      eyebrow: "Our story",
      heading: "Experience local craftsmanship transparency and true commitment",
      description:
        "Homeowners buy from contractors they trust. We craft relatable, authentic video ads that highlight your licensing, craftsmanship, and customer reviews, turning casual local scrollers into confirmed in-home estimates.",
      statValue: "390+",
      statLabel: "Contractor & Trade Videos Produced",
      socialProofBadge: "110+ Home Service Companies",
      socialProofSubtext: "4.8/5 Lead Quality Rating",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80",
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
        answer: "Yes! We tailor the script hooks and text overlays to mention your specific city or service territory for maximum local resonance.",
      },
      {
        question: "How do these video ads perform on Facebook & TikTok?",
        answer: "Home services UGC video ads typically generate 40-60% cheaper cost-per-lead compared to static image ads because they build trust fast.",
      },
      {
        question: "Can we provide photos of our past jobs to include in the video?",
        answer: "Absolutely. We incorporate your real job site photos into dynamic before-and-after split screens.",
      },
      {
        question: "How fast can we get an ad campaign live for storm season?",
        answer: "With our standard 48-72h delivery, you can have high-converting storm response ads live before the weather clears.",
      },
    ],
    relatedSlugs: ["real-estate", "professional-services", "interior-design"],
  },

  education: {
    slug: "education",
    name: "Education & Coaching",
    shortName: "Education",
    tagline: "AI tutor reels, animated curriculum explainers & course enrollment ads",
    heroHeading: "Scale course enrollments & student retention with",
    heroHighlight: "trusted AI learning videos",
    heroSubheading:
      "Transform curriculum concepts, masterclass promotions, and student breakthroughs into viral bite-sized lessons. Deliver animated lessons and enrollment ads at scale.",
    heroMetrics: [
      { value: "380K+", label: "Students & Learners Reached" },
      { value: "85%", label: "Course Completion Rate" },
      { value: "95%", label: "Concept Retention Rate" },
    ],
    heroImageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80",
    mediaVideoUrl: "/videos/Avtar%20Sample%20new.mp4?v=1",
    mediaBadge: "Featured EdTech Showcase",
    introSubhead: "We guide edtech founders, academies, and coaches with clarity — from syllabus to scale.",
    benefitCards: [
      {
        iconName: "GraduationCap",
        title: "Bite-sized micro lessons",
        description: "Break down complex academic theories, language drills, or coding fundamentals into punchy 60-second lessons.",
        formatTag: "Animated Lessons",
        ctaText: "Read more ↘",
      },
      {
        iconName: "UserCheck",
        title: "Instructor AI digital twin",
        description: "Clone your head instructor to record hundreds of modular course lessons and Q&A responses effortlessly.",
        formatTag: "Instructor Clone",
        ctaText: "Read more ↘",
      },
      {
        iconName: "Sparkles",
        title: "Student enrollment ads",
        description: "High-converting student transformation reels that showcase career breakthroughs, salary boosts, and certificates.",
        formatTag: "Enrollment Ads",
        ctaText: "Read more ↘",
      },
    ],
    story: {
      eyebrow: "Our story",
      heading: "Experience pedagogical clarity transparency and true commitment",
      description:
        "Attention spans are shorter than ever. We combine cognitive visual storytelling with charismatic AI presenters and kinetic graphics, ensuring your educational content educates, entertains, and converts scrollers into committed students.",
      statValue: "750+",
      statLabel: "Educational & Coaching Reels Delivered",
      socialProofBadge: "180+ Academies & Coaches",
      socialProofSubtext: "4.9/5 Student Rating",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
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
        answer: "Yes! Many academies use our packages to generate entire video curriculums in days instead of spending months in a studio.",
      },
      {
        question: "Can the videos be rendered with dual-language subtitles?",
        answer: "Yes, we can provide animated subtitles in English, Spanish, French, German, and 25+ other languages.",
      },
      {
        question: "How do you ensure the tone matches academic standards?",
        answer: "We calibrate the script, pacing, avatar styling, and background environment to perfectly match your target audience.",
      },
      {
        question: "Do we retain full commercial ownership of all video assets?",
        answer: "Yes, you receive 100% full commercial rights to use the videos inside your paid courses and ad campaigns.",
      },
    ],
    relatedSlugs: ["it-saas", "professional-services", "healthcare"],
  },

  ecommerce: {
    slug: "ecommerce",
    name: "eCommerce & D2C Brands",
    shortName: "eCommerce",
    tagline: "High-converting UGC ads, unboxings & cinematic product commercials",
    heroHeading: "Supercharge ROAS & viral product sales with",
    heroHighlight: "trusted AI UGC video ads",
    heroSubheading:
      "Generate high-energy creator unboxings, problem→solution hooks, and 3D product commercials without shipping physical samples or negotiating expensive creator contracts.",
    heroMetrics: [
      { value: "750K+", label: "Shoppers Converted with AI Ads" },
      { value: "85%", label: "Higher Click-Through Rate" },
      { value: "5.4x", label: "Average Campaign ROAS" },
    ],
    heroImageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
    mediaVideoUrl: "/videos/Portfolio%201.mp4",
    mediaBadge: "Featured D2C Brand Campaign",
    introSubhead: "We guide fast-scaling Shopify merchants and brands with clarity — from hook to checkout.",
    benefitCards: [
      {
        iconName: "ShoppingBag",
        title: "AI UGC product reviews",
        description: "Deploy diverse, authentic creator avatars demonstrating product benefits, daily routines, and unboxings.",
        formatTag: "Creator UGC Ads",
        ctaText: "Read more ↘",
      },
      {
        iconName: "Sparkles",
        title: "Hyper-realistic 3D spots",
        description: "Produce luxury studio commercial spots with macro product angles, dynamic lighting, and 3D fluid physics.",
        formatTag: "3D Commercials",
        ctaText: "Read more ↘",
      },
      {
        iconName: "Zap",
        title: "Viral TikTok ad hooks",
        description: "Test 10+ hook variations per product to discover the winning creative angle and scale your ad spend profitably.",
        formatTag: "Hook Variations",
        ctaText: "Read more ↘",
      },
    ],
    story: {
      eyebrow: "Our story",
      heading: "Experience creative velocity transparency and true commitment",
      description:
        "Modern eCommerce algorithms demand endless fresh creative iterations. We give you a scalable video production pipeline that outputs 10 to 30 high-converting reels every month, cutting production costs by up to 80% while boosting ROAS.",
      statValue: "1,200+",
      statLabel: "eCommerce & D2C Video Ads Produced",
      socialProofBadge: "340+ D2C Brands Scaled",
      socialProofSubtext: "5.4x Average Verified ROAS",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
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
        answer: "No! You can simply upload clean product photos or 3D CAD files. Our AI engine places your product seamlessly into realistic lifestyle scenes.",
      },
      {
        question: "Can we test multiple creator demographics for the same product?",
        answer: "Yes! We can render the exact same script across multiple AI creator ages and ethnicities to find which demographic yields highest conversion.",
      },
      {
        question: "How quickly can we get 10 variations for a TikTok ad test?",
        answer: "With our Growth package, you receive all 10 creatives within 7 days, ready to plug directly into your Ads Manager.",
      },
      {
        question: "Can you include on-screen review screenshots and trust badges?",
        answer: "Yes, we can include Trustpilot ratings, press mentions, customer quote popups, and custom discount code overlays.",
      },
    ],
    relatedSlugs: ["interior-design", "healthcare", "it-saas"],
  },

  "interior-design": {
    slug: "interior-design",
    name: "Interior Design & Architecture",
    shortName: "Interior Design",
    tagline: "3D aesthetic walkthroughs, room makeover reels & portfolio showcases",
    heroHeading: "Showcase aesthetic spaces & luxury clients with",
    heroHighlight: "trusted AI design reels",
    heroSubheading:
      "Transform 2D blueprints, mood boards, and render stills into breathtaking cinematic room walkthroughs, lighting transitions, and high-converting designer portfolio reels.",
    heroMetrics: [
      { value: "210K+", label: "Design Admirers & Clients Reached" },
      { value: "85%", label: "Portfolio Inquiry Growth" },
      { value: "100%", label: "Photorealistic Aesthetic" },
    ],
    heroImageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    mediaVideoUrl: "/videos/Hyper%20Realistic%20Sample.mp4",
    mediaBadge: "Featured Architecture & Interior Showcase",
    introSubhead: "We guide elite interior designers and architects with clarity — from blueprint to built beauty.",
    benefitCards: [
      {
        iconName: "Home",
        title: "3D room walkthroughs",
        description: "Turn static 3D interior renders into ultra-fluid camera pans, showcasing sunlight shifts, textures, and bespoke furniture.",
        formatTag: "3D Walkthroughs",
        ctaText: "Read more ↘",
      },
      {
        iconName: "Palette",
        title: "Material & moodboard reels",
        description: "Highlight fabric selections, marble vein details, and custom lighting fixtures with macro luxury closeups.",
        formatTag: "Material Reels",
        ctaText: "Read more ↘",
      },
      {
        iconName: "UserCheck",
        title: "Designer vision clones",
        description: "Clone your lead designer to explain design philosophy, transformations, and concepts to high-net-worth clients.",
        formatTag: "Designer Clones",
        ctaText: "Read more ↘",
      },
    ],
    story: {
      eyebrow: "Our story",
      heading: "Experience aesthetic excellence transparency and true commitment",
      description:
        "Interior design is about ambiance, texture, and emotion. We craft broadcast-quality reels with warm organic lighting, soothing acoustic sound design, and elegant kinetic typography that elevate your studio into the luxury echelon.",
      statValue: "310+",
      statLabel: "Interior & Architecture Reels Produced",
      socialProofBadge: "75+ Design Studios Scaled",
      socialProofSubtext: "99% Aesthetic Approval",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
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
        question: "Can you generate video motion from SketchUp, 3ds Max, or Lumion renders?",
        answer: "Yes! We take your static 3D render images and synthesize continuous camera motion and natural light progression.",
      },
      {
        question: "How do you ensure the video aesthetics match our high-end brand?",
        answer: "We carefully curate typography, color grading, and acoustic soundtracks to reflect the minimalism and warmth of your portfolio.",
      },
      {
        question: "Can we include the designer's voice explaining the project?",
        answer: "Yes. You can provide an audio recording, or we can train an AI voice clone of the designer to narrate the walkthrough seamlessly.",
      },
      {
        question: "Are these videos suitable for Instagram Reels and Pinterest?",
        answer: "Yes, we provide 9:16 vertical files for Reels/TikTok/Pinterest and can also render widescreen 16:9 for your portfolio.",
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
