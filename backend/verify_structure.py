from app.logic.roadmap_engine import roadmap_engine
import json

def verify():
    print("--- Verifying Roadmap Structure ---")
    careers = ["Software Engineer", "Data Scientist", "UI/UX Designer", "Product Manager", "Cybersecurity Analyst"]
    
    for career in careers:
        print(f"\nCareer: {career}")
        roadmap = roadmap_engine.generate(career, {"programming": 70}, [])
        
        for phase in roadmap:
            phase_name = phase['phase']
            branches = phase.get('mindmap_nodes', {}).get('branches', [])
            resources = phase.get('resources', [])
            objectives = phase.get('objectives', [])
            
            print(f"  {phase_name}:")
            print(f"    - Mindmap: {len(branches)} branches")
            print(f"    - Resources: {len(resources)} items")
            print(f"    - Objectives: {len(objectives)} items")
            
            if len(branches) == 0:
                print(f"    ERROR: No mindmap branches for {phase_name}")
            if len(resources) == 0:
                print(f"    ERROR: No resources for {phase_name}")

if __name__ == "__main__":
    verify()
