from app.email_utils import send_verification_email
from flask import Blueprint, request, jsonify
from app.models import User
from app import db
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from datetime import datetime, timedelta
import secrets

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()


# SIGNUP
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    verification_token = secrets.token_hex(32)

    new_user = User(
        name=name,
        email=email,
        password=hashed_password,
        verification_token=verification_token
    )

    db.session.add(new_user)
    db.session.commit()

    verify_link = f"http://localhost:5173/verify/{verification_token}"
    
    send_verification_email(email,verify_link)

    return jsonify({
        "message": "Signup successful. Please check your email to verify your account.",
    }), 201


# VERIFY EMAIL
@auth_bp.route("/verify-email/<token>", methods=["GET"])
def verify_email(token):

    user = User.query.filter_by(verification_token=token).first()

    if not user:
        return jsonify({"message": "Invalid verification token"}), 400

    user.is_verified = True
    user.verification_token = None

    db.session.commit()

    return jsonify({"message": "Email verified successfully"})


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if not user.is_verified:
        return jsonify({"message": "Please verify your email first"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid password"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({
        "message": "Login successful",
        "token": token
    })


# FORGOT PASSWORD
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()

    email = data.get("email")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    token = secrets.token_hex(32)

    user.reset_token = token
    user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=15)

    db.session.commit()

    reset_link = f"http://localhost:5173/reset-password/{token}"

    return jsonify({"reset_link": reset_link})


# RESET PASSWORD
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()

    token = data.get("token")
    new_password = data.get("newPassword")

    user = User.query.filter_by(reset_token=token).first()

    if not user:
        return jsonify({"message": "Invalid token"}), 400

    if user.reset_token_expiry < datetime.utcnow():
        return jsonify({"message": "Token expired"}), 400

    hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")

    user.password = hashed_password
    user.reset_token = None
    user.reset_token_expiry = None

    db.session.commit()

    return jsonify({"message": "Password reset successful"})