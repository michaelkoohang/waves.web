import os
import datetime
from flask_pymongo import PyMongo, ObjectId
from flask import Flask, jsonify, request, render_template


def create_app() -> Flask:
    '''
    # Configures application and returns it.
    :return:
    '''
    application = Flask(__name__)
    application.config['DEBUG'] = os.environ.get('DEBUG')
    application.config['TESTING'] = os.environ.get('TESTING')
    application.config['FLASK_ENV'] = os.environ.get('FLASK_ENV')
    application.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    application.config['MONGO_URI'] = os.environ.get('MONGO_URI')
    return application


app = create_app()
mongo = PyMongo(app)


@app.route('/', methods=['GET'])
def root():
    user = mongo.db.users.find_one({'username': 'michael'})
    return jsonify(user)


@app.route('/rest/radar', methods=['GET'])
def root():
    return 'radar'


@app.route('/rest/friends', methods=['GET'])
def root():
    return 'friends'


# Endpoint for registering with Waves.
@app.route('/rest/register', methods=['POST'])
def register():
    data = request.get_json()
    # Check if the username and password are in the data.
    if 'username' in data:
        # Check if the username and password are not blank.
        if data['username']:
            # Grab the users collection from the Mongo database.
            users = mongo.db.users
            # Query the user with the username provided in the data.
            existing_user = users.find_one({'username': data['username']})

            # Check if the user with the username provided does not exist in the database.
            if existing_user is None:
                # Create a new hashed password.
                hashpass = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
                # Insert the new user into the database.
                users.insert({'username': data['username']})

                return jsonify({"message": "New user '" + data["username"] + "' created!"})

            return jsonify({"message": "User '" + data["username"] + "' already exists!"}), 401
        else:
            return jsonify({"message": "Username or password is blank!"}), 401
    else:
        return jsonify({"message": "Username or password field is missing from request!"}), 401


if __name__ == '__main__':
    app.run()
