"""
Experiment 9: PCA and Model Evaluation
Dimensionality reduction and model comparison.
"""

import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

PCA_FEATURES = [
    'Hours_Studied', 'Attendance', 'Sleep_Hours', 'Previous_Scores',
    'Tutoring_Sessions', 'Physical_Activity', 'Motivation_Level',
    'Parental_Involvement', 'Access_to_Resources'
]

def load_clean_data():
    path = os.path.join(BASE_DIR, 'outputs', 'results', 'cleaned_data.csv')
    return pd.read_csv(path)

def perform_pca():
    """Perform PCA on scaled features."""
    df = load_clean_data()
    
    X = df[PCA_FEATURES].values
    y = df['Pass_Fail']
    
    # Scale
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Apply PCA (keep all components first)
    pca_full = PCA(random_state=42)
    X_pca_full = pca_full.fit_transform(X_scaled)
    
    # Explained variance
    explained_variance = [round(float(v), 4) for v in pca_full.explained_variance_ratio_]
    cumulative_variance = [round(float(v), 4) for v in np.cumsum(pca_full.explained_variance_ratio_)]
    
    # Number of components for 95% variance
    n_components_95 = int(np.argmax(np.cumsum(pca_full.explained_variance_ratio_) >= 0.95) + 1)
    
    # 2D PCA for visualization
    pca_2d = PCA(n_components=2, random_state=42)
    X_pca_2d = pca_2d.fit_transform(X_scaled)
    
    # Sample for visualization
    sample_idx = np.random.choice(len(X_pca_2d), min(300, len(X_pca_2d)), replace=False)
    pca_scatter = {
        'pc1': X_pca_2d[sample_idx, 0].tolist(),
        'pc2': X_pca_2d[sample_idx, 1].tolist(),
        'class': y.iloc[sample_idx].tolist()
    }
    
    # Train models for comparison
    X_train, X_test, y_train, y_test = train_test_split(
        X_pca_full[:, :n_components_95], y, test_size=0.2, random_state=42, stratify=y
    )
    
    model_pca = LogisticRegression(max_iter=1000, random_state=42)
    model_pca.fit(X_train, y_train)
    y_pred = model_pca.predict(X_test)
    
    pca_metrics = {
        'accuracy': round(accuracy_score(y_test, y_pred), 4),
        'precision': round(precision_score(y_test, y_pred, zero_division=0), 4),
        'recall': round(recall_score(y_test, y_pred, zero_division=0), 4),
        'f1_score': round(f1_score(y_test, y_pred, zero_division=0), 4)
    }
    
    return {
        'n_original_features': len(PCA_FEATURES),
        'n_components_95': n_components_95,
        'explained_variance': explained_variance,
        'cumulative_variance': cumulative_variance,
        'pca_2d_variance': [round(float(v), 4) for v in pca_2d.explained_variance_ratio_],
        'pca_scatter': pca_scatter,
        'pca_metrics': pca_metrics
    }