import os

from datetime import timedelta

class Config:

    # Database configuration

    SQLALCHEMY_DATABASE_URI = 'sqlite:///events.db'

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    

    # JWT configuration

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'your-secret-key-change-in-production'

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    

    # Other configurations

    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key'

    

class DevelopmentConfig(Config):

    DEBUG = True

class ProductionConfig(Config):

    DEBUG = False

config = {

    'development': DevelopmentConfig,

    'production': ProductionConfig,

    'default': DevelopmentConfig

}

