import requests
import pyotp
import time

BASE_URL = "http://localhost:8000/api/auth"
TEST_USER = {
    "email": "2fa_tester@example.com",
    "password": "password123",
    "full_name": "2FA Tester"
}

def test_2fa_flow():
    print("--- Starting 2FA Backend Verification ---")
    
    # 1. Register
    print("Registering test user...")
    reg_resp = requests.post(f"{BASE_URL}/register", json=TEST_USER)
    print(f"Registration response: {reg_resp.status_code}")
    
    # 2. Login (No 2FA)
    print("Logging in (2FA disabled)...")
    login_resp = requests.post(f"{BASE_URL}/login", data={"username": TEST_USER["email"], "password": TEST_USER["password"]})
    print(f"Login Response: {login_resp.status_code} - {login_resp.text}")
    if login_resp.status_code != 200:
        return
        
    token = login_resp.json().get("access_token")
    print(f"Token received: {token[:20]}..." if token else "Token is NONE")
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful.")

    # 3. Setup 2FA
    print("Setting up 2FA...")
    setup_resp = requests.post(f"{BASE_URL}/2fa/setup", headers=headers)
    if setup_resp.status_code != 200:
        print(f"Setup failed: {setup_resp.status_code} - {setup_resp.text}")
        return
        
    secret = setup_resp.json().get("secret")
    print(f"Secret generated: {secret}")

    # 4. Enable 2FA
    totp = pyotp.TOTP(secret)
    code = totp.now()
    print(f"Enabling 2FA with code: {code}")
    enable_resp = requests.post(f"{BASE_URL}/2fa/enable", json={"code": code}, headers=headers)
    if enable_resp.status_code != 200:
        print(f"Enable failed: {enable_resp.status_code} - {enable_resp.text}")
        return
    print(f"Enable response: {enable_resp.json()}")

    # 5. Login Challenge
    print("Logging in (2FA enabled) - Expecting challenge...")
    challenge_resp = requests.post(f"{BASE_URL}/login", data={"username": TEST_USER["email"], "password": TEST_USER["password"]})
    print(f"Challenge response: {challenge_resp.json()}")
    if challenge_resp.json().get("two_fa_required"):
        print("PASS: 2FA challenge issued.")
    else:
        print("FAIL: 2FA challenge NOT issued.")
        return

    # 6. Verify 2FA Login
    code = totp.now()
    print(f"Verifying 2FA login with code: {code}")
    verify_resp = requests.post(f"{BASE_URL}/login/verify-2fa", json={"email": TEST_USER["email"], "code": code})
    if verify_resp.status_code == 200 and verify_resp.json().get("access_token"):
        print("PASS: 2FA login successful.")
    else:
        print(f"FAIL: 2FA login failed: {verify_resp.text}")
        return

    # 7. Disable 2FA
    print("Disabling 2FA...")
    disable_resp = requests.post(f"{BASE_URL}/2fa/disable", headers=headers)
    print(f"Disable response: {disable_resp.json()}")

    # 8. Final Login Check
    print("Logging in (2FA disabled again)...")
    final_resp = requests.post(f"{BASE_URL}/login", data={"username": TEST_USER["email"], "password": TEST_USER["password"]})
    if final_resp.json().get("access_token"):
        print("PASS: Login successful without 2FA.")
    else:
        print("FAIL: Login failed after disabling 2FA.")

    print("--- 2FA Verification Complete ---")

if __name__ == "__main__":
    test_2fa_flow()
