from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user, get_current_user_optional
from app.models.user import User
from app.models.community_message import CommunityMessage
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class MessageCreate(BaseModel):
    message: str
    channel: str
    parent_id: Optional[int] = None

class MessageResponse(BaseModel):
    id: int
    user_id: int
    username: str
    message: str
    channel: str
    timestamp: datetime
    reactions: dict
    is_helpful: bool
    parent_id: Optional[int] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True

@router.post("/community/send", response_model=dict)
async def send_message(
    msg: MessageCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    new_msg = CommunityMessage(
        user_id=current_user.id,
        username=current_user.full_name,
        message=msg.message,
        channel=msg.channel,
        parent_id=msg.parent_id
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return {"success": True, "message_id": new_msg.id}

@router.get("/community/messages/{channel}", response_model=List[MessageResponse])
async def get_messages(channel: str, db: Session = Depends(get_db)):
    messages = db.query(CommunityMessage).filter(
        CommunityMessage.channel == channel
    ).order_by(CommunityMessage.timestamp.asc()).all()
    
    # Enrich with avatar_url
    results = []
    for m in messages:
        res = MessageResponse.from_orm(m)
        if m.user:
            res.avatar_url = m.user.avatar_url
        results.append(res)
        
    return results

@router.post("/community/react", response_model=dict)
async def react_to_message(
    react_data: dict, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    msg_id = react_data.get("message_id")
    reaction_type = react_data.get("type") # e.g., 'thumbs_up', 'heart', 'fire'
    
    msg = db.query(CommunityMessage).filter(CommunityMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    
    reactions = dict(msg.reactions) if msg.reactions else {"thumbs_up": 0, "heart": 0, "fire": 0}
    if reaction_type in reactions:
        reactions[reaction_type] += 1
    
    msg.reactions = reactions
    db.commit()
    return {"success": True, "reactions": reactions}
