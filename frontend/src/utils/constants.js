export const PLATFORM_LOGOS = {
    'YouTube': 'https://www.vectorlogo.zone/logos/youtube/youtube-icon.svg',
    'Coursera': 'https://www.vectorlogo.zone/logos/coursera/coursera-icon.svg',
    'Udemy': 'https://www.vectorlogo.zone/logos/udemy/udemy-icon.svg',
    'Figma': 'https://www.vectorlogo.zone/logos/figma/figma-icon.svg',
    'GitHub': 'https://www.vectorlogo.zone/logos/github/github-icon.svg',
    'Medium': 'https://www.vectorlogo.zone/logos/medium/medium-icon.svg',
    'LinkedIn': 'https://www.vectorlogo.zone/logos/linkedin/linkedin-icon.svg',
    'Google': 'https://www.vectorlogo.zone/logos/google/google-icon.svg',
    'Microsoft': 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg',
    'Amazon': 'https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg',
    'Product School': 'https://www.vectorlogo.zone/logos/productschool/productschool-icon.svg',
    'Interaction Design Foundation': 'https://www.interaction-design.org/img/logos/idf-logo-square.png',
    'TryHackMe': 'https://tryhackme.com/static/img/ant.png',
    'HackTheBox': 'https://www.vectorlogo.zone/logos/hackthebox/hackthebox-icon.svg',
    'Behance': 'https://www.vectorlogo.zone/logos/behance/behance-icon.svg',
    'Framer': 'https://www.vectorlogo.zone/logos/framer/framer-icon.svg',
    'Notion': 'https://www.vectorlogo.zone/logos/notion/notion-icon.svg',
    'Miro': 'https://www.vectorlogo.zone/logos/miro/miro-icon.svg',
    'Tableau': 'https://www.vectorlogo.zone/logos/tableau/tableau-icon.svg',
    'Power BI': 'https://www.vectorlogo.zone/logos/microsoft_powerbi/microsoft_powerbi-icon.svg',
    'Elastic': 'https://www.vectorlogo.zone/logos/elastic/elastic-icon.svg',
    'Odin Project': 'https://www.vectorlogo.zone/logos/theodinproject/theodinproject-icon.svg',
    'AWS': 'https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg',
    'PDF': 'https://www.vectorlogo.zone/logos/adobe/adobe-icon.svg'
};

export const MOCK_DEMO_RESULTS = {
    predicted_career: "Software Engineer",
    match_score: 88,
    extracted_skills: [
        { name: "Python", category: "Technical" },
        { name: "JavaScript", category: "Technical" },
        { name: "React", category: "Tools & Frameworks" },
        { name: "Communication", category: "Soft Skills" }
    ],
    missing_skills: ["Data Structures", "Docker", "Machine Learning"],
    next_recommended_skill: "Data Structures",
    career_match_score: 88,
    probability_chart_data: [
        { name: "Software Engineer", probability: 88 },
        { name: "Data Scientist", probability: 65 },
        { name: "Product Manager", probability: 42 }
    ],
    skill_comparison_data: [
        { skill: "Programming", yourScore: 90, required: 85 },
        { skill: "System Design", yourScore: 40, required: 75 },
        { skill: "Problem Solving", yourScore: 95, required: 90 }
    ],
    recommended_roadmap: [
        { id: 1, title: "Phase 1 – Foundations", status: "completed", phase: "Phase 1 – Foundations", steps: [] },
        { id: 2, title: "Phase 2 – Core Skills", status: "current", phase: "Phase 2 – Core Skills", steps: [] },
        { id: 3, title: "Phase 3 – Projects", status: "locked", phase: "Phase 3 – Projects", steps: [] },
        { id: 4, title: "Phase 4 – Career Preparation", status: "locked", phase: "Phase 4 – Career Preparation", steps: [] }
    ]
};
