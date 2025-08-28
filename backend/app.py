from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os

from models import db
from config import config  

from routes.auth import auth_bp
from routes.events import events_bp
from routes.tickets import tickets_bp


def create_app(config_name=None):
    """Factory function to create the Flask app"""
    app = Flask(__name__)

    config_name = config_name or os.environ.get('FLASK_ENV', 'development')
    app.config.from_object(config[config_name])

    # Initializations
    db.init_app(app)    
    migrate = Migrate(app, db)  
    CORS(app)               
    jwt = JWTManager(app)    

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(events_bp, url_prefix="/events")
    app.register_blueprint(tickets_bp, url_prefix="/tickets")

    # Default landing page
    @app.route('/')
    def index():
        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Events API</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                h1 { color: #333; }
                p { color: #666; }
                ul { text-align: left; display: inline-block; }
            </style>
        </head>
        <body>
            <h1>Welcome to the Events API!</h1>
            <p>Available endpoints:</p>
            <ul>
                <li>Auth: /auth/signup, /auth/login</li>
                <li>Events: /events (GET/POST), /events/&lt;id&gt; (GET/PATCH/DELETE)</li>
                <li>Tickets: /tickets (POST), /tickets/&lt;id&gt;/confirm, /tickets/&lt;id&gt;/cancel, /tickets/my</li>
            </ul>
        </body>
        </html>
        """

    # Health to check endpoints
    @app.route('/health', methods=['GET'])
    def health_check():
        """Simple endpoint to check if the API is running"""
        return jsonify({
            'status': 'healthy',
            'message': 'Events API is running fine!'
        }), 200

    # Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        """Handle non-existing routes"""
        return jsonify({'error': 'Endpoint not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        """Handle internal server errors gracefully"""
        db.session.rollback()  
        return jsonify({'error': 'Internal server error'}), 500

    return app


if __name__ == "__main__":
    app = create_app()

    print("🚀 Starting Events API server...")
    print("📊 API Endpoints:")
    print("   AUTH: /auth/signup, /auth/login")
    print("   EVENTS: /events (GET/POST), /events/<id> (GET/PATCH/DELETE)")
    print("   TICKETS: /tickets (POST), /tickets/<id>/confirm, /tickets/<id>/cancel, /tickets/my")
    print("   HEALTH: /health")

    app.run(debug=True, port=5000)






