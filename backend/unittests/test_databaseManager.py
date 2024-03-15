import unittest
from unittest.mock import patch, MagicMock
import sqlite3
import os
import sys

abs_path = os.path.abspath(__file__)
sys.path.append(os.path.dirname(os.path.dirname(abs_path)))
from databaseManager import hash_password, verify_password, create_connection, check_login, add_user

class TestDatabaseManager(unittest.TestCase):

    def setUp(self):
        self.conn = sqlite3.connect(':memory:')
        self.cursor = self.conn.cursor()
        self.cursor.execute('''
            CREATE TABLE USERS (
                Mail TEXT,
                Password TEXT,
                Vorname TEXT,
                Nachname TEXT
            )
        ''')

    def tearDown(self):
        self.cursor.execute('DROP TABLE USERS')
        self.conn.close()

    def test_hash_password(self):
        password = "password"
        salt = "doenerguide"
        hashed_password = hash_password(password, salt)
        self.assertIsNotNone(hashed_password)

    def test_verify_password(self):
        stored_password = "7d19076002f3f2e07d294bdb6afa1dcec30137b7f99efdad30e701954bebd031"
        provided_password = "password"
        salt = "doenerguide"
        result = verify_password(stored_password, provided_password, salt)
        self.assertTrue(result)

    def test_create_connection(self):
        conn = create_connection()
        self.assertIsNotNone(conn)

    def test_check_login(self):
        mail = "test@example.com"
        password = "password"
        add_user(mail, password, "John", "Doe")
        result = check_login(mail, password)
        self.assertTrue(result)

    @patch('databaseManager.create_connection')
    def test_add_user_success(self, mock_create_connection):
        mock_conn = MagicMock()
        mock_create_connection.return_value = mock_conn

        result = add_user('test@example.com', 'password', 'Vorname', 'Nachname')

        mock_conn.execute.assert_called_once_with("INSERT INTO [USERS] (Mail, Password, Vorname, Nachname) VALUES (?, ?, ?, ?)", ('test@example.com', hash_password('password', "doenerguide"), 'Vorname', 'Nachname'))
        mock_conn.commit.assert_called_once()
        mock_conn.close.assert_called_once()
        self.assertTrue(result)

    @patch('databaseManager.create_connection')
    def test_add_user_failure(self, mock_create_connection):
        mock_conn = MagicMock()
        mock_conn.execute.side_effect = sqlite3.Error('Database error')
        mock_create_connection.return_value = mock_conn

        result = add_user('test@example.com', 'password', 'Vorname', 'Nachname')

        mock_conn.execute.assert_called_once_with("INSERT INTO [USERS] (Mail, Password, Vorname, Nachname) VALUES (?, ?, ?, ?)", ('test@example.com', hash_password('password', "doenerguide"), 'Vorname', 'Nachname'))
        mock_conn.close.assert_called_once()
        self.assertFalse(result)

if __name__ == '__main__':
    unittest.main()
