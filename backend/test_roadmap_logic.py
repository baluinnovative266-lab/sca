from app.logic.roadmap_engine import roadmap_engine
import json

def test_engine():
    print("--- Test Case 1: Remedial Math & Coding ---")
    scores_low = {"math": 30, "programming": 30}
    roadmap = roadmap_engine.generate("Software Engineer", scores_low, [], confidence=0.5)
    
    found_remedial = False
    for step in roadmap[0]['steps']:
        if "Remedial" in step['title']:
            found_remedial = True
            print(f"PASS: Found Remedial Step: {step['title']}")
    
    if not found_remedial:
        print("FAIL: Remedial step missing for low scores.")

    print("\n--- Test Case 2: High Confidence (Ambition) ---")
    roadmap_ambitious = roadmap_engine.generate("Software Engineer", {"programming": 90}, [], confidence=0.9)
    
    found_advanced = False
    for phase in roadmap_ambitious:
        if phase['phase'] == "Phase 3 – Projects":
            for step in phase['steps']:
                if "Advanced" in step['title']:
                    found_advanced = True
                    print(f"PASS: Found Advanced Step: {step['title']}")
    
    if not found_advanced:
        print("FAIL: Advanced step missing for high confidence.")

    print("\n--- Test Case 3: Existing Skills ---")
    roadmap_skill = roadmap_engine.generate("Data Scientist", {"math": 80}, ["Python"], confidence=0.5)
    
    found_completed = False
    for phase in roadmap_skill:
        for step in phase['steps']:
            if "Python" in step['skill'] and step['status'] == 'completed':
                found_completed = True
                print(f"PASS: Skill 'Python' marked as completed.")
    
    if not found_completed:
        print("FAIL: Existing skill not marked completed.")

if __name__ == "__main__":
    test_engine()
