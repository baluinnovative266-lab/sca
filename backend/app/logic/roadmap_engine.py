from typing import List, Dict, Any

class RoadmapEngine:
    """
    Generates personalized 4-phase career roadmaps based on:
    - Predicted career
    - Academic scores
    - Existing skills (from resume)
    - Confidence levels
    
    Each phase includes unique mindmap nodes, objectives, resources, and expectations.
    """
    
    CAREER_REQUIRED_SKILLS = {
        "Software Engineer": ["Python", "Algorithms", "System Design", "Databases", "Cloud Computing"],
        "Data Scientist": ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
        "Web Developer": ["React", "Node.js", "CSS", "REST APIs", "TypeScript"],
        "UI/UX Designer": ["Figma", "User Research", "Prototyping", "Color Theory", "Wireframing"],
        "Product Manager": ["Agile", "User Stories", "Roadmapping", "Stakeholder Mgmt", "Analytics"],
        "Cybersecurity Analyst": ["Networking", "Security", "Cryptography", "Penetration Testing", "Linux"],
    }

    
    TEMPLATES = {
        "Software Engineer": {
            "Phase 1 – Foundations": [
                {"skill": "Programming", "title": "Programming Logic & Syntax", "duration": "3 weeks", "outcome": "Mastery of control flows and data types."},
                {"skill": "Logic", "title": "Algorithmic Thinking", "duration": "2 weeks", "outcome": "Ability to solve complex problems with code."},
                {"skill": "Math", "title": "Discrete Mathematics", "duration": "4 weeks", "outcome": "Understanding logic, sets, and graph theory."}
            ],
            "Phase 2 – Core Skills": [
                {"skill": "Data Structures", "title": "Advanced Data Structures", "duration": "4 weeks", "outcome": "Efficiently handling memory and storage."},
                {"skill": "Web Development", "title": "Backend Architecture", "duration": "5 weeks", "outcome": "Building scalable server-side systems."},
                {"skill": "Database", "title": "Database Design & SQL", "duration": "3 weeks", "outcome": "Optimizing data retrieval and integrity."}
            ],
            "Phase 3 – Projects": [
                {"skill": "Full Stack", "title": "End-to-End Web App", "duration": "6 weeks", "outcome": "A production-ready SaaS application."},
                {"skill": "Git", "title": "Collaborative Development", "duration": "2 weeks", "outcome": "Working seamlessly with team workflows."}
            ],
            "Phase 4 – Career Preparation": [
                {"skill": "System Design", "title": "Scalability & Performance", "duration": "4 weeks", "outcome": "Designing high-traffic architectures."},
                {"skill": "Soft Skills", "title": "Technical Interviews Prep", "duration": "3 weeks", "outcome": "Confidence in coding and behavioral rounds."}
            ]
        },
        "Data Scientist": {
            "Phase 1 – Foundations": [
                {"skill": "Math", "title": "Statistical Foundations", "duration": "4 weeks", "outcome": "Grasping probability and inference."},
                {"skill": "Python", "title": "Python for Data Science", "duration": "3 weeks", "outcome": "Proficiency in NumPy and Pandas."}
            ],
            "Phase 2 – Core Skills": [
                {"skill": "Machine Learning", "title": "Supervised Learning", "duration": "5 weeks", "outcome": "Building Predictive Models."},
                {"skill": "SQL", "title": "Data Engineering for AI", "duration": "3 weeks", "outcome": "ETL processes and big data handling."}
            ],
            "Phase 3 – Projects": [
                {"skill": "Deep Learning", "title": "Neural Networks Project", "duration": "6 weeks", "outcome": "Implementing image/text classification."},
                {"skill": "Visualization", "title": "Data Storytelling", "duration": "2 weeks", "outcome": "Actionable dashboards and reports."}
            ],
            "Phase 4 – Career Preparation": [
                {"skill": "Case Studies", "title": "Business Problem Solving", "duration": "3 weeks", "outcome": "Translating data to business decisions."},
                {"skill": "Portfolio", "title": "Kaggle & GitHub Polish", "duration": "2 weeks", "outcome": "A professional data science presence."}
            ]
        },
        "Product Manager": {
            "Phase 1 – Foundations": [
                {"skill": "Market Research", "title": "Understanding the Market", "duration": "3 weeks", "outcome": "Analyzing user needs and market trends."},
                {"skill": "Communication", "title": "Effective Communication", "duration": "2 weeks", "outcome": "Articulating ideas clearly to stakeholders."}
            ],
            "Phase 2 – Core Skills": [
                {"skill": "Agile", "title": "Agile Methodologies", "duration": "4 weeks", "outcome": "Running scrums and managing backlogs."},
                {"skill": "Data Analysis", "title": "Product Metrics", "duration": "3 weeks", "outcome": "Making data-driven product decisions."}
            ],
            "Phase 3 – Projects": [
                {"skill": "Product Launch", "title": "End-to-End Product Lifecycle", "duration": "6 weeks", "outcome": "Launching a product from concept to market."},
                {"skill": "Strategy", "title": "Product Strategy", "duration": "3 weeks", "outcome": "Defining long-term product vision."}
            ],
            "Phase 4 – Career Preparation": [
                {"skill": "Case Studies", "title": "Product Case Studies", "duration": "3 weeks", "outcome": "Solving real-world product problems."},
                {"skill": "Interview Prep", "title": "PM Interview Prep", "duration": "3 weeks", "outcome": "Acing the PM interview process."}
            ]
        },
        "Cybersecurity Analyst": {
             "Phase 1 – Foundations": [
                {"skill": "Networking", "title": "Network Fundamentals", "duration": "4 weeks", "outcome": "Understanding TCP/IP, DNS, and HTTP."},
                {"skill": "OS Internals", "title": "Linux/Windows Internals", "duration": "3 weeks", "outcome": "Command line proficiency and system architecture."}
            ],
            "Phase 2 – Core Skills": [
                {"skill": "Security", "title": "Vulnerability Assessment", "duration": "4 weeks", "outcome": "Identifying and classifying security risks."},
                {"skill": "Cryptography", "title": "Applied Cryptography", "duration": "3 weeks", "outcome": "Securing data in transit and at rest."}
            ],
            "Phase 3 – Projects": [
                {"skill": "Penetration Testing", "title": "Ethical Hacking Lab", "duration": "5 weeks", "outcome": "Simulating attacks to find weaknesses."},
                {"skill": "SIEM", "title": "Security Monitoring", "duration": "3 weeks", "outcome": "Detecting and responding to incidents."}
            ],
            "Phase 4 – Career Preparation": [
                {"skill": "Certifications", "title": "CompTIA Security+ / CEH Prep", "duration": "4 weeks", "outcome": "Industry-recognized credential preparation."},
                {"skill": "Interview Prep", "title": "Security Interview Cases", "duration": "2 weeks", "outcome": "Handling technical security scenarios."}
            ]
        },
        "UI/UX Designer": {
            "Phase 1 – Foundations": [
                {"skill": "Design Theory", "title": "Design Principles", "duration": "3 weeks", "outcome": "Mastery of color, typography, and layout."},
                {"skill": "Tools", "title": "Figma Basics", "duration": "2 weeks", "outcome": "Proficiency in industry-standard design tools."}
            ],
            "Phase 2 – Core Skills": [
                {"skill": "User Research", "title": "UX Research Methods", "duration": "4 weeks", "outcome": "Conducting interviews and usability testing."},
                {"skill": "Prototyping", "title": "Interactive Prototyping", "duration": "3 weeks", "outcome": "Creating high-fidelity clickable mockups."}
            ],
            "Phase 3 – Projects": [
                {"skill": "App Redesign", "title": "Mobile App Case Study", "duration": "5 weeks", "outcome": "End-to-end redesign of a popular app."},
                {"skill": "Design System", "title": "Building a Design System", "duration": "3 weeks", "outcome": "Creating reusable component libraries."}
            ],
            "Phase 4 – Career Preparation": [
                {"skill": "Portfolio", "title": "Portfolio Curation", "duration": "3 weeks", "outcome": "Showcasing work effectively on Behance/Dribbble."},
                 {"skill": "Interview Prep", "title": "Design Critiques", "duration": "2 weeks", "outcome": "Articulating design decisions confidently."}
            ]
        },
        "Web Developer": {
            "Phase 1 – Foundations": [
                {"skill": "HTML/CSS", "title": "Web Fundamentals", "duration": "3 weeks", "outcome": "Building semantic and responsive layouts."},
                {"skill": "JavaScript", "title": "Modern JS (ES6+)", "duration": "3 weeks", "outcome": "Functional programming and DOM mastery."}
            ],
            "Phase 2 – Core Skills": [
                {"skill": "React", "title": "Frontend Frameworks", "duration": "5 weeks", "outcome": "Building complex component architectures."},
                {"skill": "Node.js", "title": "Server-side JS", "duration": "4 weeks", "outcome": "REST API development and database integration."}
            ],
            "Phase 3 – Projects": [
                {"skill": "Full Stack", "title": "Dynamic Web App", "duration": "6 weeks", "outcome": "A fully functional MERN stack application."},
                {"skill": "Deployment", "title": "Cloud & Hosting", "duration": "2 weeks", "outcome": "Launching apps on Vercel/AWS."}
            ],
            "Phase 4 – Career Preparation": [
                {"skill": "Performance", "title": "Optimization & SEO", "duration": "3 weeks", "outcome": "Speeding up apps and improving visibility."},
                {"skill": "Portfolio", "title": "Project Showcase", "duration": "3 weeks", "outcome": "A professional portfolio of work."}
            ]
        }
    }

    # ==========================================
    # DETAILED SKILL METADATA FOR SIDE PANELS
    # ==========================================
    SKILL_DETAILS = {
        "programming": {
            "description": "The logic and syntax used to build functional software. Focuses on variables, loops, and basic algorithms.",
            "importance": "Core foundation for any developer role. Prevents 'spaghetti code' and improves logic.",
            "use_cases": ["Backend Logic", "Scripting", "Mobile Apps"],
            "objectives": ["Understand Variables & Types", "Master Control Flow", "Apply OOP Patterns"],
            "learning_time": "4 Weeks"
        },
        "logic": {
            "description": "Structured thinking to solve complex problems by breaking them into smaller, manageable parts.",
            "importance": "Essential for debugging and architecture design.",
            "use_cases": ["Bug Fixing", "System Flow", "Game Logic"],
            "objectives": ["Boolean Algebra", "Edge Case Identification", "Pseudo-coding"],
            "learning_time": "2 Weeks"
        },
        "math": {
            "description": "Mathematical foundations like Statistics, Probability, and Discrete Math tailored for Tech.",
            "importance": "Powerhouse for Data Science and Graphics programming.",
            "use_cases": ["ML Models", "3D Rendering", "A/B Testing"],
            "objectives": ["Descriptive Statistics", "Calculus for ML", "Discrete Logic"],
            "learning_time": "4 Weeks"
        },
        "data structures": {
            "description": "Ways to store and organize data efficiently like Arrays, Hash Maps, and Trees.",
            "importance": "Directly impacts application speed and technical interview performance.",
            "use_cases": ["Search Engines", "Database Indices", "File Systems"],
            "objectives": ["Space/Time Complexity", "Tree Traversals", "Hash Map Optimization"],
            "learning_time": "3 Weeks"
        },
        "web development": {
            "description": "Building and maintaining websites, from visual elements to server logic.",
            "importance": "Most common entry point for software careers.",
            "use_cases": ["E-commerce", "SaaS Dashboards", "Personal Portfolios"],
            "objectives": ["Frontend (React/Vue)", "Backend (Node/FastAPI)", "RESTful APIs"],
            "learning_time": "5 Weeks"
        },
        "database": {
            "description": "Storing, retrieving, and managing and organizing data using SQL or NoSQL.",
            "importance": "The brain of any application; essential for data persistence.",
            "use_cases": ["User Management", "Transaction Logs", "Inventory Systems"],
            "objectives": ["Schema Normalization", "Indexing", "ACID Properties"],
            "learning_time": "3 Weeks"
        },
        "machine learning": {
            "description": "Algorithms that improve automatically through experience and data usage.",
            "importance": "Key for predictive analytics and modern AI features.",
            "use_cases": ["Recommendation Engines", "Fraud Detection", "Computer Vision"],
            "objectives": ["Supervised Learning", "Overfitting Prevention", "Hyperparameter Tuning"],
            "learning_time": "6 Weeks"
        },
        "ui/ux design": {
            "description": "Ensuring products are intuitive to use and visually pleasing.",
            "importance": "Determines user retention and overall product success.",
            "use_cases": ["App Interfaces", "Design Systems", "User Journeys"],
            "objectives": ["Figma Prototyping", "Hierarchy & Layout", "User Empathy"],
            "learning_time": "4 Weeks"
        },
        "html/css": {
            "description": "The building blocks of the web. HTML for structure, CSS for presentation and layout.",
            "importance": "Fundamental for any web-based project or frontend role.",
            "use_cases": ["Landing Pages", "Email Templates", "Web Apps"],
            "objectives": ["Semantic HTML5", "Flexbox & Grid", "Responsive Design"],
            "learning_time": "3 Weeks"
        },
        "rest apis": {
            "description": "Standardized way for different software systems to communicate over HTTP.",
            "importance": "Core of modern web communication and microservices.",
            "use_cases": ["Third-party Integrations", "Mobile App Backends", "Data Fetching"],
            "objectives": ["HTTP Methods", "Status Codes", "JSON Design"],
            "learning_time": "2 Weeks"
        },
        "typescript": {
            "description": "A strongly typed superset of JavaScript that scales better for large projects.",
            "importance": "Industry standard for enterprise web development.",
            "use_cases": ["Large-scale Web Apps", "Library Development", "Refactor-safe Code"],
            "objectives": ["Interfaces & Types", "Generics", "Strict Type Checking"],
            "learning_time": "3 Weeks"
        },
        "networking": {
            "description": "How computers connect and share data. Covers protocols like TCP/IP, DNS, and HTTP.",
            "importance": "Crucial for Cloud, DevOps, and Security roles.",
            "use_cases": ["Cloud Setup", "Web Troubleshooting", "Security Hardening"],
            "objectives": ["OSI Model", "Subnetting", "Protocols (HTTP/S)"],
            "learning_time": "4 Weeks"
        },
        "os internals": {
            "description": "Understanding how operating systems (Linux/Windows) manage memory, processes, and files.",
            "importance": "Baseline for Systems Engineering and Cybersecurity.",
            "use_cases": ["Performance Tuning", "Malware Analysis", "Sysadmin Tasks"],
            "objectives": ["Kernel Basics", "Process Management", "File Permissions"],
            "learning_time": "3 Weeks"
        },
        "cryptography": {
            "description": "Protecting information by transforming it into unreadable formats.",
            "importance": "The backbone of privacy and digital security.",
            "use_cases": ["SSL/TLS", "Password Hashing", "Blockchain"],
            "objectives": ["Symmetric/Asymmetric Keys", "Hashing Algorithms", "Encryption Standards"],
            "learning_time": "3 Weeks"
        },
        "agile": {
            "description": "Iterative project management that focuses on continuous delivery and feedback.",
            "importance": "Industry standard for how modern tech teams operate.",
            "use_cases": ["Sprint Planning", "Backlog Grooming", "Daily Standups"],
            "objectives": ["Understand Scrum", "Master Kanban", "Agile Estimation"],
            "learning_time": "2 Weeks"
        },
        "penetration testing": {
            "description": "Simulating cyberattacks to find and fix security vulnerabilities.",
            "importance": "Proactive defense strategy for protecting critical infrastructure.",
            "use_cases": ["Web App Pentesting", "Network Audits", "Red Teaming"],
            "objectives": ["Nmap Scanning", "Metasploit Basics", "OWASP Top 10"],
            "learning_time": "5 Weeks"
        },
        "linux": {
            "description": "Mastery of the Linux command line and system administration.",
            "importance": "Indispensable for Servers, Cloud, and Security professionals.",
            "use_cases": ["Bash Scripting", "Server Hardening", "DevOps Pipelines"],
            "objectives": ["CLI Navigation", "Shell Scripting", "User & Group Permissions"],
            "learning_time": "3 Weeks"
        },
        "siem": {
            "description": "Security Information and Event Management. Real-time monitoring and analysis of security alerts.",
            "importance": "Vital for incident response and threat detection.",
            "use_cases": ["Log Analysis", "Threat Hunting", "Compliance Auditing"],
            "objectives": ["Splunk/ELK Basics", "Writing Detection Rules", "Alert Triage"],
            "learning_time": "3 Weeks"
        },
        "performance": {
            "description": "Optimizing software to run faster and use fewer resources.",
            "importance": "Directly impacts user experience and infrastructure costs.",
            "use_cases": ["Reducing Load Times", "Database Optimization", "Memory Management"],
            "objectives": ["Profiling Code", "Caching Strategies", "Asset Minification"],
            "learning_time": "3 Weeks"
        },
        "python": {
            "description": "The most versatile language for software engineering, data science, and AI.",
            "importance": "Core language for modern development.",
            "use_cases": ["Backend", "Data Science", "Automation"],
            "objectives": ["Syntax & PEP 8", "Virtual Envs", "Async/Await"],
            "learning_time": "3 Weeks"
        },
        "algorithms": {
            "description": "Solving problems efficiently using standard patterns like sorting, searching, and recursion.",
            "importance": "Key for technical interviews and performance optimization.",
            "use_cases": ["Search", "Optimization", "Ranking"],
            "objectives": ["Big O Notation", "Recursion", "Searching/Sorting"],
            "learning_time": "4 Weeks"
        },
        "system design": {
            "description": "Designing large-scale, distributed systems that are reliable and scalable.",
            "importance": "Critical for senior engineering roles.",
            "use_cases": ["Cloud Arch", "SaaS Scaling", "Microservices"],
            "objectives": ["Load Balancing", "Caching", "Sharding"],
            "learning_time": "5 Weeks"
        },
        "databases": {
            "description": "Managing data persistence using SQL and NoSQL systems.",
            "importance": "Essential for any data-driven application.",
            "use_cases": ["User Data", "Analytics", "Inventory"],
            "objectives": ["Normalizations", "Indexing", "Query Opt"],
            "learning_time": "3 Weeks"
        },
        "cloud computing": {
            "description": "Deploying and managing applications on platforms like AWS, GCP, or Azure.",
            "importance": "Industry standard for modern deployments.",
            "use_cases": ["Serverless", "S3 Storage", "Managed DBs"],
            "objectives": ["IAM Roles", "EC2/EKS", "VPC Networking"],
            "learning_time": "4 Weeks"
        },
        "machine learning": {
            "description": "Teaching systems to learn from data using statistical techniques.",
            "importance": "The engine behind modern AI features.",
            "use_cases": ["Predictions", "NLP", "CV"],
            "objectives": ["Regression", "Neural Nets", "Model Tuning"],
            "learning_time": "6 Weeks"
        },
        "statistics": {
            "description": "The mathematical study of data collection, analysis, interpretation, and presentation.",
            "importance": "Fundamental for data science and research.",
            "use_cases": ["A/B Testing", "Inference", "Hypothesis testing"],
            "objectives": ["Probability Dist", "Linear Regression", "P-values"],
            "learning_time": "3 Weeks"
        },
        "sql": {
            "description": "Standard language for managing and querying relational databases.",
            "importance": "Vital for data retrieval and manipulation.",
            "use_cases": ["Data Extraction", "Reporting", "ETL"],
            "objectives": ["Joins & Unions", "Aggregation", "Indexing"],
            "learning_time": "2 Weeks"
        },
        "data visualization": {
            "description": "Transforming data into visual graphics like charts and dashboards to reveal insights.",
            "importance": "Crucial for communicating findings to stakeholders.",
            "use_cases": ["Dashboards", "Business Reports", "Research"],
            "objectives": ["Chart selection", "Color Theory", "D3.js/Tableau"],
            "learning_time": "3 Weeks"
        },
        "react": {
            "description": "A JavaScript library for building component-based user interfaces.",
            "importance": "The industry standard for frontend development.",
            "use_cases": ["Web Apps", "SPAs", "UI Components"],
            "objectives": ["Hooks API", "Virtual DOM", "State Management"],
            "learning_time": "4 Weeks"
        },
        "node.js": {
            "description": "A runtime environment that allows running JavaScript on the server.",
            "importance": "Key for building fast and scalable network applications.",
            "use_cases": ["APIs", "Real-time Apps", "Microservices"],
            "objectives": ["Event Loop", "NPM Ecosystem", "Express Middleware"],
            "learning_time": "4 Weeks"
        },
        "figma": {
            "description": "Collaborative interface design tool for building UI/UX prototypes.",
            "importance": "Primary tool for modern product designers.",
            "use_cases": ["Prototyping", "Design Systems", "User Journeys"],
            "objectives": ["Auto-layout", "Components", "Interactive Prototyping"],
            "learning_time": "2 Weeks"
        },
        "css": {
            "description": "Stylesheet language for controlling the visual presentation of web pages.",
            "importance": "Essential for any frontend or web development role.",
            "use_cases": ["Responsive Layouts", "Animations", "Theming"],
            "objectives": ["Flexbox & Grid", "Media Queries", "CSS Variables"],
            "learning_time": "3 Weeks"
        },
        "user research": {
            "description": "Systematic study of target users to understand their behaviors, needs, and motivations.",
            "importance": "Foundation of user-centered design; prevents building the wrong product.",
            "use_cases": ["User Interviews", "Surveys", "Persona Creation"],
            "objectives": ["Interview Techniques", "Affinity Mapping", "Usability Testing"],
            "learning_time": "3 Weeks"
        },
        "prototyping": {
            "description": "Creating interactive mockups to test and validate design ideas before development.",
            "importance": "Reduces costly rework by catching issues early.",
            "use_cases": ["Clickable Mockups", "User Testing", "Stakeholder Demos"],
            "objectives": ["Low-fi Wireframes", "Hi-fi Prototypes", "Interaction Design"],
            "learning_time": "2 Weeks"
        },
        "color theory": {
            "description": "The science and art of using color effectively in design to evoke emotion and hierarchy.",
            "importance": "Directly impacts brand perception and user experience.",
            "use_cases": ["Brand Identity", "UI Theming", "Accessibility"],
            "objectives": ["Color Harmony", "Contrast Ratios", "Palette Generation"],
            "learning_time": "1 Week"
        },
        "wireframing": {
            "description": "Creating skeletal blueprints of a page or app to define layout and information architecture.",
            "importance": "First step in translating requirements into visual structure.",
            "use_cases": ["Page Layouts", "Navigation Flows", "Content Hierarchy"],
            "objectives": ["Information Architecture", "Sketching", "Tool Proficiency (Figma/Balsamiq)"],
            "learning_time": "1 Week"
        },
        "user stories": {
            "description": "Short descriptions of a feature from the end user's perspective, used in Agile development.",
            "importance": "Bridges the gap between business requirements and development tasks.",
            "use_cases": ["Backlog Creation", "Sprint Planning", "Acceptance Criteria"],
            "objectives": ["As-a / I-want / So-that Format", "Story Splitting", "Estimation"],
            "learning_time": "1 Week"
        },
        "roadmapping": {
            "description": "Strategic planning tool that outlines the vision, direction, and priorities of a product over time.",
            "importance": "Aligns teams and stakeholders on what to build and when.",
            "use_cases": ["Quarterly Planning", "Feature Prioritization", "Release Planning"],
            "objectives": ["Now/Next/Later Framework", "OKRs", "Dependency Mapping"],
            "learning_time": "2 Weeks"
        },
        "stakeholder mgmt": {
            "description": "The process of managing expectations and communication with key decision-makers.",
            "importance": "Critical for getting buy-in and unblocking cross-functional work.",
            "use_cases": ["Executive Updates", "Cross-team Alignment", "Conflict Resolution"],
            "objectives": ["RACI Matrix", "Communication Plans", "Influence Mapping"],
            "learning_time": "2 Weeks"
        },
        "analytics": {
            "description": "Using data and metrics to measure product performance and guide decisions.",
            "importance": "Enables evidence-based product development and optimization.",
            "use_cases": ["Funnel Analysis", "Cohort Tracking", "A/B Testing"],
            "objectives": ["Google Analytics", "Mixpanel/Amplitude", "KPI Definition"],
            "learning_time": "3 Weeks"
        },
        "security": {
            "description": "Protecting systems, networks, and programs from digital attacks and unauthorized access.",
            "importance": "Critical to protect user data and maintain organizational trust.",
            "use_cases": ["Penetration Testing", "Zero Trust Architecture", "SOC Analysis"],
            "objectives": ["Network Security", "Identity Management", "Threat Modeling"],
            "learning_time": "5 Weeks"
        },
        "communication": {
            "description": "The ability to convey information effectively and efficiently to others.",
            "importance": "Critical for team collaboration, stakeholder management, and project success.",
            "use_cases": ["Team Meetings", "Stakeholder Updates", "Documentation"],
            "objectives": ["Active Listening", "Clear Articulation", "Conflict Resolution"],
            "learning_time": "2 Weeks"
        },
        "problem solving": {
            "description": "The process of finding solutions to difficult or complex issues.",
            "importance": "Core skill for identifying bugs, optimizing systems, and creating innovative solutions.",
            "use_cases": ["Debugging", "Architecture Design", "Algorithm Optimization"],
            "objectives": ["Root Cause Analysis", "Logical Reasoning", "Creative Solutioning"],
            "learning_time": "Ongoing"
        },
        "leadership": {
            "description": "The action of leading a group of people or an organization.",
            "importance": "Essential for career growth into management and senior technical roles.",
            "use_cases": ["Team Management", "Project Lead", "Mentorship"],
            "objectives": ["Strategic Thinking", "Delegation", "Emotional Intelligence"],
            "learning_time": "Ongoing"
        },
        "team collaboration": {
            "description": "Working together with others to achieve a common goal.",
            "importance": "Projects are rarely built by one person; collective effort is key.",
            "use_cases": ["Agile Sprints", "Pair Programming", "Cross-functional Projects"],
            "objectives": ["Knowledge Sharing", "Reliability", "Cooperation"],
            "learning_time": "Ongoing"
        },
        "critical thinking": {
            "description": "The objective analysis and evaluation of an issue in order to form a judgment.",
            "importance": "Helps in making better technical decisions and identifying edge cases.",
            "use_cases": ["Code Review", "Risk Assessment", "System Audit"],
            "objectives": ["Objective Analysis", "Evidence Evaluation", "Logic Application"],
            "learning_time": "Ongoing"
        },
        "agile": {
            "description": "A set of principles for software development under which requirements and solutions evolve through the collaborative effort of self-organizing and cross-functional teams.",
            "importance": "Modern software development standard for rapid and high-quality delivery.",
            "use_cases": ["Sprint Planning", "Daily Standups", "Retrospectives"],
            "objectives": ["Scrum Mastery", "Kanban Methodology", "Sprint Execution"],
            "learning_time": "3 Weeks"
        }
    }

    # ==========================================
    # ENRICHED PROJECTS FOR PHASES (Carrier + Phase)
    # ==========================================
    PROJECT_TEMPLATES = {
        "Software Engineer": {
            "Phase 1 – Foundations": [
                {
                    "title": "Terminal Task Manager", 
                    "overview": "A CLI app to manage daily tasks.", 
                    "tech_stack": "Python", 
                    "difficulty": "Easy", 
                    "github_link": "https://github.com/project-hub/cli-task-manager",
                    "resources": [
                        {"platform": "YouTube", "title": "Python CLI Basics", "url": "https://youtube.com/results?search_query=python+cli+tutorial"},
                        {"platform": "Documentation", "title": "Argparse Guide", "url": "https://docs.python.org/3/library/argparse.html"}
                    ],
                    "objectives": ["Python Syntax", "File I/O", "CLI Arguments"]
                },
                {
                    "title": "Algorithm Visualizer", 
                    "overview": "Visualize sorting algorithms in the browser.", 
                    "tech_stack": "JavaScript", 
                    "difficulty": "Medium", 
                    "github_link": "https://github.com/project-hub/algo-viz",
                    "resources": [
                        {"platform": "MDN", "title": "Canvas API", "url": "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API"},
                        {"platform": "YouTube", "title": "Visualizing Algorithms", "url": "https://youtube.com/results?search_query=algorithm+visualizer+js"}
                    ],
                    "objectives": ["Sorting Logic", "DOM Manipulation", "Animation Frames"]
                }
            ],
            "Phase 2 – Core Skills": [
                {
                    "title": "Real-time Chat App", 
                    "overview": "Build a messaging system with WebSockets.", 
                    "tech_stack": "Node.js + Socket.io", 
                    "difficulty": "Hard", 
                    "github_link": "https://github.com/project-hub/realtime-chat",
                    "resources": [
                        {"platform": "Socket.io", "title": "Get Started with Socket.io", "url": "https://socket.io/get-started/chat"},
                        {"platform": "Medium", "title": "WebSockets in Node.js", "url": "https://medium.com/tag/websockets"}
                    ],
                    "objectives": ["Event-driven Arch", "WebSocket Handshakes", "Rooms & Namespaces"]
                },
                {
                    "title": "Inventory API & Schema", 
                    "overview": "A robust REST API for warehouse management with SQL optimization.", 
                    "tech_stack": "FastAPI + Postgres", 
                    "difficulty": "Medium", 
                    "github_link": "https://github.com/project-hub/inventory-api",
                    "resources": [
                        {"platform": "FastAPI", "title": "FastAPI Docs", "url": "https://fastapi.tiangolo.com/"},
                        {"platform": "SQL", "title": "Postgres SQL Optimization", "url": "https://use-the-index-luke.com/"}
                    ],
                    "objectives": ["DB Normalization", "Indexing Strategies", "API Documentation"]
                }
            ],
            "Phase 3 – Projects": [
                {
                    "title": "SaaS Dashboard", 
                    "overview": "Complete project management suite with Auth.", 
                    "tech_stack": "React + Firebase", 
                    "difficulty": "Hard", 
                    "github_link": "https://github.com/project-hub/saas-dashboard",
                    "resources": [
                        {"platform": "Firebase", "title": "Firebase Auth Setup", "url": "https://firebase.google.com/docs/auth"},
                        {"platform": "React", "title": "Tailwind UI Components", "url": "https://tailwindui.com/"}
                    ],
                    "objectives": ["Authentication Flow", "NoSQL Data Models", "Protected Routes"]
                },
                {
                    "title": "E-commerce Microservice", 
                    "overview": "Scale a small store into microservices with Docker.", 
                    "tech_stack": "Go + Docker", 
                    "difficulty": "Expert", 
                    "github_link": "https://github.com/project-hub/micro-store",
                    "resources": [
                        {"platform": "Docker", "title": "Dockerizing Go Apps", "url": "https://docs.docker.com/language/golang/"},
                        {"platform": "Microservices.io", "title": "Microservice Patterns", "url": "https://microservices.io/"}
                    ],
                    "objectives": ["Service Discovery", "Containerization", "Inter-service Comm"]
                },
                {
                    "title": "Distributed Task Queue", 
                    "overview": "Handle background jobs at scale with Redis and Celery.", 
                    "tech_stack": "Python + Redis + System Design", 
                    "difficulty": "Expert", 
                    "github_link": "https://github.com/project-hub/task-queue",
                    "resources": [
                        {"platform": "Celery", "title": "Celery First Steps", "url": "https://docs.celeryq.dev/en/stable/getting-started/first-steps-with-celery.html"},
                        {"platform": "Redis", "title": "Redis Pub/Sub Guide", "url": "https://redis.io/docs/manual/pubsub/"}
                    ],
                    "objectives": ["Async Processing", "Message Queuing", "Worker Scaling"]
                }
            ]
        },
        "Data Scientist": {
            "Phase 1 – Foundations": [
                {
                    "title": "Stock Data Scraper", 
                    "overview": "Extract and clean financial data.", 
                    "tech_stack": "Python + BeautifulSoup", 
                    "difficulty": "Medium", 
                    "github_link": "https://github.com/project-hub/stock-scraper",
                    "resources": [
                        {"platform": "YouTube", "title": "Web Scraping with BeautifulSoup", "url": "https://youtube.com/results?search_query=beautiful+soup+tutorial"},
                        {"platform": "Docs", "title": "Pandas Data Cleaning", "url": "https://pandas.pydata.org/docs/user_guide/10min.html"}
                    ],
                    "objectives": ["HTML Parsing", "Data Cleaning", "CSV Export"]
                }
            ],
            "Phase 2 – Core Skills": [
                {
                    "title": "Housing Price Predictor", 
                    "overview": "Regression model for real estate.", 
                    "tech_stack": "Pandas + Scikit-learn", 
                    "difficulty": "Medium", 
                    "github_link": "https://github.com/project-hub/price-predict",
                    "resources": [
                        {"platform": "Kaggle", "title": "Regression Techniques Guide", "url": "https://www.kaggle.com/learn/intro-to-machine-learning"},
                        {"platform": "Scikit-Learn", "title": "Linear Regression Example", "url": "https://scikit-learn.org/stable/auto_examples/linear_model/plot_ols.html"}
                    ],
                    "objectives": ["Feature Engineering", "Model Evaluation", "Regression Algorithms"]
                }
            ],
            "Phase 3 – Projects": [
                {
                    "title": "Deep Learning Chatbot", 
                    "overview": "Train an LSTMs for natural conversation.", 
                    "tech_stack": "TensorFlow/PyTorch", 
                    "difficulty": "Hard", 
                    "github_link": "https://github.com/project-hub/ai-chat",
                    "resources": [
                        {"platform": "TensorFlow", "title": "NLP with TensorFlow", "url": "https://www.tensorflow.org/tutorials/text/word_embeddings"},
                        {"platform": "PyTorch", "title": "Sequence Models & LSTM", "url": "https://pytorch.org/tutorials/beginner/nlp/sequence_models_tutorial.html"}
                    ],
                    "objectives": ["Tokenization", "LSTM Layers", "Seq2Seq Models"]
                },
                {
                    "title": "Retail Demand Forecast", 
                    "overview": "Time-series forecasting for inventory management.", 
                    "tech_stack": "Prophet + Scikit-Learn", 
                    "difficulty": "Medium", 
                    "github_link": "https://github.com/project-hub/demand-predict",
                    "resources": [
                        {"platform": "Meta", "title": "Prophet Documentation", "url": "https://facebook.github.io/prophet/"}
                    ],
                    "objectives": ["Seasonality Analysis", "Hyperparameter Tuning", "Forecast Validation"]
                },
                {
                    "title": "Healthcare Image Classifier", 
                    "overview": "Detect diseases from X-ray images using CNNs.", 
                    "tech_stack": "Keras + OpenCV", 
                    "difficulty": "Expert", 
                    "github_link": "https://github.com/project-hub/med-vision",
                    "resources": [
                        {"platform": "Coursera", "title": "AI for Medicine", "url": "https://www.coursera.org/specializations/ai-for-medicine"}
                    ],
                    "objectives": ["Image Processing", "CNN Architecture", "Precision/Recall Tuning"]
                }
            ]
        },
        "Web Developer": {
            "Phase 1 – Foundations": [
                {
                    "title": "Personal Portfolio", 
                    "overview": "Build a responsive portfolio site.", 
                    "tech_stack": "HTML/CSS/JS", 
                    "difficulty": "Easy", 
                    "github_link": "https://github.com/project-hub/portfolio-boilerplate",
                    "resources": [
                        {"platform": "YouTube", "title": "Responsive Layouts", "url": "https://youtube.com/results?search_query=responsive+web+design"},
                        {"platform": "MDN", "title": "Flexbox Guide", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox"}
                    ],
                    "objectives": ["Semantics", "Mobile-First Design", "SEO Basics"]
                }
            ],
            "Phase 3 – Projects": [
                {
                    "title": "Social Media Dashboard", 
                    "overview": "A modern React dashboard with light/dark mode.", 
                    "tech_stack": "React + Tailwind", 
                    "difficulty": "Medium", 
                    "github_link": "https://github.com/project-hub/react-dashboard",
                    "resources": [
                        {"platform": "React", "title": "React Docs", "url": "https://react.dev/"},
                        {"platform": "Tailwind", "title": "Component Library", "url": "https://tailwindcss.com/docs/installation"}
                    ],
                    "objectives": ["State Mgmt", "Hook Patterns", "UI Theming"]
                },
                {
                    "title": "Real-time Auction Platform", 
                    "overview": "Live bidding app with real-time updates.", 
                    "tech_stack": "Socket.io + MongoDB", 
                    "difficulty": "Hard", 
                    "github_link": "https://github.com/project-hub/live-auction",
                    "resources": [
                        {"platform": "Socket.io", "title": "Realtime Guide", "url": "https://socket.io/docs/v4/"}
                    ],
                    "objectives": ["Concurrency", "Real-time Sync", "NoSQL Aggregation"]
                },
                {
                    "title": "SaaS Platform Template", 
                    "overview": "Multi-tenant architecture with Stripe billing.", 
                    "tech_stack": "Next.js + Stripe", 
                    "difficulty": "Expert", 
                    "github_link": "https://github.com/project-hub/nextjs-saas",
                    "resources": [
                        {"platform": "Stripe", "title": "Stripe Billing Docs", "url": "https://stripe.com/docs/billing"}
                    ],
                    "objectives": ["Subscription Flow", "Server Actions", "RBAC Auth"]
                }
            ]
        },
        "Product Manager": {
            "Phase 2 – Core Skills": [
                {
                    "title": "PRD for New Feature", 
                    "overview": "Write a complete Product Requirements Document.", 
                    "tech_stack": "Notion/Google Docs", 
                    "difficulty": "Medium", 
                    "github_link": "https://github.com/project-hub/pm-templates",
                    "resources": [
                        {"platform": "Medium", "title": "Writing Great PRDs", "url": "https://medium.com/product-management"},
                        {"platform": "Atlassian", "title": "Agile Basics", "url": "https://www.atlassian.com/agile"}
                    ],
                    "objectives": ["User Personas", "Feature Prioritization", "Success Metrics"]
                }
            ],
            "Phase 3 – Projects": [
                {
                    "title": "Product Launch Roadmap", 
                    "overview": "Plan a Q3 roadmap for a SaaS product.", 
                    "tech_stack": "Jira/Miro", 
                    "difficulty": "Hard", 
                    "github_link": "https://github.com/project-hub/pm-roadmap",
                    "resources": [
                        {"platform": "Miro", "title": "Roadmap Templates", "url": "https://miro.com/templates/product-roadmap/"}
                    ],
                    "objectives": ["Stakeholder Mgmt", "Gantt Charts", "Risk Assessment"]
                },
                {
                    "title": "User Feedback Analysis Tool", 
                    "overview": "Automate categorization of user complaints.", 
                    "tech_stack": "Python + NLP", 
                    "difficulty": "Medium", 
                    "github_link": "https://github.com/project-hub/sentiment-analysis",
                    "resources": [
                        {"platform": "ChatGPT", "title": "NLP for PMs", "url": "https://openai.com/blog/chatgpt"}
                    ],
                    "objectives": ["Sentiment Tracking", "Problem Prioritization", "Data Reporting"]
                },
                {
                    "title": "Growth Hacking Experiment", 
                    "overview": "Design and track an A/B test for onboarding.", 
                    "tech_stack": "Mixpanel + Optimizely", 
                    "difficulty": "Medium", 
                    "github_link": "https://github.com/project-hub/growth-ab",
                    "resources": [
                        {"platform": "Mixpanel", "title": "Growth Guide", "url": "https://mixpanel.com/blog/growth-hacking/"}
                    ],
                    "objectives": ["Funnel Optimization", "Hypothesis Testing", "Retention Metrics"]
                }
            ]
        },
        "Cybersecurity Analyst": {
            "Phase 1 – Foundations": [
                {
                    "title": "Network Homelab", 
                    "overview": "Setup a secure virtual network environment.", 
                    "tech_stack": "VirtualBox + Kali Linux", 
                    "difficulty": "Medium", 
                    "github_link": "https://github.com/project-hub/security-lab",
                    "resources": [
                        {"platform": "YouTube", "title": "Cybersecurity Homelab", "url": "https://youtube.com/results?search_query=cybersecurity+homelab+setup"}
                    ],
                    "objectives": ["Network Segmentation", "VPN Setup", "Firewall Rules"]
                }
            ],
            "Phase 3 – Projects": [
                {
                    "title": "Intrusion Detection System", 
                    "overview": "Configure and tune Snort for network alerts.", 
                    "tech_stack": "Snort + Linux", 
                    "difficulty": "Hard", 
                    "github_link": "https://github.com/project-hub/ids-config",
                    "resources": [
                        {"platform": "Snort", "title": "Snort Documentation", "url": "https://www.snort.org/documents"}
                    ],
                    "objectives": ["Packet Analysis", "Signature Writing", "Alert Tuning"]
                },
                {
                    "title": "Malware Sandbox Lab", 
                    "overview": "Safe environment for behavioral analysis.", 
                    "tech_stack": "Cuckoo + VirtualBox", 
                    "difficulty": "Expert", 
                    "github_link": "https://github.com/project-hub/malware-lab",
                    "resources": [
                        {"platform": "SANS", "title": "Malware Analysis 101", "url": "https://www.sans.org/blog/malware-analysis-for-beginners/"}
                    ],
                    "objectives": ["Dynamic Analysis", "Network Isolation", "Reverse Engineering"]
                },
                {
                    "title": "Threat Intel Dashboard", 
                    "overview": "Aggregate and visualize dark web feeds.", 
                    "tech_stack": "ELK Stack + Python", 
                    "difficulty": "Hard", 
                    "github_link": "https://github.com/project-hub/threat-intel",
                    "resources": [
                        {"platform": "Elastic", "title": "Elastic Security Guide", "url": "https://www.elastic.co/security"}
                    ],
                    "objectives": ["Log Ingestion", "Dashboard Visualization", "Alerting Logic"]
                }
            ]
        },
    }

    # ==========================================
    # PHASE-SPECIFIC MINDMAP DATA PER CAREER
    # Each phase has unique branches and subnodes
    # ==========================================
    MINDMAP_DATA = {
        "Software Engineer": {
            "Phase 1 – Foundations": {
                "branches": [
                    {"name": "Programming Basics", "subnodes": ["Variables & Types", "Control Flow", "Functions", "OOP Concepts"]},
                    {"name": "Core Concepts", "subnodes": ["Big-O Notation", "Recursion", "Memory Management", "Compilation"]},
                    {"name": "Learning Resources", "subnodes": ["CS50 (Harvard)", "freeCodeCamp", "The Odin Project", "Codecademy"]},
                    {"name": "Practice Exercises", "subnodes": ["HackerRank Easy", "LeetCode Warm-up", "Codewars Katas", "Project Euler"]}
                ]
            },
            "Phase 2 – Core Skills": {
                "branches": [
                    {"name": "Technical Stacks", "subnodes": ["Python/Django", "JavaScript/Node.js", "Java/Spring", "Go/Gin"]},
                    {"name": "Frameworks", "subnodes": ["React", "Express.js", "FastAPI", "Next.js"]},
                    {"name": "Algorithms & DS", "subnodes": ["Trees & Graphs", "Dynamic Programming", "Sorting", "Hash Maps"]},
                    {"name": "Case Studies", "subnodes": ["Netflix Architecture", "Uber Dispatch", "Slack Real-time", "Stripe Payments"]}
                ]
            },
            "Phase 3 – Projects": {
                "branches": [
                    {"name": "Real-world Projects", "subnodes": ["E-commerce Platform", "Chat Application", "Task Manager API", "Blog CMS"]},
                    {"name": "GitHub Workflow", "subnodes": ["Branching Strategy", "Pull Requests", "Code Reviews", "CI/CD Pipelines"]},
                    {"name": "Deployment", "subnodes": ["Docker Containers", "AWS/GCP Basics", "Vercel/Netlify", "Database Hosting"]},
                    {"name": "Portfolio Building", "subnodes": ["README Quality", "Live Demos", "Architecture Docs", "Test Coverage"]}
                ]
            },
            "Phase 4 – Career Preparation": {
                "branches": [
                    {"name": "Resume Building", "subnodes": ["ATS Optimization", "Project Highlights", "Quantified Impact", "Technical Skills Section"]},
                    {"name": "Mock Interviews", "subnodes": ["DSA Rounds", "System Design", "Behavioral (STAR)", "Take-Home Challenges"]},
                    {"name": "Certifications", "subnodes": ["AWS Cloud Practitioner", "Meta Frontend Dev", "Google IT Support", "Oracle Java"]},
                    {"name": "Job Platforms", "subnodes": ["LinkedIn Optimization", "AngelList/Wellfound", "GitHub Jobs", "Hired.com"]}
                ]
            }
        },
        "Data Scientist": {
            "Phase 1 – Foundations": {
                "branches": [
                    {"name": "Math Basics", "subnodes": ["Linear Algebra", "Probability", "Calculus", "Statistics"]},
                    {"name": "Core Concepts", "subnodes": ["Data Types", "Distributions", "Hypothesis Testing", "Bayesian Thinking"]},
                    {"name": "Learning Resources", "subnodes": ["Khan Academy Stats", "3Blue1Brown", "StatQuest", "Coursera Math"]},
                    {"name": "Practice Exercises", "subnodes": ["Kaggle Learn", "DataCamp Basics", "NumPy Exercises", "Pandas Challenges"]}
                ]
            },
            "Phase 2 – Core Skills": {
                "branches": [
                    {"name": "Technical Stacks", "subnodes": ["Python/Scikit-learn", "R/Tidyverse", "Spark/PySpark", "SQL/PostgreSQL"]},
                    {"name": "Frameworks", "subnodes": ["TensorFlow", "PyTorch", "XGBoost", "Keras"]},
                    {"name": "Algorithms", "subnodes": ["Linear Regression", "Decision Trees", "SVM", "Neural Networks"]},
                    {"name": "Case Studies", "subnodes": ["Netflix Recommendations", "Fraud Detection", "Churn Prediction", "NLP Sentiment"]}
                ]
            },
            "Phase 3 – Projects": {
                "branches": [
                    {"name": "Real-world Projects", "subnodes": ["Price Predictor", "Image Classifier", "Recommendation Engine", "Time Series Forecast"]},
                    {"name": "GitHub Workflow", "subnodes": ["Jupyter Notebooks", "Data Versioning (DVC)", "Model Registry", "Experiment Tracking"]},
                    {"name": "Deployment", "subnodes": ["Flask/FastAPI Model Serving", "Streamlit Dashboards", "MLflow", "Docker for ML"]},
                    {"name": "Portfolio Building", "subnodes": ["Kaggle Competitions", "Blog Write-ups", "Interactive Demos", "Research Papers"]}
                ]
            },
            "Phase 4 – Career Preparation": {
                "branches": [
                    {"name": "Resume Building", "subnodes": ["Kaggle Rank", "Publication List", "Project Metrics", "Technical Blog"]},
                    {"name": "Mock Interviews", "subnodes": ["ML System Design", "Case Study Analysis", "Coding + SQL", "Statistics Questions"]},
                    {"name": "Certifications", "subnodes": ["Google Data Analytics", "IBM Data Science", "AWS ML Specialty", "TensorFlow Developer"]},
                    {"name": "Job Platforms", "subnodes": ["LinkedIn Data Roles", "Kaggle Jobs", "DataJobs.com", "AI-Jobs.net"]}
                ]
            }
        },
        "Product Manager": {
            "Phase 1 – Foundations": {
                "branches": [
                    {"name": "PM Basics", "subnodes": ["Product Thinking", "User Personas", "Problem Framing", "Value Proposition"]},
                    {"name": "Core Concepts", "subnodes": ["Jobs-to-be-Done", "Design Thinking", "Lean Startup", "MVP Strategy"]},
                    {"name": "Learning Resources", "subnodes": ["Product School", "Reforge", "Lenny's Newsletter", "Inspired (Book)"]},
                    {"name": "Practice Exercises", "subnodes": ["Product Teardowns", "Competitive Analysis", "User Interviews", "Feature Prioritization"]}
                ]
            },
            "Phase 2 – Core Skills": {
                "branches": [
                    {"name": "Technical Literacy", "subnodes": ["API Concepts", "SQL Basics", "A/B Testing", "Analytics Tools"]},
                    {"name": "Frameworks", "subnodes": ["RICE Scoring", "OKRs", "North Star Metric", "Kano Model"]},
                    {"name": "Methodologies", "subnodes": ["Agile/Scrum", "Kanban", "Sprint Planning", "Retrospectives"]},
                    {"name": "Case Studies", "subnodes": ["Airbnb Growth", "Spotify Discovery", "Slack Adoption", "Uber Pricing"]}
                ]
            },
            "Phase 3 – Projects": {
                "branches": [
                    {"name": "Real-world Projects", "subnodes": ["Feature Spec Document", "Go-to-Market Plan", "User Research Report", "Metrics Dashboard"]},
                    {"name": "Collaboration", "subnodes": ["Cross-functional Teams", "Stakeholder Mgmt", "Design Sprints", "Dev Handoff"]},
                    {"name": "Launch Strategy", "subnodes": ["Beta Testing", "Phased Rollout", "Feature Flags", "Launch Metrics"]},
                    {"name": "Portfolio Building", "subnodes": ["Case Study Deck", "Product Blog", "Side Projects", "Community Talks"]}
                ]
            },
            "Phase 4 – Career Preparation": {
                "branches": [
                    {"name": "Resume Building", "subnodes": ["Impact Metrics", "Product Launches", "Growth Stories", "Leadership Examples"]},
                    {"name": "Mock Interviews", "subnodes": ["Product Sense", "Estimation Questions", "Strategy Cases", "Behavioral Rounds"]},
                    {"name": "Certifications", "subnodes": ["PMP Certification", "Scrum Master", "Google PM Certificate", "Pragmatic Institute"]},
                    {"name": "Job Platforms", "subnodes": ["LinkedIn PM Roles", "Product Hunt Jobs", "Mind the Product", "Glassdoor PM"]}
                ]
            }
        },
        "Cybersecurity Analyst": {
            "Phase 1 – Foundations": {
                "branches": [
                    {"name": "Network Basics", "subnodes": ["TCP/IP Model", "DNS & HTTP", "Firewalls", "VPN Concepts"]},
                    {"name": "Core Concepts", "subnodes": ["CIA Triad", "Attack Vectors", "Threat Modeling", "Security Policies"]},
                    {"name": "Learning Resources", "subnodes": ["TryHackMe Free", "Cybrary Basics", "CompTIA Network+", "Professor Messer"]},
                    {"name": "Practice Exercises", "subnodes": ["OverTheWire Bandit", "PicoCTF", "HackTheBox Starting", "CyberDefenders"]}
                ]
            },
            "Phase 2 – Core Skills": {
                "branches": [
                    {"name": "Technical Stacks", "subnodes": ["Kali Linux", "Wireshark", "Burp Suite", "Metasploit"]},
                    {"name": "Frameworks", "subnodes": ["NIST CSF", "OWASP Top 10", "MITRE ATT&CK", "ISO 27001"]},
                    {"name": "Algorithms", "subnodes": ["Encryption (AES/RSA)", "Hashing (SHA)", "PKI", "Key Exchange"]},
                    {"name": "Case Studies", "subnodes": ["SolarWinds Attack", "Equifax Breach", "WannaCry", "Log4Shell Vuln"]}
                ]
            },
            "Phase 3 – Projects": {
                "branches": [
                    {"name": "Real-world Projects", "subnodes": ["Home Lab Setup", "Vulnerability Scanner", "SIEM Dashboard", "Incident Response Plan"]},
                    {"name": "CTF Challenges", "subnodes": ["Web Exploitation", "Forensics", "Reverse Engineering", "Cryptographic Puzzles"]},
                    {"name": "Deployment", "subnodes": ["Security Hardening", "IDS/IPS Setup", "Log Aggregation", "Automated Scanning"]},
                    {"name": "Portfolio Building", "subnodes": ["CTF Write-ups", "Security Blog", "Tool Development", "Bug Bounty Reports"]}
                ]
            },
            "Phase 4 – Career Preparation": {
                "branches": [
                    {"name": "Resume Building", "subnodes": ["Certifications List", "CTF Rankings", "Tools Proficiency", "Incident Reports"]},
                    {"name": "Mock Interviews", "subnodes": ["Scenario-based Q&A", "Network Troubleshooting", "Incident Response Drills", "Compliance Questions"]},
                    {"name": "Certifications", "subnodes": ["CompTIA Security+", "CEH", "OSCP", "CISSP"]},
                    {"name": "Job Platforms", "subnodes": ["CyberSecJobs", "InfoSec Jobs", "LinkedIn Security", "ClearanceJobs"]}
                ]
            }
        },
        "UI/UX Designer": {
            "Phase 1 – Foundations": {
                "branches": [
                    {"name": "Design Basics", "subnodes": ["Color Theory", "Typography", "Layout & Grid", "Visual Hierarchy"]},
                    {"name": "Core Concepts", "subnodes": ["User-Centered Design", "Accessibility (a11y)", "Gestalt Principles", "Design Ethics"]},
                    {"name": "Learning Resources", "subnodes": ["Google UX Certificate", "Interaction Design Foundation", "Refactoring UI", "Laws of UX"]},
                    {"name": "Practice Exercises", "subnodes": ["Daily UI Challenge", "Dribbble Recreation", "Figma Tutorials", "Wireframe Sketching"]}
                ]
            },
            "Phase 2 – Core Skills": {
                "branches": [
                    {"name": "Technical Stacks", "subnodes": ["Figma Advanced", "Adobe XD", "Sketch", "Framer"]},
                    {"name": "Frameworks", "subnodes": ["Material Design", "Apple HIG", "Atomic Design", "Design Tokens"]},
                    {"name": "Research Methods", "subnodes": ["User Interviews", "Usability Testing", "Card Sorting", "A/B Testing"]},
                    {"name": "Case Studies", "subnodes": ["Airbnb Redesign", "Duolingo UX", "Spotify Wrapped", "Apple.com Design"]}
                ]
            },
            "Phase 3 – Projects": {
                "branches": [
                    {"name": "Real-world Projects", "subnodes": ["Mobile App Redesign", "SaaS Dashboard", "E-commerce UX Audit", "Design System"]},
                    {"name": "Design Process", "subnodes": ["Research → Ideate", "Wireframe → Prototype", "Test → Iterate", "Handoff → Dev"]},
                    {"name": "Tools Mastery", "subnodes": ["Figma Components", "Auto Layout", "Prototyping", "Design Tokens"]},
                    {"name": "Portfolio Building", "subnodes": ["Case Study Format", "Behance/Dribbble", "Personal Website", "Process Documentation"]}
                ]
            },
            "Phase 4 – Career Preparation": {
                "branches": [
                    {"name": "Resume Building", "subnodes": ["Visual Resume", "Portfolio Link", "Process Showcase", "Impact Metrics"]},
                    {"name": "Mock Interviews", "subnodes": ["Design Challenge", "Whiteboard Exercise", "Portfolio Walkthrough", "Design Critique"]},
                    {"name": "Certifications", "subnodes": ["Google UX Professional", "Nielsen Norman UX", "HFI CUA", "Interaction Design Foundation"]},
                    {"name": "Job Platforms", "subnodes": ["Dribbble Jobs", "Behance Jobs", "LinkedIn Design", "Designerjobs.co"]}
                ]
            }
        }
    }

    # ==========================================
    # PHASE-SPECIFIC RESOURCES PER CAREER
    # Unique curated resources for each phase
    # ==========================================
    PHASE_RESOURCES = {
        "Software Engineer": {
            "Phase 1 – Foundations": [
                {"type": "course", "title": "CS50: Introduction to Computer Science", "url": "https://cs50.harvard.edu/x/", "platform": "Harvard", "duration": "12 weeks", "difficulty": "Beginner"},
                {"type": "video", "title": "Programming Logic for Beginners", "url": "https://www.youtube.com/watch?v=zOjov-2OZ0E", "platform": "YouTube", "duration": "45 mins", "difficulty": "Beginner"},
                {"type": "article", "title": "Clean Code Summary (Stable Gist)", "url": "https://gist.github.com/wojteklu/73c6914518bc2acc4ca0", "platform": "GitHub Gist", "duration": "20 mins", "difficulty": "Intermediate"},
                {"type": "article", "title": "The Odin Project: Foundations", "url": "https://www.theodinproject.com/paths/foundations/courses/foundations", "platform": "Odin Project", "duration": "40 hours", "difficulty": "Beginner"}
            ],
            "Phase 2 – Core Skills": [
                {"type": "course", "title": "Full Stack Open: Deep Dive Into Modern Web Dev", "url": "https://fullstackopen.com/en/", "platform": "University of Helsinki", "duration": "14 weeks", "difficulty": "Intermediate"},
                {"type": "video", "title": "System Design for Beginners", "url": "https://www.youtube.com/watch?v=i7SInS8vO0E", "platform": "YouTube", "duration": "1 hour", "difficulty": "Intermediate"},
                {"type": "article", "title": "REST API Design Best Practices", "url": "https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/", "platform": "StackOverflow", "duration": "20 mins", "difficulty": "Intermediate"},
                {"type": "pdf", "title": "The Pragmatic Programmer: Quick Guide", "url": "https://www.cs.colorado.edu/~kena/classes/5448/f12/presentation-materials/thepragmaticprogrammer.pdf", "platform": "PDF", "duration": "Read", "difficulty": "Intermediate"}
            ],
            "Phase 3 – Projects": [
                {"type": "video", "title": "Building a Real-time Chat with WebSockets", "url": "https://www.youtube.com/watch?v=kYRPZRLS8L4", "platform": "YouTube", "duration": "1.5 hours", "difficulty": "Advanced"},
                {"type": "article", "title": "Microservices Architecture Guide", "url": "https://microservices.io/patterns/microservices.html", "platform": "Microservices.io", "duration": "30 mins", "difficulty": "Advanced"},
                {"type": "course", "title": "AWS Cloud Practitioner Essentials", "url": "https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials", "platform": "AWS", "duration": "6 hours", "difficulty": "Intermediate"}
            ],
            "Phase 4 – Career Preparation": [
                {"type": "video", "title": "Cracking the Coding Interview: Tips", "url": "https://www.youtube.com/watch?v=uQ_Xit_C9pQ", "platform": "YouTube", "duration": "30 mins", "difficulty": "Hard"},
                {"type": "article", "title": "Star Method for Behavioral Interviews", "url": "https://www.themuse.com/advice/star-interview-method", "platform": "The Muse", "duration": "15 mins", "difficulty": "Beginner"},
                {"type": "link", "title": "Professional Resume Template", "url": "https://www.careercup.com/resume", "platform": "CareerCup", "duration": "Template", "difficulty": "Beginner"}
            ]
        },
        "Data Scientist": {
            "Phase 1 – Foundations": [
                {"type": "course", "title": "Python for Data Science (IBM)", "url": "https://www.edx.org/course/python-for-data-science-2", "platform": "edX", "duration": "4 weeks", "difficulty": "Beginner"},
                {"type": "video", "title": "Linear Algebra for ML Pro", "url": "https://www.youtube.com/watch?v=kjBOesZCoqc", "platform": "YouTube", "duration": "2 hours", "difficulty": "Beginner"}
            ],
            "Phase 2 – Core Skills": [
                {"type": "article", "title": "Pandas Cheat Sheet for Data Analysis", "url": "https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf", "platform": "Pandas", "duration": "5 mins", "difficulty": "Beginner"},
                {"type": "video", "title": "Scikit-Learn Machine Learning Workflow", "url": "https://www.youtube.com/watch?v=0Lt9w-RO8MC", "platform": "YouTube", "duration": "1 hour", "difficulty": "Intermediate"}
            ],
            "Phase 3 – Projects": [
                {"type": "video", "title": "Building your Data Science Portfolio", "url": "https://www.youtube.com/watch?v=8_L79767auM", "platform": "YouTube", "duration": "45 mins", "difficulty": "Intermediate"}
            ],
            "Phase 4 – Career Preparation": [
                {"type": "article", "title": "Data Science Interview Bible", "url": "https://towardsdatascience.com/data-science-interview-guide-4ee9f5eb7787", "platform": "Medium", "duration": "1 hour", "difficulty": "Hard"}
            ]
        },
        "Product Manager": {
            "Phase 1 – Foundations": [
                {"type": "course", "title": "Product Management Fundamentals", "url": "https://www.coursera.org/learn/uva-darden-digital-product-management", "platform": "Coursera", "duration": "4 weeks", "difficulty": "Beginner"},
                {"type": "video", "title": "Product Manager Role Explained", "url": "https://www.youtube.com/watch?v=zOjov-2OZ0E", "platform": "YouTube", "duration": "1 hour", "difficulty": "Beginner"},
                {"type": "article", "title": "Inspired by Marty Cagan (Summary)", "url": "https://www.productplan.com/learn/inspired-marty-cagan-summary/", "platform": "ProductPlan", "duration": "20 mins", "difficulty": "Beginner"},
                {"type": "tool", "title": "Miro: Collaborative Whiteboarding", "url": "https://miro.com/", "platform": "Miro", "duration": "Tool", "difficulty": "Beginner"}
            ],
            "Phase 2 – Core Skills": [
                {"type": "course", "title": "Agile with Atlassian Jira", "url": "https://www.coursera.org/learn/agile-atlassian-jira", "platform": "Coursera", "duration": "12 hours", "difficulty": "Intermediate"},
                {"type": "video", "title": "Product Metrics & Analytics Deep Dive", "url": "https://www.youtube.com/watch?v=i7SInS8vO0E", "platform": "YouTube", "duration": "1.5 hours", "difficulty": "Intermediate"},
                {"type": "article", "title": "RICE Prioritization Framework", "url": "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/", "platform": "Intercom", "duration": "15 mins", "difficulty": "Intermediate"},
                {"type": "tool", "title": "Amplitude: Product Analytics", "url": "https://amplitude.com/", "platform": "Amplitude", "duration": "Tool", "difficulty": "Intermediate"}
            ],
            "Phase 3 – Projects": [
                {"type": "course", "title": "Product Launch: Go-to-Market Strategy", "url": "https://www.reforge.com/", "platform": "Reforge", "duration": "Advanced", "difficulty": "Advanced"},
                {"type": "video", "title": "How Top PMs Ship Products", "url": "https://www.youtube.com/watch?v=kYRPZRLS8L4", "platform": "YouTube", "duration": "45 mins", "difficulty": "Advanced"},
                {"type": "article", "title": "Writing Great Product Specs", "url": "https://www.lennysnewsletter.com/p/my-favorite-templates-issue-37", "platform": "Lenny's", "duration": "30 mins", "difficulty": "Advanced"}
            ],
            "Phase 4 – Career Preparation": [
                {"type": "course", "title": "Exponent: PM Interview Course", "url": "https://www.tryexponent.com/courses/pm", "platform": "Exponent", "duration": "Course", "difficulty": "Hard"},
                {"type": "video", "title": "Mock Technical Interview Practice", "url": "https://www.youtube.com/watch?v=uQ_Xit_C9pQ", "platform": "YouTube", "duration": "1 hour", "difficulty": "Hard"},
                {"type": "article", "title": "Cracking the PM Interview Guide", "url": "https://www.crackingthepminterview.com/", "platform": "CTPMI", "duration": "Book/Guide", "difficulty": "Hard"}
            ]
        },
        "Cybersecurity Analyst": {
            "Phase 1 – Foundations": [
                {"type": "course", "title": "TryHackMe: Complete Beginner Path", "url": "https://tryhackme.com/path/outline/beginner", "platform": "TryHackMe", "duration": "40 hours", "difficulty": "Beginner"},
                {"type": "video", "title": "CompTIA Network+ Full Course", "url": "https://www.youtube.com/watch?v=qiALsdEz7uy", "platform": "YouTube", "duration": "14 hours", "difficulty": "Beginner"},
                {"type": "pdf", "title": "Linux Command Line Basics (Cheat Sheet)", "url": "https://web.mit.edu/m-it/linux/cheat-sheet.pdf", "platform": "MIT", "duration": "10 mins", "difficulty": "Beginner"},
                {"type": "tool", "title": "OverTheWire: Bandit Wargame", "url": "https://overthewire.org/wargames/bandit/", "platform": "OverTheWire", "duration": "Self-paced", "difficulty": "Beginner"}
            ],
            "Phase 2 – Core Skills": [
                {"type": "course", "title": "Ethical Hacking with Kali Linux", "url": "https://www.udemy.com/course/learn-ethical-hacking-from-scratch/", "platform": "Udemy", "duration": "15 hours", "difficulty": "Intermediate"},
                {"type": "video", "title": "Wireshark Tutorial for Beginners", "url": "https://www.youtube.com/watch?v=lb1Dw0elw0Q", "platform": "YouTube", "duration": "2 hours", "difficulty": "Intermediate"},
                {"type": "article", "title": "MITRE ATT&CK Framework Guide", "url": "https://attack.mitre.org/", "platform": "MITRE", "duration": "45 mins", "difficulty": "Intermediate"},
                {"type": "tool", "title": "Burp Suite Community Edition", "url": "https://portswigger.net/burp/communitydownload", "platform": "PortSwigger", "duration": "Tool", "difficulty": "Intermediate"}
            ],
            "Phase 3 – Projects": [
                {"type": "video", "title": "Build a Home Hacking Lab", "url": "https://www.youtube.com/watch?v=Wp87I8K0rSw", "platform": "YouTube", "duration": "1 hour", "difficulty": "Intermediate"},
                {"type": "tool", "title": "VulnHub: Vulnerable VMs for Practice", "url": "https://www.vulnhub.com/", "platform": "VulnHub", "duration": "Practice", "difficulty": "Advanced"},
                {"type": "pdf", "title": "SIEM Implementation Guide", "url": "https://www.elastic.co/guide/en/siem/guide/current/siem-guide.pdf", "platform": "Elastic", "duration": "1 hour", "difficulty": "Advanced"}
            ],
            "Phase 4 – Career Preparation": [
                {"type": "course", "title": "CompTIA Security+ Study Guide", "url": "https://www.comptia.org/certifications/security", "platform": "CompTIA", "duration": "Study Plan", "difficulty": "Hard"},
                {"type": "video", "title": "OSCP Certification Preparation", "url": "https://www.youtube.com/watch?v=S07_C98_N9Y", "platform": "YouTube", "duration": "2 hours", "difficulty": "Hard"},
                {"type": "article", "title": "Cybersecurity Interview Questions", "url": "https://www.simplilearn.com/tutorials/cyber-security-tutorial/cyber-security-interview-questions", "platform": "SimpliLearn", "duration": "1 hour", "difficulty": "Hard"}
            ]
        },
        "UI/UX Designer": {
            "Phase 1 – Foundations": [
                {"type": "course", "title": "Google UX Design Certificate", "url": "https://www.coursera.org/professional-certificates/google-ux-design", "platform": "Coursera", "duration": "6 months", "difficulty": "Beginner"},
                {"type": "video", "title": "Figma Tutorial for Beginners", "url": "https://www.youtube.com/watch?v=dXQ7IHkTiMM", "platform": "YouTube", "duration": "2 hours", "difficulty": "Beginner"},
                {"type": "article", "title": "Laws of UX: Essential Principles", "url": "https://lawsofux.com/", "platform": "Laws of UX", "duration": "30 mins", "difficulty": "Beginner"},
                {"type": "tool", "title": "Coolors: Color Palette Generator", "url": "https://coolors.co/", "platform": "Coolors", "duration": "Tool", "difficulty": "Beginner"}
            ],
            "Phase 2 – Core Skills": [
                {"type": "video", "title": "UX Research Methods Masterclass", "url": "https://www.youtube.com/watch?v=zOjov-2OZ0E", "platform": "YouTube", "duration": "1 hour", "difficulty": "Intermediate"},
                {"type": "article", "title": "Material Design 3 Guidelines", "url": "https://m3.material.io/", "platform": "Google", "duration": "1 hour", "difficulty": "Intermediate"},
                {"type": "tool", "title": "Maze: Remote Usability Testing", "url": "https://maze.co/", "platform": "Maze", "duration": "Tool", "difficulty": "Intermediate"}
            ],
            "Phase 3 – Projects": [
                {"type": "video", "title": "UX Case Study Presentation Tips", "url": "https://www.youtube.com/watch?v=uQ_Xit_C9pQ", "platform": "YouTube", "duration": "30 mins", "difficulty": "Intermediate"},
                {"type": "article", "title": "Atomic Design Methodology", "url": "https://bradfrost.com/blog/post/atomic-web-design/", "platform": "Brad Frost", "duration": "45 mins", "difficulty": "Advanced"},
                {"type": "tool", "title": "Framer: Interactive Prototyping", "url": "https://www.framer.com/", "platform": "Framer", "duration": "Tool", "difficulty": "Advanced"}
            ],
            "Phase 4 – Career Preparation": [
                {"type": "video", "title": "UX Portfolio Design Walkthrough", "url": "https://www.youtube.com/watch?v=dXQ7IHkTiMM", "platform": "YouTube", "duration": "1 hour", "difficulty": "Intermediate"},
                {"type": "article", "title": "How to Present Design Work", "url": "https://medium.com/design-bootcamp/how-to-present-your-design-work-e08b1b53e23a", "platform": "Medium", "duration": "20 mins", "difficulty": "Hard"},
                {"type": "tool", "title": "ADPList: Free Design Mentorship", "url": "https://adplist.org/", "platform": "ADPList", "duration": "Mentorship", "difficulty": "Beginner"}
            ]
        },
    }

    # ==========================================
    # CAREER-SPECIFIC OBJECTIVES & EXPECTATIONS
    # ==========================================
    PHASE_OBJECTIVES = {
        "Software Engineer": {
            "Phase 1 – Foundations": {
                "focus": "Algorithmic Logic & Syntax",
                "objectives": ["Understand memory allocation basics", "Learn time complexity (Big O)", "Master recursion & iteration", "Implement basic search algorithms"],
                "mastery_checklist": ["Solve 50+ basic logic puzzles", "Configure local dev environment", "Pass the syntax proficiency test", "Create a CLI tool from scratch"],
                "expectations": ["Syntax proficiency", "Clean code habits", "Independent problem solving"]
            },
            "Phase 2 – Core Skills": {
                "focus": "Backend & Database Architecture",
                "objectives": ["Design relational database schemas", "Master SQL query optimization", "Build robust REST APIs", "Understand event-driven architecture"],
                "mastery_checklist": ["Deploy 3 micro-services", "Optimize a slow SQL query", "Complete API authentication flow", "Implement caching with Redis"],
                "expectations": ["System design awareness", "Robust API development", "Data persistence mastery"]
            },
            "Phase 3 – Projects": {
                "focus": "Full Stack Mastery & Scaling",
                "objectives": ["Architect scalable full-stack apps", "Master CI/CD pipeline automation", "Implement advanced security (OAuth2)", "Configure cloud infrastructure"],
                "mastery_checklist": ["Launch a live production app", "Setup automated testing suite", "Dockerize a multi-node system", "Configure load balancer on AWS"],
                "expectations": ["Deployable projects", "Infrastructure knowledge", "Team workflow proficiency"]
            },
            "Phase 4 – Career Preparation": {
                "focus": "Technical Interviews & Portfolio",
                "objectives": ["Master system design interview patterns", "Solve hard-level DSA problems", "Optimize technical resume structure", "Build a high-performance portfolio site"],
                "mastery_checklist": ["Complete 10 mock interviews", "Solve 200+ LeetCode problems", "Get 2 open-source PRs merged", "Network with 20+ professionals"],
                "expectations": ["Interview confidence", "Professional network set", "Job market readiness"]
            }
        },
        "Data Scientist": {
            "Phase 1 – Foundations": {
                "focus": "Statistical Thinking & Python",
                "objectives": ["Master exploratory data analysis (EDA)", "Understand probability distributions", "Learn statistical hypothesis testing", "Proficiency in NumPy/Pandas pipelines"],
                "mastery_checklist": ["Analyze 5 diverse datasets", "Create interactive data dashboards", "Clean 10,000+ rows of raw data", "Automate reports with Python"],
                "expectations": ["Data manipulation skills", "Statistical intuition", "Clean notebook habits"]
            },
            "Phase 2 – Core Skills": {
                "focus": "Machine Learning Algorithms",
                "objectives": ["Learn regression & classification depth", "Implement model ensemble techniques", "Understand hyperparameter tuning", "Advanced SQL for data pipelining"],
                "mastery_checklist": ["Win a bronze medal on Kaggle", "Build a customer churn model", "Optimize model inference speed", "Cross-validate 5 complex models"],
                "expectations": ["Predictive modeling", "Metric selection", "Advanced data querying"]
            },
            "Phase 3 – Projects": {
                "focus": "Deep Learning & Model Deployment",
                "objectives": ["Master Neural Network architectures", "Deploy models via FastAPI/Flask", "Handle big data with Spark/Hadoop", "Implement experiment tracking (MLflow)"],
                "mastery_checklist": ["Train a custom NLP transformer", "Serve a model using Docker", "Process a 1GB dataset in real-time", "Build an image recognition app"],
                "expectations": ["DL implementation", "Model productionization", "Insightful storytelling"]
            },
            "Phase 4 – Career Preparation": {
                "focus": "Business Impact & Portfolio",
                "objectives": ["Master ML system design interviews", "Solve real-world business case studies", "Curate a high-impact GitHub portfolio", "Build an online presence (TowardsDS)"],
                "mastery_checklist": ["Publish 3 technical blog posts", "Get ranked top 10% in Kaggle", "Complete 5 end-to-end projects", "Engage with Data Science mentors"],
                "expectations": ["Business-alignment", "Portfolio excellence", "Job-ready presence"]
            }
        },
        "Web Developer": {
            "Phase 1 – Foundations": {
                "focus": "UI Fundamentals & JS Logic",
                "objectives": ["Master CSS Grid & Flexbox layouts", "Understand JavaScript ES6+ internals", "Learn semantic HTML5 & Accessibility", "Build responsive interactive components"],
                "mastery_checklist": ["Clone 5 pixel-perfect websites", "Solve 100 JS logic challenges", "Build a responsive landing page", "Implement custom CSS animations"],
                "expectations": ["Layout precision", "Dynamic interaction", "Cross-browser awareness"]
            },
            "Phase 2 – Core Skills": {
                "focus": "Frontend Frameworks & Backend basics",
                "objectives": ["Master React lifecycle & hooks", "Learn state management (Zustand/Redux)", "Build custom server-side Node.js APIs", "Integrate complex 3rd party services"],
                "mastery_checklist": ["Build a multi-page web app", "Manage complex state in React", "Setup a full-stack CRUD API", "Implement dark mode & theming"],
                "expectations": ["Framework proficiency", "Full-stack basics", "API consumption"]
            },
            "Phase 3 – Projects": {
                "focus": "Enterprise Apps & Deployment",
                "objectives": ["Build reusable Design Systems", "Master complex E-commerce logic", "Optimize for speed and SEO (Next.js)", "Deploy scalable apps on Vercel/AWS"],
                "mastery_checklist": ["Pass Lighthouse 90+ score", "Deploy 3 production-ready apps", "Build a component library", "Implement real-time features"],
                "expectations": ["Production-ready apps", "Deployment knowledge", "UI polish mastery"]
            },
            "Phase 4 – Career Preparation": {
                "focus": "Interview Readiness & Portfolio",
                "objectives": ["Apply for frontend specific roles", "Practice technical whiteboard rounds", "Maintain a live project showcase", "Learn freelance & contract basics"],
                "mastery_checklist": ["Build your personal portfolio", "Review 10 coworker PRs", "Optimize your LinkedIn profile", "Apply to 5 high-potential roles"],
                "expectations": ["Interview confidence", "Live portfolio", "Job search strategy"]
            }
        },
        "UI/UX Designer": {
            "Phase 1 – Foundations": {
                "focus": "Visual Design & Theory",
                "objectives": ["Understand visual hierarchy & rhythm", "Master professional typography rules", "Learn Figma component best practices", "Study universal design principles"],
                "mastery_checklist": ["Design a full mobile app UI", "Perfect a 10-style font system", "Create an icon library", "Analyze 20 popular app UIs"],
                "expectations": ["High visual quality", "Tool proficiency", "Consistency mastery"]
            },
            "Phase 2 – Core Skills": {
                "focus": "Interaction & Research",
                "objectives": ["Master high-fidelity prototyping", "Conduct professional user research", "Build complex information architectures", "Learn usability testing methodologies"],
                "mastery_checklist": ["Conduct 10 user interviews", "Build a clickable mockup", "Create a full user journey map", "Run 5 remote usability tests"],
                "expectations": ["Research-backed design", "Interactive prototypes", "User-flow clarity"]
            },
            "Phase 3 – Projects": {
                "focus": "Case Studies & Design Systems",
                "objectives": ["Analyze deep UX case study flows", "Build scalable design systems", "Master advanced Figma variables", "Optimize design-to-dev handoffs"],
                "mastery_checklist": ["Complete 2 major case studies", "Construct a full design system", "Design a responsive SaaS app", "Pass the UX certification exam"],
                "expectations": ["Strong portfolio pieces", "Systematic thinking", "Dev handoff skills"]
            },
            "Phase 4 – Career Preparation": {
                "focus": "Career Branding & Presentation",
                "objectives": ["Polish Behance/Dribbble portfolios", "Learn design critique articulation", "Build a custom visual resume", "Master client management basics"],
                "mastery_checklist": ["Feature on Dribbble frontpage", "Present 3 design case studies", "Get 5 designer endorsements", "Apply for 10 design studios"],
                "expectations": ["Professional brand", "Critique confidence", "Job market ready"]
            }
        },
        "Cybersecurity Analyst": {
            "Phase 1 – Foundations": {
                "focus": "Networking & SysAdmin",
                "objectives": ["Understand the TCP/IP stack depth", "Learn Linux and Windows system admin", "Master basic network security rules", "Develop a security analysis mindset"],
                "mastery_checklist": ["Pass a network essentials lab", "Automate tasks with Bash shell", "Identify 10 diverse port states", "Setup a local secure firewall"],
                "expectations": ["Command line comfort", "Networking protocols", "Threat awareness"]
            },
            "Phase 2 – Core Skills": {
                "focus": "Vulnerability & Tooling",
                "objectives": ["Master vulnerability scanning tools", "Learn ethical hacking methodologies", "Understand OWASP security protocols", "Write simple Python security scripts"],
                "mastery_checklist": ["Exploit 5 lab machines", "Perform 10 vulnerability scans", "Script a malware scanner", "Intercept 10 network packets"],
                "expectations": ["Scanner proficiency", "Exploit understanding", "Analytical thinking"]
            },
            "Phase 3 – Projects": {
                "focus": "Defense & Monitoring",
                "objectives": ["Configure SIEM monitoring alerts", "Learn deeper incident response flow", "Master cloud security (AWS Secrets)", "Implement advanced encryption tech"],
                "mastery_checklist": ["Setup a live SIEM dashboard", "Resolve 5 simulated breaches", "Hardened 3 cloud servers", "Deploy an IDS/IPS on home net"],
                "expectations": ["SOC readiness", "Defense implementation", "Compliance knowledge"]
            },
            "Phase 4 – Career Preparation": {
                "focus": "Certs & Job Readiness",
                "objectives": ["Finalize Security+ certification", "Learn professional report writing", "Master technical security interviews", "Build a specialized security resume"],
                "mastery_checklist": ["Get CompTIA Security+ certified", "Write 3 detailed audit reports", "Solve 5 technical walk-throughs", "Connect with SOC managers"],
                "expectations": ["Certification path set", "Communication skill", "Pro tech presence"]
            }
        },
        "Product Manager": {
            "Phase 1 – Foundations": {
                "focus": "Product Thinking & UX",
                "objectives": ["Master product-market fit logic", "Learn user persona segmentation", "Understand PM fundamentals & roles", "Master Agile & Scrum basics"],
                "mastery_checklist": ["Interview 10 potential users", "Craft 5 detailed user stories", "Build an MVP product roadmap", "Conduct a market teardown"],
                "expectations": ["Strategic mindset", "Empathy foundation", "Iterative thinking"]
            },
            "Phase 2 – Core Skills": {
                "focus": "Analytics & Tech Literacy",
                "objectives": ["Learn SQL for PM data analysis", "Master product analytics (Amplitude)", "Write professional PRD documents", "Learn prioritization (ICE/Kano)"],
                "mastery_checklist": ["Query a database for insights", "Write a 10-page PRD document", "Define 5 core product KPIs", "Present a data-backed plan"],
                "expectations": ["Data-driven decisions", "Clear documentation", "Prioritization skill"]
            },
            "Phase 3 – Projects": {
                "focus": "Strategy & Roadmap",
                "objectives": ["Build a quarterly feature roadmap", "Master cross-team stakeholder mgmt", "Develop a go-to-market strategy", "Analyze competitive landscape depth"],
                "mastery_checklist": ["Lead a mock sprint planning", "Design a GTM launch plan", "Create a Miro strategy board", "Conduct a SWOT analysis"],
                "expectations": ["Vision clarity", "Cross-team leadership", "Market understanding"]
            },
            "Phase 4 – Career Preparation": {
                "focus": "PM Case Study & Networking",
                "objectives": ["Master PM market sizing cases", "Learn product estimation logic", "Build a specialized PM network", "Finalize professional PM portfolio"],
                "mastery_checklist": ["Solve 20 product case studies", "Estimate 5 market problems", "Attend 3 product conferences", "Apply for 5 associate PM roles"],
                "expectations": ["Estimation confidence", "Strong PM brand", "Job funnel set"]
            }
        }
    }

    # ==========================================
    # MODULE-SPECIFIC RESOURCES (Used for side panels)
    # ==========================================

    # ==========================================
    # MODULE-SPECIFIC RESOURCES (Used for side panels)
    # ==========================================
    MODULE_RESOURCES = {
        "programming": [
            {"type": "video", "title": "Programming Logic Masterclass", "url": "https://www.youtube.com/watch?v=zOjov-2OZ0E", "description": "Fundamentals of coding logic."},
            {"type": "course", "title": "Intro to Programming (Harvard CS50)", "url": "https://cs50.harvard.edu/x/", "description": "The world's most famous intro to CS."}
        ],
        "data structures": [
            {"type": "video", "title": "Data Structures in 10 Minutes", "url": "https://www.youtube.com/watch?v=bum_19loOEc", "description": "Quick overview of core structures."},
            {"type": "tool", "title": "VisuAlgo", "url": "https://visualgo.net/", "description": "Visualizing data structures and algorithms."}
        ],
        "logic": [
            {"type": "article", "title": "The Art of Logical Thinking", "url": "https://plato.stanford.edu/entries/logic-informal/", "description": "Foundations of informal logic."}
        ],
        "web development": [
            {"type": "course", "title": "The Complete Web Dev Bootcamp", "url": "https://www.udemy.com/course/the-complete-web-development-bootcamp/", "description": "From zero to full-stack."}
        ],
        "machine learning": [
            {"type": "video", "title": "Machine Learning for Everyone", "url": "https://www.youtube.com/watch?v=IpGxLWOIZy4", "description": "A non-technical intro to ML."}
        ],
        "communication": [
            {"type": "video", "title": "Effective Communication Skills", "url": "https://www.youtube.com/watch?v=HAnw168huqA", "description": "Master the art of conversation."},
            {"type": "article", "title": "Top 10 Communication Skills", "url": "https://www.thebalancecareers.com/communication-skills-list-2063779", "description": "List of essential comms skills."}
        ],
        "problem solving": [
            {"type": "video", "title": "How to Solve Any Problem", "url": "https://www.youtube.com/watch?v=8K0l9E4-oAc", "description": "Problem solving framework."},
            {"type": "article", "title": "The Problem Solving Process", "url": "https://www.asq.org/quality-resources/problem-solving", "description": "Systematic approach to issues."}
        ],
        "leadership": [
            {"type": "video", "title": "What Makes a Good Leader?", "url": "https://www.youtube.com/watch?v=fW8amMCVAJQ", "description": "Leadership traits and skills."},
            {"type": "article", "title": "Leadership Skills Checklist", "url": "https://www.mindtools.com/pages/article/newLDR_41.htm", "description": "Develop your leadership potential."}
        ]
    }

    def _get_phase_metadata(self, career: str, phase_name: str, scores: dict = None) -> Dict[str, Any]:
        """
        Build rich phase metadata including objectives, expectations, resources, and mindmap.
        """
        # Get career-specific objectives or fallback to Software Engineer
        career_objs = self.PHASE_OBJECTIVES.get(career, self.PHASE_OBJECTIVES.get("Software Engineer", {}))
        phase_obj = career_objs.get(phase_name, {})
        
        # Career-specific description
        career_descriptions = {
            "Phase 1 – Foundations": f"Building the bedrock for a {career}. Internalizing core concepts and setting up your learning environment.",
            "Phase 2 – Core Skills": f"Deepening your {career} expertise with industry-standard tools, frameworks, and problem-solving techniques.",
            "Phase 3 – Projects": f"Applying your {career} skills to real-world projects. Building a portfolio that demonstrates practical competence.",
            "Phase 4 – Career Preparation": f"Polishing your {career} profile for the job market. Interview prep, certifications, and networking.",
        }
        
        # Get mindmap data
        career_mindmap = self.MINDMAP_DATA.get(career, self.MINDMAP_DATA.get("Software Engineer", {}))
        mindmap_nodes = career_mindmap.get(phase_name, {"branches": []})
        
        # Get resources (PHASE LEVEL)
        career_resources = self.PHASE_RESOURCES.get(career, self.PHASE_RESOURCES.get("Software Engineer", {}))
        resources = career_resources.get(phase_name, [])
        
        # Enrich resources with more metadata
        enriched_resources = []
        for res in resources:
            # Add default metadata if missing
            res_copy = res.copy()
            if 'duration' not in res_copy:
                res_copy['duration'] = "2-4 hours" if res_copy['type'] in ['course', 'video'] else "15-30 mins"
            if 'difficulty' not in res_copy:
                res_copy['difficulty'] = "Beginner" if "Foundations" in phase_name else "Intermediate"
            if 'description' not in res_copy:
                res_copy['description'] = f"Master {res_copy['title']} to excel in this phase."
            enriched_resources.append(res_copy)

        # Compute improvement areas from scores
        improvement_areas = []
        if scores:
            if scores.get("programming", 100) < 60:
                improvement_areas.append("Strengthen programming fundamentals — practice daily coding")
            if scores.get("math", 100) < 60:
                improvement_areas.append("Improve mathematical foundations — focus on applied math")
            if scores.get("communication", 100) < 60:
                improvement_areas.append("Develop communication skills — practice presentations")
            if scores.get("logic", 100) < 60:
                improvement_areas.append("Sharpen problem-solving — work through logic puzzles")
            if scores.get("design", 100) < 60:
                improvement_areas.append("Explore design thinking — study UI/UX basics")
        
        if not improvement_areas:
            improvement_areas = ["Continue building on your strengths", "Explore advanced topics in your strong areas"]

        # Get career-specific tools for this phase with full metadata
        TOOL_META = {
            "VS Code": {"name": "VS Code", "desc": "Standard for this phase", "url": "https://code.visualstudio.com/download", "logo": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg"},
            "Git": {"name": "Git", "desc": "Standard for this phase", "url": "https://git-scm.com/downloads", "logo": "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.svg"},
            "Figma": {"name": "Figma", "desc": "Collaborative design tool for UI/UX teams.", "url": "https://figma.com/downloads/", "logo": "https://www.vectorlogo.zone/logos/figma/figma-icon.svg"},
            "Python": {"name": "Python", "desc": "Powerful language for backend, AI, and data science.", "url": "https://www.python.org/downloads/", "logo": "https://www.vectorlogo.zone/logos/python/python-icon.svg"},
            "React": {"name": "React", "desc": "A JavaScript library for building user interfaces.", "url": "https://reactjs.org/docs/getting-started.html", "logo": "https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"},
            "PostgreSQL": {"name": "PostgreSQL", "desc": "Advanced open source relational database.", "url": "https://www.postgresql.org/download/", "logo": "https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg"},
            "Docker": {"name": "Docker", "desc": "Containerization platform for reliable deployments.", "url": "https://www.docker.com/products/docker-desktop", "logo": "https://www.vectorlogo.zone/logos/docker/docker-icon.svg"},
            "AWS": {"name": "AWS", "desc": "Comprehensive cloud computing platform.", "url": "https://aws.amazon.com/free/", "logo": "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg"},
            "Jupyter": {"name": "Jupyter", "desc": "Interactive tool for data science and research.", "url": "https://jupyter.org/install", "logo": "https://www.vectorlogo.zone/logos/jupyter/jupyter-icon.svg"},
            "Miro": {"name": "Miro", "desc": "Online whiteboard for visual collaboration.", "url": "https://miro.com/apps/", "logo": "https://www.vectorlogo.zone/logos/miro/miro-icon.svg"},
            "Wireshark": {"name": "Wireshark", "desc": "World's foremost network protocol analyzer.", "url": "https://www.wireshark.org/download.html", "logo": "https://www.vectorlogo.zone/logos/wireshark/wireshark-icon.svg"},
            "Kali Linux": {"name": "Kali Linux", "desc": "Advanced OS for penetration testing.", "url": "https://www.kali.org/get-kali/", "logo": "https://www.vectorlogo.zone/logos/kali/kali-icon.svg"},
            "Tableau": {"name": "Tableau", "desc": "Leading platform for data visualization and BI.", "url": "https://www.tableau.com/products/desktop/download", "logo": "https://www.vectorlogo.zone/logos/tableau/tableau-icon.svg"},
            "Power BI": {"name": "Power BI", "desc": "Microsoft's powerful business analytics service.", "url": "https://powerbi.microsoft.com/en-us/downloads/", "logo": "https://www.vectorlogo.zone/logos/microsoft_powerbi/microsoft_powerbi-icon.svg"},
            "Behance": {"name": "Behance", "desc": "Showcase and discover creative work.", "url": "https://www.behance.net/", "logo": "https://www.vectorlogo.zone/logos/behance/behance-icon.svg"},
            "Framer": {"name": "Framer", "desc": "Tool for building high-fidelity interactive prototypes.", "url": "https://www.framer.com/download/", "logo": "https://www.vectorlogo.zone/logos/framer/framer-icon.svg"},
            "Splunk": {"name": "Splunk", "desc": "Data platform for search, analysis, and visualization.", "url": "https://www.splunk.com/en_us/download.html", "logo": "https://www.vectorlogo.zone/logos/splunk/splunk-icon.svg"},
            "Notion": {"name": "Notion", "desc": "All-in-one workspace for notes and collaboration.", "url": "https://www.notion.so/desktop", "logo": "https://www.vectorlogo.zone/logos/notion/notion-icon.svg"},
            "Postman": {"name": "Postman", "desc": "API platform for building and using APIs.", "url": "https://www.postman.com/downloads/", "logo": "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg"},
            "MongoDB": {"name": "MongoDB", "desc": "The most popular NoSQL database.", "url": "https://www.mongodb.com/try/download/community", "logo": "https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg"},
            "IntelliJ": {"name": "IntelliJ IDEA", "desc": "The leading Java and Kotlin IDE.", "url": "https://www.jetbrains.com/idea/download/", "logo": "https://www.vectorlogo.zone/logos/jetbrains/jetbrains-icon.svg"},
            "Anaconda": {"name": "Anaconda", "desc": "The world's most popular data science platform.", "url": "https://www.anaconda.com/download", "logo": "https://www.vectorlogo.zone/logos/anaconda/anaconda-icon.svg"},
            "Jira": {"name": "Jira", "desc": "The #1 software development tool used by agile teams.", "url": "https://www.atlassian.com/software/jira/free", "logo": "https://www.vectorlogo.zone/logos/atlassian_jira/atlassian_jira-icon.svg"},
            "Nmap": {"name": "Nmap", "desc": "Free and open source utility for network discovery.", "url": "https://nmap.org/download.html", "logo": "https://www.vectorlogo.zone/logos/nmap/nmap-icon.svg"},
            "Metasploit": {"name": "Metasploit", "desc": "The world's most used penetration testing framework.", "url": "https://www.metasploit.com/download", "logo": "https://www.vectorlogo.zone/logos/metasploit/metasploit-icon.svg"},
            "Chrome DevTools": {"name": "Chrome DevTools", "desc": "Web debugging and performance tools.", "url": "https://www.google.com/chrome/", "logo": "https://www.vectorlogo.zone/logos/google_chrome/google_chrome-icon.svg"},
            "GitHub Desktop": {"name": "GitHub Desktop", "desc": "GUI for managing Git repositories.", "url": "https://desktop.github.com/", "logo": "https://www.vectorlogo.zone/logos/github/github-icon.svg"},
            "Vercel": {"name": "Vercel", "desc": "Platform for frontend frameworks and static sites.", "url": "https://vercel.com/download", "logo": "https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg"},
            "Node.js": {"name": "Node.js", "desc": "JavaScript runtime for backend development.", "url": "https://nodejs.org/en/download/", "logo": "https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg"},
            "Tailwind CSS": {"name": "Tailwind CSS", "desc": "Utility-first CSS framework for rapid UI design.", "url": "https://tailwindcss.com/docs/installation", "logo": "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg"}
        }

        phase_tools_raw = {
            "Phase 1 – Foundations": {
                "Software Engineer": ["VS Code", "Git", "Python"],
                "Data Scientist": ["Anaconda", "Jupyter", "Python"],
                "Web Developer": ["VS Code", "Chrome DevTools", "Git"],
                "UI/UX Designer": ["Figma", "Miro"],
                "Cybersecurity Analyst": ["Git", "Nmap"],
                "Product Manager": ["Miro", "Notion"]
            },
            "Phase 2 – Core Skills": {
                "Software Engineer": ["Postman", "PostgreSQL", "IntelliJ"],
                "Data Scientist": ["Tableau", "PostgreSQL", "Anaconda"],
                "Web Developer": ["Postman", "Node.js", "Tailwind CSS"],
                "UI/UX Designer": ["Figma", "Framer"],
                "Cybersecurity Analyst": ["Kali Linux", "Wireshark", "Metasploit"],
                "Product Manager": ["Notion", "Jira", "Tableau"]
            },
            "Phase 3 – Projects": {
                "Software Engineer": ["Docker", "AWS", "MongoDB"],
                "Data Scientist": ["Power BI", "AWS", "Jupyter"],
                "Web Developer": ["Vercel", "MongoDB", "React"],
                "UI/UX Designer": ["Framer", "Behance"],
                "Cybersecurity Analyst": ["Kali Linux", "Docker", "Splunk"],
                "Product Manager": ["Jira", "Figma", "Notion"]
            },
            "Phase 4 – Career Preparation": {
                "Software Engineer": ["VS Code", "Git", "Postman"],
                "Data Scientist": ["Tableau", "Power BI", "Git"],
                "Web Developer": ["GitHub Desktop", "Vercel", "Chrome DevTools"],
                "UI/UX Designer": ["Behance", "Figma"],
                "Cybersecurity Analyst": ["Kali Linux", "Wireshark", "Splunk"],
                "Product Manager": ["Jira", "Notion", "Power BI"]
            },
        }
        
        tools_list = phase_tools_raw.get(phase_name, {}).get(career, ["VS Code", "Git"])
        tools_data = [TOOL_META.get(t, {"name": t, "desc": "Essential tool for this phase.", "url": "#", "logo": ""}) for t in tools_list]
        
        # Get featured projects (PHASE LEVEL)
        featured_projects = self.PROJECT_TEMPLATES.get(career, {}).get(phase_name, [])

        return {
            "description": career_descriptions.get(phase_name, f"Mastering essential skills for {career}."),
            "focus": phase_obj.get("focus", "Building expertise"),
            "objectives": phase_obj.get("objectives", ["Master core skills", "Build practical experience"]),
            "mastery_checklist": phase_obj.get("mastery_checklist", ["Complete all modules", "Achieve 85% score", "Pass phase assessment"]),
            "expectations": phase_obj.get("expectations", ["Ready for the next level"]),
            "improvement_areas": improvement_areas,
            "tools": tools_data,
            "resources": enriched_resources,
            "mindmap_nodes": mindmap_nodes,
            "featured_projects": featured_projects,
            "skill_details": {k: v for k, v in self.SKILL_DETAILS.items()} # Ensure fresh copy
        }\

    def generate(self, career: str, scores: dict[str, int], existing_skills: List[str], confidence: float = 0.5) -> List[dict[str, Any]]:
        template = self.TEMPLATES.get(career, self.TEMPLATES.get("Software Engineer")) # Fallback to SE
        
        personalized_roadmap = []
        existing_skills_lower = [s.lower() for s in existing_skills]
        
        needs_remedial_math = scores.get("math", 100) < 40
        needs_remedial_coding = scores.get("programming", 100) < 40
        is_ambitious = confidence > 0.8
        
        for phase_name, steps in template.items():
            phase_steps = []
            
            if phase_name == "Phase 1 – Foundations" and needs_remedial_coding:
                phase_steps.append({
                    "skill": "Intro to Logic", 
                    "title": "Remedial: Coding Basics", 
                    "duration": "2 weeks", 
                    "outcome": "Building confidence in basic logic structures.",
                    "status": "critical",
                    "custom_description": "Added due to low programming score."
                })
            
            for step in steps:
                skill_req = step["skill"].lower()
                status = "upcoming"
                is_completed = False
                custom_desc = step["outcome"]
                
                search_text = f"{skill_req} {step['title'].lower()}"
                if any(ext_skill in search_text or search_text in ext_skill for ext_skill in existing_skills_lower):
                    status = "completed"
                    is_completed = True
                    custom_desc = "You already have this skill! moving to next."
                
                elif scores.get(skill_req, 0) > 85:
                    status = "fast-track"
                    custom_desc = "High aptitude detected. You can move through this quickly."
                elif scores.get(skill_req, 100) < 40 and not is_completed:
                     status = "critical"
                     custom_desc = f"CRITICAL: {custom_desc}. Extra focus needed."

                # ENRICH STEP WITH MODULE-SPECIFIC DATA
                skill_meta = self.SKILL_DETAILS.get(skill_req, {})
                module_resources = self.MODULE_RESOURCES.get(skill_req, [])
                
                # Get a unique project for this step if it exists in templates
                phase_projects = self.PROJECT_TEMPLATES.get(career, {}).get(phase_name, [])
                # Purely for demo, we link projects to specific steps by title match or circular assignment
                step_project = None
                for p in phase_projects:
                    if skill_req in p['title'].lower() or skill_req in p['tech_stack'].lower():
                        step_project = p
                        break
                
                if not step_project and phase_projects:
                    # Fallback to first available in phase if no skill match
                    step_project = phase_projects[0]

                phase_steps.append({
                    **step,
                    "status": status,
                    "is_completed": is_completed,
                    "custom_description": custom_desc,
                    "skill_details": skill_meta,
                    "module_resources": module_resources,
                    "featured_project": step_project
                })
            
            if phase_name == "Phase 3 – Projects" and is_ambitious:
                 phase_steps.append({
                    "skill": "Open Source", 
                    "title": "Advanced: Open Source Contribution", 
                    "duration": "ongoing", 
                    "outcome": " contributing to real-world software.",
                    "status": "upcoming",
                    "custom_description": "Added due to high confidence.",
                    "module_resources": [{"type": "link", "title": "GitHub Explore", "url": "https://github.com/explore"}]
                })

            phase_meta = self._get_phase_metadata(career, phase_name, scores)
            
            personalized_roadmap.append({
                "phase": phase_name,
                "steps": phase_steps,
                **phase_meta
            })
            
        return personalized_roadmap

    def get_projects_for_skills(self, career: str, skills: List[str]) -> List[Dict[str, Any]]:
        """
        Retrieves a list of project suggestions tailored to specific missing skills.
        """
        suggested_projects = []
        career_projects = self.PROJECT_TEMPLATES.get(career, self.PROJECT_TEMPLATES.get("Software Engineer", {}))
        
        skills_lower = [s.lower() for s in skills]
        
        # Flatten all projects from this career
        all_projects = []
        for phase_projects in career_projects.values():
            all_projects.extend(phase_projects)
            
        for skill in skills_lower:
            # Find a project that matches this skill in its title or tech stack
            found = False
            for p in all_projects:
                # Direct match in tech stack or title
                if skill in p["title"].lower() or any(s.strip().lower() == skill for s in p["tech_stack"].replace("+", ",").split(",")):
                    if p not in suggested_projects:
                        suggested_projects.append(p)
                        found = True
                        break
            
            # If no direct match, check substrings in title
            if not found:
                for p in all_projects:
                    if skill[:4] in p["title"].lower(): # Match first 4 chars
                        if p not in suggested_projects:
                            suggested_projects.append(p)
                            found = True
                            break

            # If still no match, look for phase 1 projects as base
            if not found and career_projects.get("Phase 1 – Foundations"):
                p = career_projects["Phase 1 – Foundations"][0]
                if p not in suggested_projects:
                    suggested_projects.append(p)
                    
        return suggested_projects[:3] # Cap at 3 for UI

    def get_fallback_skills(self, career: str) -> List[Dict[str, Any]]:
        fallback_data = {
            "Software Engineer": [
                {"name": "HTML/CSS", "category": "Technical", "description": "Web foundations."},
                {"name": "Python/JS", "category": "Technical", "description": "Core languages."},
                {"name": "SQL", "category": "Technical", "description": "Data management."}
            ],
             "Data Scientist": [
                {"name": "Python", "category": "Technical", "description": "Data manipulation."},
                {"name": "Statistics", "category": "Technical", "description": "Inference basics."},
                {"name": "SQL", "category": "Technical", "description": "Data retrieval."}
            ]
        }
        return fallback_data.get(career, [{"name": "Communication", "category": "Soft Skills", "description": "General professional skill."}])

roadmap_engine = RoadmapEngine()
