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

@app.route('/api/preprocessing/report', methods=['GET'])
def preprocessing_report():
    try:
        report = get_preprocessing_report()
        return jsonify(report)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Experiment 3: EDA data (computed on frontend from sample)
@app.route('/api/eda/data', methods=['GET'])
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

@app.route('/api/statistics/ttest', methods=['GET'])
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
def clustering_train():
    try:
        result = get_or_train_model('clustering', train_clustering_model)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Experiment 9: PCA
@app.route('/api/pca/analyze', methods=['GET'])
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

if __name__ == '__main__':
    # Pre-train models on startup (optional)
    print("Starting Flask server...")
    app.run(debug=True, port=5000)