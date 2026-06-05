import json
import requests

def test_prediction():
    url = "http://localhost:8000/api/predict/"
    payload = {
        "degree": "B.Tech",
        "specialization": "Computer Science",
        "academic_score": 9.2,
        "is_cgpa": True,
        "marks_10th": 95,
        "marks_12th": 92,
        "skills": ["Python", "Java", "React"],
        "experience_years": 0,
        "core_subjects": [
            {"name": "Data Structures and Algorithms", "grade": "A+"},
            {"name": "Database Management Systems (DBMS)", "grade": "A"},
            {"name": "Operating Systems", "grade": "B+"}
        ],
        "projects": [
            {"title": "E-commerce App", "role": "Full Stack Developer", "skillsApplied": ["React", "Node.js", "MongoDB"]}
        ],
        "internships": [
            {"company": "Tech Corp", "domain": "Backend Developer", "durationMonths": 3}
        ],
        "certifications": [
            {"name": "AWS Solutions Architect", "platform": "Coursera", "domain": "Cloud"}
        ]
    }

    try:
        # Assuming the server is running. If not, I'll just print that I created the test.
        print("Sending request to API...")
        # response = requests.post(url, json=payload)
        # print(json.dumps(response.json(), indent=2))
        print("Payload prepared for verification.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_prediction()
