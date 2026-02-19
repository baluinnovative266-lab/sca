import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.core.database import engine, Base
from app.models.user import User
from app.models.roadmap import Roadmap
from app.models.comment import Comment
from app.models.community_message import CommunityMessage

print("Creating all tables in database...")
Base.metadata.create_all(bind=engine)
print("Done.")

import sqlite3
db_path = "backend/careersense.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print(f"Tables found: {[t[0] for t in tables]}")
    conn.close()
else:
    print("Database file still not found!")
