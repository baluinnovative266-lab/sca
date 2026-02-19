import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/auth"

# Global session to maintain cookies if needed, though we use Bearer token
session = requests.Session()

def test_endpoints():
    print("----------------------------------------------------------------")
    print("Testing Auth Endpoints (Age, Password Change)")
    print("----------------------------------------------------------------")

    # 1. Login (assuming a test user exists, or we register one)
    # Let's try to register a temporary test user to avoid messing up real accounts
    email = "test_verify_user@example.com"
    password = "password123"
    
    print(f"[1] Registering test user: {email}...")
    try:
        reg_res = requests.post(f"{BASE_URL}/register", json={
            "email": email,
            "password": password,
            "full_name": "Test Verify User"
        })
        if reg_res.status_code == 200:
            print("    ✅ Registration successful")
            token = reg_res.json()["access_token"]
        elif reg_res.status_code == 400 and "already registered" in reg_res.text:
             print("    ℹ️ User already exists, logging in instead...")
             # Login if already exists
             login_res = requests.post(f"{BASE_URL}/login", data={
                 "username": email,
                 "password": password
             })
             if login_res.status_code == 200:
                 print("    ✅ Login successful")
                 token = login_res.json()["access_token"]
             else:
                 print(f"    ❌ Login failed: {login_res.text}")
                 return
        else:
            print(f"    ❌ Registration failed: {reg_res.text}")
            return
    except Exception as e:
        print(f"    ❌ Connection failed: {e}")
        return

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Set Age
    print(f"\n[2] Testing Set Age endpoint...")
    age_payload = {"age": 25}
    age_res = requests.post(f"{BASE_URL}/set-age", json=age_payload, headers=headers)
    if age_res.status_code == 200:
        print("    ✅ Set Age successful")
    else:
        print(f"    ❌ Set Age failed: {age_res.text}")

    # 3. Get Profile (Verify Age)
    print(f"\n[3] Verifying Age in Profile...")
    me_res = requests.get(f"{BASE_URL}/me", headers=headers)
    if me_res.status_code == 200:
        profile = me_res.json()
        if profile.get("age") == 25:
             print("    ✅ Profile age matches (25)")
        else:
             print(f"    ❌ Profile age mismatch. Got: {profile.get('age')}")
    else:
        print(f"    ❌ Get Profile failed: {me_res.text}")

    # 4. Change Password
    print(f"\n[4] Testing Change Password endpoint...")
    new_password = "newpassword456"
    pwd_payload = {
        "old_password": password,
        "new_password": new_password
    }
    pwd_res = requests.post(f"{BASE_URL}/change-password", json=pwd_payload, headers=headers)
    if pwd_res.status_code == 200:
        print("    ✅ Password Change successful")
    else:
        print(f"    ❌ Password Change failed: {pwd_res.text}")

    # 5. Verify New Password (Login with new password)
    print(f"\n[5] Verifying Login with New Password...")
    new_login_res = requests.post(f"{BASE_URL}/login", data={
        "username": email,
        "password": new_password
    })
    if new_login_res.status_code == 200:
        print("    ✅ Logic with new password successful")
    else:
        print(f"    ❌ Login with new password failed: {new_login_res.text}")

    # Cleanup (Optional: revert password or handle cleanup if needed)
    print("\n----------------------------------------------------------------")
    print("Verification Complete")
    print("----------------------------------------------------------------")

if __name__ == "__main__":
    test_endpoints()
