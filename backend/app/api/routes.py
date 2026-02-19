from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user, get_current_user_optional
from app.models.user import User
from app.models.roadmap import Roadmap
from typing import Optional, List, Any
from fastapi.responses import JSONResponse
from app.models.api_schemas import CareerInput, CareerPredictionResponse, SkillGapResponse
from app.services.ml_service import career_predictor
from app.services.resume_parser import resume_parser
from app.logic.roadmap_engine import roadmap_engine

router = APIRouter()

@router.post("/predict-career", response_model=CareerPredictionResponse)
def predict_career(input_data: CareerInput, current_user: Optional[User] = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    try:

        if hasattr(input_data, "model_dump"):
            input_dict = input_data.model_dump()
        elif hasattr(input_data, "dict"):
            input_dict = input_data.dict()
        else:
            input_dict = dict(input_data)
    except:
        input_dict = {}
        
    result = career_predictor.predict(input_dict)
    predicted_career = result.get("predicted_career", "General Analyst")
    
    scores_dict = {
        "programming": input_data.programming_score,
        "math": input_data.math_score,
        "communication": input_data.communication_score,
        "logic": input_data.problem_solving_score,
        "design": input_data.interest_design * 10
    }
    
    confidence_score = result.get("confidence", 0.85)
    roadmap = roadmap_engine.generate(predicted_career, scores_dict, [], confidence=confidence_score)
    
    if current_user:
        current_user.predicted_career = predicted_career
        
        # Save Roadmap to DB
        existing_roadmap = db.query(Roadmap).filter(Roadmap.user_id == current_user.id, Roadmap.status == "active").first()
        if existing_roadmap:
            existing_roadmap.status = "archived"
            
        new_roadmap = Roadmap(
            user_id=current_user.id,
            career_path=predicted_career,
            content=roadmap,
            status="active"
        )
        db.add(new_roadmap)
        # Persist extracted skills so job matcher can use them
        current_user.extracted_skills = extracted_skills
        db.commit()
    
    career_match = confidence_score * 100
    # ... (rest of response preparation) ...
    radar_data = [
        {"subject": "Programming", "A": scores_dict["programming"], "fullMark": 100},
        {"subject": "Math", "A": scores_dict["math"], "fullMark": 100},
        {"subject": "Communication", "A": scores_dict["communication"], "fullMark": 100},
        {"subject": "Problem Solving", "A": scores_dict["logic"], "fullMark": 100},
        {"subject": "Design", "A": scores_dict["design"], "fullMark": 100}
    ]
    
    probability_chart_data = [
        {"career": p["name"], "probability": p["prob"]} 
        for p in result.get("probabilities", [])[:5]
    ]

    skill_comparison_data = [
        {"skill": "Logic", "yourScore": scores_dict["logic"], "required": 85},
        {"skill": "Math", "yourScore": scores_dict["math"], "required": 75},
        {"skill": "Comm", "yourScore": scores_dict["communication"], "required": 70}
    ]

    next_recommended_skill = roadmap[0]["steps"][0]["skill"] if roadmap and roadmap[0]["steps"] else "Python"

    # Build extracted_skills based on input scores
    extracted_skills = []
    if scores_dict["programming"] >= 50:
        extracted_skills.append({"name": "Programming Logic", "category": "Technical", "description": f"Strong analytical ability with {scores_dict['programming']}% proficiency."})
    if scores_dict["programming"] >= 70:
        extracted_skills.append({"name": "Software Development", "category": "Technical", "description": "Capable of building full software systems."})
    if scores_dict["math"] >= 50:
        extracted_skills.append({"name": "Mathematical Reasoning", "category": "Technical", "description": f"Solid math foundation at {scores_dict['math']}% proficiency."})
    if scores_dict["math"] >= 70:
        extracted_skills.append({"name": "Data Analysis", "category": "Technical", "description": "Can interpret and analyze complex datasets."})
    if scores_dict["communication"] >= 50:
        extracted_skills.append({"name": "Communication", "category": "Soft Skills", "description": f"Effective communicator at {scores_dict['communication']}% proficiency."})
    if scores_dict["communication"] >= 70:
        extracted_skills.append({"name": "Team Collaboration", "category": "Soft Skills", "description": "Works well in team environments."})
    if scores_dict["logic"] >= 50:
        extracted_skills.append({"name": "Problem Solving", "category": "Soft Skills", "description": f"Strong problem solver at {scores_dict['logic']}% proficiency."})
    if scores_dict["logic"] >= 70:
        extracted_skills.append({"name": "Critical Thinking", "category": "Soft Skills", "description": "Excellent analytical and critical thinking skills."})
    if scores_dict["design"] >= 50:
        extracted_skills.append({"name": "UI/UX Design", "category": "Tools & Frameworks", "description": f"Design sense at {scores_dict['design']}% proficiency."})
    
    # Always add at least some baseline tools
    extracted_skills.extend([
        {"name": "Git & GitHub", "category": "Tools & Frameworks", "description": "Version control and collaborative development."},
        {"name": "VS Code", "category": "Tools & Frameworks", "description": "Proficient in modern IDE workflows."},
    ])

    # Determine missing skills based on career
    missing_skills = roadmap_engine.CAREER_REQUIRED_SKILLS.get(predicted_career, ["Python", "Algorithms", "Databases", "Cloud", "Testing"])

    return {
        "predicted_career": predicted_career,
        "confidence": result.get("probabilities")[0].get("prob") / 100 if result.get("probabilities") else 0.8,
        "probabilities": result.get("probabilities", []),
        "extracted_skills": extracted_skills, 
        "missing_skills": missing_skills, 
        "recommended_roadmap": roadmap,
        "radar_data": radar_data,
        "career_match_score": career_match,
        "next_recommended_skill": next_recommended_skill,
        "probability_chart_data": probability_chart_data,
        "skill_comparison_data": skill_comparison_data,
        "featured_projects": roadmap_engine.get_projects_for_skills(predicted_career, missing_skills),
        "skill_details": {s.lower(): roadmap_engine.SKILL_DETAILS.get(s.lower(), {}) for s in missing_skills + [sk["name"] for sk in extracted_skills]}
    }

@router.get("/get-roadmap")
def get_user_roadmap(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    active_roadmap = db.query(Roadmap).filter(Roadmap.user_id == current_user.id, Roadmap.status == "active").first()
    
    if not active_roadmap:
        return {"roadmap": [], "career": None}
        
    return {
        "roadmap": active_roadmap.content,
        "career": active_roadmap.career_path,
        "created_at": active_roadmap.created_at
    }

# ... (rest of routes) ...

@router.post("/analyze-resume", response_model=SkillGapResponse)
async def analyze_resume(file: UploadFile = File(...), current_user: Optional[User] = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    contents = await file.read()
    text = ""
    try:
        filename = file.filename.lower()
        if filename.endswith('.pdf'):
            text = resume_parser.extract_text_from_pdf(contents)
        elif filename.endswith('.docx'):
            text = resume_parser.extract_text_from_docx(contents)
        else:
            text = contents.decode("utf-8")
    except:
        return JSONResponse(status_code=400, content={"success": False, "message": "Extraction failed"})

    if not text:
         return JSONResponse(status_code=400, content={"success": False, "message": "No text detected"})

    extracted_skills = resume_parser.extract_skills(text)
    target_career = "Software Engineer"
    existing_skill_names = [s["name"].lower() for s in extracted_skills]
    
    if any(s in ["design", "figma", "ui", "ux"] for s in existing_skill_names):
        target_career = "UI/UX Designer"
    elif any(s in ["data", "ml", "python", "sql"] for s in existing_skill_names):
        target_career = "Data Scientist"
    
    roadmap = roadmap_engine.generate(target_career, {"programming": 60, "soft skills": 80}, existing_skill_names)
    
    radar_data = [
        {"subject": "Tech", "A": 65, "fullMark": 100},
        {"subject": "Soft Skills", "A": 80, "fullMark": 100},
        {"subject": "Experience", "A": 40, "fullMark": 100}
    ]
    
    if current_user:
        current_user.predicted_career = target_career
        current_user.extracted_skills = extracted_skills
        # Save/update roadmap for this user
        existing_roadmap = db.query(Roadmap).filter(Roadmap.user_id == current_user.id, Roadmap.status == "active").first()
        if existing_roadmap:
            existing_roadmap.status = "archived"
        new_roadmap = Roadmap(
            user_id=current_user.id,
            career_path=target_career,
            content=roadmap,
            status="active"
        )
        db.add(new_roadmap)
        db.commit()
    
    # Calculate mock scores based on extracted skills count
    skill_count = len(extracted_skills)
    base_score = min(skill_count * 10, 90)  # Cap at 90
    
    # Calculate probability chart data (mock based on target career)
    # In a real app, we would run a classifier on the resume text
    probability_chart_data = [
        {"career": target_career, "probability": 85.5},
        {"career": "Data Scientist" if target_career != "Data Scientist" else "ML Engineer", "probability": 60.2},
        {"career": "Web Developer" if target_career != "Web Developer" else "Frontend Dev", "probability": 45.8},
        {"career": "Product Manager", "probability": 30.1},
        {"career": "DevOps Engineer", "probability": 20.5}
    ]
    
    # Calculate skill comparison data (mock)
    skill_comparison_data = [
        {"skill": "Technical", "yourScore": base_score, "required": 85},
        {"skill": "Soft Skills", "yourScore": 75, "required": 80},
        {"skill": "Tools", "yourScore": 60, "required": 70}
    ]

    next_recommended_skill = roadmap[0]["steps"][0]["skill"] if roadmap and roadmap[0]["steps"] else "Advanced Python"

    # Determine missing skills based on target career
    missing_skills = [s for s in roadmap_engine.CAREER_REQUIRED_SKILLS.get(target_career, []) if s.lower() not in existing_skill_names]
    if not missing_skills:
        missing_skills = ["Scaling", "DevOps", "Advanced Algorithms", "System Design"]

    return {
        "predicted_career": target_career,
        "extracted_skills": extracted_skills,
        "missing_skills": missing_skills,
        "recommended_roadmap": roadmap,
        "radar_data": radar_data,
        "career_match_score": base_score,
        "next_recommended_skill": next_recommended_skill,
        "probability_chart_data": probability_chart_data,
        "skill_comparison_data": skill_comparison_data,
        "featured_projects": roadmap_engine.get_projects_for_skills(target_career, missing_skills),
        "skill_details": {s.lower(): roadmap_engine.SKILL_DETAILS.get(s.lower(), {}) for s in missing_skills + [sk["name"] for sk in extracted_skills]}
    }
