from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user, get_current_user_optional
from app.models.user import User
from app.models.comment import Comment as CommentModel
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class CommentCreate(BaseModel):
    phase_id: str
    content: str
    pros: Optional[str] = None
    cons: Optional[str] = None
    tags: Optional[str] = None  # Comma-separated tags
    parent_id: Optional[int] = None  # For threaded replies

class CommentResponse(BaseModel):
    id: int
    user_name: str
    phase_id: str
    content: Optional[str] = None
    pros: Optional[str] = None
    cons: Optional[str] = None
    tags: Optional[str] = None
    parent_id: Optional[int] = None
    upvotes: int = 0
    is_accepted: bool = False
    timestamp: datetime
    replies: List['CommentResponse'] = []

    class Config:
        from_attributes = True

# Recursive model reference
CommentResponse.model_rebuild()

def build_comment_response(c, db) -> dict:
    """Build a comment response with nested replies."""
    replies_query = db.query(CommentModel).filter(
        CommentModel.parent_id == c.id
    ).order_by(CommentModel.created_at.asc()).all()
    
    return CommentResponse(
        id=c.id,
        user_name=c.user.full_name if c.user else "Anonymous",
        phase_id=c.phase_id,
        content=c.content,
        pros=c.pros,
        cons=c.cons,
        tags=c.tags,
        parent_id=c.parent_id,
        upvotes=c.upvotes or 0,
        is_accepted=c.is_accepted or False,
        timestamp=c.created_at,
        replies=[build_comment_response(r, db) for r in replies_query]
    )


