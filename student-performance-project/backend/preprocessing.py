"""
Experiment 2: Data Preprocessing and Cleaning
Handles missing values, encoding, scaling, and feature separation.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import os

# Path configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, '..', 'dataset', 'StudentPerformanceFactors.csv')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

# Columns with missing values
MISSING_COLS = ['Teacher_Quality', 'Parental_Education_Level', 'Distance_from_Home']

# Categorical columns for encoding
CATEGORICAL_COLS = [
    'Parental_Involvement', 'Access_to_Resources', 'Extracurricular_Activities',
    'Motivation_Level', 'Internet_Access', 'Family_Income', 'Teacher_Quality',
    'School_Type', 'Peer_Influence', 'Learning_Disabilities',
    'Parental_Education_Level', 'Distance_from_Home', 'Gender'
]

# Numerical columns (excluding target)
NUMERICAL_COLS = [
    'Hours_Studied', 'Attendance', 'Sleep_Hours', 'Previous_Scores',
    'Tutoring_Sessions', 'Physical_Activity'
]

def load_data():
    """Load raw dataset."""
    df = pd.read_csv(DATASET_PATH)
    return df

def get_data_info(df):
    """Return dataset information for frontend display."""
    info = {
        'shape': df.shape,
        'columns': list(df.columns),
        'dtypes': df.dtypes.astype(str).to_dict(),
        'missing': df.isnull().sum().to_dict(),
        'missing_percent': (df.isnull().sum() / len(df) * 100).round(2).to_dict()
    }
    return info

def clean_data(df):
    """
    Perform complete preprocessing pipeline.
    
    Steps:
    1. Handle missing values in categorical columns (mode imputation)
    2. Remove duplicate rows
    3. Fix invalid values (negative attendance, out-of-range Exam_Score)
    4. Encode categorical variables
    5. Scale numerical features
    """
    df = df.copy()
    original_shape = df.shape
    
    # --- Step 1: Handle Missing Values ---
    # Mode imputation for categorical columns with missing values
    for col in MISSING_COLS:
        if col in df.columns:
            mode_val = df[col].mode()[0]
            df[col] = df[col].fillna(mode_val)
    
    # --- Step 2: Remove Duplicates ---
    df = df.drop_duplicates()
    
    # --- Step 3: Fix Invalid Values ---
    # Attendance should be 0-100 (fix negative values)
    df['Attendance'] = df['Attendance'].clip(lower=0, upper=100)
    
    # Exam_Score should be 0-100 (clip outliers)
    df['Exam_Score'] = df['Exam_Score'].clip(lower=0, upper=100)
    
    # --- Step 4: Create Classification Target (Pass/Fail) ---
    # Threshold: Pass if Exam_Score >= 70 (adjustable)
    df['Pass_Fail'] = (df['Exam_Score'] >= 70).astype(int)
    
    # --- Step 5: Encode Categorical Variables ---
    label_encoders = {}
    df_encoded = df.copy()
    
    for col in CATEGORICAL_COLS:
        if col in df_encoded.columns:
            le = LabelEncoder()
            df_encoded[col] = le.fit_transform(df_encoded[col].astype(str))
            label_encoders[col] = le
    
    # --- Step 6: Scale Numerical Features ---
    scaler = StandardScaler()
    df_encoded[NUMERICAL_COLS] = scaler.fit_transform(df_encoded[NUMERICAL_COLS])
    
    # Save encoders and scaler
    joblib.dump(label_encoders, os.path.join(MODELS_DIR, 'label_encoders.pkl'))
    joblib.dump(scaler, os.path.join(MODELS_DIR, 'scaler.pkl'))
    
    # Save cleaned dataset
    df_encoded.to_csv(os.path.join(BASE_DIR, 'outputs', 'results', 'cleaned_data.csv'), index=False)
    
    return df_encoded, original_shape, df.shape

def get_preprocessing_report():
    """Generate before/after preprocessing report."""
    raw_df = load_data()
    cleaned_df, orig_shape, new_shape = clean_data(raw_df)
    
    report = {
        'before': {
            'shape': orig_shape,
            'missing_total': int(raw_df.isnull().sum().sum()),
            'duplicates': int(raw_df.duplicated().sum())
        },
        'after': {
            'shape': new_shape,
            'missing_total': int(cleaned_df.isnull().sum().sum()),
            'duplicates': int(cleaned_df.duplicated().sum())
        },
        'missing_details': {
            col: int(raw_df[col].isnull().sum()) 
            for col in raw_df.columns if raw_df[col].isnull().sum() > 0
        },
        'encoding_applied': len(CATEGORICAL_COLS),
        'scaling_applied': len(NUMERICAL_COLS)
    }
    return report