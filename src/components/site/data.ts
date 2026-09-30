export const heroBadges = [
  "Script Included",
  "5+ AI Video Formats",
  "Up to 60-Second Videos",
  "9:16 Reel Format",
  "48–72 Hour Delivery",
  "1 Revision Included",
];

export const formats = ["AI UGC", "AI Cartoon", "AI Avatar", "Hyper-Realistic", "Digital Twin"];

export const samples = [
  {
    format: "AI UGC",
    industry: "Dermatological Skincare",
    description: "Engaging creator-led daily skincare hydration routine featuring CeraVe Moisturizing Cream.",
    videoUrl: "/videos/UGC%20Sample.mp4",
  },
  {
    format: "AI Cartoon",
    industry: "Kitchen & Cookware",
    description:
      "3D animated kitchen story: a stressed chef battling smoking pans switches to non-stick cookware, with playful character-led product storytelling.",
    videoUrl: "/videos/Cartoon%20Sample.mp4",
  },
  {
    format: "AI Avatar",
    industry: "Beauty & Cosmetics",
    description: "AI avatar presenter reel demonstrating a foundation and concealer makeup routine for a beauty brand.",
    videoUrl: "/videos/Avtar%20Sample.mp4",
  },
  {
    format: "Hyper-Realistic",
    industry: "Luxury Cosmetics & Beauty",
    description: "Cinematic 3D hyper-realistic product commercial showcasing DIOR Addict Lip Maximizer with studio lighting and macro details.",
    videoUrl: "/videos/Hyper%20Realistic%20Sample.mp4",
  },
  {
    format: "Digital Twin",
    industry: "Founder Branding",
    description: "Founder-led update reel created from an approved digital twin.",
    videoUrl: "",
    imageUrl: "/images/Digital%20Twin%20Image.png",
  },
];

export const portfolioFilters = [
  "All",
  "AI UGC",
  "AI Avatar",
  "Hyper-Realistic",
  "AI Cartoon",
  "Digital Twin",
] as const;

export type PortfolioCategory = (typeof portfolioFilters)[number];

export const portfolioItems = [
  {
    title: "Rhode Peptide Glazing Fluid",
    format: "AI UGC",
    industry: "Skincare & Beauty",
    description:
      "Authentic creator-style morning routine and product review for Rhode Peptide Glazing Fluid.",
    videoUrl: "/videos/Portfolio 1.mp4",
    isSpecConcept: true,
    specLabel: "AI VIDEO SPEC CONCEPT",
  },
  {
    title: "Dyson Airwrap Styler",
    format: "AI UGC",
    industry: "Luxury Haircare & Beauty",
    description:
      "Authentic creator-style hair styling routine and product spotlight reel for Dyson Airwrap.",
    videoUrl: "/videos/Portfolio 2.mp4",
    isSpecConcept: true,
    specLabel: "AI VIDEO SPEC CONCEPT",
  },
  {
    title: "Bvlgari Fine Jewelry",
    format: "Hyper-Realistic",
    industry: "High Jewelry & Gemstones",
    description:
      "Cinematic reveal commercial showcasing Bvlgari fine jewelry with volcanic gemstone transitions and macro studio lighting.",
    videoUrl: "/videos/Portfolio 3.mp4",
    isSpecConcept: true,
    specLabel: "SPEC AD / UNOFFICIAL CONCEPT",
  },
  {
    title: "Nike Performance Footwear",
    format: "AI UGC",
    industry: "Athletic Footwear & Sportswear",
    description:
      "High-energy performance commercial featuring Nike running shoes with explosive athlete movements and ground-strike closeups.",
    videoUrl: "/videos/Portfolio 4.mp4",
    isSpecConcept: true,
    specLabel: "AI VIDEO SPEC CONCEPT",
  },
  {
    title: "Dior Addict Lip Glow",
    format: "Hyper-Realistic",
    industry: "Luxury Cosmetics & Lip Care",
    description:
      "High-gloss commercial reveal reel showcasing Dior Addict Lip Glow with sensory macro textures and studio lighting.",
    videoUrl: "/videos/Portfolio 5.mp4",
    isSpecConcept: true,
    specLabel: "SPEC AD / UNOFFICIAL CONCEPT",
  },
  {
    title: "CeraVe Hydration Routine",
    format: "AI UGC",
    industry: "Dermatological Skincare",
    description:
      "Engaging creator-led daily skincare hydration routine featuring CeraVe Moisturizing Cream.",
    videoUrl: "/videos/UGC%20Sample.mp4",
    isSpecConcept: true,
    specLabel: "AI VIDEO SPEC CONCEPT",
  },
  {
    title: "Smart Kitchen Cookware",
    format: "AI Cartoon",
    industry: "Kitchen & Cookware",
    description:
      "3D animated kitchen story: a stressed chef battling smoking pans switches to non-stick cookware, with playful character-led product storytelling.",
    videoUrl: "/videos/Cartoon%20Sample.mp4",
    isSpecConcept: false,
    specLabel: "ORIGINAL AI CONCEPT",
  },
  {
    title: "Radiant Beauty Glow",
    format: "AI Avatar",
    industry: "Beauty & Cosmetics",
    description:
      "AI avatar presenter reel demonstrating a foundation and concealer makeup routine for a modern beauty brand.",
    videoUrl: "/videos/Avtar%20Sample.mp4",
    isSpecConcept: false,
    specLabel: "ORIGINAL AI CONCEPT",
  },
  {
    title: "DIOR Addict Lip Maximizer",
    format: "Hyper-Realistic",
    industry: "Luxury Cosmetics & Beauty",
    description:
      "Cinematic 3D hyper-realistic product commercial showcasing DIOR Addict Lip Maximizer with studio lighting and macro details.",
    videoUrl: "/videos/Hyper%20Realistic%20Sample.mp4",
    isSpecConcept: true,
    specLabel: "SPEC AD / UNOFFICIAL CONCEPT",
  },
  {
    title: "Executive AI Persona",
    format: "Digital Twin",
    industry: "Founder Branding & Executive",
    description:
      "Founder-led brand update reel powered by a hyper-realistic digital twin — no camera, no studio needed.",
    videoUrl: "",
    imageUrl: "/images/Digital%20Twin%20Image.png",
    isSpecConcept: false,
    specLabel: "DIGITAL TWIN CONCEPT",
  },
];

