import app
from flask import jsonify
from unittest.mock import patch, MagicMock
import json
from app import app
import unittest
import sys
sys.path.insert(0, 'doenerguide/backend/tests')


class TestLogin(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    @patch('app.dbm')
    def test_login_success(self, mock_dbm):
        mock_dbm.check_login.return_value = True

        result = self.app.post('/login', data=json.dumps({
            'email': 'test@example.com', 'password': 'password'}), content_type='application/json')

        self.assertEqual(result.get_json(), {'success': True})

    @patch('app.dbm')
    def test_login_failure(self, mock_dbm):
        mock_dbm.check_login.return_value = False

        result = self.app.post('/login', data=json.dumps({
            'email': 'test@example.com', 'password': 'wrong_password'}), content_type='application/json')

        self.assertEqual(result.get_json(), {'success': False})


if __name__ == '__main__':
    unittest.main()
