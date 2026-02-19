from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.roadmap import Roadmap
from app.services.job_service import job_service

router = APIRouter()

@router.get("/match")
def get_job_matches(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch personalized job matches based on user career path and completed skills."""
    try:
        # Get user's active roadmap to find career path and completed phases
        roadmap = db.query(Roadmap).filter(Roadmap.user_id == current_user.id, Roadmap.status == "active").first()
        
        if not roadmap:
            return {"matches": [], "message": "No active roadmap found. Complete career analysis first."}
        
        # Extract real skills — extracted_skills is a JSON field on user (list of dicts or strings)
        raw_skills = current_user.extracted_skills or []
        if raw_skills and isinstance(raw_skills[0], dict):
            user_skills = [s.get("name", "") for s in raw_skills if s.get("name")]
        else:
            user_skills = [s for s in raw_skills if isinstance(s, str)]

        # Fallback baseline if no skills recorded yet
        if not user_skills:
            user_skills = ["Python", "General Knowledge"]
        
        career_path = roadmap.career_path
        
        # roadmap.content is a list of phase objects directly
        current_phase = 1
        content = roadmap.content
        if isinstance(content, list):
            phases = content
        elif isinstance(content, dict):
            phases = content.get("roadmap", content.get("phases", []))
        else:
            phases = []

        if phases:
            completed_phases = 0
            for p in phases:
                steps = p.get("steps", [])
                if any(s.get("is_completed") or s.get("status") == "completed" for s in steps):
                    completed_phases += 1
            current_phase = max(1, completed_phases)

        matches = job_service.get_matches(career_path, user_skills, current_phase)
        
        return {
            "career_path": career_path,
            "matches": matches
        }
    except Exception as e:
        print(f"Error fetching job matches: {e}")
        return {"matches": [], "career_path": "", "message": "Unable to load job matches. Please try again."}

@router.get("/companies/by-skill")
def get_companies_by_skill(career_path: str):
    """Get companies hiring for a specific career path/skill set."""
    companies = job_service.get_companies_by_career(career_path)
    if not companies:
        raise HTTPException(status_code=404, detail="No companies found for this career path")
    return companies
