"""
Main Flask application integrating all experiments.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json

# Import modules
from preprocessing import get_data_info, get_preprocessing_report, load_data, clean_data
from statistics import (compute_descriptive_stats, compute_covariance_matrix,
                        compute_correlation_matrix, perform_ttest)
from regression import train_regression_model, predict_score, load_clean_data as load_reg_data
from classification import train_classification_model, predict_pass_fail
from clustering import train_clustering_model
from pca import perform_pca
from astar import astar_study_path

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESULTS_DIR = os.path.join(BASE_DIR, 'outputs', 'results')
os.makedirs(RESULTS_DIR, exist_ok=True)

# Cache trained models results
_cache = {}

def get_or_train_model(model_name, train_func):
    """Cache model results to avoid retraining on every request."""
    if model_name not in _cache:
        _cache[model_name] = train_func()
    return _cache[model_name]

# ==================== API ENDPOINTS ====================

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

# Experiment 1 & 2: Dataset info and preprocessing
@app.route('/api/dataset/info', methods=['GET'])
def dataset_info():
    df = load_data()
    info = get_data_info(df)
    # Add sample rows
    info['sample'] = df.head(10).to_dict(orient='records')
    return jsonify(info)

@app.route('/api/dataset/pass-fail-stats', methods=['GET'])
def pass_fail_stats():
    """Return Pass/Fail distribution and Exam Score distribution."""
    import pandas as pd
    path = os.path.join(BASE_DIR, 'outputs', 'results', 'cleaned_data.csv')
    df = pd.read_csv(path)
    
    counts = df['Pass_Fail'].value_counts().to_dict()
    total = len(df)
    
    pass_count = int(counts.get(1, 0))
    fail_count = int(counts.get(0, 0))
    
    # --- NEW: Calculate Exam Score Distribution Buckets ---
    bins = [0, 50, 60, 70, 80, 90, 101]
    labels = ['0-49', '50-59', '60-69', '70-79', '80-89', '90-100']
    df['Score_Bucket'] = pd.cut(df['Exam_Score'], bins=bins, labels=labels, right=False)
    score_dist = df['Score_Bucket'].value_counts().reindex(labels).fillna(0).to_dict()
    
    return jsonify({
        'pass': pass_count,
        'fail': fail_count,
        'total': total,
        'pass_percentage': round((pass_count / total) * 100, 1),
        'fail_percentage': round((fail_count / total) * 100, 1),
        'avg_exam_score': round(float(df['Exam_Score'].mean()), 2),
        'avg_hours_studied': round(float(df['Hours_Studied'].mean()), 2),
        'score_distribution': {k: int(v) for k, v in score_dist.items()} # NEW
    })

@app.route('/api/dataset/summary', methods=['GET'])
def dataset_summary():
    df = load_data()
    numeric_columns = df.select_dtypes(include='number').columns.tolist()
    categorical_columns = [
        column for column in df.columns if column not in numeric_columns
    ]
    return jsonify({
        'total_records': int(df.shape[0]),
        'total_features': int(df.shape[1]),
        'numerical_cols': numeric_columns,
        'categorical_cols': categorical_columns,
        'missing_values': {
            column: int(count)
            for column, count in df.isnull().sum().items()
            if count > 0
        },
    })

@app.route('/api/dataset/preview', methods=['GET'])
def dataset_preview():
    df = load_data()
    return jsonify(df.head(10).where(df.notna(), None).to_dict(orient='records'))

@app.route('/api/preprocessing/report', methods=['GET'])
def preprocessing_report():
    try:
        report = get_preprocessing_report()
        return jsonify(report)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Experiment 3: EDA data (computed on frontend from sample)
@app.route('/api/eda/data', methods=['GET'])
@app.route('/api/eda/charts', methods=['GET'])
def eda_data():
    df = load_data()
    # Return data for charts
    eda = {
        'hours_studied': df['Hours_Studied'].dropna().tolist()[:500],
        'exam_score': df['Exam_Score'].dropna().tolist()[:500],
        'attendance': df['Attendance'].dropna().tolist()[:500],
        'previous_scores': df['Previous_Scores'].dropna().tolist()[:500],
        'gender_counts': df['Gender'].value_counts().to_dict(),
        'school_type_counts': df['School_Type'].value_counts().to_dict()
    }
    return jsonify(eda)

# Experiment 5: Statistics
@app.route('/api/statistics/descriptive', methods=['GET'])
@app.route('/api/statistics/summary', methods=['GET'])
def descriptive_stats():
    df = load_reg_data()
    stats = compute_descriptive_stats(df)
    return jsonify(stats)

@app.route('/api/statistics/covariance', methods=['GET'])
def covariance():
    df = load_reg_data()
    cov = compute_covariance_matrix(df)
    return jsonify(cov)

@app.route('/api/statistics/correlation', methods=['GET'])
def correlation():
    df = load_reg_data()
    corr = compute_correlation_matrix(df)
    return jsonify(corr)

@app.route('/api/statistics/ttest', methods=['GET', 'POST'])
def ttest():
    df = load_reg_data()
    result = perform_ttest(df)
    return jsonify(result)

# Experiment 6: Regression
@app.route('/api/regression/train', methods=['GET'])
def regression_train():
    try:
        result = get_or_train_model('regression', train_regression_model)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/regression/predict', methods=['POST'])
def regression_predict():
    try:
        data = request.json
        prediction = predict_score(data)
        return jsonify({'predicted_score': prediction})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Experiment 7: Classification
@app.route('/api/classification/train', methods=['GET'])
def classification_train():
    try:
        result = get_or_train_model('classification', train_classification_model)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/classification/predict', methods=['POST'])
def classification_predict():
    try:
        data = request.json
        result = predict_pass_fail(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Experiment 8: Clustering
@app.route('/api/clustering/train', methods=['GET'])
@app.route('/api/clustering/results', methods=['GET'])
def clustering_train():
    try:
        result = get_or_train_model('clustering', train_clustering_model)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Experiment 9: PCA
@app.route('/api/pca/analyze', methods=['GET'])
@app.route('/api/pca/results', methods=['GET'])
def pca_analyze():
    try:
        result = get_or_train_model('pca', perform_pca)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Experiment 4: A* Study Path
@app.route('/api/astar/path', methods=['POST'])
def astar_path():
    try:
        data = request.json
        start_level = data.get('start_level', 'Beginner')
        target_level = data.get('target_level', 'Exam_Ready')
        result = astar_study_path(start_level, target_level)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dataset/pass-fail-stats', methods=['GET'])
def pass_fail_stats():
    """Return Pass/Fail distribution and Exam Score distribution."""
    import pandas as pd
    path = os.path.join(BASE_DIR, 'outputs', 'results', 'cleaned_data.csv')
    df = pd.read_csv(path)
    
    counts = df['Pass_Fail'].value_counts().to_dict()
    total = len(df)
    
    pass_count = int(counts.get(1, 0))
    fail_count = int(counts.get(0, 0))
    
    # Exam Score Distribution Buckets
    bins = [0, 50, 60, 70, 80, 90, 101]
    labels = ['0-49', '50-59', '60-69', '70-79', '80-89', '90-100']
    df['Score_Bucket'] = pd.cut(df['Exam_Score'], bins=bins, labels=labels, right=False)
    score_dist = df['Score_Bucket'].value_counts().reindex(labels).fillna(0).to_dict()
    
    return jsonify({
        'pass': pass_count,
        'fail': fail_count,
        'total': total,
        'pass_percentage': round((pass_count / total) * 100, 1),
        'fail_percentage': round((fail_count / total) * 100, 1),
        'avg_exam_score': round(float(df['Exam_Score'].mean()), 2),
        'avg_hours_studied': round(float(df['Hours_Studied'].mean()), 2),
        'score_distribution': {k: int(v) for k, v in score_dist.items()}
    })

if __name__ == '__main__':
    # Pre-train models on startup (optional)
    print("Starting Flask server...")
    app.run(debug=True, port=5000)