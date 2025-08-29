from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models import db, User, Event

events_bp = Blueprint('events', __name__)

def get_current_user():
    return User.query.get(get_jwt_identity())

@events_bp.route('/', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify({'events': [e.to_dict(include_creator=True) for e in events]}), 200

@events_bp.route('/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    return jsonify({'event': event.to_dict(include_creator=True)}), 200

@events_bp.route('', methods=['POST'])
@jwt_required()
def create_event():
    current_user = get_current_user()
    data = request.get_json()
    required_fields = ['title', 'date', 'location']
    for f in required_fields:
        if not data.get(f):
            return jsonify({'error': f'{f} required'}), 400
    try:
        event_date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
    except:
        return jsonify({'error': 'Invalid date format'}), 400
    price = data.get('price', 0)
    event = Event(title=data['title'], description=data.get('description',''), date=event_date, location=data['location'], price=price, creator_id=current_user.id)
    db.session.add(event)
    db.session.commit()
    return jsonify({'message': 'Event created', 'event': event.to_dict(include_creator=True)}), 201

@events_bp.route('/<int:event_id>', methods=['PATCH'])
@jwt_required()
def update_event(event_id):
    current_user = get_current_user()
    event = Event.query.get(event_id)
    if not event: return jsonify({'error':'Event not found'}),404
    if event.creator_id != current_user.id: return jsonify({'error':'Not authorized'}),403
    data = request.get_json()
    for field in ['title','description','date','location','price']:
        if field in data:
            if field=='date':
                try: event.date=datetime.fromisoformat(data['date'].replace('Z','+00:00'))
                except: return jsonify({'error':'Invalid date format'}),400
            else:
                setattr(event,field,data[field])
    db.session.commit()
    return jsonify({'message':'Event updated','event':event.to_dict(include_creator=True)}),200

@events_bp.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    current_user = get_current_user()
    event = Event.query.get(event_id)
    if not event: return jsonify({'error':'Event not found'}),404
    if event.creator_id != current_user.id: return jsonify({'error':'Not authorized'}),403
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message':'Event deleted'}),200


