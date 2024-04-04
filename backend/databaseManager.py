import sqlite3
import os
import hashlib
import ast
import logging

def hash_password(password, salt):
    password_hash = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return password_hash

def create_connection():
    db_file = "/backend/database.db"
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
    
def add_user(mail, password, vorname, nachname):
    password = hash_password(password, "doenerguide")
    conn = create_connection()
    try:
        conn.execute("INSERT INTO [USERS] (Mail, Password, Vorname, Nachname, Favoriten) VALUES (?, ?, ?, ?, ?)", (mail, password, vorname, nachname, str([])))
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

def create_shop(name, imageURL, address, rating, priceCategory, flags, openingHours, tel, lat, long):
    name = str(name)
    imageURL = str(imageURL)
    address = str(address)
    rating = int(rating)
    priceCategory = int(priceCategory)
    flags = str(flags)
    openingHours = str(openingHours)
    tel = str(tel)
    lat = int(lat*10**6)
    long = int(long*10**6)
    conn = create_connection()
    try:
        conn.execute("INSERT INTO [SHOPS] (name, imageURL, address, rating, priceCategory, flags, openingHours, tel, lat, long) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (name, imageURL, address, rating, priceCategory, flags, openingHours, tel, lat, long))
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