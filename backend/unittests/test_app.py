from unittest.mock import patch
import json
import unittest
import sys

import os
abs_path = os.path.abspath(__file__)
sys.path.append(os.path.dirname(os.path.dirname(abs_path)))
from app import app


class TestLogin(unittest.TestCase):
    """
    A test case class for testing the login functionality of the app.
    """

    def setUp(self):
        """
        Set up the test case by creating an instance of the app's test client.
        """
        self.app = app.test_client()

    @patch('app.dbm')
    def test_login_success(self, mock_dbm):
        """
        Test the login success scenario.

        Mocks the 'check_login' function of the 'dbm' module to return True.
        Sends a POST request to the '/login' endpoint with valid credentials.
        Asserts that the response JSON is {'success': True}.
        """
        mock_dbm.check_login.return_value = True

        result = self.app.post('/login', data=json.dumps({
            'email': 'test@example.com', 'password': 'password'}), content_type='application/json')

        self.assertEqual(result.get_json(), {'success': True})

    @patch('app.dbm')
    def test_login_failure(self, mock_dbm):
        """
        Test the login failure scenario.

        Mocks the 'check_login' function of the 'dbm' module to return False.
        Sends a POST request to the '/login' endpoint with invalid credentials.
        Asserts that the response JSON is {'success': False}.
        """
        mock_dbm.check_login.return_value = False

        result = self.app.post('/login', data=json.dumps({
            'email': 'test@example.com', 'password': 'wrong_password'}), content_type='application/json')

        self.assertEqual(result.get_json(), {'success': False})


if __name__ == '__main__':
    unittest.main()
