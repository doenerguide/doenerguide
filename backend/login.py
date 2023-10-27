import sqlite3
import json

# Verbindung zur SQL Database
conn = sqlite3.connect('users.db')

# Erstellt SQL Tabelle
conn.execute('''CREATE TABLE IF NOT EXISTS users
             (username TEXT PRIMARY KEY NOT NULL,
             password TEXT NOT NULL);''')

# Überprüfung, ob User existiert
def user_exists(username):
    cursor = conn.execute("SELECT * FROM users WHERE username=?", (username,))
    row = cursor.fetchone()
    if row is None:
        return False
    else:
        return True

# Hinzufügen neuer User
def add_user(username, password):
    conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
    conn.commit()
    
# Entfernen von Usern
def remove_user(username):
    conn.execute("DELETE FROM users WHERE username=?", (username,))
    conn.commit()

# Login von Usern
def authenticate(username, password):
    cursor = conn.execute("SELECT * FROM users WHERE username=?", (username,))
    row = cursor.fetchone()
    if row is None:
        return False
    else:
        if row[1] == password:
            return True
        else:
            return False
