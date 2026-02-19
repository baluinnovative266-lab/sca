import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "careersense.db")

def fix_schema():
    print(f"Checking DB at: {DB_PATH}")
    if not os.path.exists(DB_PATH):
        print("DB file not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if extracted_skills column exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if "extracted_skills" not in columns:
            print("Adding missing column 'extracted_skills'...")
            cursor.execute("ALTER TABLE users ADD COLUMN extracted_skills JSON")
            conn.commit()
            print("Column added successfully.")
        else:
            print("Column 'extracted_skills' already exists.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    fix_schema()
