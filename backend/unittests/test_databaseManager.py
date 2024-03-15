import unittest
from unittest.mock import patch, MagicMock
import sqlite3
import os
import sys

abs_path = os.path.abspath(__file__)
sys.path.append(os.path.dirname(os.path.dirname(abs_path)))
from databaseManager import hash_password, verify_password, create_connection, check_login, add_user

class TestDatabaseManager(unittest.TestCase):
    """
    A test case for the databaseManager module.
    """

    def setUp(self):
        """
        Set up the test case by creating an in-memory SQLite database and a cursor.
        Create the USERS table in the database.
        """
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
        """
        Tear down the test case by dropping the USERS table and closing the database connection.
        """
        self.cursor.execute('DROP TABLE USERS')
        self.conn.close()

    def test_hash_password(self):
        """
        Test the hash_password function.
        """
        password = "password"
        salt = "doenerguide"
        hashed_password = hash_password(password, salt)
        self.assertIsNotNone(hashed_password)

    def test_verify_password(self):
        """
        Test the verify_password function.
        """
        stored_password = "7d19076002f3f2e07d294bdb6afa1dcec30137b7f99efdad30e701954bebd031"
        provided_password = "password"
        salt = "doenerguide"
        result = verify_password(stored_password, provided_password, salt)
        self.assertTrue(result)

    def test_create_connection(self):
        """
        Test the create_connection function.
        """
        conn = create_connection()
        self.assertIsNotNone(conn)

    def test_check_login(self):
        """
        Test the check_login function.
        """
        mail = "test@example.com"
        password = "password"
        add_user(mail, password, "John", "Doe")
        result = check_login(mail, password)
        self.assertTrue(result)

    @patch('databaseManager.create_connection')
    def test_add_user_success(self, mock_create_connection):
        """
        Test the add_user function when the user is successfully added to the database.
        """
        mock_conn = MagicMock()
        mock_create_connection.return_value = mock_conn

        result = add_user('test@example.com', 'password', 'Vorname', 'Nachname')

        mock_conn.execute.assert_called_once_with("INSERT INTO [USERS] (Mail, Password, Vorname, Nachname) VALUES (?, ?, ?, ?)", ('test@example.com', hash_password('password', "doenerguide"), 'Vorname', 'Nachname'))
        mock_conn.commit.assert_called_once()
        mock_conn.close.assert_called_once()
        self.assertTrue(result)

    @patch('databaseManager.create_connection')
    def test_add_user_failure(self, mock_create_connection):
        """
        Test the add_user function when an error occurs while adding the user to the database.
        """
        mock_conn = MagicMock()
        mock_conn.execute.side_effect = sqlite3.Error('Database error')
        mock_create_connection.return_value = mock_conn

        result = add_user('test@example.com', 'password', 'Vorname', 'Nachname')

        mock_conn.execute.assert_called_once_with("INSERT INTO [USERS] (Mail, Password, Vorname, Nachname) VALUES (?, ?, ?, ?)", ('test@example.com', hash_password('password', "doenerguide"), 'Vorname', 'Nachname'))
        mock_conn.close.assert_called_once()
        self.assertFalse(result)

if __name__ == '__main__':
    unittest.main()
