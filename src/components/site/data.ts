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
    format: "AI Avatar",
    industry: "Hospitality & Food",
    description: "AI avatar presenter reel highlighting a hotel's diverse food menu and dining varieties.",
    videoUrl: "",
  },
  {
    format: "Hyper-Realistic",
    industry: "Luxury Cosmetics & Beauty",
    description: "Cinematic 3D hyper-realistic product commercial showcasing DIOR Addict Lip Maximizer with studio lighting and macro details.",
    videoUrl: "/videos/Hyper%20Realistic%20Sample.mp4",
  },
  {
    format: "AI Cartoon",
    industry: "Food & Confectionery",
    description:
      "Engaging animated brand storytelling reel with custom characters for Chitale Kesar Modak.",
    videoUrl: "",
  },
  {
    format: "Digital Twin",
    industry: "Founder Branding",
    description: "Founder-led update reel created from an approved digital twin.",
    videoUrl: "",
  },
];

export const portfolioItems = [
  {
    industry: "Skincare & Beauty",
    description:
      "Authentic creator-style morning routine and product review for Rhode Peptide Glazing Fluid.",
    videoUrl: "/videos/Portfolio 1.mp4",
  },
  {
    industry: "Luxury Haircare & Beauty",
    description:
      "Authentic creator-style hair styling routine and product spotlight reel for Dyson Airwrap.",
    videoUrl: "/videos/Portfolio 2.mp4",
  },
  {
    industry: "High Jewelry & Gemstones",
    description:
      "Cinematic reveal commercial showcasing Bvlgari fine jewelry with volcanic gemstone transitions and macro studio lighting.",
    videoUrl: "/videos/Portfolio 3.mp4",
  },
  {
    industry: "Athletic Footwear & Sportswear",
    description:
      "High-energy performance commercial featuring Nike running shoes with explosive athlete movements and ground-strike closeups.",
    videoUrl: "/videos/Portfolio 4.mp4",
  },
  {
    industry: "Luxury Cosmetics & Lip Care",
    description:
      "High-gloss commercial reveal reel showcasing Dior Addict Lip Glow with sensory macro textures and studio lighting.",
    videoUrl: "/videos/Portfolio 5.mp4",
  },
  {
    industry: "Digital Twin & Executive",
    description:
      "Founder-led brand update reel powered by a hyper-realistic digital twin — no camera, no studio needed.",
    videoUrl: "",
  },
];

export const services = [
  {
    title: "AI UGC Video Production",
    description:
      "Create authentic creator-style videos for your products and services without arranging a traditional influencer shoot.",
    bestFor: "D2C brands, e-commerce, beauty, skincare, food and consumer brands.",
    items: [
      "Product Reviews",
      "Product Demonstrations",
      "Unboxing Videos",
      "Testimonials",
      "Product Recommendations",
      "Problem → Solution Videos",
      "Social Media Advertisements",
    ],
    price: "$79 / Reel",
    cta: "Create AI UGC Video",
  },
  {
    title: "AI Cartoon Animation Services",
    description:
      "Turn your ideas into engaging animated videos using AI-generated characters, scenes and storytelling.",
    bestFor: "Education, coaching, SaaS, children's brands and creative businesses.",
    items: [
      "Explainer Videos",
      "Educational Content",
      "Brand Stories",
      "Animated Reels",
      "Character-Based Videos",
      "Product Explainers",
    ],
    price: "$79 / Reel",
    cta: "Create Cartoon Video",
  },
  {
    title: "AI Avatar Video Production",
    description:
      "Create professional presenter-style videos using realistic AI avatars without requiring a traditional camera shoot.",
    bestFor: "Real Estate, Clinics, Education, Finance, SaaS and professional services.",
    items: [
      "Business Presentations",
      "Educational Videos",
      "Property Videos",
      "Doctor/Clinic Explainers",
      "Service Explainers",
      "Corporate Videos",
      "Social Media Reels",
    ],
    price: "$99 / Reel",
    cta: "Create AI Avatar Video",
  },
  {
    title: "Hyper-Realistic AI Video Production",
    description:
      "Create cinematic AI-generated people, environments, products and scenes for premium visual storytelling.",
    bestFor: "Real Estate, Jewellery, Fashion, Luxury Brands and premium businesses.",
    items: [
      "Product Advertisements",
      "Cinematic Brand Videos",
      "Real Estate Videos",
      "Product Launches",
      "Premium Social Media Content",
      "Advertising Campaigns",
    ],
    price: "$149 / Reel",
    cta: "Create Hyper-Realistic Video",
  },
  {
    title: "AI Digital Twin & Clone Video Services",
    description:
      "Create recurring video content using an appropriately authorized digital twin and AI voice setup.",
    bestFor: "Founders, Doctors, Coaches, Consultants, Educators, Influencers and Personal Brands.",
    items: [
      "Founder Videos",
      "Personal Branding",
      "Educational Reels",
      "Expert Content",
      "Business Updates",
      "Promotional Videos",
      "Social Media Content",
    ],
    price: "$179 / Reel",
    cta: "Get Your Digital Twin",
  },
];

