import matplotlib.pyplot as plt
from sklearn.tree import plot_tree
import joblib
import os
import sys

# 1. Handle custom imports for joblib
# Make sure the script can find your custom transformers
backend_path = os.path.join(os.getcwd(), "backend")
sys.path.append(backend_path)
import ai_engine.utils
sys.modules['utils'] = ai_engine.utils

# 2. Load the model
MODEL_PATH = "model_artifacts/job_predictor.joblib"
pipeline = joblib.load(MODEL_PATH)

# 3. Extract components
# Your pipeline has a 'features' step and a 'classifier' step
feature_transformer = pipeline.named_steps['features']
classifier = pipeline.named_steps['classifier']

# Get feature names (TF-IDF words + numeric column names)
# CORRECT LINE
feature_names = feature_transformer.feature_names_


# 4. Select a tree
# Note: classifier.estimators_ is a 2D array [tree_index, class_index]
# Let's visualize the first tree (index 0) for the first class (index 0)
target_tree = classifier.estimators_[0, 0]

# 5. Plot the Tree
plt.figure(figsize=(20, 10))
plot_tree(
    target_tree,
    feature_names=feature_names,
    filled=True,
    rounded=True,
    fontsize=10,
    max_depth=3 # Limit depth so it's readable
)

plt.title("Visualizing Decision Tree 0 for Role Prediction")
plt.savefig("tree_visualization.png")
print("Tree visualization saved as 'tree_visualization.png'")
plt.show()
