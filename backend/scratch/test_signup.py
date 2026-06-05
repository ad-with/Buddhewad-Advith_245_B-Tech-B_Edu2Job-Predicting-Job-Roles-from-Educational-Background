import httpx
import random
import string

def get_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def test_signup():
    url = "http://127.0.0.1:8000/api/v1/auth/signup"
    email = f"test_{get_random_string(5)}@example.com"
    payload = {
        "email": email,
        "password": "testpassword123",
        "full_name": "Test User"
    }
    
    print(f"Testing signup with email: {email}")
    try:
        response = httpx.post(url, json=payload, timeout=10.0)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Signup Successful!")
            print(f"Response: {response.json()}")
        else:
            print(f"Signup Failed: {response.text}")
    except Exception as e:
        print(f"Error connecting to server: {e}")

if __name__ == "__main__":
    test_signup()
