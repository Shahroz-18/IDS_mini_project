"""
Experiment 7: Classification
Pass/Fail classification using Logistic Regression.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, precision_score, recall_score, 
                             f1_score, confusion_matrix, classification_report)
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

CLASSIFICATION_FEATURES = [
    'Hours_Studied', 'Attendance', 'Sleep_Hours', 'Previous_Scores',
    'Tutoring_Sessions', 'Physical_Activity', 'Motivation_Level',
    'Parental_Involvement', 'Access_to_Resources'
]

NUMERICAL_FEATURES = [
    'Hours_Studied', 'Attendance', 'Sleep_Hours', 'Previous_Scores',
    'Tutoring_Sessions', 'Physical_Activity'
]

def load_clean_data():
    path = os.path.join(BASE_DIR, 'outputs', 'results', 'cleaned_data.csv')
    return pd.read_csv(path)

def train_classification_model():
    """Train Logistic Regression for Pass/Fail classification."""
    df = load_clean_data()
    
    X = df[CLASSIFICATION_FEATURES]
    y = df['Pass_Fail']
    
    # Train-test split with stratification
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train model
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred = model.predict(X_test)
    
    # Metrics
    metrics = {
        'accuracy': round(accuracy_score(y_test, y_pred), 4),
        'precision': round(precision_score(y_test, y_pred, zero_division=0), 4),
        'recall': round(recall_score(y_test, y_pred, zero_division=0), 4),
        'f1_score': round(f1_score(y_test, y_pred, zero_division=0), 4)
    }
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    confusion = {
        'matrix': cm.tolist(),
        'labels': ['Fail', 'Pass'],
        'tn': int(cm[0, 0]),
        'fp': int(cm[0, 1]),
        'fn': int(cm[1, 0]),
        'tp': int(cm[1, 1])
    }
    
    # Save model
    joblib.dump(model, os.path.join(MODELS_DIR, 'classification_model.pkl'))
    
    return {
        'metrics': metrics,
        'confusion_matrix': confusion
    }

def predict_pass_fail(features_dict):
    """Predict Pass/Fail for given input features."""
    model = joblib.load(os.path.join(MODELS_DIR, 'classification_model.pkl'))
    scaler = joblib.load(os.path.join(MODELS_DIR, 'scaler.pkl'))

    input_df = pd.DataFrame([features_dict])

    for feat in CLASSIFICATION_FEATURES:
        if feat not in input_df.columns:
            input_df[feat] = 0

    input_df = input_df[CLASSIFICATION_FEATURES]

    # --- FIX: Apply same scaler ---
    input_df[NUMERICAL_FEATURES] = scaler.transform(input_df[NUMERICAL_FEATURES])

    prediction = model.predict(input_df[CLASSIFICATION_FEATURES])[0]
    probability = model.predict_proba(input_df[CLASSIFICATION_FEATURES])[0]

    return {
        'prediction': 'Pass' if prediction == 1 else 'Fail',
        'probability': {
            'fail': round(float(probability[0]), 4),
            'pass': round(float(probability[1]), 4)
        }
    }