from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models import db, User, Event, Ticket

tickets_bp = Blueprint('tickets', __name__)

def get_current_user():
    """Helper function to get current authenticated user"""
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)

@tickets_bp.route('/', methods=['POST'])  
@jwt_required()
def create_ticket():
    """Register for an event (create ticket)"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        event_id = data.get('event_id')
        
        if not event_id:
            return jsonify({'error': 'Event ID is required'}), 400
        
        # Checks if event exists
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Checks if user already has a ticket for this event
        existing_ticket = Ticket.query.filter_by(
            user_id=current_user.id,
            event_id=event_id
        ).first()
        
        if existing_ticket:
            return jsonify({'error': 'You already have a ticket for this event'}), 400
        
        # Creates ticket based on event price
        if event.price == 0:
            # Free event - auto confirm
            ticket = Ticket(
                user_id=current_user.id,
                event_id=event_id,
                status='confirmed',
                payment_status='free'
            )
        else:
            # Paid event - pending until payment
            ticket = Ticket(
                user_id=current_user.id,
                event_id=event_id,
                status='pending',
                payment_status='unpaid'
            )
        
        db.session.add(ticket)
        db.session.commit()
        
        return jsonify({
            'message': 'Ticket created successfully',
            'ticket': ticket.to_dict(include_relations=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create ticket'}), 500

@tickets_bp.route('/<int:ticket_id>/confirm', methods=['PATCH'])
@jwt_required()
def confirm_ticket(ticket_id):
    """Confirm ticket payment"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        # Checks if user owns the ticket
        if ticket.user_id != current_user.id:
            return jsonify({'error': 'Not authorized to confirm this ticket'}), 403
        
        # Updates ticket status
        ticket.status = 'confirmed'
        ticket.payment_status = 'paid'
        ticket.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Ticket confirmed successfully',
            'ticket': ticket.to_dict(include_relations=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to confirm ticket'}), 500

@tickets_bp.route('/<int:ticket_id>/cancel', methods=['PATCH'])
@jwt_required()
def cancel_ticket(ticket_id):
    """Cancel a ticket (user or organizer can cancel)"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        # Checks if user owns the ticket or is the event organizer
        if ticket.user_id != current_user.id and ticket.event.creator_id != current_user.id:
            return jsonify({'error': 'Not authorized to cancel this ticket'}), 403
        
        # Updates ticket status
        ticket.status = 'canceled'
        if ticket.payment_status == 'paid':
            ticket.payment_status = 'refunded'
        ticket.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Ticket canceled successfully',
            'ticket': ticket.to_dict(include_relations=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to cancel ticket'}), 500

@tickets_bp.route('/my', methods=['GET'])  
@jwt_required()
def get_my_tickets():
    """Get current user's tickets"""
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        tickets = Ticket.query.filter_by(user_id=current_user.id).all()
        
        return jsonify({
            'tickets': [ticket.to_dict(include_relations=True) for ticket in tickets]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch tickets'}), 500