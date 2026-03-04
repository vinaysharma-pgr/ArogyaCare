from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)

    app.config.from_object("app.config.Config")
    app.config["JWT_SECRET_KEY"] = "super-secret-key-change-this"

    CORS(app)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt = JWTManager(app)

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app