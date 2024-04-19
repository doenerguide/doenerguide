import flask
from flask import request, jsonify
from flask_cors import CORS
import databaseManager as dbm
import os
import hashlib

app = flask.Flask(__name__)
CORS(app, resources={r'/login': {"origins": "*"}, r'/signup': {"origins": "*"}, r'/getShops': {"origins": "*"}, r'/getShop': {"origins": "*"}, r'/updateFavoriten': {"origins": "*"}})

def hash_string(s):
    """
    Hashes a string using the SHA-256 algorithm.

    Parameters:
    - s (str): The string to be hashed.

    Returns:
    - str: The hashed string.
    """
    return hashlib.sha256(s.encode()).hexdigest()

def create_identification_code():
    """
    Creates a random identification code.

    Returns:
        str: A random identification code.
    """
    return os.urandom(16).hex()



@app.route('/login', methods=['POST'])
def login():
    """
    Handles the login functionality.

    Retrieves the email and password from the request body and checks if the login credentials are valid.
    If the login is successful, returns a JSON response with {'success': True}.
    If the login fails, returns a JSON response with {'success': False}.

    Returns:
        A JSON response indicating the success or failure of the login attempt.
    """
    body = request.get_json()
    email = body['email'].lower()
    password = body['password']
    if user := dbm.check_login(email, password):
        return jsonify({'success': True, 'user': user})
    else:
        return jsonify({'success': False})
    
@app.route('/signup', methods=['POST'])
def signup():
    """
    Sign up a new user.

    This function handles the POST request to the '/signup' endpoint and creates a new user in the database.

    Returns:
        A JSON response indicating the success of the operation.
    """
    body = request.get_json()
    email = body['email'].lower()
    password = body['password']
    vorname = body['vorname']
    nachname = body['nachname']
    identification_code = create_identification_code()
    hashed_identification_code = hash_string(identification_code)
    if dbm.add_user(email, password, vorname, nachname, hashed_identification_code):
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})
    

@app.route('/getShops', methods=['GET'])
def get_shops():
    """
    Retrieves a list of shops based on the provided latitude, longitude, radius, price category, and flags.

    Parameters:
    - lat (float): The latitude of the location.
    - long (float): The longitude of the location.
    - radius (float): The search radius in kilometers.
    - price_category (int): The price category of the shops.
    - flags (str): Additional flags for filtering the shops.

    Returns:
    - list: A list of shops matching the provided criteria.
    """
    lat = float(request.args.get('lat').replace('"', ''))
    long = float(request.args.get('long').replace('"', ''))
    radius = float(request.args.get('radius'))
    price_category = int(request.args.get('price_category'.replace('"', '')))
    flags = request.args.get('flags')
    return jsonify(dbm.get_shops(lat, long, radius, price_category, flags))

@app.route('/getShop', methods=['GET'])
def get_shop():
    """
    Retrieves a shop based on the provided shop ID.

    Parameters:
    - shop_id (int): The ID of the shop.

    Returns:
    - dict: The shop matching the provided ID.
    """
    shop_id = int(request.args.get('id'))
    return jsonify(dbm.get_shop(shop_id))


@app.route('/updateFavoriten', methods=['POST'])
def update_favoriten():
    """
    Updates the favoriten list of a user.

    Retrieves the user ID and the updated favoriten list from the request body and updates the user's favoriten list in the database.

    Returns:
        A JSON response indicating the success of the operation.
    """
    body = request.get_json()
    user_id = body['user_id']
    favoriten = body['favoriten']
    if dbm.update_user_favoriten(user_id, favoriten):
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})
    
if __name__ == '__main__':
    print("Running backend server of DönerGuide...")
    app.run(debug=True, host='0.0.0.0', port=8000)