export const services = [
  {
    num: "01",
    tag: "SERVICE 01",
    title: "AI UGC Video Ads",
    fullTitle: "SERVICE 01 — AI UGC VIDEO ADS",
    tagline: "Real Creator-Style Content. AI-Powered Production.",
    description: "Create UGC-style ads without coordinating creators, locations, or traditional shoots.",
    bestFor: "Skincare, Cosmetics, Haircare, Fashion, Supplements, Fitness, Pet Products, Food & Beverage, Wellness, E-commerce Products",
    idealFor: [
      "Skincare",
      "Cosmetics",
      "Haircare",
      "Fashion",
      "Supplements",
      "Fitness",
      "Pet Products",
      "Food & Beverage",
      "Wellness",
      "E-commerce Products",
    ],
    greatFor: [
      "Testimonials",
      "Product Reviews",
      "Problem/Solution",
      "Product Demonstrations",
      "Unboxing",
      "Lifestyle Content",
      "Social Ads",
    ],
    items: [
      "Product Reviews",
      "Product Demonstrations",
      "Unboxing Videos",
      "Testimonials",
      "Product Recommendations",
      "Problem → Solution Videos",
      "Social Media Advertisements",
    ],
    price: "$79 / AI Video",
    startingAt: "$79 / AI Video",
    cta: "Create an AI UGC Ad",
    videoUrl: "/videos/UGC%20Sample.mp4",
  },
  {
    num: "02",
    tag: "SERVICE 02",
    title: "AI Avatar Video Ads",
    fullTitle: "SERVICE 02 — AI AVATAR VIDEO ADS",
    tagline: "Turn Your Message Into an On-Camera Video",
    description: "Use realistic AI presenters to communicate your product, service, offer, or message.",
    bestFor: "SaaS, AI Companies, Mobile Apps, B2B Software, Real Estate, Healthcare, Education, Professional Services",
    idealFor: [
      "SaaS",
      "AI Companies",
      "Mobile Apps",
      "B2B Software",
      "Real Estate",
      "Healthcare",
      "Education",
      "Professional Services",
    ],
    greatFor: [
      "Explainer Videos",
      "Product Walkthroughs",
      "Educational Content",
      "Ads",
      "Social Videos",
      "Founder-Style Content",
    ],
    items: [
      "Business Presentations",
      "Educational Videos",
      "Property Videos",
      "Doctor/Clinic Explainers",
      "Service Explainers",
      "Corporate Videos",
      "Social Media Reels",
    ],
    price: "$79 / AI Video",
    startingAt: "$79 / AI Video",
    cta: "Create an AI Avatar Video",
    videoUrl: "/videos/Avtar%20Sample.mp4",
  },
  {
    num: "03",
    tag: "SERVICE 03",
    title: "AI Cartoon Video Ads",
    fullTitle: "SERVICE 03 — AI CARTOON VIDEO ADS",
    tagline: "Make Your Brand Impossible to Ignore",
    description: "Use animated characters, storytelling, and visual humor to create distinctive social-first content.",
    bestFor: "Consumer Brands, Apps, Kids & Family Products, Pet Brands, Food & Beverage, Entertainment, Social Campaigns",
    idealFor: [
      "Consumer Brands",
      "Apps",
      "Kids & Family Products",
      "Pet Brands",
      "Food & Beverage",
      "Entertainment",
      "Social Campaigns",
    ],
    greatFor: [
      "Animated Storytelling",
      "Product Explainers",
      "Educational Content",
      "Social Ads",
      "Brand Stories",
      "Entertainment Content",
    ],
    items: [
      "Explainer Videos",
      "Educational Content",
      "Brand Stories",
      "Animated Reels",
      "Character-Based Videos",
      "Product Explainers",
    ],
    price: "$79 / AI Video",
    startingAt: "$79 / AI Video",
    cta: "Create Cartoon AI Ad",
    videoUrl: "/videos/Cartoon%20Sample.mp4",
  },
  {
    num: "04",
    tag: "SERVICE 04",
    title: "AI Hyper-Realistic Video Ads",
    fullTitle: "SERVICE 04 — AI HYPER-REALISTIC VIDEO ADS",
    tagline: "Cinematic Product Advertising Without a Traditional Production",
    description: "Create premium, visually detailed product advertising using AI-generated environments, characters, product visuals, camera movement, and cinematic storytelling.",
    bestFor: "Beauty, Luxury, Jewelry, Fashion, Automotive, Consumer Products, Premium E-commerce, Lifestyle Brands",
    idealFor: [
      "Beauty",
      "Luxury",
      "Jewelry",
      "Fashion",
      "Automotive",
      "Consumer Products",
      "Premium E-commerce",
      "Lifestyle Brands",
    ],
    greatFor: [
      "Product Advertising",
      "Luxury Campaigns",
      "Cinematic Ads",
      "Product Launches",
      "Brand Films",
      "Premium Social Ads",
    ],
    items: [
      "Product Advertisements",
      "Cinematic Brand Videos",
      "Real Estate Videos",
      "Product Launches",
      "Premium Social Media Content",
      "Advertising Campaigns",
    ],
    price: "$149 / AI Video",
    startingAt: "$149 / AI Video",
    cta: "Create a Premium AI Ad",
    videoUrl: "/videos/Hyper%20Realistic%20Sample.mp4",
  },
  {
    num: "05",
    tag: "SERVICE 05",
    title: "AI Digital Twin Video",
    fullTitle: "SERVICE 05 — AI DIGITAL TWIN VIDEO",
    tagline: "Turn Your Brand or Personal Presence Into Scalable Video Content",
    description: "Create AI-powered videos using a digital representation of a real person for repeatable content production.",
    bestFor: "Founders, CEOs, Coaches, Consultants, Real Estate Professionals, Creators, Personal Brands, Business Owners",
    idealFor: [
      "Founders",
      "CEOs",
      "Coaches",
      "Consultants",
      "Real Estate Professionals",
      "Creators",
      "Personal Brands",
      "Business Owners",
    ],
    greatFor: [
      "Personal Branding",
      "Educational Content",
      "Founder Content",
      "Social Videos",
      "Thought Leadership",
      "Promotional Videos",
    ],
    items: [
      "Founder Videos",
      "Personal Branding",
      "Educational Reels",
      "Expert Content",
      "Business Updates",
      "Promotional Videos",
      "Social Media Content",
    ],
    price: "$179 / Video",
    startingAt: "$179 / Video",
    cta: "Create Your Digital Twin",
    videoUrl: "",
    imageUrl: "/images/Digital%20Twin%20Image.png",
  },
];

