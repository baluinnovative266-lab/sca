import requests
import json

BASE_URL = "http://localhost:8000/api/auth"

def test_register():
    print("Testing Registration...")
    payload = {
        "email": "debug_user@test.com",
        "password": "password123",
        "full_name": "Debug User"
    }
    try:
        response = requests.post(f"{BASE_URL}/register", json=payload)
        print(f"Register Status: {response.status_code}")
        print(f"Register Response: {response.text}")
        return response.status_code == 200 or response.status_code == 400 # 400 is ok if already exists
    except Exception as e:
        print(f"Register Failed: {e}")
        return False

def test_login():
    print("\nTesting Login...")
    payload = {
        "username": "debug_user@test.com",
        "password": "password123"
    }
    try:
        response = requests.post(
            f"{BASE_URL}/login", 
            data=payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.text}")
    except Exception as e:
        print(f"Login Failed: {e}")

if __name__ == "__main__":
    if test_register():
        test_login()
