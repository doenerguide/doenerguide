import flask
from flask import request, jsonify
from flask_cors import CORS
import databaseManager as dbm

app = flask.Flask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}})


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
        return jsonify({'success': False, "error": "Mail already exists"})
    
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')