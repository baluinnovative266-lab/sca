import sys
import os
sys.path.append(os.getcwd())
from app.core.database import SessionLocal, engine
from sqlalchemy import inspect
from app.models.user import User
from app.models.community_message import CommunityMessage
from app.models.roadmap import Roadmap
from app.models.comment import Comment

inspector = inspect(engine)
print("TABLES:", inspector.get_table_names())
db = SessionLocal()
print("USER COUNT:", db.query(User).count())
# Print first user email if exists
u = db.query(User).first()
if u:
    print(f"SAMPLE USER: {u.email}")
db.close()
