import os
import shutil
import tempfile
import unittest
from pathlib import Path

from app import app


class PassFailStatsEndpointTests(unittest.TestCase):
    def test_pass_fail_stats_route_returns_distribution(self):
        client = app.test_client()

        response = client.get('/api/dataset/pass-fail-stats')

        self.assertEqual(response.status_code, 200)

        data = response.get_json()
        self.assertIn('pass', data)
        self.assertIn('fail', data)
        self.assertIn('total', data)
        self.assertIn('pass_percentage', data)
        self.assertIn('fail_percentage', data)
        self.assertGreaterEqual(data['total'], data['pass'] + data['fail'])
        self.assertAlmostEqual(data['pass_percentage'] + data['fail_percentage'], 100.0, delta=1.0)

    def test_ensure_cleaned_dataset_recreates_missing_file(self):
        from app import CLEANED_CSV, ensure_cleaned_dataset

        backup_path = None
        if os.path.exists(CLEANED_CSV):
            backup_path = str(Path(CLEANED_CSV).with_suffix('.csv.bak'))
            shutil.move(CLEANED_CSV, backup_path)

        try:
            ensure_cleaned_dataset()
            self.assertTrue(os.path.exists(CLEANED_CSV))
        finally:
            if backup_path and os.path.exists(backup_path):
                shutil.move(backup_path, CLEANED_CSV)


if __name__ == '__main__':
    unittest.main()