export const whyAiVideo = [
  {
    title: "Hooks",
    description: "Different opening messages for different audiences.",
  },
  {
    title: "Angles",
    description: "Different reasons for customers to care.",
  },
  {
    title: "Personas",
    description: "Different creator or presenter styles.",
  },
  {
    title: "Concepts",
    description: "Different storytelling approaches.",
  },
  {
    title: "Visual Styles",
    description: "UGC, avatar, cinematic, cartoon, product-focused, and more.",
  },
  {
    title: "CTAs",
    description: "Different actions based on campaign objectives.",
  },
];

export interface IndividualPricing {
  service: string;
  price: string;
  badge?: string;
  description?: string;
}

export const individualPricingList: IndividualPricing[] = [
  { service: "AI UGC Video Ads", price: "$79", description: "Real Creator-Style Content. AI-Powered Production." },
  { service: "AI Avatar Video Ads", price: "$79", description: "Turn Your Message Into an On-Camera Video" },
  { service: "AI Cartoon Video Ads", price: "$79", description: "Turn Ideas into Engaging Animated Ads" },
  { service: "AI Hyper-Realistic Video Ads", price: "$149", description: "Cinematic, High-Impact AI Visuals" },
  { service: "AI Digital Twin Video", price: "$179", description: "Scale Yourself Without Recording Every Video" },
  { service: "Digital Twin Setup", price: "$499", badge: "One-Time", description: "Avatar & voice clone calibration" },
];

