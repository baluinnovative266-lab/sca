from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    career: Optional[str] = "Software Engineer"
    skills: Optional[List[str]] = []

class ChatResponse(BaseModel):
    reply: str

# Career-specific data for rule-based responses
CAREER_ALERTS = {
    "Software Engineer": {
        "skills": "Python, JavaScript, React, SQL, Git, Docker, and Data Structures & Algorithms.",
        "why": "Your strong programming and problem-solving scores make you a great fit for building scalable software systems.",
        "roadmap": "1. Master DSA, 2. Build a full-stack project, 3. Learn Cloud basics, 4. Contribute to Open Source."
    },
    "Data Scientist": {
        "skills": "Python, Pandas, NumPy, Machine Learning, SQL, and Statistics.",
        "why": "Your math and analytical skills align perfectly with data-driven decision making and model building.",
        "roadmap": "1. Advanced ML, 2. Data Pipelines, 3. Complex SQL, 4. Deep Learning basics."
    },
    "Web Developer": {
        "skills": "HTML, CSS, JavaScript, React, Node.js, and MongoDB.",
        "why": "Your coding interest and design flair suggest a career in creating beautiful, interactive web experiences.",
        "roadmap": "1. Build MERN apps, 2. Secure Auth, 3. API Design, 4. Responsive UI."
    },
    "Product Manager": {
        "skills": "Leadership, Communication, Agile, Jira, and Product Lifecycle.",
        "why": "Your management interest and strong communication skills are essential for orchestrating product success.",
        "roadmap": "1. PM Certification, 2. Data-driven decisions, 3. Side projects, 4. Agile mastery."
    },
    "UI/UX Designer": {
        "skills": "Figma, User Research, Prototyping, and Design Systems.",
        "why": "Your design interest and empathy for users indicate a talent for crafting intuitive interfaces.",
        "roadmap": "1. Portfolio building, 2. UX Certification, 3. App redesigns, 4. Figma mastery."
    }
}

import random

# dynamic response templates for a more natural feel
TEMPLATES = {
    "why": [
        "Based on your strong {highlights} scores, along with your interest in {interest}, {career} is a strong match. Your profile aligns well with these types of specialized roles.",
        "Your aptitude in {highlights} and passion for {interest} make you a natural fit for a career as a {career}. Our AI analysis shows a high compatibility with this path.",
        "Considering your performance in {highlights}, a move into {career} looks very promising. It leverages your existing strengths while giving you room to grow in {interest}."
    ],
    "skills": [
        "To excel as a {career}, you should double down on: {skills}. Mastering these will make your profile stand out to recruiters.",
        "The core toolkit for a {career} includes {skills}. Based on your current profile, focusing on these areas will bridge your most significant gaps.",
        "I recommend prioritizing {skills} for your {career} journey. These are the most sought-after competencies in the current market."
    ],
    "roadmap": [
        "I've structured your {career} roadmap into four key phases: 1. Foundations, 2. Intermediate Skills, 3. Real-world Projects, and 4. Career Preparation. This structured approach ensures you miss no critical steps.",
        "Your journey to becoming a {career} follows a clear path: Foundations, then Skill Deep-Dives, followed by Portfolio Building, and finally Industry Prep. This sequence is optimized for your learning style.",
        "Let's get you ready for {career}! We'll start with the basics, move to advanced techniques, build some killer projects, and then polish your profile for interviews."
    ],
    "improve": [
        "To level up your {career} profile, focus on the missing skills identified in your dashboard. Hands-on projects are the best way to prove your expertise.",
        "Consistency is key! Try building a small project using {skills} this week. It's the best way to improve your match score for {career}.",
        "I'd suggest working on your {weak_area} if you want to see a quick jump in your {career} readiness. Every bit of practice counts!"
    ]
}

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    msg = request.message.lower()
    career = request.career if request.career in CAREER_ALERTS else "Software Engineer"
    data = CAREER_ALERTS.get(career)
    
    # Mock some contextual variation based on high/low scores if we had them here 
    # but for now we use random variation for "LLM-like" feel
    
    if "skill" in msg:
        reply = random.choice(TEMPLATES["skills"]).format(career=career, skills=data['skills'])
    elif "why" in msg or "reason" in msg or "explain" in msg:
        interest = "Coding" if "Engineer" in career or "Developer" in career else "Design" if "Designer" in career else "Strategy"
        highlights = "Programming and Logic" if "Engineer" in career else "Math and Analytics" if "Scientist" in career else "Communication"
        reply = random.choice(TEMPLATES["why"]).format(career=career, highlights=highlights, interest=interest)
    elif "roadmap" in msg or "plan" in msg or "step" in msg:
        reply = random.choice(TEMPLATES["roadmap"]).format(career=career)
    elif "improve" in msg or "better" in msg:
        weak_area = "Soft Skills" if "Manager" in career else "Technical Depth"
        reply = random.choice(TEMPLATES["improve"]).format(career=career, skills=data['skills'], weak_area=weak_area)
    elif "job" in msg or "role" in msg:
        reply = f"Common roles for this path include Junior {career}, Senior {career}, and specialized roles like Systems Architect. The industry is currently seeing high demand for these positions."
    elif "hello" in msg or "hi" in msg:
        reply = f"Hello! I am your CareerSense AI assistant. How can I help you with your {career} journey today?"
    else:
        reply = f"I'm here to help you navigate your journey toward becoming a {career}. Feel free to ask about specific skills, why this was suggested, or your personalized roadmap."

    return {"reply": reply}
