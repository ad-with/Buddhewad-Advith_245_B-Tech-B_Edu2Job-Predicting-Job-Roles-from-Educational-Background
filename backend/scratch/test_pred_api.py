import requests
import json

url = "http://localhost:8000/predict/"

payload = json.dumps({
  "degree": "B.Tech",
  "specialization": "Computer Science",
  "academic_score": 9.2,
  "is_cgpa": True,
  "marks_10th": 90,
  "marks_12th": 92,
  "skills": ["react", "python"],
  "experience_years": 1,
  "core_subjects": [{"name": "react", "grade": "A"}],
  "projects": [],
  "internships": [],
  "certifications": []
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
