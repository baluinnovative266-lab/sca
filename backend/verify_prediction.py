import requests
import json

url = "http://127.0.0.1:8000/api/predict-career"
# Simulate zero values as sent by frontend for empty inputs
payload = {
    "math_score": 0,
    "programming_score": 0,
    "communication_score": 0,
    "problem_solving_score": 0,
    "interest_coding": 0,
    "interest_design": 0,
    "interest_management": 0
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    if response.status_code != 200:
        print(f"Error: {response.text}")
    else:
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Request failed: {e}")