@router.post("/comments", response_model=dict)
async def add_comment(comment: CommentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_comment = CommentModel(
        user_id=current_user.id,
        phase_id=comment.phase_id,
        content=comment.content,
        pros=comment.pros,
        cons=comment.cons,
        tags=comment.tags,
        parent_id=comment.parent_id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return {"success": True, "message": "Comment added successfully", "id": new_comment.id}


@router.get("/comments/{phase_id}", response_model=List[CommentResponse])
async def get_comments(phase_id: str, db: Session = Depends(get_db)):
    # Only get top-level comments (no parent), replies are nested inside
    comments = db.query(CommentModel).filter(
        CommentModel.phase_id == phase_id,
        CommentModel.parent_id == None
    ).order_by(CommentModel.created_at.desc()).all()
    
    return [build_comment_response(c, db) for c in comments]


@router.post("/comments/{comment_id}/upvote", response_model=dict)
async def upvote_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(CommentModel).filter(CommentModel.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    comment.upvotes = (comment.upvotes or 0) + 1
    db.commit()
    return {"success": True, "upvotes": comment.upvotes}


@router.post("/comments/{comment_id}/accept", response_model=dict)
async def accept_comment(comment_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    comment = db.query(CommentModel).filter(CommentModel.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    comment.is_accepted = not comment.is_accepted
    db.commit()
    return {"success": True, "is_accepted": comment.is_accepted}


@router.post("/discussion-insights", response_model=dict)
async def get_discussion_insights(
    request: dict,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Generate AI-powered insights for the discussion panel.
    Takes career, phase, and optional question to provide personalized advice.
    """
    career = request.get("career", "Software Engineer")
    phase = request.get("phase", "Phase 1 – Foundations")
    question = request.get("question", "")
    
    # Career-specific insights
    career_insights = {
        "Software Engineer": {
            "Phase 1 – Foundations": {
                "advice": "Focus on understanding WHY code works, not just HOW. Build a strong mental model of how computers process instructions.",
                "skill_gaps": ["Algorithm fundamentals", "Version control (Git)", "Command line proficiency"],
                "next_actions": ["Complete 50 easy LeetCode problems", "Build a calculator app", "Set up your GitHub profile"]
            },
            "Phase 2 – Core Skills": {
                "advice": "Start thinking in systems, not just code. Every piece of code you write should consider scalability and maintainability.",
                "skill_gaps": ["System architecture patterns", "Database optimization", "API design"],
                "next_actions": ["Build a REST API from scratch", "Study common design patterns", "Practice SQL queries daily"]
            },
            "Phase 3 – Projects": {
                "advice": "Quality over quantity. Two well-documented, deployed projects are worth more than ten incomplete ones.",
                "skill_gaps": ["Deployment pipelines", "Testing strategies", "Documentation"],
                "next_actions": ["Deploy a project to the cloud", "Write comprehensive tests", "Create project READMEs"]
            },
            "Phase 4 – Career Preparation": {
                "advice": "Treat job hunting like a project. Set daily targets, track applications, and iterate on your approach based on feedback.",
                "skill_gaps": ["Behavioral interview skills", "System design communication", "Salary negotiation"],
                "next_actions": ["Do 3 mock interviews this week", "Update LinkedIn with projects", "Apply to 5 companies"]
            }
        },
        "Data Scientist": {
            "Phase 1 – Foundations": {
                "advice": "Math is your superpower. Invest time in understanding statistics deeply — it's the foundation of every ML model.",
                "skill_gaps": ["Probability theory", "Python data libraries", "Data cleaning"],
                "next_actions": ["Complete Khan Academy statistics", "Master Pandas operations", "Analyze a public dataset"]
            },
            "Phase 2 – Core Skills": {
                "advice": "Don't just learn algorithms — understand when to use each one and why. Feature engineering is often more valuable than model selection.",
                "skill_gaps": ["Feature engineering", "Model evaluation", "Cross-validation"],
                "next_actions": ["Enter a Kaggle competition", "Build an ML pipeline", "Study bias-variance tradeoff"]
            },
            "Phase 3 – Projects": {
                "advice": "Focus on the story your data tells. Employers want to see how you translate data insights into business value.",
                "skill_gaps": ["Data storytelling", "Model deployment", "Experiment tracking"],
                "next_actions": ["Deploy a model with Streamlit", "Write a Kaggle notebook", "Create a data blog post"]
            },
            "Phase 4 – Career Preparation": {
                "advice": "Prepare for both technical (ML theory, coding, SQL) and business (case studies) interview rounds. Practice explaining models simply.",
                "skill_gaps": ["SQL interview questions", "ML system design", "Business case analysis"],
                "next_actions": ["Practice 20 SQL problems", "Prepare 3 project walkthroughs", "Study ML system design"]
            }
        },
        "Product Manager": {
            "Phase 1 – Foundations": {
                "advice": "Start thinking from the user's perspective. Every good product decision starts with understanding the user's pain point.",
                "skill_gaps": ["User empathy", "Problem framing", "Market analysis"],
                "next_actions": ["Do 5 user interviews", "Write a product teardown", "Read 'Inspired' by Marty Cagan"]
            },
            "Phase 2 – Core Skills": {
                "advice": "Data literacy is your competitive edge. PMs who can write SQL and read dashboards make better decisions faster.",
                "skill_gaps": ["Data analysis", "Prioritization frameworks", "Technical communication"],
                "next_actions": ["Learn basic SQL", "Practice RICE prioritization", "Shadow a sprint planning"]
            },
            "Phase 3 – Projects": {
                "advice": "Document everything. Your ability to write clear specs and measure outcomes is what separates great PMs from good ones.",
                "skill_gaps": ["Spec writing", "Launch planning", "Metrics definition"],
                "next_actions": ["Write a PRD for a feature", "Define success metrics", "Run a design sprint"]
            },
            "Phase 4 – Career Preparation": {
                "advice": "PM interviews test your thinking process, not your answers. Practice structured thinking and communicate your reasoning clearly.",
                "skill_gaps": ["Product sense questions", "Estimation practice", "Strategy frameworks"],
                "next_actions": ["Practice 10 product cases", "Prepare your PM story", "Network with PMs on LinkedIn"]
            }
        },
        "Cybersecurity Analyst": {
            "Phase 1 – Foundations": {
                "advice": "Understand how systems work before you learn to break them. Networking and OS fundamentals are the bedrock of security.",
                "skill_gaps": ["TCP/IP protocols", "Linux administration", "Basic scripting"],
                "next_actions": ["Complete TryHackMe beginner path", "Set up a Linux VM", "Learn Bash scripting basics"]
            },
            "Phase 2 – Core Skills": {
                "advice": "Think like an attacker. Understanding threat actor methodologies helps you build better defenses.",
                "skill_gaps": ["Vulnerability assessment", "Encryption protocols", "Security frameworks"],
                "next_actions": ["Study OWASP Top 10", "Practice with Burp Suite", "Learn MITRE ATT&CK"]
            },
            "Phase 3 – Projects": {
                "advice": "Build a home lab. Hands-on experience with real tools in a safe environment is the fastest way to develop security skills.",
                "skill_gaps": ["Penetration testing", "Incident response", "Log analysis"],
                "next_actions": ["Set up a home lab", "Complete 5 CTF challenges", "Build a security monitoring dashboard"]
            },
            "Phase 4 – Career Preparation": {
                "advice": "Certifications matter in cybersecurity. CompTIA Security+ is the minimum; aim for CEH or OSCP as stretch goals.",
                "skill_gaps": ["Certification prep", "Report writing", "Compliance knowledge"],
                "next_actions": ["Start Security+ study plan", "Write CTF write-ups", "Build security incident reports"]
            }
        },
        "UI/UX Designer": {
            "Phase 1 – Foundations": {
                "advice": "Design is problem-solving, not decoration. Always start with the user's need, then make it beautiful.",
                "skill_gaps": ["Design principles", "Figma basics", "User-centered thinking"],
                "next_actions": ["Complete Daily UI challenge (7 days)", "Learn Figma components", "Study Laws of UX"]
            },
            "Phase 2 – Core Skills": {
                "advice": "Great design is invisible. Focus on removing friction from user flows rather than adding visual complexity.",
                "skill_gaps": ["User research methods", "Prototyping", "Design systems"],
                "next_actions": ["Conduct 3 usability tests", "Build a component library", "Study Material Design"]
            },
            "Phase 3 – Projects": {
                "advice": "Your case study process matters more than the final design. Show how you think, research, iterate, and measure impact.",
                "skill_gaps": ["Case study writing", "Design process documentation", "Handoff practices"],
                "next_actions": ["Redesign a popular app", "Write a detailed case study", "Build a personal portfolio"]
            },
            "Phase 4 – Career Preparation": {
                "advice": "Your portfolio is your resume. Invest in 3-4 deep case studies that show end-to-end process rather than many surface-level showcases.",
                "skill_gaps": ["Portfolio presentation", "Design critique skills", "Interview whiteboarding"],
                "next_actions": ["Polish 3 portfolio pieces", "Practice design challenges", "Get feedback from senior designers"]
            }
        }
    }
    
    career_data = career_insights.get(career, career_insights.get("Software Engineer", {}))
    phase_data = career_data.get(phase, list(career_data.values())[0] if career_data else {
        "advice": f"Keep learning and building. Consistency is the key to mastering your {career} journey.",
        "skill_gaps": ["Core technical skills", "Soft skills", "Industry knowledge"],
        "next_actions": ["Set weekly learning goals", "Join relevant communities", "Build small projects"]
    })
    
    # If a question is provided, tailor the response slightly
    if question:
        q_lower = question.lower()
        if any(w in q_lower for w in ["stuck", "help", "lost", "confused"]):
            phase_data["advice"] = f"It's normal to feel stuck during this phase. {phase_data['advice']} Break your current challenge into smaller pieces and tackle them one at a time."
        elif any(w in q_lower for w in ["interview", "job", "hire"]):
            phase_data["advice"] = f"Great that you're thinking about career readiness! {phase_data['advice']} The best way to prepare is consistent practice with real-world scenarios."
        elif any(w in q_lower for w in ["project", "build", "portfolio"]):
            phase_data["advice"] = f"Building projects is the fastest path to mastery. {phase_data['advice']} Start small, ship fast, and iterate based on feedback."
    
    return {
        "advice": phase_data.get("advice", "Keep pushing forward!"),
        "skill_gaps": phase_data.get("skill_gaps", []),
        "next_actions": phase_data.get("next_actions", []),
        "career": career,
        "phase": phase
    }
