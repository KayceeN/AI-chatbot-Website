export type SectionId =
  | "hero"
  | "benefits"
  | "features"
  | "services"
  | "process"
  | "projects"
  | "customers"
  | "pricing"
  | "comparison"
  | "team"
  | "contact"
  | "faq"
  | "footer";

export interface LandingNavItem {
  label: string;
  href: string;
}

export interface CTA {
  label: string;
  href: string;
  variant: "primary" | "secondary";
}

export interface HeroMediaConfig {
  posterSrc: string;
  webmSrc: string;
  mp4Src: string;
  aspectRatio: string;
  idleDelayMs: number;
  observerRootMargin: string;
  observerThreshold: number;
  fadeMs: number;
}

export interface LandingPageContent {
  brand: string;
  nav: LandingNavItem[];
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctas: [CTA, CTA];
    quote: string;
    quoteAuthor: string;
    media: HeroMediaConfig;
  };
  benefits: {
    badge: string;
    title: string;
    subtitle: string;
    cards: Array<{ title: string; body: string }>;
    chips: string[];
  };
  features: {
    badge: string;
    title: string;
    subtitle: string;
    cards: Array<{ title: string; body: string; visual: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" }>;
    ctas: [CTA, CTA];
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    cards: Array<{ title: string; body: string }>;
  };
  process: {
    badge: string;
    title: string;
    subtitle: string;
    steps: Array<{ id: string; title: string; body: string }>;
  };
  projects: {
    badge: string;
    title: string;
    subtitle: string;
    tabs: string[];
    caseStudies: Array<{
      id: string;
      title: string;
      body: string;
      metrics: Array<{ value: string; label: string }>;
    }>;
  };
  customers: {
    badge: string;
    title: string;
    subtitle: string;
    featureQuote: string;
    miniTestimonials: Array<{ quote: string; name: string; role: string }>;
    stats: Array<{ value: string; label: string }>;
  };
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    plans: Array<{
      name: string;
      monthly: string;
      yearly: string;
      blurb: string;
      popular?: boolean;
      features: string[];
    }>;
    donationLine: string;
  };
  comparison: {
    badge: string;
    title: string;
    subtitle: string;
    us: { label: string; features: string[] };
    others: { label: string; features: string[] };
  };
  team: {
    badge: string;
    title: string;
    subtitle: string;
    members: Array<{ name: string; role: string }>;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    infoCards: Array<{ title: string; body: string; linkLabel: string; linkHref: string }>;
    form: {
      fullName: string;
      email: string;
      subject: string;
      message: string;
      submit: string;
      placeholders: {
        fullName: string;
        email: string;
        subject: string;
        message: string;
      };
    };
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    entries: Array<{ question: string; answer: string }>;
    emailLine: string;
    email: string;
  };
  footer: {
    headline: string;
    cta: CTA;
    links: string[];
  };
}

export const sectionOrder: SectionId[] = [
  "hero",
  "benefits",
  "features",
  "services",
  "process",
  "projects",
  "customers",
  "pricing",
  "comparison",
  "team",
  "contact",
  "faq",
  "footer"
];

