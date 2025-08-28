# seed.py
from app import create_app, db
from models import User, Event
from datetime import datetime

app = create_app()

with app.app_context():
    # Drop and recreate all tables (optional if starting fresh)
    db.drop_all()
    db.create_all()

    # Users
    users = [
        User(username="Alice", email="alice@example.com"),
        User(username="Bob", email="bob@example.com")
    ]
    users[0].set_password("password1")
    users[1].set_password("password2")
    db.session.add_all(users)
    db.session.commit()

    # Events
    events = [
        Event(
            title="Tech Conference",
            description="Annual tech meetup",
            date=datetime(2025, 9, 1),
            location="Nairobi",
            price=500,
            creator_id=users[0].id
        ),
        Event(
            title="Music Festival",
            description="Outdoor live music",
            date=datetime(2025, 10, 10),
            location="Mombasa",
            price=1000,
            creator_id=users[1].id
        )
    ]
    db.session.add_all(events)
    db.session.commit()

    print("✅ Seed data inserted successfully!")