export const whyAiVideo = [
  {
    title: "Create More Content",
    description: "Produce more videos for social media, advertising and content marketing.",
  },
  {
    title: "Faster Production",
    description:
      "Create professional video content through streamlined AI-powered production workflows.",
  },
  {
    title: "Reduce Production Complexity",
    description:
      "Reduce dependency on traditional shoots, locations and repeated recording sessions.",
  },
  {
    title: "Consistent Content",
    description: "Maintain consistent messaging, presentation and visual style across your videos.",
  },
  {
    title: "Scalable Video Marketing",
    description:
      "Create one video or multiple videos every month based on your content requirements.",
  },
  {
    title: "Social Media Ready",
    description:
      "Receive videos in vertical 9:16 format suitable for Instagram Reels, Facebook and YouTube Shorts.",
  },
];

export interface IndividualPricing {
  service: string;
  price: string;
  badge?: string;
  description?: string;
}

export const individualPricingList: IndividualPricing[] = [
  { service: "AI UGC", price: "$79", description: "Authentic creator-style product review & demo reels" },
  { service: "AI Cartoon", price: "$79", description: "Engaging 3D & 2D character animation storytelling" },
  { service: "AI Avatar", price: "$99", description: "Professional presenter-style spokesperson reels" },
  { service: "Hyper-Realistic", price: "$149", description: "Cinematic commercial-grade visual storytelling" },
  { service: "Digital Twin Video", price: "$179", description: "Recurring content with your custom AI twin & voice" },
  { service: "Digital Twin Setup", price: "$499", badge: "One-Time", description: "Full avatar model training, voice clone & speaking setup" },
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
    package: "Single Video",
    delivery: "24 Hrs",
    videos: 1,
    aiUgc: "$79",
    aiAvatar: "$99",
    aiCartoon: "$79",
    hyperRealistic: "$149",
    digitalTwin: "$179",
  },
  {
    package: "Starter",
    delivery: "72 Hrs",
    videos: 5,
    aiUgc: "$349",
    aiAvatar: "$449",
    aiCartoon: "$349",
    hyperRealistic: "$649",
    digitalTwin: "$799",
  },
  {
    package: "Growth",
    delivery: "Within 7 Days",
    videos: 10,
    popular: true,
    badge: "Most Popular",
    aiUgc: "$649",
    aiAvatar: "$799",
    aiCartoon: "$649",
    hyperRealistic: "$1,199",
    digitalTwin: "$1,499",
  },
  {
    package: "Scale",
    delivery: "Within 14 Days",
    videos: 15,
    badge: "High Growth",
    aiUgc: "$899",
    aiAvatar: "$1,099",
    aiCartoon: "$899",
    hyperRealistic: "$1,699",
    digitalTwin: "$2,099",
  },
  {
    package: "Pro",
    delivery: "Within 16 Days",
    videos: 20,
    badge: "Best Value",
    aiUgc: "$1,099",
    aiAvatar: "$1,399",
    aiCartoon: "$1,099",
    hyperRealistic: "$2,199",
    digitalTwin: "$2,599",
  },
  {
    package: "Enterprise",
    delivery: "Within 20 Days",
    videos: 30,
    badge: "Maximum Scale",
    aiUgc: "$1,499",
    aiAvatar: "$1,999",
    aiCartoon: "$1,499",
    hyperRealistic: "$3,299",
    digitalTwin: "$3,799",
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
  { label: "Samples", href: "#samples" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "How It Works", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const calendlyUrl =
  "https://calendly.com/qsaistudio/quickupp-ai-studio-30-min-strategy-call";
export const strategyCallEmail = "qsaistudio@gmail.com";

export const footerTagline = "AI-Powered Videos. Built for Your Business.";
export const footerDescription =
  "Quickupp AI Studio provides professional AI video production services for businesses, brands and creators. Create AI UGC, AI avatar, cartoon, hyper-realistic and digital twin videos for social media, advertising and digital marketing.";
export const footerEmail = "info@quickuppaistudio.us";
export const footerPhone = "+91 8177828748";
export const footerUsaAddress = "8 The Green, Suite A, Dover, Delaware - 19901, USA";
export const footerUsaMapUrl = "https://maps.app.goo.gl/2rLqrCN4rco2XpQr5";
export const footerCanadaAddress = "Jacques St, Montréal, QC H2Y 1P5";
export const footerCanadaMapUrl = "https://maps.google.com/?q=Jacques+St,+Montr%C3%A9al,+QC+H2Y+1P5";
export const footerCopyright = `© ${new Date().getFullYear()} Quickupp AI Studio. All rights reserved.`;

export const whatsAppPhoneNumber = "918177828748";
export const whatsAppDefaultMessage = `Hello Quickupp AI Studio Team,

I visited quickuppaistudio.us and I'm interested in exploring your AI Video Production services for my business.

Could you please share details regarding:
• Available AI video formats (UGC, Avatar, Hyper-Realistic, Cartoon, Digital Twin)
• Pricing packages & turnaround timelines
• Next steps to get started

Looking forward to connecting with your team!`;

export const whatsAppUrl = `https://wa.me/${whatsAppPhoneNumber}?text=${encodeURIComponent(whatsAppDefaultMessage)}`;
