import sqlite3
import os
import hashlib
import logging

def hash_password(password, salt):
    password_hash = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return password_hash

def create_connection():
    path = os.path.dirname(os.path.abspath(__file__))
    db_file = path + "/database.db"
    logging.debug("Using database file: " + db_file)
    print("Using database file: " + db_file)
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
        return False
    else:
        return True
    
def add_user(mail, password, vorname, nachname):
    password = hash_password(password, "doenerguide")
    conn = create_connection()
    try:
        conn.execute("INSERT INTO [USERS] (Mail, Password, Vorname, Nachname) VALUES (?, ?, ?, ?)", (mail, password, vorname, nachname))
    except sqlite3.Error as e:
        print(e)
        conn.close()
        return False
    conn.commit()
    conn.close()
    return True

def create_shop(name, image_url, address, price_category, opening_hours, flags, lat, long):
    name = str(name)
    image_url = str(image_url)
    address = str(address)
    price_category = int(price_category)
    opening_hours = str(opening_hours)
    flags = str(flags)
    lat = int(lat*10**6)
    long = int(long*10**6)
    conn = create_connection()
    try:
        conn.execute("INSERT INTO [SHOPS] (name, imageURL, address, priceCategory, openingHours, flags, lat, long) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (name, image_url, address, price_category, opening_hours, flags, lat, long))
    except sqlite3.Error as e:
        conn.close()
        return "Es gab einen Fehler beim Erstellen des Shops.\n\n" + str(e)
    conn.commit()
    conn.close()
    return "Shop wurde erfolgreich erstellt."

def get_shops(lat, long, radius, price_category, flags):
    lat = int(lat*10**6)
    long = int(long*10**6)
    radius = int(radius/111*10**6)
    if radius == 0:
        radius = 0.09/111*10**6
    conn = create_connection()
    cursor = conn.execute("SELECT * FROM [SHOPS] WHERE [lat] BETWEEN ? AND ? AND [long] BETWEEN ? AND ?", (lat - radius, lat + radius, long - radius, long + radius))
    data = cursor.fetchall()
    print(data)
    conn.close()
    return data