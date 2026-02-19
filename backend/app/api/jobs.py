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
    
    # Get user's active roadmap to find career path and completed phases
    roadmap = db.query(Roadmap).filter(Roadmap.user_id == current_user.id, Roadmap.status == "active").first()
    
    if not roadmap:
        return {"matches": [], "message": "No active roadmap found. Complete analysis first."}
    
    # Extract real skills from user record (these are saved during analysis)
    # The user model has 'extracted_skills' as a JSON field
    user_skills = current_user.extracted_skills or []
    
    # Fallback/Safety: If no skills extracted yet, use a baseline related to career path
    if not user_skills:
        user_skills = ["Python", "General Knowledge"]
    
    career_path = roadmap.career_path
    
    # Calculate current phase based on roadmap content
    # If content has 'roadmap' key which is a list of phases
    current_phase = 1
    if roadmap.content and isinstance(roadmap.content.get('roadmap'), list):
        phases = roadmap.content['roadmap']
        # Find the highest phase number that has some progress or is completed
        # For simplicity in this mock, we'll check how many phases have completed steps
        completed_phases = 0
        for p in phases:
            steps = p.get('steps', [])
            if any(s.get('is_completed') or s.get('status') == 'completed' for s in steps):
                completed_phases += 1
        current_phase = max(1, completed_phases)

    matches = job_service.get_matches(career_path, user_skills, current_phase)
    
    return {
        "career_path": career_path,
        "matches": matches
    }

@router.get("/companies/by-skill")
def get_companies_by_skill(career_path: str):
    """Get companies hiring for a specific career path/skill set."""
    companies = job_service.get_companies_by_career(career_path)
    if not companies:
        raise HTTPException(status_code=404, detail="No companies found for this career path")
    return companies
