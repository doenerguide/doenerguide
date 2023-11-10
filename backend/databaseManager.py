import sqlite3
import os

def create_connection():
    path = os.path.dirname(os.path.abspath(__file__))
    db_file = path + "/database.db"
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except sqlite3.Error as e:
        print(e)
    return conn

def check_login(mail, password):
    conn = create_connection()
    cursor = conn.execute("SELECT * FROM [USERS] WHERE [Mail] = ? AND [Password] = ?", (mail, password))
    data = cursor.fetchall()
    conn.close()
    if len(data) == 0:
        return False
    else:
        return True
    
def add_user(mail, password, vorname, nachname):
    conn = create_connection()
    conn.execute("INSERT INTO [USERS] (ID, Mail, Password, Vorname, Nachname) VALUES (NULL, ?, ?, ?, ?)", (mail, password, vorname, nachname))
    conn.commit()
    conn.close()