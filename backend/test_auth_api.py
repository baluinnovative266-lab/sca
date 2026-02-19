import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_auth():
    # 1. Register
    reg_data = {
        "email": "test_user@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }
    print(f"Registering: {reg_data['email']}...")
    try:
        r = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
        
        if r.status_code == 200:
            token = r.json().get("access_token")
            print("SUCCESS: Registered and got token.")
        else:
            print("FAILED: Registration failed.")
            return

        # 2. Login
        login_data = {
            "username": "test_user@example.com",
            "password": "testpassword123"
        }
        print(f"\nLogging in: {login_data['username']}...")
        # OAuth2PasswordRequestForm expects form data
        r = requests.post(f"{BASE_URL}/auth/login", data=login_data)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text}")
        
        if r.status_code == 200:
            print("SUCCESS: Logged in.")
        else:
            print("FAILED: Login failed.")

    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_auth()
