import re
from typing import List, Set
from pypdf import PdfReader
import io
import docx

class ResumeParser:
    def __init__(self):
        # Structured skill database with categories and descriptions
        self.skills_data = {
            "Python": {"cat": "Technical", "desc": "High-level programming language used for web dev, AI, and automation."},
            "JavaScript": {"cat": "Technical", "desc": "The primary language of the web, essential for interactive frontends."},
            "React": {"cat": "Tools & Frameworks", "desc": "Popular JS library for building modern component-based UIs."},
            "SQL": {"cat": "Technical", "desc": "Standard language for managing and querying relational databases."},
            "Machine Learning": {"cat": "Technical", "desc": "Teaching computers to learn from data and make predictions."},
            "Communication": {"cat": "Soft Skills", "desc": "Effectively conveying information to stakeholders and team members."},
            "Problem Solving": {"cat": "Soft Skills", "desc": "Analytical approach to resolving technical and logical challenges."},
            "Git": {"cat": "Tools & Frameworks", "desc": "Distributed version control system for tracking source code changes."},
            "Docker": {"cat": "Tools & Frameworks", "desc": "Containerization platform to package applications with dependencies."},
            "Figma": {"cat": "Tools & Frameworks", "desc": "Collaborative interface design tool for UX/UI prototyping."},
            "Leadership": {"cat": "Soft Skills", "desc": "Inspiring and managing team efforts towards a project goal."},
            "Agile": {"cat": "Soft Skills", "desc": "Iterative project management methodology focused on rapid delivery."},
            "HTML": {"cat": "Technical", "desc": "Standard markup language for creating the structure of web pages."},
            "CSS": {"cat": "Technical", "desc": "Styling language used to control the layout and design of web documents."},
            "NLP": {"cat": "Technical", "desc": "Natural Language Processing for machines to understand human text."},
            "Adaptability": {"cat": "Soft Skills", "desc": "Adjusting to new environments and changing project requirements."},
            "Critical Thinking": {"cat": "Soft Skills", "desc": "Rational and unbiased evaluation of information or situations."},
            "Collaborative": {"cat": "Soft Skills", "desc": "Working effectively with others to achieve shared goals."},
            "Teamwork": {"cat": "Soft Skills", "desc": "Cooperative effort by the members of a group or team to achieve a common goal."},
            "Time Management": {"cat": "Soft Skills", "desc": "Ability to use one's time effectively or productively."},
        }
        self.skills_db: Set[str] = {s.lower() for s in self.skills_data.keys()}

    def extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extracts text from a PDF file efficiently with fallback."""
        try:
            reader = PdfReader(io.BytesIO(file_content))
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text.strip()
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            return ""

    def extract_text_from_docx(self, file_content: bytes) -> str:
        """Extracts text from a DOCX file."""
        try:
            doc = docx.Document(io.BytesIO(file_content))
            text = ""
            for para in doc.paragraphs:
                text += para.text + "\n"
            return text.strip()
        except Exception as e:
            print(f"Error extracting text from DOCX: {e}")
            return ""

    def extract_skills(self, text: str) -> List[dict[str, str]]:
        """Extracts skills from the given text using keyword matching with metadata."""
        if not text:
            return []
            
        text_lower = text.lower()
        text_clean = re.sub(r'[^\w\s]', ' ', text_lower)
        
        found_skills = []
        
        for skill_name, metadata in self.skills_data.items():
            pattern = r'\b' + re.escape(skill_name.lower()) + r'\b'
            if re.search(pattern, text_clean):
                found_skills.append({
                    "name": skill_name,
                    "category": metadata["cat"],
                    "description": metadata["desc"]
                })
                
        return found_skills

resume_parser = ResumeParser()
