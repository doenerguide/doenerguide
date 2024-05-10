import flask
from flask import request, jsonify
from flask_cors import CORS
import databaseManager as dbm
import os
import hashlib

app = flask.Flask(__name__)
CORS(app, resources={r'/login': {"origins": "*"}, r'/signup': {"origins": "*"}, r'/getShops': {"origins": "*"}, r'/getShop': {"origins": "*"}, r'/updateFavoriten': {"origins": "*"}, r'/getUserBySession': {"origins": "*"}, r'/updateUser': {"origins": "*"}, r'/updateUserPassword': {"origins": "*"}, r'/addUserStamp': {"origins": "*"}, r'/getUserStamps': {"origins": "*"}, r'/removeUserStamps': {"origins": "*"}})

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
        session_id = create_session(email)
        return jsonify({'success': True, 'user': user, 'session_id': session_id})
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
    if dbm.get_user_data(email) is not None:
        return jsonify({'success': False})
    if dbm.add_user(email, password, vorname, nachname, hashed_identification_code):
        session_id = create_session(email)
        user = dbm.get_user_data(email)
        return jsonify({'success': True, 'user': user, 'session_id': session_id})
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
    
@app.route('/getUserBySession', methods=['GET'])
def get_user_by_session():
    """
    Retrieves the user information based on the provided session ID.

    Parameters:
    - session_id (str): The session ID of the user.

    Returns:
    - dict: The user information.
    """
    session_id = request.args.get('session_id')
    user = dbm.get_user_by_session_id(session_id)
    if user:
        return {'success': True, 'user': user}
    else:
        return {'success': False}
    
@app.route('/updateUser', methods=['POST'])
def update_user():
    """
    Updates the user information.

    Retrieves the user ID and the updated user information from the request body and updates the user information in the database.

    Returns:
        A JSON response indicating the success of the operation.
    """
    body = request.get_json()
    user_id = body['id']
    vorname = body['vorname']
    nachname = body['nachname']
    email = body['mail']
    if dbm.update_user(user_id, vorname, nachname, email):
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})

@app.route('/updateUserPassword', methods=['POST'])
def update_password():
    """
    Updates the user password.

    Retrieves the user ID and the updated password from the request body and updates the user password in the database.

    Returns:
        A JSON response indicating the success of the operation.
    """
    body = request.get_json()
    user_id = body['id']
    old_password = body['old_password']
    new_password = body['new_password']
    if dbm.update_user_password(user_id, old_password, new_password):
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})
    
@app.route('/addUserStamp', methods=['POST'])
def add_user_stamp():
    """
    Adds a stamp to the user's stamp card.

    Retrieves the user ID and the shop ID from the request body and adds a stamp to the user's stamp card in the database.

    Returns:
        A JSON response indicating the success of the operation.
    """
    body = request.get_json()
    identification_code = body['identification_code']
    shop_id = body['shop_id']
    amount = dbm.get_user_stamps(identification_code, shop_id)
    if amount >= 10:
        return jsonify({'success': False, 'message': 'Stempelkarte ist bereits voll.'})
    if dbm.add_user_stamp(identification_code, shop_id):
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Stempel konnte nicht hinzugefügt werden.'})
    
@app.route('/getUserStamps', methods=['GET'])
def get_user_stamps():
    """
    Retrieves the user's stamp card for a specific shop.

    Parameters:
    - identification_code (str): The identification code of the user.
    - shop_id (int): The ID of the shop.

    Returns:
    - int: The number of stamps on the user's stamp card for the specified shop.
    """
    identification_code = request.args.get('identification_code')
    shop_id = int(request.args.get('shop_id'))
    amount = dbm.get_user_stamps(identification_code, shop_id)
    return jsonify({'amount': amount})

@app.route('/removeUserStamps', methods=['POST'])
def remove_user_stamps():
    """
    Removes all stamps from the user's stamp card for a specific shop.

    Retrieves the user ID and the shop ID from the request body and removes all stamps from the user's stamp card for the specified shop in the database.

    Returns:
        A JSON response indicating the success of the operation.
    """
    body = request.get_json()
    identification_code = body['identification_code']
    shop_id = body['shop_id']
    if dbm.remove_user_stamps(identification_code, shop_id):
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Stempel konnten nicht entfernt werden.'})

    


def create_session(email):
    """
    Creates a new session in the database.

    Returns:
        str: The session ID.
    """
    session_id = create_identification_code()
    hashed_session_id = hash_string(session_id)
    dbm.create_session(hashed_session_id, email)
    return hashed_session_id
    
if __name__ == '__main__':
    print("Running backend server of DönerGuide...")
    app.run(debug=True, host='0.0.0.0', port=8000)