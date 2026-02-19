import sys
import os
sys.path.append(os.getcwd())

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.community_message import CommunityMessage
from app.models.roadmap import Roadmap
from app.models.comment import Comment

def debug():
    try:
        print("Checking database tables...")
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tables found: {tables}")
        
        if "users" not in tables:
            print("CRITICAL: 'users' table not found!")
        if "community_messages" not in tables:
            print("Creating 'community_messages' table...")
            Base.metadata.create_all(bind=engine)
            print("Tables created.")
        
        db = SessionLocal()
        print("Database session established.")
        
        user_count = db.query(User).count()
        print(f"Total users: {user_count}")
        
        db.close()
        print("Debug finished successfully.")
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug()
