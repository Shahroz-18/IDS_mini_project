"""
Experiment 5: Statistical Analysis
Mean, median, variance, std, covariance, correlation, t-test.
"""

import pandas as pd
import numpy as np
from scipy import stats
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_clean_data():
    """Load preprocessed data."""
    path = os.path.join(BASE_DIR, 'outputs', 'results', 'cleaned_data.csv')
    return pd.read_csv(path)

def compute_descriptive_stats(df, columns=None):
    """Compute mean, median, variance, std for numerical columns."""
    if columns is None:
        columns = ['Hours_Studied', 'Attendance', 'Sleep_Hours', 
                   'Previous_Scores', 'Tutoring_Sessions', 'Exam_Score']
    
    stats_dict = {}
    for col in columns:
        if col in df.columns:
            stats_dict[col] = {
                'mean': round(float(df[col].mean()), 4),
                'median': round(float(df[col].median()), 4),
                'variance': round(float(df[col].var()), 4),
                'std': round(float(df[col].std()), 4),
                'min': round(float(df[col].min()), 4),
                'max': round(float(df[col].max()), 4)
            }
    return stats_dict

def compute_covariance_matrix(df, columns=None):
    """Compute covariance matrix for numerical features."""
    if columns is None:
        columns = ['Hours_Studied', 'Attendance', 'Previous_Scores', 'Exam_Score']
    
    cov_matrix = df[columns].cov()
    return {
        'columns': columns,
        'matrix': cov_matrix.round(4).values.tolist()
    }

def compute_correlation_matrix(df, columns=None):
    """Compute correlation matrix."""
    if columns is None:
        columns = ['Hours_Studied', 'Attendance', 'Sleep_Hours', 
                   'Previous_Scores', 'Tutoring_Sessions', 'Exam_Score']
    
    corr_matrix = df[columns].corr()
    return {
        'columns': columns,
        'matrix': corr_matrix.round(4).values.tolist()
    }

def perform_ttest(df):
    """
    Perform independent t-test.
    
    H0: Mean Exam_Score of high study time students == low study time students
    H1: Means are significantly different
    
    Split by median Hours_Studied.
    """
    median_hours = df['Hours_Studied'].median()
    
    high_study = df[df['Hours_Studied'] > median_hours]['Exam_Score']
    low_study = df[df['Hours_Studied'] <= median_hours]['Exam_Score']
    
    t_stat, p_value = stats.ttest_ind(high_study, low_study)
    
    return {
        'test': 'Independent T-Test',
        'hypothesis': {
            'H0': 'Mean Exam_Score is equal for high and low study time groups',
            'H1': 'Mean Exam_Score is significantly different'
        },
        'groups': {
            'high_study': {
                'n': len(high_study),
                'mean': round(float(high_study.mean()), 4),
                'std': round(float(high_study.std()), 4)
            },
            'low_study': {
                'n': len(low_study),
                'mean': round(float(low_study.mean()), 4),
                'std': round(float(low_study.std()), 4)
            }
        },
        't_statistic': round(float(t_stat), 4),
        'p_value': round(float(p_value), 6),
        'significant': bool(p_value < 0.05),
        'conclusion': 'Reject H0 - Significant difference' if p_value < 0.05 else 'Fail to reject H0 - No significant difference'
    }