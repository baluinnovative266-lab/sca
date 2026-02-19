import sys
import os
# No need to append os.getcwd() if we run from this folder
from core.database import SessionLocal, engine
from models.user import User
from models.community_message import CommunityMessage
from models.roadmap import Roadmap
from models.comment import Comment

db = SessionLocal()
print("REAL DB USER COUNT:", db.query(User).count())
users = db.query(User).limit(5).all()
for u in users:
    print(f"User: {u.full_name} ({u.email})")
db.close()