export interface PackagePricingTier {
  package: string;
  delivery: string;
  videos: number | string;
  badge?: string;
  popular?: boolean;
  aiUgc: string;
  aiAvatar: string;
  aiCartoon: string;
  hyperRealistic: string;
  digitalTwin: string;
}

export const packagePricingTiers: PackagePricingTier[] = [
  {
    package: "1 Video",
    delivery: "24 Hrs",
    videos: 1,
    aiUgc: "$79",
    aiAvatar: "$79",
    aiCartoon: "$79",
    hyperRealistic: "$149",
    digitalTwin: "$179",
  },
  {
    package: "5 Videos",
    delivery: "72 Hrs",
    videos: 5,
    aiUgc: "$359",
    aiAvatar: "$359",
    aiCartoon: "$359",
    hyperRealistic: "$699",
    digitalTwin: "$849",
  },
  {
    package: "10 Videos",
    delivery: "Within 7 Days",
    videos: 10,
    popular: true,
    badge: "Most Popular",
    aiUgc: "$649",
    aiAvatar: "$649",
    aiCartoon: "$649",
    hyperRealistic: "$1,249",
    digitalTwin: "$1,499",
  },
  {
    package: "15 Videos",
    delivery: "Within 14 Days",
    videos: 15,
    badge: "High Growth",
    aiUgc: "$899",
    aiAvatar: "$899",
    aiCartoon: "$899",
    hyperRealistic: "$1,699",
    digitalTwin: "$2,049",
  },
  {
    package: "30 Videos",
    delivery: "Within 20 Days",
    videos: 30,
    badge: "Best Value",
    aiUgc: "$1,549",
    aiAvatar: "$1,549",
    aiCartoon: "$1,549",
    hyperRealistic: "$2,949",
    digitalTwin: "$3,499",
  },
  {
    package: "30+ Videos",
    delivery: "Custom Timeline",
    videos: "30+",
    badge: "Custom Scale",
    aiUgc: "Custom",
    aiAvatar: "Custom",
    aiCartoon: "Custom",
    hyperRealistic: "Custom",
    digitalTwin: "Custom",
  },
];

export const digitalTwinSetupItem = {
  service: "Digital Twin Setup (One-time)",
  delivery: "Within 72 Hrs",
  price: "$499",
  description: "One-time fee to build your Digital Twin before ordering Digital Twin videos.",
};

export const twinFeatures = [
  "Digital Twin Creation & Setup",
  "Face/Avatar Training",
  "Voice Clone Setup",
  "AI Speaking Model Configuration",
  "Lip-Sync Model Setup",
  "Basic Expressions & Gestures",
  "Brand-Ready Avatar Configuration",
  "Initial Testing & Optimization",
  "Setup for Future Digital Twin Videos",
];

