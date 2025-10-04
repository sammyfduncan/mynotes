from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from . import models, schemas
from .database import get_db
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
import os

#configuration
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable not set. Please create a .env file and set it.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXP = 30 #minutes

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

#hashing 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_pw, hashed_pw):
    return pwd_context.verify(plain_pw, hashed_pw)

def get_pw_hash(password):
    return pwd_context.hash(password)

#jwt token creation
def create_acc_token(data : dict, expires_delta : Optional[timedelta] = None):
    encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
        
    encode.update({"exp" : expire})
    encoded_jwt = jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(
        token : str = Depends(oauth2_scheme),
        db : Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try: 
        payload = jwt.decode(
            token, 
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        email : str = payload.get("sub")

        if email is None:
            raise credentials_exception
        
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == token_data.email).first()

    if user is None:
        raise credentials_exception

    return user
    
#optional authentication dependency function
#allows upload endpoint to accept requests from both guest and users
async def current_user_optional(
        db : Session = Depends(get_db),
        authorization : Optional[str] = Header(None)
) -> Optional[models.User]:
    if not authorization:
        return None
    try:
        scheme, token = authorization.split()

        if (scheme.lower() != "bearer"):
            return None
    except ValueError:
        return None
    
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        email : str = payload.get("sub")

        if email is None:
            return None
        user = db.query(
            models.User).filter(
                models.User.email == email).first()
        return user
    except JWTError:
        return None #token invalid, so guest
    
async def guest_id_optional(
    guest_id : Optional[str] = Header(None)
) -> Optional[str]:
    return guest_id

def decode_acc_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
