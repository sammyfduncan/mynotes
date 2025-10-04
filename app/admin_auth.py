from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session
import os

from app.security import SECRET_KEY, decode_acc_token, verify_password, create_acc_token
from app.database import get_db
from app.models import User

class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username = form["username"]
        password = form["password"]

        # We can't use Depends() in this context, so we create a db session manually
        db: Session = next(get_db())

        user = db.query(User).filter(User.email == username).first()

        # Validate username/password
        if not user or not verify_password(password, user.hashed_pw):
            return False

        # Validate if the user is the designated admin
        admin_email = os.getenv("ADMIN_EMAIL")
        if user.email != admin_email:
            return False

        # Create a token and store it in the session
        access_token = create_acc_token(data={"sub": user.email})
        request.session.update({"token": access_token})

        return True

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("token")

        if not token:
            return False

        # Here we decode the token and check if the user is the admin
        payload = decode_acc_token(token)
        if not payload or "sub" not in payload:
            return False
            
        email = payload.get("sub")
        admin_email = os.getenv("ADMIN_EMAIL")

        if email == admin_email:
            return True

        return False

authentication_backend = AdminAuth(secret_key=SECRET_KEY)