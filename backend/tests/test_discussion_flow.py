import requests
import sys

BASE_URL = "http://localhost:8000/api"
AUTH_URL = "http://localhost:8000/api/auth"

def register_user(email, password, name):
    print(f"Registering user {email}...")
    try:
        # Try login first to avoid registration error if user exists
        resp = requests.post(f"{AUTH_URL}/login", data={"username": email, "password": password})
        if resp.status_code == 200:
            print("User already exists, logged in.")
            return resp.json()["access_token"]
        
        # Register
        resp = requests.post(f"{AUTH_URL}/register", json={
            "email": email,
            "password": password,
            "full_name": name,
            "age": 25
        })
        if resp.status_code == 200:
            print("User registered.")
            # Login to get token
            login_resp = requests.post(f"{AUTH_URL}/login", data={"username": email, "password": password})
            return login_resp.json()["access_token"]
        else:
            print(f"Registration failed: {resp.text}")
            return None
    except Exception as e:
        print(f"Error during registration: {e}")
        return None

def test_comments(token):
    print("\n--- Testing Phase Comments ---")
    headers = {"Authorization": f"Bearer {token}"}
    phase_id = "phase-1-test"
    
    # 1. Post a comment
    print("Posting comment...")
    comment_data = {
        "phase_id": phase_id,
        "content": "This is a test comment for backend verification.",
        "pros": "Great for testing",
        "cons": "None",
        "tags": "test,backend"
    }
    resp = requests.post(f"{BASE_URL}/comments", json=comment_data, headers=headers)
    if resp.status_code != 200:
        print(f"Failed to post comment: {resp.text}")
        return
    comment_id = resp.json()["id"]
    print(f"Comment posted. ID: {comment_id}")
    
    # 2. Upvote comment
    print("Upvoting comment...")
    resp = requests.post(f"{BASE_URL}/comments/{comment_id}/upvote", headers=headers)
    if resp.status_code == 200:
        print(f"Upvoted. New count: {resp.json()['upvotes']}")
    else:
        print(f"Failed to upvote: {resp.text}")

    # 3. Reply to comment
    print("Replying to comment...")
    reply_data = {
        "phase_id": phase_id,
        "content": "This is a nested reply.",
        "parent_id": comment_id
    }
    resp = requests.post(f"{BASE_URL}/comments", json=reply_data, headers=headers)
    if resp.status_code == 200:
        print(f"Reply posted. ID: {resp.json()['id']}")
    else:
        print(f"Failed to reply: {resp.text}")

    # 4. Get comments
    print("Fetching comments...")
    resp = requests.get(f"{BASE_URL}/comments/{phase_id}", headers=headers)
    if resp.status_code == 200:
        comments = resp.json()
        print(f"Found {len(comments)} top-level comments.")
        if len(comments) > 0 and comments[0]["replies"]:
            print(f"Verified nested reply: {comments[0]['replies'][0]['content']}")
        else:
            print("Warning: Nested reply not found in structure.")
    else:
        print(f"Failed to fetch comments: {resp.text}")

def test_community(token):
    print("\n--- Testing Community Chat ---")
    headers = {"Authorization": f"Bearer {token}"}
    channel = "test-channel"

    # 1. Send message
    print("Sending message...")
    msg_data = {
        "message": "Hello community from test script!",
        "channel": channel
    }
    resp = requests.post(f"{BASE_URL}/community/send", json=msg_data, headers=headers)
    if resp.status_code != 200:
        print(f"Failed to send message: {resp.text}")
        return
    msg_id = resp.json()["message_id"]
    print(f"Message sent. ID: {msg_id}")

    # 2. React to message
    print("Reacting to message...")
    react_data = {
        "message_id": msg_id,
        "type": "fire"
    }
    resp = requests.post(f"{BASE_URL}/community/react", json=react_data, headers=headers)
    if resp.status_code == 200:
        print(f"Reaction added. Counts: {resp.json()['reactions']}")
    else:
        print(f"Failed to react: {resp.text}")

    # 3. Get messages
    print("Fetching messages...")
    resp = requests.get(f"{BASE_URL}/community/messages/{channel}", headers=headers)
    if resp.status_code == 200:
        msgs = resp.json()
        print(f"Found {len(msgs)} messages in channel.")
        found_msg = next((m for m in msgs if m["id"] == msg_id), None)
        if found_msg:
            print(f"Verified message content: {found_msg['message']}")
            print(f"Verified reactions: {found_msg['reactions']}")
        else:
            print("Error: Sent message not found in fetch.")
    else:
        print(f"Failed to fetch messages: {resp.text}")

if __name__ == "__main__":
    print("Starting Backend Verification...")
    token = register_user("test_verifier@example.com", "password123", "Test Verifier")
    if token:
        test_comments(token)
        test_community(token)
        print("\nVerification Complete.")
    else:
        print("\nAborting verification: Auth failed.")
