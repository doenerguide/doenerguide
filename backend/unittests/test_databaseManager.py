import unittest
from unittest.mock import patch, MagicMock
import sqlite3
import os
import sys
import hashlib

abs_path = os.path.abspath(__file__)
sys.path.append(os.path.dirname(os.path.dirname(abs_path)))
from databaseManager import hash_password, create_connection, check_login, add_user


def create_identification_code():
    return "ddd8f41be4b46cbaf6102ddc6bf9e89da885aac480884480c7d504c73c8ef6e6"

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
                Nachname TEXT,
                Favoriten TEXT
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
        identification_code = create_identification_code()
        add_user(mail, password, "John", "Doe", identification_code)
        result = check_login(mail, password)
        self.assertTrue(result)

    @patch('databaseManager.create_connection')
    def test_add_user_success(self, mock_create_connection):
        """
        Test the add_user function when the user is successfully added to the database.
        """
        mock_conn = MagicMock()
        mock_create_connection.return_value = mock_conn
        identification_code = create_identification_code()

        result = add_user('test@example.com', 'password', 'Vorname', 'Nachname', identification_code)

        mock_conn.execute.assert_called_once_with("INSERT INTO [USERS] (Mail, Password, Vorname, Nachname, Favoriten, identification_code) VALUES (?, ?, ?, ?, ?, ?)", ('test@example.com', hash_password('password', "doenerguide"), 'Vorname', 'Nachname', str([]), create_identification_code()))
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
        identification_code = create_identification_code()

        result = add_user('test@example.com', 'password', 'Vorname', 'Nachname', identification_code)

        mock_conn.execute.assert_called_once_with("INSERT INTO [USERS] (Mail, Password, Vorname, Nachname, Favoriten, identification_code) VALUES (?, ?, ?, ?, ?, ?)", ('test@example.com', hash_password('password', "doenerguide"), 'Vorname', 'Nachname', str([]), create_identification_code()))
        mock_conn.close.assert_called_once()
        self.assertFalse(result)

if __name__ == '__main__':
    unittest.main()
