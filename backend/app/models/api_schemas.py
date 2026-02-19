from pydantic import BaseModel
from typing import List, Optional, Any

class StudentProfile(BaseModel):
    name: str
    email: str

class CareerInput(BaseModel):
    math_score: int
    programming_score: int
    communication_score: int
    problem_solving_score: int
    interest_coding: int
    interest_design: int
    interest_management: int

class CareerProbability(BaseModel):
    name: str
    prob: float

class SkillMetadata(BaseModel):
    name: str
    category: str
    description: str

class ProjectMetadata(BaseModel):
    title: str
    overview: str
    tech_stack: str
    difficulty: str
    github_link: str

class CareerPredictionResponse(BaseModel):
    predicted_career: str
    confidence: Optional[float] = None
    probabilities: List[CareerProbability] = []
    extracted_skills: List[SkillMetadata] = []
    missing_skills: List[str] = []
    recommended_roadmap: List[dict] = []
    radar_data: List[dict] = []
    career_match_score: Optional[float] = None
    next_recommended_skill: Optional[str] = None
    probability_chart_data: List[dict] = []
    skill_comparison_data: List[dict] = []
    featured_projects: List[ProjectMetadata] = []

class SkillGapResponse(BaseModel):
    predicted_career: str
    extracted_skills: List[SkillMetadata]
    missing_skills: List[str]
    recommended_roadmap: List[dict]
    radar_data: List[dict] = []
    career_match_score: Optional[float] = None
    next_recommended_skill: Optional[str] = None
    probability_chart_data: List[dict] = []
    skill_comparison_data: List[dict] = []
    featured_projects: List[ProjectMetadata] = []

class HelpDeskTicketCreate(BaseModel):
    name: str
    email: str
    issue_type: str
    description: str
