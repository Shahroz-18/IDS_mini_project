"""
Experiment 6: Linear Regression
Predict Exam_Score using selected features.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Features for regression (after encoding)
REGRESSION_FEATURES = [
    'Hours_Studied', 'Attendance', 'Sleep_Hours', 'Previous_Scores',
    'Tutoring_Sessions', 'Physical_Activity', 'Motivation_Level',
    'Parental_Involvement', 'Access_to_Resources'
]

# Numerical features that get scaled (must match preprocessing.py)
NUMERICAL_FEATURES = [
    'Hours_Studied', 'Attendance', 'Sleep_Hours', 'Previous_Scores',
    'Tutoring_Sessions', 'Physical_Activity'
]

# Categorical features that are label-encoded (NOT scaled)
CATEGORICAL_FEATURES = [
    'Motivation_Level', 'Parental_Involvement', 'Access_to_Resources'
]


def load_clean_data():
    path = os.path.join(BASE_DIR, 'outputs', 'results', 'cleaned_data.csv')
    return pd.read_csv(path)


def train_regression_model():
    """Train Linear Regression model and save it."""
    df = load_clean_data()

    X = df[REGRESSION_FEATURES]
    y = df['Exam_Score']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = LinearRegression()
    model.fit(X_train, y_train)

    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    metrics = {
        'train': {
            'MAE': round(mean_absolute_error(y_train, y_pred_train), 4),
            'MSE': round(mean_squared_error(y_train, y_pred_train), 4),
            'RMSE': round(np.sqrt(mean_squared_error(y_train, y_pred_train)), 4),
            'R2': round(r2_score(y_train, y_pred_train), 4)
        },
        'test': {
            'MAE': round(mean_absolute_error(y_test, y_pred_test), 4),
            'MSE': round(mean_squared_error(y_test, y_pred_test), 4),
            'RMSE': round(np.sqrt(mean_squared_error(y_test, y_pred_test)), 4),
            'R2': round(r2_score(y_test, y_pred_test), 4)
        }
    }

    feature_importance = {
        feat: round(coef, 4)
        for feat, coef in zip(REGRESSION_FEATURES, model.coef_)
    }

    sample_idx = np.random.choice(len(y_test), min(100, len(y_test)), replace=False)
    actual_vs_pred = {
        'actual': y_test.iloc[sample_idx].tolist(),
        'predicted': y_pred_test[sample_idx].tolist()
    }

    joblib.dump(model, os.path.join(MODELS_DIR, 'regression_model.pkl'))

    return {
        'metrics': metrics,
        'feature_importance': feature_importance,
        'actual_vs_predicted': actual_vs_pred,
        'intercept': round(float(model.intercept_), 4)
    }


def predict_score(features_dict):
    """
    Predict exam score for given input features.

    IMPORTANT: Applies the SAME scaler used during training so the model
    receives inputs in the same distribution it was trained on.
    """
    model = joblib.load(os.path.join(MODELS_DIR, 'regression_model.pkl'))
    scaler = joblib.load(os.path.join(MODELS_DIR, 'scaler.pkl'))

    # Build DataFrame with all required features
    input_df = pd.DataFrame([features_dict])

    for feat in REGRESSION_FEATURES:
        if feat not in input_df.columns:
            input_df[feat] = 0

    # Reorder to match training feature order
    input_df = input_df[REGRESSION_FEATURES]

    # --- FIX: Apply the same StandardScaler used during training ---
    # Only scale numerical columns; categorical (label-encoded) stay as-is
    input_df[NUMERICAL_FEATURES] = scaler.transform(input_df[NUMERICAL_FEATURES])

    prediction = model.predict(input_df[REGRESSION_FEATURES])[0]

    # Clamp to valid Exam_Score range [0, 100]
    prediction = float(np.clip(prediction, 0, 100))

    return round(prediction, 2)