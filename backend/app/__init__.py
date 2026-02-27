from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS

db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)

    app.config.from_object("app.config.Config")

    CORS(app)

    db.init_app(app)
    bcrypt.init_app(app)

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app