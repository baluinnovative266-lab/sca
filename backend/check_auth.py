
import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api/auth"

def test_backend():
    print(f"Checking backend at {BASE_URL}...")
    
    # 1. Try to Register
    user_data = {
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test User"
    }
    
    try:
        print("Attempting registration...")
        reg_response = requests.post(f"{BASE_URL}/register", json=user_data)
        
        if reg_response.status_code == 200:
            print("✅ Registration Successful")
            print(reg_response.json())
        elif reg_response.status_code == 400 and "already registered" in reg_response.text:
            print("⚠️ User already exists (This is good, backend is running)")
        else:
            print(f"❌ Registration Failed: {reg_response.status_code} - {reg_response.text}")
            return False

        # 2. Try to Login
        print("Attempting login...")
        login_data = {
            "username": "test@example.com",
            "password": "password123"
        }
        login_response = requests.post(f"{BASE_URL}/login", data=login_data)
        
        if login_response.status_code == 200:
            print("✅ Login Successful")
            token = login_response.json().get("access_token")
            print(f"Token received: {token[:10]}...")
            return True
        else:
            print(f"❌ Login Failed: {login_response.status_code} - {login_response.text}")
            return False

    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return False

if __name__ == "__main__":
    success = test_backend()
    if not success:
        sys.exit(1)
