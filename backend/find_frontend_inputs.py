import joblib
import sys
import os
import pandas as pd
import numpy as np

# Fix for joblib
import ai_engine.utils
sys.modules['utils'] = ai_engine.utils

MODEL_PATH = "model_artifacts/job_predictor.joblib"
model = joblib.load(MODEL_PATH)

classes = model.classes_

# Let's inspect some of the feature names
pipeline = model.named_steps['features']
feature_names = pipeline.feature_names_

print("Checking vectorizer features containing 'html', 'css', 'react', 'front':")
matching = [f for f in feature_names if any(x in f.lower() for x in ['html', 'css', 'react', 'front'])]
print(matching[:30])

# Let's write a grid search to find a combination that outputs "Frontend Developer"
# We will try different specializations, degrees, skills, subjects

degrees = ["B.Tech", "B.Sc", "BCA", "M.Tech", "MCA"]
specializations = ["Computer Science", "Information Technology", "Web Development", "Frontend Engineering", "Data Science"]
skills_options = [
    "HTML, CSS, JavaScript, React, Tailwind CSS",
    "React, CSS, HTML, JavaScript",
    "React, HTML5, CSS3, JavaScript, Next.js, Redux",
    "Web Developer, Frontend Developer, React, JavaScript, HTML, CSS",
    "Frontend, React, HTML, CSS, JavaScript, Web Development"
]
subjects_options = [
    "Web Development:A+,Object Oriented Programming:A",
    "Web Development:A+",
    "Web Development:O,Object Oriented Programming:O"
]

found = False
for deg in degrees:
    for spec in specializations:
        for sk in skills_options:
            for sub in subjects_options:
                input_df = pd.DataFrame([{
                    "degree": deg,
                    "specialization": spec,
                    "academic_score": 9.0,
                    "marks_10th": 90.0,
                    "marks_12th": 90.0,
                    "skills": sk,
                    "core_subjects": sub,
                    "projects": "React E-Commerce UI, Frontend Portfolio website",
                    "internships": "Frontend Developer Internship: 6 months",
                    "experience_years": 0.0
                }])
                probas = model.predict_proba(input_df)[0]
                pred = classes[np.argmax(probas)]
                if pred == "Frontend Developer":
                    print(f"\nSUCCESS! Found input yielding {pred}:")
                    print(f"Degree: {deg}")
                    print(f"Specialization: {spec}")
                    print(f"Skills: {sk}")
                    print(f"Subjects: {sub}")
                    print(f"Probabilities: {dict(zip(classes, probas))[pred]*100:.2f}%")
                    found = True
                    break
            if found: break
        if found: break
    if found: break

if not found:
    print("\nNo combination found using standard grid. Let's do a broad search of combinations...")
    # Let's print out the feature importances for the classifier to see what features it relies on for Frontend Developer
    clf = model.named_steps['classifier']
    importances = clf.feature_importances_
    
    # Sort features by importance
    sorted_feats = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
    print("\nTop 20 most important features in the model:")
    for f, imp in sorted_feats[:20]:
        print(f"{f}: {imp:.5f}")
