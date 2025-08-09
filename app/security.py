from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from . import models, schemas
from .database import get_db
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

#configuration
SECRET_KEY = "asjbjfbiugsdfdsjgn"
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
    

    


