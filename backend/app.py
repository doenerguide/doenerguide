import flask
from flask import request, jsonify
from flask_cors import CORS
import databaseManager as dbm

app = flask.Flask(__name__)
CORS(app, resources={r'/login': {"origins": "*"}, r'/signup': {"origins": "*"}, r'/getShops': {"origins": "*"}})


@app.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body['email'].lower()
    password = body['password']
    if dbm.check_login(email, password):
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})
    
@app.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    email = body['email'].lower()
    password = body['password']
    vorname = body['vorname']
    nachname = body['nachname']
    if dbm.add_user(email, password, vorname, nachname):
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})
    

@app.route('/getShops', methods=['GET'])
def getShops():
    lat = float(request.args.get('lat').replace('"', ''))
    long = float(request.args.get('long').replace('"', ''))
    radius = float(request.args.get('radius'))
    price_category = int(request.args.get('price_category'.replace('"', '')))
    flags = request.args.get('flags')
    return jsonify(dbm.get_shops(lat, long, radius, price_category, flags))
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5050)