from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from . import models, schemas
from .database import get_db
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os

#configuration
SECRET_KEY = os.getenv("SECRET_KEY")
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
def create_acc_token(data : dict, expiry_delta : Optional[timedelta] = None):
    encode = data.copy()
    if expiry_delta:
        expire = datetime.utcnow() + expiry_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
        
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
        username : str = payload.get("sub")

        if username is None:
            raise credentials_exception
        
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
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
        username : str = payload.get("sub")

        if username is None:
            return None
        user = db.query(
            models.User).filter(
                models.User.username == username).first()
        return user
    except JWTError:
        return None #token invalid, so guest
    
async def guest_id_optional(
    guest_id : Optional[str] = Header(None)
) -> Optional[str]:
    return guest_id
    


