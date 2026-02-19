import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle
import os

# Create synthetic dataset
def create_synthetic_data(n_samples=1000):
    np.random.seed(42)
    
    # Features: Academic Performance (0-100), Interest Scores (0-10)
    data = {
        'math_score': np.random.randint(50, 100, n_samples),
        'programming_score': np.random.randint(50, 100, n_samples),
        'communication_score': np.random.randint(50, 100, n_samples),
        'problem_solving_score': np.random.randint(50, 100, n_samples),
        'interest_coding': np.random.randint(1, 10, n_samples),
        'interest_design': np.random.randint(1, 10, n_samples),
        'interest_management': np.random.randint(1, 10, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Rule-based target generation for consistency
    conditions = [
        (df['programming_score'] > 80) & (df['interest_coding'] > 7),
        (df['math_score'] > 80) & (df['problem_solving_score'] > 80),
        (df['communication_score'] > 80) & (df['interest_management'] > 7),
        (df['interest_design'] > 7)
    ]
    choices = ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer']
    
    df['career'] = np.select(conditions, choices, default='General Analyst')
    
    return df

def train_model():
    print("Generating synthetic data...")
    df = create_synthetic_data()
    
    X = df.drop('career', axis=1)
    y = df['career']
    
    # Train test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Model
    print("Training Random Forest model...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    print(f"Model Accuracy: {clf.score(X_test, y_test):.2f}")
    
    # Save Model
    os.makedirs('backend/app/models_data', exist_ok=True)
    with open('backend/app/models_data/career_model.pkl', 'wb') as f:
        pickle.dump(clf, f)
    
    print("Model saved to backend/app/models_data/career_model.pkl")

if __name__ == "__main__":
    train_model()
