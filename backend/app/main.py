from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes, chat

app = FastAPI(title="CareerSense AI API", version="1.0.0")

# CORS Middleware
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to CareerSense AI API"}

from app.core.database import engine, Base
from app.api import auth, comments, community, jobs

# Import ALL models so they register with Base before create_all
from app.models.user import User
from app.models.roadmap import Roadmap
from app.models.comment import Comment
from app.models.community_message import CommunityMessage
from app.models.helpdesk import HelpDeskTicket

# Create tables
Base.metadata.create_all(bind=engine)

app.include_router(routes.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(comments.router, prefix="/api", tags=["Comments"])
app.include_router(community.router, prefix="/api", tags=["Community"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])

from app.api import helpdesk
app.include_router(helpdesk.router, prefix="/api/helpdesk", tags=["Help Desk"])
