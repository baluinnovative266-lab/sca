import sqlite3
import os

db_path = "backend/careersense.db"
if not os.path.exists(db_path):
    # Try relative to script if run from project root
    db_path = "careersense.db"

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print(f"Tables in {db_path}: {[t[0] for t in tables]}")
    conn.close()
else:
    print(f"Database not found at {db_path}")
