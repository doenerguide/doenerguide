import sqlite3
import os
import hashlib
import ast
import logging
import os

def hash_password(password, salt):
    password_hash = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return password_hash

def create_connection():
    db_file = os.path.dirname(__file__) + "/database.db"
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except sqlite3.Error as e:
        print(e)
    return conn

def check_login(mail, password):
    password = hash_password(password, "doenerguide")
    conn = create_connection()
    cursor = conn.execute("SELECT * FROM [USERS] WHERE [Mail] = ? AND [Password] = ?", (mail, password))
    data = cursor.fetchall()
    conn.close()
    if len(data) == 0:
        return None
    else:
        favoriten_ids = ast.literal_eval(data[0][5])
        favoriten_ids = [int(n.strip()) for n in favoriten_ids]
        favoriten = []
        for id in favoriten_ids:
            favoriten.append(get_shop(id))
        user_object = {
            'id': data[0][0],
            'mail': data[0][1],
            'vorname': data[0][3],
            'nachname': data[0][4],
            'favoriten': favoriten
        }
        return user_object
    
def add_user(mail, password, vorname, nachname, identification_code):
    password = hash_password(password, "doenerguide")
    conn = create_connection()
    try:
        conn.execute("INSERT INTO [USERS] (Mail, Password, Vorname, Nachname, Favoriten, identification_code) VALUES (?, ?, ?, ?, ?, ?)", (mail, password, vorname, nachname, str([]), identification_code))
    except sqlite3.Error as e:
        print(e)
        conn.close()
        return False
    conn.commit()
    conn.close()
    return True

def update_user_favoriten(user_id, favoriten):
    conn = create_connection()
    try:
        conn.execute("UPDATE [USERS] SET Favoriten = ? WHERE ID = ?", (str(favoriten), user_id))
    except sqlite3.Error as e:
        print(e)
        conn.close()
        return False
    conn.commit()
    conn.close()
    return True

def create_shop(name, imageURL, address, rating, priceCategory, flags, openingHours, tel, lat, long, maps_url):
    name = str(name)
    imageURL = str(imageURL)
    address = str(address)
    rating = int(rating)
    priceCategory = int(priceCategory)
    flags = str(flags)
    openingHours = str(openingHours)
    tel = str(tel)
    lat = float(lat)
    long = float(long)
    maps_url = str(maps_url)
    conn = create_connection()
    try:
        conn.execute("INSERT INTO [SHOPS] (name, imageURL, address, rating, priceCategory, flags, openingHours, tel, lat, long, maps_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (name, imageURL, address, rating, priceCategory, flags, openingHours, tel, lat, long, maps_url))
    except sqlite3.Error as e:
        conn.close()
        return "Es gab einen Fehler beim Erstellen des Shops.\n\n" + str(e)
    conn.commit()
    conn.close()
    return "Shop wurde erfolgreich erstellt."

def get_shops(lat, long, radius, price_category, flags):
    conn = create_connection()
    cursor = conn.execute("""
        SELECT *
        FROM [SHOPS]
        WHERE (
            6371 * acos (
                cos ( radians(?) )
                * cos( radians( lat ) )
                * cos( radians( long ) - radians(?) )
                + sin ( radians(?) )
                * sin( radians( lat ) )
            )
        ) <= ?
        AND (priceCategory = ? OR ? = 0)
    """, (lat, long, lat, radius, price_category, price_category))
    
    data = cursor.fetchall()
    conn.close()
    return data

def get_shop(id):
    conn = create_connection()
    cursor = conn.execute("SELECT * FROM [SHOPS] WHERE [ID] = ?", (id,))
    data = cursor.fetchall()
    conn.close()
    shop = {
        'id': data[0][0],
        'name': data[0][1],
        'imageURL': data[0][2],
        'address': data[0][3],
        'rating': data[0][4],
        'priceCategory': data[0][5],
        'flags': {
            'acceptCard': 'Kartenzahlung' in data[0][6],
            'stampCard': 'Stempelkarte' in data[0][6],
        },
        'openingHours': data[0][7],
        'lat': data[0][8],
        'long': data[0][9]
    }
    return shop


def create_session(hashed_session_id, email):
    conn = create_connection()
    try:
        conn.execute("INSERT INTO [SESSIONS] (SessionID, Mail) VALUES (?, ?)", (hashed_session_id, email))
    except sqlite3.Error as e:
        print(e)
        conn.close()
        return False
    conn.commit()
    conn.close()
    return True

def get_user_by_session_id(session_id):
    conn = create_connection()
    cursor = conn.execute("SELECT * FROM [SESSIONS] WHERE [SessionID] = ?", (session_id,))
    data = cursor.fetchall()
    conn.close()
    if len(data) == 0:
        return None
    else:
        user = get_user_data(data[0][1])
        return user
    
def get_user_data(mail):
    conn = create_connection()
    cursor = conn.execute("SELECT * FROM [USERS] WHERE [Mail] = ?", (mail,))
    data = cursor.fetchall()
    conn.close()
    if len(data) == 0:
        return None
    else:
        favoriten_ids = ast.literal_eval(data[0][5])
        favoriten_ids = [int(n.strip()) for n in favoriten_ids]
        favoriten = []
        for id in favoriten_ids:
            favoriten.append(get_shop(id))
        user_object = {
            'id': data[0][0],
            'mail': data[0][1],
            'vorname': data[0][3],
            'nachname': data[0][4],
            'favoriten': favoriten,
            'identification_code': data[0][6]
        }
        return user_object