from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models import db, User, Event

events_bp = Blueprint('events', __name__)

def get_current_user():
    """Helper function to get current authenticated user"""
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)

@events_bp.route('/', methods=['GET'])  
def get_events():
    """Get all events"""
    try:
        events = Event.query.all()
        return jsonify({
            'events': [event.to_dict(include_creator=True) for event in events]
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch events'}), 500

@events_bp.route('/<int:event_id>', methods=['GET'])  
def get_event(event_id):
    """Get a single event by ID"""
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        return jsonify({
            'event': event.to_dict(include_creator=True)
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch event'}), 500

@events_bp.route('/', methods=['POST']) 
@jwt_required()
def create_event():
    """Create a new event (authenticated users only)"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validation
        required_fields = ['title', 'date', 'location']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field.capitalize()} is required'}), 400
        
        # Parse date
        try:
            event_date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
        
        # Validates price
        price = data.get('price', 0)
        if not isinstance(price, (int, float)) or price < 0:
            return jsonify({'error': 'Price must be a number >= 0'}), 400
        
        # Creates event
        event = Event(
            title=data['title'],
            description=data.get('description', ''),
            date=event_date,
            location=data['location'],
            price=price,
            creator_id=current_user.id
        )
        
        db.session.add(event)
        db.session.commit()
        
        return jsonify({
            'message': 'Event created successfully',
            'event': event.to_dict(include_creator=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create event'}), 500

@events_bp.route('/<int:event_id>', methods=['PATCH'])
@jwt_required()
def update_event(event_id):
    """Update an event (only by creator)"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Check if user is the creator
        if event.creator_id != current_user.id:
            return jsonify({'error': 'Not authorized to update this event'}), 403
        
        data = request.get_json()
        
        # Update fields if provided
        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'date' in data:
            try:
                event.date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid date format'}), 400
        if 'location' in data:
            event.location = data['location']
        if 'price' in data:
            price = data['price']
            if not isinstance(price, (int, float)) or price < 0:
                return jsonify({'error': 'Price must be a number >= 0'}), 400
            event.price = price
        
        db.session.commit()
        
        return jsonify({
            'message': 'Event updated successfully',
            'event': event.to_dict(include_creator=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update event'}), 500

@events_bp.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    """Delete an event (only by creator)"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Check if user is the creator
        if event.creator_id != current_user.id:
            return jsonify({'error': 'Not authorized to delete this event'}), 403
        
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({'message': 'Event deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete event'}), 500