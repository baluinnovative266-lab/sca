from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class CommunityMessage(Base):
    __tablename__ = "community_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    username = Column(String(100))
    message = Column(Text)
    channel = Column(String(50), index=True) # e.g., 'general', 'ml', 'web-dev'
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Social features
    reactions = Column(JSON, default=lambda: {"thumbs_up": 0, "heart": 0, "fire": 0})
    is_helpful = Column(Boolean, default=False)
    parent_id = Column(Integer, ForeignKey("community_messages.id"), nullable=True) # For threading

    user = relationship("User", back_populates="community_messages")
    replies = relationship("CommunityMessage", back_populates="parent")
    parent = relationship("CommunityMessage", remote_side=[id], back_populates="replies")

# Update User model to include relationship (will do in separate step)
