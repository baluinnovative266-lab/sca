import sys
import os
sys.path.append(os.getcwd())
from app.core.database import SessionLocal, engine
from sqlalchemy import inspect
from app.models.user import User
from app.models.community_message import CommunityMessage
from app.models.comment import Comment
from app.models.roadmap import Roadmap

inspector = inspect(engine)
print("TABLES:", inspector.get_table_names())
db = SessionLocal()
print("USER COUNT:", db.query(User).count())
db.close()
