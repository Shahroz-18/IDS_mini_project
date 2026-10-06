import os
import tempfile

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

if os.environ.get('VERCEL') == '1':
    STORAGE_DIR = os.path.join(tempfile.gettempdir(), 'student-performance-project')
else:
    STORAGE_DIR = BASE_DIR

RESULTS_DIR = os.path.join(STORAGE_DIR, 'outputs', 'results')
MODELS_DIR = os.path.join(STORAGE_DIR, 'models')
CLEANED_CSV = os.path.join(RESULTS_DIR, 'cleaned_data.csv')
DATASET_PATH = os.path.join(
    BASE_DIR,
    'dataset' if os.environ.get('VERCEL') == '1' else '..',
    'StudentPerformanceFactors.csv' if os.environ.get('VERCEL') == '1' else 'dataset/StudentPerformanceFactors.csv',
)

os.makedirs(RESULTS_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)