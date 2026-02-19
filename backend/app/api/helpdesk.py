from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.helpdesk import HelpDeskTicket
from app.models.api_schemas import HelpDeskTicketCreate
from datetime import datetime

router = APIRouter()

@router.post("/ticket")
def create_ticket(ticket_in: HelpDeskTicketCreate, db: Session = Depends(get_db)):
    try:
        new_ticket = HelpDeskTicket(
            name=ticket_in.name,
            email=ticket_in.email,
            issue_type=ticket_in.issue_type,
            description=ticket_in.description,
            timestamp=datetime.utcnow()
        )
        db.add(new_ticket)
        db.commit()
        db.refresh(new_ticket)
        
        # Simulate email notification
        print(f"NOTIFICATION: Support ticket created by {ticket_in.email}")
        print(f"Subject: New {ticket_in.issue_type} Report - {ticket_in.name}")
        
        return {"success": True, "message": "Your issue has been submitted successfully.", "ticket_id": new_ticket.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
