#!/usr/bin/env python3
import os
import jwt  # PyJWT is used for encoding and decoding JWT tokens
import datetime

# Load the SECRET_KEY from an environment variable or a default
SECRET_KEY = os.getenv('SECRET_KEY', 'defaultSecretKey')

def generate_auth_token():
    # Define the payload of the token
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),  # Token expires in 1 day
        'iat': datetime.datetime.utcnow(),  # Issued at
        # You can add more claims here if needed
    }

    # Encode the payload using the SECRET_KEY
    # Note: jwt.encode() returns a string in PyJWT version 2.0.0 and above
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return token

if __name__ == "__main__":
    token = generate_auth_token()
    print("Generated AUTH_TOKEN:")
    print(token)