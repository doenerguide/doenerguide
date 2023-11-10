import flask
from flask import request, jsonify
from flask_cors import CORS
import databaseManager as dbm

app = flask.Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    username = body['username']
    password = body['password']
    if dbm.check_login(username, password):
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})
    
@app.route('/register', methods=['POST'])
def register():
    body = request.get_json()
    username = body['username']
    password = body['password']
    vorname = body['vorname']
    nachname = body['nachname']
    if dbm.add_user(username, password, vorname, nachname):
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')