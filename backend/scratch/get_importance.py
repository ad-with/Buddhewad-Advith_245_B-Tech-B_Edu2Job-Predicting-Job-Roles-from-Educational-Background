import joblib
import os
import pandas as pd

MODEL_PATH = "model_artifacts/job_predictor.joblib"
if os.path.exists(MODEL_PATH):
    pipeline = joblib.load(MODEL_PATH)
    model = pipeline.named_steps['classifier']
    preprocessor = pipeline.named_steps['preprocessor']
    
    # Get feature names
    cat_features = preprocessor.named_transformers_['cat'].get_feature_names_out(['degree', 'specialization'])
    num_features = ['academic_score', 'marks_10th', 'marks_12th', 'experience_years']
    text_features = preprocessor.named_transformers_['text'].get_feature_names_out()
    
    all_features = list(num_features) + list(cat_features) + list(text_features)
    importances = model.feature_importances_
    
    feat_imp = pd.DataFrame({'feature': all_features, 'importance': importances})
    feat_imp = feat_imp.sort_values(by='importance', ascending=False)
    
    print("--- Top Feature Importances ---")
    print(feat_imp.head(20))
    
    # Aggregate importance by category
    summary = {
        'Academic Scores': feat_imp[feat_imp['feature'].isin(num_features[:-1])]['importance'].sum(),
        'Experience': feat_imp[feat_imp['feature'] == 'experience_years']['importance'].sum(),
        'Degrees/Specializations': feat_imp[feat_imp['feature'].isin(cat_features)]['importance'].sum(),
        'Skills (Keywords)': feat_imp[feat_imp['feature'].isin(text_features)]['importance'].sum()
    }
    print("\n--- Aggregated Weightage ---")
    for k, v in summary.items():
        print(f"{k}: {v*100:.2f}%")
else:
    print("Model not found.")
