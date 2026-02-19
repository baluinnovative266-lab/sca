import traceback
import sys
import os

# Add the current directory to sys.path
sys.path.append(os.getcwd())

try:
    print("Attempting to import app.main...")
    from app.main import app
    print("Import successful!")
except Exception as e:
    print("\n--- TRACEBACK START ---")
    traceback.print_exc()
    print("--- TRACEBACK END ---\n")
    sys.exit(1)
