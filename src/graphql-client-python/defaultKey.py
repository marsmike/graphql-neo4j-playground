#!/usr/bin/env python3
import secrets

# Generate a 64-character hexadecimal secret key
default_secret_key = secrets.token_hex(32)
print("Your default secret key is:")
print(default_secret_key)