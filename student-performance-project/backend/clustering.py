"""
Experiment 8: Clustering
K-Means clustering to group students by performance.
"""

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

CLUSTER_FEATURES = ['Hours_Studied', 'Attendance', 'Previous_Scores', 'Exam_Score']

def load_clean_data():
    path = os.path.join(BASE_DIR, 'outputs', 'results', 'cleaned_data.csv')
    return pd.read_csv(path)

def train_clustering_model():
    """Train K-Means clustering model."""
    df = load_clean_data()
    
    X = df[CLUSTER_FEATURES].values
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Elbow method: compute inertia for K=1 to 10
    inertias = []
    K_range = range(1, 11)
    
    for k in K_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        kmeans.fit(X_scaled)
        inertias.append(round(float(kmeans.inertia_), 4))
    
    # Train with K=3 (low, average, high performers)
    optimal_k = 3
    kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_scaled)
    
    # Analyze clusters
    df_clustered = df.copy()
    df_clustered['Cluster'] = labels
    
    cluster_summary = {}
    for i in range(optimal_k):
        cluster_data = df_clustered[df_clustered['Cluster'] == i]
        cluster_summary[f'Cluster_{i}'] = {
            'count': len(cluster_data),
            'avg_hours_studied': round(float(cluster_data['Hours_Studied'].mean()), 2),
            'avg_attendance': round(float(cluster_data['Attendance'].mean()), 2),
            'avg_previous_scores': round(float(cluster_data['Previous_Scores'].mean()), 2),
            'avg_exam_score': round(float(cluster_data['Exam_Score'].mean()), 2)
        }
    
    # Determine cluster labels based on avg exam score
    avg_scores = {k: v['avg_exam_score'] for k, v in cluster_summary.items()}
    sorted_clusters = sorted(avg_scores.keys(), key=lambda x: avg_scores[x])
    
    cluster_labels = {}
    cluster_names = ['Low Performers', 'Average Performers', 'High Performers']
    for idx, cluster_key in enumerate(sorted_clusters):
        cluster_labels[cluster_key] = cluster_names[idx]
    
    # Add labels to summary
    for cluster_key in cluster_summary:
        cluster_summary[cluster_key]['label'] = cluster_labels[cluster_key]
    
    # Sample data for visualization (200 points)
    sample_idx = np.random.choice(len(X_scaled), min(200, len(X_scaled)), replace=False)
    scatter_data = {
        'hours_studied': df_clustered.iloc[sample_idx]['Hours_Studied'].tolist(),
        'exam_score': df_clustered.iloc[sample_idx]['Exam_Score'].tolist(),
        'cluster': df_clustered.iloc[sample_idx]['Cluster'].tolist()
    }
    
    # Save models
    joblib.dump(kmeans, os.path.join(MODELS_DIR, 'kmeans_model.pkl'))
    joblib.dump(scaler, os.path.join(MODELS_DIR, 'cluster_scaler.pkl'))
    
    return {
        'elbow': {
            'k_values': list(K_range),
            'inertias': inertias
        },
        'optimal_k': optimal_k,
        'clusters': cluster_summary,
        'scatter_data': scatter_data
    }