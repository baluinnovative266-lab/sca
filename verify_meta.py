import sys
import os

# Ensure backend/ is in sys.path
backend_path = os.path.abspath(os.path.join(os.getcwd(), 'backend'))
if backend_path not in sys.path:
    sys.path.append(backend_path)

from app.core.database import engine, Base
from app.models.user import User
from app.models.roadmap import Roadmap
from app.models.comment import Comment
from app.models.community_message import CommunityMessage

print(f"DATABASE_URL: {engine.url}")
print(f"Models in metadata: {Base.metadata.tables.keys()}")

from sqlalchemy import inspect
inspector = inspect(engine)
print(f"Tables in DB file: {inspector.get_table_names()}")

if 'users' not in inspector.get_table_names():
    print("WARNING: 'users' table MISSING. Attempting to create...")
    Base.metadata.create_all(bind=engine)
    print(f"Tables after create_all: {inspector.get_table_names()}")
else:
    print("'users' table exists.")
