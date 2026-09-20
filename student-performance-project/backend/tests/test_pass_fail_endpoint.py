import unittest

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


if __name__ == '__main__':
    unittest.main()