export const deliverables = [
  {
    title: "AI UGC Video",
    items: [
      "Up to 60-sec Reel",
      "Script Included",
      "AI Creator/Influencer-Style Video",
      "Product/Service-Focused Script",
      "AI-Generated UGC Creator",
      "Voiceover",
      "Lip-Sync & Expressions",
      "Product/Service Integration",
      "Captions/Subtitles",
      "Background Music",
      "Basic Sound Effects",
      "9:16 Reel Format",
      "1 Revision",
    ],
  },
  {
    title: "AI Cartoon Animation",
    items: [
      "Up to 60-sec Reel",
      "Script Included",
      "Concept & Script Adaptation",
      "AI Cartoon/Animated Characters",
      "Scene-by-Scene Animation",
      "AI Voiceover",
      "Character Expressions & Movements",
      "Backgrounds & Visual Elements",
      "Captions/Subtitles",
      "Background Music & Sound Effects",
      "9:16 Reel Format",
      "1 Revision",
    ],
  },
  {
    title: "AI Avatar Video",
    items: [
      "Up to 60-sec Reel",
      "Script Included",
      "AI Avatar Selection/Creation",
      "Professional Script",
      "AI Voiceover",
      "Natural Lip-Sync",
      "Avatar Expressions & Gestures",
      "Brand/Product Visuals",
      "Captions/Subtitles",
      "Background Music",
      "Basic Motion Graphics",
      "9:16 Reel Format",
      "1 Revision",
    ],
  },
  {
    title: "Hyper-Realistic AI Video",
    items: [
      "Up to 60-sec Reel",
      "Script Included",
      "Hyper-Realistic AI Characters/Scenes",
      "Professional Concept & Script",
      "Cinematic AI Visuals",
      "Realistic Human/Product Movements",
      "AI Voiceover",
      "Lip-Sync Where Applicable",
      "Product/Service Integration",
      "Cinematic Transitions",
      "Sound Design & Background Music",
      "Captions/Subtitles",
      "9:16 Reel Format",
      "1 Revision",
    ],
  },
  {
    title: "AI Digital Twin / Clone",
    items: [
      "Up to 60-sec Reel",
      "Script Included",
      "Digital Twin / Clone-Based Video",
      "Client-Approved Digital Twin",
      "Clone Voiceover",
      "AI Lip-Sync",
      "Facial Expressions & Gestures",
      "Brand/Product Integration",
      "Captions/Subtitles",
      "Background Music",
      "Basic Motion Graphics",
      "9:16 Reel Format",
      "1 Revision",
    ],
  },
];


export const useCases = [
  "Product Advertisements",
  "Product Demonstrations",
  "Product Reviews",
  "Unboxing Videos",
  "AI UGC Advertisements",
  "Customer Testimonials",
  "Real Estate Promotional Videos",
  "Clinic & Doctor Explainers",
  "Educational Videos",
  "Service Explainer Videos",
  "Brand Awareness Reels",
  "Product Launch Videos",
  "Promotional Reels",
  "Founder Videos",
  "Personal Branding Videos",
  "Social Media Advertisements",
  "AI Video Ads",
  "Corporate Communication",
  "Storytelling Videos",
];

export const processSteps = [
  {
    title: "Share Your Requirement",
    description: "Tell us about your business, product/service, audience and video objective.",
  },
  {
    title: "Script & Concept",
    description: "Our team prepares the video script and creative concept.",
  },
  {
    title: "Approve the Script",
    description: "Review and approve the script/concept before production begins.",
  },
  {
    title: "AI Video Production",
    description:
      "We create the AI visuals, voiceover, lip-sync, animation, captions, music and editing.",
  },
  {
    title: "Review & Revision",
    description: "Review the completed video and use the included revision where applicable.",
  },
  {
    title: "Final Delivery",
    description: "After completion of the balance payment, the final video is delivered.",
  },
];

export const whyUs = [
  {
    title: "5+ AI Video Formats",
    description: "From AI UGC and AI avatars to hyper-realistic videos and digital twins.",
  },
  {
    title: "Business-Focused Content",
    description:
      "Scripts and concepts are created around your product, service and target audience.",
  },
  {
    title: "Complete Video Production",
    description: "Script, AI generation, voiceover, lip-sync, captions, music and editing.",
  },
  {
    title: "Fast Turnaround",
    description:
      "Standard delivery within 48–72 working hours after script approval and receipt of required materials.",
  },
  {
    title: "Scalable Packages",
    description: "Choose from single videos or 5, 10 and 15-video packages.",
  },
  {
    title: "Social Media Ready",
    description: "Vertical 9:16 format suitable for modern social media platforms.",
  },
];

