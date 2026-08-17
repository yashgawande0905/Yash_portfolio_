/**
 * Canonical site URL — used for SEO tags, sitemap and the JSON-LD block.
 * Override per-environment with VITE_SITE_URL (set it in Vercel once you know
 * your final domain).
 */
export const siteUrl = (
  import.meta.env.VITE_SITE_URL || 'https://yashgawande.vercel.app'
).replace(/\/$/, '')

export const profile = {
  name: 'Yash Gawande',
  roles: [
    'Mechanical Engineer',
    'AI/ML Researcher',
    'Full-Stack Developer',
    'Aerospace Enthusiast',
    'Bio-Medical Tech Explorer'
  ],
  bioParagraphs: [
    'I\u2019m Yash Gawande \u2014 an engineer who loves combining mechanical systems with artificial intelligence to create smarter, data-driven solutions.',
    'Currently a Research Intern at CAIR, IIT Mandi, benchmarking medical image segmentation architectures \u2014 U-Net, U-Net++, TransUNet, Swin-Unet and SAMUS \u2014 for breast lesion and cardiac ultrasound analysis, and designing an autonomous prompt-generation framework for fully automatic segmentation.',
    'From an industry-backed Flutter build system at IIT Delhi\u2019s CART lab to a real-time biomass gasification reactor at NIT Trichy, I\u2019ve worked across disciplines \u2014 code, sensors, and machines \u2014 to make systems more efficient and intelligent.',
    'If it involves data, innovation, or smart systems, I\u2019m in.'
  ],
  socials: {
    linkedin: 'https://www.linkedin.com/in/yashsgawande0905',
    github: 'https://github.com/yashgawande0905',
    email: 'yashgawande0905@gmail.com'
  },
  portrait: '/assets/portrait-square.jpg',
  /** Full-resolution original — only loaded when the lightbox opens. */
  banner: '/assets/skyline-banner.jpg',
  /** Lighter copy used for the in-page render. */
  bannerWeb: '/assets/skyline-banner-web.jpg',
  /** 1200x630 card shown when the site is shared on social / WhatsApp. */
  ogImage: '/assets/og-image.jpg',
  location: 'Pune, Maharashtra, India'
}

