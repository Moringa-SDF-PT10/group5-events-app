from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models import db, User, Event, Ticket

tickets_bp = Blueprint('tickets', __name__)

def get_current_user():
    return User.query.get(get_jwt_identity())

@tickets_bp.route('/', methods=['POST'])
@jwt_required()
def create_ticket():
    current_user = get_current_user()
    data = request.get_json()
    event_id = data.get('event_id')
    if not event_id: return jsonify({'error':'Event ID required'}),400
    event = Event.query.get(event_id)
    if not event: return jsonify({'error':'Event not found'}),404
    existing = Ticket.query.filter_by(user_id=current_user.id, event_id=event_id).first()
    if existing: return jsonify({'error':'Ticket already exists'}),400
    ticket = Ticket(user_id=current_user.id, event_id=event_id, status='confirmed' if event.price==0 else 'pending', payment_status='free' if event.price==0 else 'unpaid')
    db.session.add(ticket)
    db.session.commit()
    return jsonify({'message':'Ticket created','ticket':ticket.to_dict(include_relations=True)}),201

@tickets_bp.route('/<int:ticket_id>/confirm', methods=['PATCH'])
@jwt_required()
def confirm_ticket(ticket_id):
    current_user = get_current_user()
    ticket = Ticket.query.get(ticket_id)
    if not ticket: return jsonify({'error':'Ticket not found'}),404
    if ticket.user_id != current_user.id: return jsonify({'error':'Not authorized'}),403
    ticket.status='confirmed'
    ticket.payment_status='paid'
    ticket.updated_at=datetime.utcnow()
    db.session.commit()
    return jsonify({'message':'Ticket confirmed','ticket':ticket.to_dict(include_relations=True)}),200

@tickets_bp.route('/<int:ticket_id>/cancel', methods=['PATCH'])
@jwt_required()
def cancel_ticket(ticket_id):
    current_user = get_current_user()
    ticket = Ticket.query.get(ticket_id)
    if not ticket: return jsonify({'error':'Ticket not found'}),404
    if ticket.user_id!=current_user.id and ticket.event.creator_id!=current_user.id: return jsonify({'error':'Not authorized'}),403
    ticket.status='canceled'
    if ticket.payment_status=='paid': ticket.payment_status='refunded'
    ticket.updated_at=datetime.utcnow()
    db.session.commit()
    return jsonify({'message':'Ticket canceled','ticket':ticket.to_dict(include_relations=True)}),200

@tickets_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_tickets():
    current_user = get_current_user()
    tickets = Ticket.query.filter_by(user_id=current_user.id).all()
    return jsonify({'tickets':[t.to_dict(include_relations=True) for t in tickets]}),200