export const faqs = [
  {
    question: "What AI video production services does Quickupp AI Studio offer?",
    answer:
      "Quickupp AI Studio offers AI UGC videos, AI cartoon animations, AI avatar videos, hyper-realistic AI videos and AI digital twin or clone videos for businesses.",
  },
  {
    question: "How much does AI video production cost?",
    answer:
      "Our AI video production services start from $79 per reel. Pricing depends on the selected video format, production requirements and package size.",
  },
  {
    question: "What is included in an AI video?",
    answer:
      "Depending on the selected service, the package can include scripting, AI-generated visuals, voiceover, lip-sync, expressions, captions, music, sound effects, motion graphics and final 9:16 editing.",
  },
  {
    question: "How long does AI video production take?",
    answer:
      "Our standard delivery timeline is 48–72 working hours after script approval and receipt of all required materials.",
  },
  {
    question: "Can you create AI UGC videos for my product?",
    answer:
      "Yes. We create AI UGC videos featuring AI-generated creators for product demonstrations, reviews, recommendations, testimonials and promotional content.",
  },
  {
    question: "Can you create an AI avatar of me?",
    answer:
      "Yes. We can create an appropriately authorized AI avatar or digital twin for clients who want to produce recurring videos using their approved appearance and voice.",
  },
  {
    question: "What is an AI digital twin?",
    answer:
      "An AI digital twin is a reusable digital representation of a person that can be used to create AI-powered videos using an appropriately authorized avatar and voice configuration.",
  },
  {
    question: "Can I use AI videos for Instagram Reels?",
    answer:
      "Yes. Our standard videos are delivered in vertical 9:16 format suitable for Instagram Reels, Facebook and YouTube Shorts.",
  },
  {
    question: "How many revisions are included?",
    answer:
      "One revision is included with the standard package, based on the approved script and concept.",
  },
  {
    question: "Can I order multiple AI videos every month?",
    answer:
      "Yes. We offer 5, 10 and 15-reel packages and can also create customized monthly AI video production plans.",
  },
];

export const nav = [
  { label: "Samples", href: "/#samples" },
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "How It Works", href: "/#process" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export const calendlyUrl =
  "https://calendly.com/qsaistudio/quickupp-ai-studio-30-min-strategy-call";
export const strategyCallEmail = "qsaistudio@gmail.com";

export const footerTagline = "AI-Powered Videos. Built for Your Business.";
export const footerDescription =
  "Quickupp AI Studio provides professional AI video production services for businesses, brands and creators. Create AI UGC, AI avatar, cartoon, hyper-realistic and digital twin videos for social media, advertising and digital marketing.";
export const footerEmail = "info@quickuppaistudio.us";
export const footerPhone = "+1 (302) 754-5679";
export const footerUsaAddress = "8 The Green, Suite A, Dover, Delaware - 19901, USA";
export const footerUsaMapUrl = "https://maps.app.goo.gl/2rLqrCN4rco2XpQr5";
export const footerCanadaAddress = "Jacques St, Montréal, QC H2Y 1P5";
export const footerCanadaMapUrl = "https://maps.google.com/?q=Jacques+St,+Montr%C3%A9al,+QC+H2Y+1P5";
export const footerCopyright = `© ${new Date().getFullYear()} Quickupp AI Studio. All rights reserved.`;

export const whatsAppPhoneNumber = "13027545679";
export const whatsAppDefaultMessage = `Hello Quickupp AI Studio Team,

I visited quickuppaistudio.us and I am interested in exploring your AI Video Production services for my business.

Could you please share details regarding:
- Available AI video formats (UGC, Avatar, Hyper-Realistic, Cartoon, Digital Twin)
- Pricing packages and turnaround timelines
- Next steps to get started

Quickupp AI Studio USA
Website: https://quickuppaistudio.us
Address: 8 The Green, Suite A, Dover, Delaware - 19901, USA
Email: info@quickuppaistudio.us`;

export const whatsAppUrl = `https://wa.me/${whatsAppPhoneNumber}?text=${encodeURIComponent(whatsAppDefaultMessage)}`;
