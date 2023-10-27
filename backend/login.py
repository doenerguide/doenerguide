import sqlite3
import json

DB_NAME = 'users.db'

# Verbindung zur SQL Database
conn = sqlite3.connect(DB_NAME)

###############################################
# NUR FUER DEBUGGING:
# Löscht die database
def clear_database():
    conn.execute("DROP TABLE IF EXISTS users")
    conn.commit()
    
clear_database()
###############################################
    
# Erstellt SQL Tabelle mit Benutzername, Passwort und Berechtigungen
def create_table():
    conn.execute('''CREATE TABLE IF NOT EXISTS users
             (username TEXT PRIMARY KEY NOT NULL,
             password TEXT NOT NULL,
             permissions TEXT NOT NULL);''')

# Überprüfung, ob User existiert
def user_exists(username):
    cursor = conn.execute("SELECT * FROM users WHERE username=?", (username,))
    row = cursor.fetchone()
    if row is None:
        return False
    else:
        return True

# Hinzufügen neuer User
def add_user(username, password, permission):
    conn.execute("INSERT INTO users (username, password, permissions) VALUES (?, ?, ?)", (username, password, permission))
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

# Überprüft Berechtigungen der User
def get_permissions(username):
    cursor = conn.execute("SELECT permissions FROM users WHERE username=?", (username,))
    row = cursor.fetchone()
    if row is None:
        return None
    else:
        return row[0]

create_table()
test_user="Max"
add_user(test_user,"pw","user")
###############################
# NUR FUER DEBUGGING:
add_user("admin","123","admin")
###############################

if user_exists(test_user):
    print("True")
    print(get_permissions(test_user))
else:
    print("False")

####################################################################
# NUR FUER DEBUGGING:
# Konvertiert .db zu .json um einen besseren Ueberblick zu behalten
def convert_to_json():
            cursor = conn.execute("SELECT * FROM users")
            rows = cursor.fetchall()
            users = []
            for row in rows:
                user = {}
                user['username'] = row[0]
                user['password'] = row[1]
                user['permissions'] = row[2]
                users.append(user)
            with open('users.json', 'w') as f:
                json.dump(users, f)

convert_to_json()
####################################################################