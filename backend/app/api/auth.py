from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.core.database import get_db
from app.models.user import User
from app.models.community_message import CommunityMessage
from app.models.comment import Comment
from app.models.roadmap import Roadmap
from app.services.auth_service import verify_password, get_password_hash, create_access_token
from pydantic import BaseModel
from typing import Optional, List, Any

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from jose import jwt, JWTError
    from app.services.auth_service import SECRET_KEY, ALGORITHM
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_user_optional(token: str = Depends(oauth2_scheme_optional), db: Session = Depends(get_db)):
    if not token:
        return None
    from jose import jwt, JWTError
    from app.services.auth_service import SECRET_KEY, ALGORITHM
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return db.query(User).filter(User.email == email).first()
    except JWTError:
        return None

from app.services.two_fa_service import two_fa_service

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TwoFAVerify(BaseModel):
    email: str
    code: str

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if user.two_fa_enabled:
        return {"two_fa_required": True, "email": user.email}
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login/verify-2fa", response_model=Token)
def verify_2fa_login(data: TwoFAVerify, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not two_fa_service.verify_code(user.two_fa_secret, data.code):
        raise HTTPException(status_code=401, detail="Invalid 2FA code")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/2fa/setup")
def setup_2fa(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    secret = two_fa_service.generate_secret()
    current_user.two_fa_secret = secret
    db.commit()
    
    uri = two_fa_service.get_provisioning_uri(current_user.email, secret)
    # Since we might not have 'qrcode' dependency working perfectly in all environments or
    # the user might just want the secret, we return both.
    try:
        qr_code_base64 = two_fa_service.get_qr_base64(uri)
    except Exception:
        qr_code_base64 = None
        
    return {
        "secret": secret,
        "qr_code": qr_code_base64,
        "uri": uri
    }

class TwoFAConfirm(BaseModel):
    code: str

@router.post("/2fa/enable")
def enable_2fa(data: TwoFAConfirm, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.two_fa_secret:
        raise HTTPException(status_code=400, detail="2FA setup not initiated")
    
    if two_fa_service.verify_code(current_user.two_fa_secret, data.code):
        current_user.two_fa_enabled = True
        db.commit()
        return {"message": "2FA enabled successfully"}
    else:
        raise HTTPException(status_code=400, detail="Invalid verification code")

@router.post("/2fa/disable")
def disable_2fa(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.two_fa_enabled = False
    current_user.two_fa_secret = None
    db.commit()
    return {"message": "2FA disabled successfully"}

@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "avatar_url": current_user.avatar_url,
        "predicted_career": current_user.predicted_career,
        "age": current_user.age
    }

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

@router.post("/update-profile")
def update_profile(data: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if data.full_name:
        current_user.full_name = data.full_name
    if data.avatar_url:
        current_user.avatar_url = data.avatar_url
    db.commit()
    return {"message": "Profile updated successfully"}

class SetAge(BaseModel):
    age: int

@router.post("/set-age")
def set_age(data: SetAge, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if data.age < 1 or data.age > 120:
        raise HTTPException(status_code=400, detail="Age must be between 1 and 120")
    current_user.age = data.age
    db.commit()
    return {"message": "Age saved successfully", "age": data.age}

@router.get("/avatar-recommendations")
def get_avatar_recommendations(current_user: User = Depends(get_current_user)):
    career = current_user.predicted_career or "Student"
    mapping = {
        "Software Engineer": "software",
        "Web Developer": "software",
        "Data Scientist": "data",
        "UI/UX Designer": "design",
        "Product Manager": "management"
    }
    folder = mapping.get(career, "student")
    return [f"/avatars/{folder}/{i}.svg" for i in range(1, 5)]

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

@router.post("/change-password")
def change_password(data: PasswordChange, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")

    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}
