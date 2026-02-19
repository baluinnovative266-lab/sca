from typing import List, Dict, Any, Optional

class JobService:
    # Curated dataset of companies and their primary hiring categories
    COMPANIES = {
        "Software Engineer": [
            {"name": "Google", "logo": "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_Icons_By_Google.png", "url": "https://www.google.com/about/careers/applications/jobs/results/", "desc": "Leading global tech company specializing in search, AI, and cloud computing."},
            {"name": "Microsoft", "logo": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", "url": "https://careers.microsoft.com/us/en/search-results", "desc": "Empowering every person and organization on the planet to achieve more."},
            {"name": "Amazon", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", "url": "https://www.amazon.jobs/en/search", "desc": "The world's largest online retailer and cloud services provider (AWS)."},
            {"name": "Meta", "logo": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", "url": "https://www.metacareers.com/jobs", "desc": "Building tools that help people connect, find communities, and grow businesses."},
            {"name": "Netflix", "logo": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", "url": "https://jobs.netflix.com/search", "desc": "The world's leading entertainment service with over 200 million memberships."}
        ],
        "Data Scientist": [
            {"name": "IBM", "logo": "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", "url": "https://www.ibm.com/careers", "desc": "A global technology and innovation company headquartered in Armonk, NY."},
            {"name": "Deloitte", "logo": "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg", "url": "https://www2.deloitte.com/ui/en/careers/careers.html", "desc": "Leading professional services network providing audit, consulting, and tax services."},
            {"name": "Accenture", "logo": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg", "url": "https://www.accenture.com/in-en/careers", "desc": "Global professional services company with leading capabilities in digital, cloud and security."},
            {"name": "Adobe", "logo": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg", "url": "https://www.adobe.com/careers.html", "desc": "Changing the world through digital experiences with creative and document software."}
        ],
        "Web Developer": [
            {"name": "Shopify", "logo": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg", "url": "https://www.shopify.com/careers", "desc": "A leading global commerce company, providing trusted tools to start and grow a business."},
            {"name": "Airbnb", "logo": "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg", "url": "https://careers.airbnb.com/", "desc": "Online marketplace for lodging, primary homestays for vacation rentals, and tourism activities."},
            {"name": "Stripe", "logo": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", "url": "https://stripe.com/jobs/search", "desc": "Financial services and software as a service company dual-headquartered in SF and Dublin."},
            {"name": "Atlassian", "logo": "https://upload.wikimedia.org/wikipedia/commons/0/01/Atlassian_Logo.svg", "url": "https://www.atlassian.com/company/careers", "desc": "Software company that develops products for software developers and project managers."}
        ],
        "UI/UX Designer": [
            {"name": "Figma", "logo": "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg", "url": "https://www.figma.com/careers/", "desc": "The collaborative interface design tool that brings teams together."},
            {"name": "Canva", "logo": "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg", "url": "https://www.canva.com/careers/", "desc": "Online design and visual communication platform with a mission to empower the world to design."},
            {"name": "Uber", "logo": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png", "url": "https://www.uber.com/careers/", "desc": "Technology platform that enables moves of people and things in revolutionary ways."}
        ]
    }

    # Curated dataset of job roles and their required skills
    JOB_ROLES = {
        "Software Engineer": [
            {"role": "Frontend Developer Intern", "level": "Entry", "required_skills": ["HTML/CSS", "JavaScript", "React"], "phase_requirement": 1, "description": "Build responsive and interactive user interfaces for web applications."},
            {"role": "Junior Full Stack Developer", "level": "Entry", "required_skills": ["React", "Node.js", "SQL"], "phase_requirement": 2, "description": "Work on both client and server-side logic to deliver complete features."},
            {"role": "Software Engineer I", "level": "Intermediate", "required_skills": ["Python", "Algorithms", "System Design"], "phase_requirement": 3, "description": "Design and implement scalable software solutions and efficient algorithms."},
            {"role": "Senior Backend Engineer", "level": "Expert", "required_skills": ["System Design", "Databases", "Cloud Computing", "DevOps"], "phase_requirement": 4, "description": "Architect robust backend systems and manage cloud infrastructure."}
        ],
        "Data Scientist": [
            {"role": "Data Analyst Intern", "level": "Entry", "required_skills": ["Excel", "SQL", "Statistics"], "phase_requirement": 1, "description": "Analyze data sets to identify trends and generate actionable insights."},
            {"role": "Junior Data Scientist", "level": "Entry", "required_skills": ["Python", "SQL", "Data Visualization"], "phase_requirement": 2, "description": "Build predictive models and visualize complex data for stakeholders."},
            {"role": "Machine Learning Engineer", "level": "Intermediate", "required_skills": ["Python", "Machine Learning", "Statistics"], "phase_requirement": 3, "description": "Design and deploy machine learning models into production environments."},
            {"role": "AI Research Scientist", "level": "Expert", "required_skills": ["Machine Learning", "Deep Learning", "Math", "Python"], "phase_requirement": 4, "description": "Conduct cutting-edge research to advance the field of artificial intelligence."}
        ],
        "Web Developer": [
            {"role": "Junior Web Developer", "level": "Entry", "required_skills": ["HTML/CSS", "JavaScript", "React"], "phase_requirement": 1, "description": "Create and maintain websites with a focus on user experience."},
            {"role": "E-commerce Specialist", "level": "Intermediate", "required_skills": ["React", "Node.js", "REST APIs"], "phase_requirement": 2, "description": "Develop and optimize online store platforms for high performance."}
        ],
        "UI/UX Designer": [
            {"role": "UX Researcher Intern", "level": "Entry", "required_skills": ["User Research", "Communication"], "phase_requirement": 1, "description": "Conduct user research to inform design decisions and improve usability."},
            {"role": "Junior Product Designer", "level": "Entry", "required_skills": ["Figma", "Wireframing", "Prototyping"], "phase_requirement": 2, "description": "Design intuitive interfaces and create prototypes for digital products."},
            {"role": "Product Designer", "level": "Intermediate", "required_skills": ["Figma", "User Research", "UI/UX Design"], "phase_requirement": 3, "description": "Lead the design process from concept to final product delivery."}
        ]
    }

    @staticmethod
    def calculate_match(user_skills: List[str], required_skills: List[str]) -> Dict[str, Any]:
        """Calculate skill match percentage and identify gaps."""
        user_skills_lower = [s.lower() for s in user_skills]
        required_skills_lower = [s.lower() for s in required_skills]
        
        matched_skills = [s for s in required_skills_lower if s in user_skills_lower]
        missing_skills = [s for s in required_skills if s.lower() not in user_skills_lower]
        
        match_percentage = (len(matched_skills) / len(required_skills)) * 100 if required_skills else 0
        
        return {
            "match_percentage": round(match_percentage, 1),
            "missing_skills": missing_skills,
            "is_eligible": match_percentage >= 70
        }

    @classmethod
    def get_matches(cls, career_path: str, user_skills: List[str], current_phase: int = 1) -> List[Dict[str, Any]]:
        """Find matching jobs for a user based on career path, skills, and current phase progress."""
        all_roles = cls.JOB_ROLES.get(career_path, [])
        companies = cls.COMPANIES.get(career_path, [])
        
        # Return all roles regardless of phase so users can see future goals
        roles = all_roles
        
        matches = []
        for role in roles:
            match_data = cls.calculate_match(user_skills, role["required_skills"])
            
            # Show all roles, but sorted by match percentage
            # Assign companies to roles randomly (for mock)
            import random
            company = random.choice(companies) if companies else {"name": "Tech Corp", "logo": "", "url": "#"}
            
            matches.append({
                "role": role["role"],
                "level": role["level"],
                "required_skills": role["required_skills"],
                "match_percentage": match_data["match_percentage"],
                "missing_skills": match_data["missing_skills"],
                "is_eligible": match_data["is_eligible"],
                "company_name": company["name"],
                "company_logo": company["logo"],
                "apply_url": company["url"],
                "description": role.get("description", "")
            })
        
        return sorted(matches, key=lambda x: x["match_percentage"], reverse=True)

    @classmethod
    def get_companies_by_career(cls, career_path: str) -> List[Dict[str, Any]]:
        """Get top hiring companies for a career path."""
        return cls.COMPANIES.get(career_path, [])

job_service = JobService()