export type SkillCategory = {
  title: string
  glyph: string
  skills: { name: string; icon?: string; mono?: boolean }[]
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Programming Languages',
    glyph: '\u2726',
    skills: [
      { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      { name: 'HTML/CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
      { name: 'MATLAB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg' }
    ]
  },
  {
    title: 'Aerospace & Engineering Tools',
    glyph: '\u2699',
    skills: [
      { name: 'GMAT', mono: true },
      { name: 'AutoCAD', icon: '/assets/autocad.jpeg' },
      { name: 'Fusion 360', icon: '/assets/fusion360.png' },
      { name: 'CATIA V5', icon: '/assets/catia.png' },
      { name: 'ANSYS', icon: '/assets/ansys.png' }
    ]
  },
  {
    title: 'Artificial Intelligence & Machine Learning',
    glyph: '\u25C8',
    skills: [
      { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
      { name: 'PyTorch', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Pytorch_logo.png' },
      { name: 'OpenCV', icon: 'https://opencv.org/wp-content/uploads/2020/07/OpenCV_logo_black.png' },
      { name: 'Pandas', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Pandas_logo.svg' },
      { name: 'NumPy', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/NumPy_logo.svg' },
      { name: 'Streamlit', mono: true }
    ]
  },
  {
    title: 'Web & Backend Development',
    glyph: '\u25C7',
    skills: [
      { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
      { name: 'Flask', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
      { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
      { name: 'RESTful APIs', mono: true }
    ]
  },
  {
    title: 'Data & Productivity',
    glyph: '\u25C6',
    skills: [
      { name: 'Excel', icon: '/assets/excel.jpeg' },
      { name: 'Git/GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
      { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' }
    ]
  }
]

export const education = [
  {
    school: 'MIT Academy of Engineering, Pune',
    degree: 'B.Tech \u2014 Mechanical Engineering',
    period: 'Aug 2023 \u2013 May 2027',
    detail: 'Exploring innovation at the intersection of AI and mechanical systems.',
    image: '/assets/mitaoe.jpeg'
  },
  {
    school: 'Janata Mahavidyalaya, Chandrapur',
    degree: 'Intermediate \u2014 PCM & Computer Science',
    period: 'Aug 2021 \u2013 May 2023',
    detail: 'Focused on Physics, Mathematics, and computer fundamentals with distinction.',
    image: '/assets/jmvc.jpeg'
  }
]

export type ExperienceItem = {
  role: string
  org: string
  period: string
  location: string
  detail: string
  image?: string
  /** object-position for the card thumbnail, when the default centre crop is wrong */
  imagePosition?: string
  /** Attribution shown over the photo \u2014 required by the CC BY-SA licence */
  credit?: { text: string; href: string }
  glyphLabel?: string
}

export const experience: ExperienceItem[] = [
  {
    role: 'Research Intern',
    org: 'CAIR, IIT Mandi',
    period: 'June 2026 \u2013 10 Aug 2026 \u00b7 Ongoing',
    location: 'Mandi, Himachal Pradesh (On-site)',
    detail:
      'Developed and benchmarked U-Net, U-Net++, TransUNet, Swin-Unet and SAMUS for breast lesion and cardiac ultrasound segmentation on the BUSI and CAMUS datasets. Designed a novel autonomous prompt-generation framework combining a Dense Localization Head with YASH (Yield-Adaptive Autonomous Spotting & Heuristics) for fully automatic ultrasound lesion segmentation, with extensive ablations across Dice, IoU, Precision, Recall, HD95, Boundary Dice and Calibration Error.',
    image: '/assets/iit-mandi.jpg',
    imagePosition: 'center 55%',
    credit: {
      text: 'Timothy A. Gonsalves / Wikimedia Commons \u00b7 CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:IIT_Mandi_Campus_from_Griffon_Peak_Jan_2020_D72_13785.jpg'
    },
    glyphLabel: 'CAIR'
  },
  {
    role: 'Project Intern',
    org: 'IIT Delhi \u2014 CART',
    period: 'Dec 2025 \u2013 Jan 2026',
    location: 'Delhi (On-site)',
    detail:
      'Worked on an industry-backed Flutter application at the Centre for Automotive Research and Tribology, IIT Delhi, in collaboration with Arresto Solutions Pvt. Ltd. Redesigned the Scheduler module\u2019s UI/UX and implemented automated Flutter build and deployment workflows using CI principles and Bash scripting, cutting manual build effort.',
    image: '/assets/iit-delhi.jpg',
    imagePosition: 'center 40%',
    credit: {
      text: 'Azanti / Wikimedia Commons \u00b7 CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Indian_Institute_of_Technology_Delhi.jpg'
    },
    glyphLabel: 'CART'
  },
  {
    role: 'Research Intern',
    org: 'NIT Trichy',
    period: 'June 2025 \u2013 July 2025',
    location: 'Tamil Nadu (On-site)',
    detail:
      'Designed and developed an integrated biomass gasification reactor for efficient fuel production, combining Arduino, sensors, Python and AI/ML for real-time monitoring and control.',
    image: '/assets/nitt.jpeg'
  }
]

export const projects = [
  {
    title: 'Medical Ultrasound Segmentation Benchmark',
    tag: 'Bio-Medical AI',
    description:
      'A unified benchmarking framework evaluating U-Net, U-Net++, TransUNet, Swin-Unet and SAMUS on the BUSI and CAMUS ultrasound datasets, using standardized pipelines and metrics (Dice, IoU, HD95, Boundary Dice) to compare CNN, transformer, and foundation-model architectures.',
    stack: ['PyTorch', 'CUDA', 'OpenCV', 'MONAI', 'Albumentations'],
    visual: 'scan' as const,
    codeUrl: 'https://github.com/yashgawande0905'
  },
  {
    title: 'Brain Tumor Detection using CNN',
    tag: 'Computer Vision',
    description:
      'A CNN trained to detect brain tumors from MRI images, using image preprocessing and augmentation to achieve high classification accuracy.',
    stack: ['TensorFlow', 'Keras', 'OpenCV', 'Scikit-learn'],
    image: '/assets/BTDCNN.jpeg',
    visual: 'photo' as const,
    codeUrl: 'https://github.com/yashgawande0905'
  },
  {
    title: 'Chemical Equipment Parameter Visualizer',
    tag: 'Full-stack Dashboard',
    description:
      'A hybrid web and desktop application built for the IIT Bombay AI/ML Program, letting engineers upload CSV datasets and analyze flow rate, pressure, and temperature trends through interactive dashboards.',
    stack: ['React', 'TypeScript', 'Django REST', 'PyQt5', 'SQLite'],
    visual: 'circuit' as const,
    codeUrl: 'https://github.com/yashgawande0905'
  },
  {
    title: 'AI-Based Solar Thermal Performance Prediction',
    tag: 'Applied ML',
    description:
      'A machine learning model behind a FastAPI + React dashboard predicting and visualizing solar collector performance \u2014 heat output, heat loss and thermal efficiency \u2014 in real time from live input parameters.',
    stack: ['Python', 'FastAPI', 'React', 'TypeScript'],
    image: '/assets/SOLAR.jpeg',
    visual: 'photo' as const,
    codeUrl: 'https://github.com/yashgawande0905'
  }
]

export const certifications = [
  {
    title: 'Certificate of Merit \u2014 RS & GIS Applications in Natural Resource Management',
    issuer: 'IIRS, ISRO'
  },
  {
    title: 'Web Development',
    issuer: 'Udemy'
  },
  {
    title: 'Aerospace Structural Analysis',
    issuer: 'NPTEL'
  },
  {
    title: 'Medical Image Analysis',
    issuer: 'NPTEL'
  },
  {
    title: 'Fundamentals of AI',
    issuer: 'NPTEL'
  }
]

export const domains = [
  'Aerospace Industry',
  'Mechanical Domain',
  'AIML \u2014 Data Science',
  'Bio-Medical / Healthcare Technology'
]

export const stats = [
  { label: 'Research & Industry Internships', value: 3, suffix: '' },
  { label: 'AI / ML Projects Shipped', value: 4, suffix: '+' },
  { label: 'Institutes Collaborated With', value: 4, suffix: '' },
  { label: 'Certifications Earned', value: 5, suffix: '' }
]