export const landingContent: LandingPageContent = {
  brand: "kAyphI",
  nav: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Services", href: "#services" },
    { label: "Updates", href: "#customers" },
    { label: "Contact", href: "#contact" }
  ],
  hero: {
    badge: "AI AUTOMATION FOR BUSINESSES",
    title: "kAyphI",
    subtitle: "Custom AI solutions, built for the innovators of tomorrow",
    ctas: [
      { label: "Get Template", href: "#pricing", variant: "primary" },
      { label: "See Our Services", href: "#services", variant: "secondary" }
    ],
    quote:
      "We harness your data, understand your audience, and use AI to help your brand rise above the noise. The best part? We execute, too.",
    quoteAuthor: "Founder of kAyphI",
    media: {
      posterSrc: "/videos/hero/hero-clean-poster.webp",
      webmSrc: "/videos/hero/hero-clean.webm",
      mp4Src: "/videos/hero/hero-clean.mp4",
      aspectRatio: "16 / 9",
      idleDelayMs: 1200,
      observerRootMargin: "200px 0px",
      observerThreshold: 0.2,
      fadeMs: 520
    }
  },
  benefits: {
    badge: "BENEFITS",
    title: "Why Choose Us",
    subtitle: "Partner with an AI agency delivering smart solutions.",
    cards: [
      {
        title: "Real-Time Analytics",
        body: "Stay ahead with accurate, real-time performance tracking"
      },
      {
        title: "AI-Driven Growth",
        body: "Make smarter moves with accurate, real-time business insights."
      },
      {
        title: "Sync in real time",
        body: "Connect with your team instantly to track progress and updates"
      }
    ],
    chips: [
      "Scalable Solutions",
      "Personalized Experiences",
      "Cost Effective",
      "Real-Time Insights",
      "Automation"
    ]
  },
  features: {
    badge: "FEATURES",
    title: "All features in 1 tool",
    subtitle: "Discover features that simplify workflows & grow your business.",
    cards: [
      {
        title: "Cutting-Edge AI",
        body: "Deploy AI solutions that adapt quickly, learn fast, and scale with your business needs.",
        visual: "topLeft"
      },
      {
        title: "Automated Workflows",
        body: "Streamline tasks and boost efficiency with powerful, scalable AI-powered automation tools for growing teams and projects.",
        visual: "topRight"
      },
      {
        title: "Insightful Analytics",
        body: "Gain deep, real-time data insights with advanced AI analytics to guide smarter strategies, decisions, and scalable business growth.",
        visual: "bottomLeft"
      },
      {
        title: "AI-Powered Support",
        body: "Enhance customer experience with AI-driven virtual assistants available for support and engagement.",
        visual: "bottomRight"
      }
    ],
    ctas: [
      { label: "Get Started", href: "#contact", variant: "primary" },
      { label: "See Our Services", href: "#services", variant: "secondary" }
    ]
  },
  services: {
    badge: "SERVICES",
    title: "Our AI-Driven Services",
    subtitle: "Leverage AI features that boost performance to your business.",
    cards: [
      {
        title: "AI Strategy Consulting",
        body: "Get expert guidance to implement AI solutions that drive business growth"
      },
      {
        title: "Content Generation",
        body: "We provide seamless content creation solutions that generate captivating, high-quality content in line with your brand's voice."
      },
      {
        title: "AI-Powered Chatbots",
        body: "We develop AI-driven chatbots with advanced cognitive technologies to elevate customer support and automate business operations."
      },
      {
        title: "Automated Workflows",
        body: "Automate workflows to streamline tasks, boost efficiency, and save time"
      }
    ]
  },
  process: {
    badge: "PROCESS",
    title: "Simple & Scalable",
    subtitle: "A transparent process of collaboration and feedback",
    steps: [
      {
        id: "01",
        title: "Workflow Assessment",
        body: "We begin by examining your existing workflows to identify where AI can deliver the greatest impact."
      },
      {
        id: "02",
        title: "Deploy with Confidence",
        body: "Our team develops custom AI systems built around your goals, ensuring safe and reliable deployment."
      },
      {
        id: "03",
        title: "Ongoing Support & Optimization",
        body: "After deployment, we provide support and refine your AI systems to keep them performing at their best."
      }
    ]
  },
  projects: {
    badge: "PROJECTS",
    title: "Proven Impact & Results",
    subtitle: "Explore Projects that reflect our AI expertise & real world impact",
    tabs: ["PROJECT 1", "PROJECT 2", "PROJECT 3"],
    caseStudies: [
      {
        id: "01",
        title: "MedixCare — AI Triage Assistant for Healthcare",
        body: "We built a custom AI triage assistant that evaluates symptoms and routes patients to the appropriate care level.",
        metrics: [
          { value: "40%", label: "Reduced average wait" },
          { value: "30%", label: "Rise in patient satisfaction" }
        ]
      },
      {
        id: "02",
        title: "NeoMart — Smart Product Recommendations",
        body: "Integrated AI-driven product recommendations based on real-time user behavior and historical data.",
        metrics: [
          { value: "22%", label: "Boosted order value" },
          { value: "18%", label: "Reduced cart dropoff" }
        ]
      },
      {
        id: "03",
        title: "Workwise — Automated HR Workflow Bot",
        body: "Developed an AI-powered workflow automation bot for onboarding, leave requests, and FAQ handling.",
        metrics: [
          { value: "60%", label: "Saved admin time" },
          { value: "35%", label: "Improved team output" }
        ]
      }
    ]
  },
  customers: {
    badge: "CUSTOMERS",
    title: "What Our Clients Say",
    subtitle: "Join customers who trust AI to transform their business.",
    featureQuote:
      "Their AI-driven approach helped us reach the right audience and grow faster with smarter insights, streamlining our strategy, improving engagement, and delivering results we couldn't achieve before.",
    miniTestimonials: [
      {
        quote:
          "We needed intelligent automation and they nailed it. Every step was collaborative, transparent, and focused on delivering the best outcome for us",
        name: "Brendan",
        role: "Marketing Director at StratIQ"
      },
      {
        quote:
          "Their team helped us identify key opportunities for AI, then built tools that boosted both our speed and accuracy. We're already seeing results.",
        name: "Lena M",
        role: "Manager at NovaTech"
      },
      {
        quote:
          "From ideation to final delivery, they were incredibly proactive and sharp. Our new AI-powered assistant reduced manual work and improved user satisfaction",
        name: "Eli R",
        role: "COO at GridFrame"
      }
    ],
    stats: [
      { value: "100+", label: "Projects Completed" },
      { value: "95%", label: "Client Satisfaction" },
      { value: "10+", label: "Years of Experience" }
    ]
  },
  pricing: {
    badge: "PRICING",
    title: "Simple Price For All",
    subtitle: "Flexible pricing plans that fit your budget & scale with needs.",
    plans: [
      {
        name: "Starter",
        monthly: "$800/month",
        yearly: "$700/month",
        blurb: "Ideal for businesses ready to explore AI and intelligent automation",
        features: [
          "Basic AI Tools",
          "Limited Automation Features",
          "Real-Time Reporting",
          "Basic Chatbot Integration"
        ]
      },
      {
        name: "Pro",
        monthly: "$1700/month",
        yearly: "$1600/month",
        blurb: "Built for companies that want to gain an edge with AI-powered automation",
        popular: true,
        features: [
          "Advanced AI Tools",
          "Customizable Workflows",
          "AI-Powered Analytics",
          "Premium Chatbot Features",
          "Cross-Platform Integrations"
        ]
      },
      {
        name: "Enterprise",
        monthly: "$4700/month",
        yearly: "$3600/month",
        blurb: "For businesses aiming to harness AI and automation to lead their industry",
        features: [
          "Fully Customized AI Solutions",
          "Unlimited Integrations",
          "Advanced Reporting & Insights",
          "Scalable AI Solutions",
          "Team Collaboration Features",
          "Priority Feature Access"
        ]
      }
    ],
    donationLine: "We donate 2% of your membership to pediatric wellbeing"
  },
  comparison: {
    badge: "COMPARISON",
    title: "Precision vs Basic",
    subtitle: "See how our AI outperforms competitors with speed.",
    us: {
      label: "kAyphI",
      features: [
        "Automated workflows",
        "Personalized AI-driven strategies",
        "Data-backed real-time insights",
        "Scalable AI systems",
        "Trained chatbots",
        "Rapid AI-generated content",
        "Real time data analysis"
      ]
    },
    others: {
      label: "Others",
      features: [
        "Manual workflows",
        "Generic one-size-fits-all solutions",
        "Decision-making based on guesswork",
        "Lacks scalability",
        "Standard chatbots",
        "Time-consuming content creation"
      ]
    }
  },
  team: {
    badge: "TEAM",
    title: "Team Behind Success",
    subtitle: "Meet the experts behind our AI — driven to deliver smart solutions.",
    members: [
      { name: "Gwen Chase", role: "Marketing" },
      { name: "James Bond", role: "Designer" },
      { name: "Emily Gwen", role: "Support Team" }
    ]
  },
  contact: {
    badge: "CONTACT",
    title: "Reach Us At Anytime",
    subtitle: "Have questions or need any help? We're here to help you with that",
    infoCards: [
      {
        title: "Email",
        body: "Feel free to email me if you have any questions or need more details!",
        linkLabel: "kayphi@support.com",
        linkHref: "mailto:kayphi@support.com"
      },
      {
        title: "Call",
        body: "Feel free to book a call if that's more convenient and easier for you",
        linkLabel: "Book a call",
        linkHref: "#contact"
      }
    ],
    form: {
      fullName: "Full Name",
      email: "Email Address",
      subject: "Subject Of Interest",
      message: "How may we assist you?",
      submit: "Send Your Message",
      placeholders: {
        fullName: "Ikta Sollork",
        email: "kayphi@support.com",
        subject: "Regarding Project",
        message: "Give us more info.."
      }
    }
  },
  faq: {
    badge: "FAQS",
    title: "Questions? Answers!",
    subtitle: "Find Some quick answers to the most common questions.",
    entries: [
      {
        question: "What services do you offer?",
        answer:
          "We specialize in AI solutions, including machine learning models, automation, chatbots, predictive analytics, and consulting tailored to your business needs"
      },
      {
        question: "How long does it take to develop an AI solution?",
        answer: "Timelines depend on scope, but most projects launch in phased milestones with visible progress every sprint."
      },
      {
        question: "Do I need technical expertise to work with you?",
        answer: "No. We translate technical decisions into business terms and guide your team through adoption."
      },
      {
        question: "Is my data safe when working with your agency?",
        answer: "Yes, we use strict access controls and secure deployment practices tailored to your compliance needs."
      },
      {
        question: "Can AI really help my business grow?",
        answer: "AI helps automate repetitive work, improve decision quality, and unlock new opportunities across operations and customer experience."
      }
    ],
    emailLine: "Feel free to mail us for any enquiries:",
    email: "kayphi@support.com"
  },
  footer: {
    headline: "Next-gen AI systems, built for tomorrow's innovators",
    cta: { label: "Get Started", href: "#contact", variant: "primary" },
    links: ["Features", "Contact", "Projects", "Updates", "Privacy"]
  }
};
