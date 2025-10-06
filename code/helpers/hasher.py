import hashlib

def hash_password(password):
    salt = "static_salt_12345"
    """Hash the password with a static salt."""
    return hashlib.sha256((salt + password).encode()).hexdigest()

#hasher from previous project