from fastapi import FastAPI, HTTPException, APIRouter, Query, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import shutil
from models.login_model import Loginmodel , adminLoginmodel
from models.studenten_model import Studentenmodel
from models.register_model import Registermodel
from typing import Optional
app = FastAPI()
router = APIRouter()

adminLogin_db = adminLoginmodel()
login_db = Loginmodel()
bronnen_api = Studentenmodel()
register_model = Registermodel()

class UserResponse(BaseModel):
    id: int
    voornaam: str
    achternaam: str
    email: str
    is_admin: bool = False

class LoginRequest(BaseModel):
    email: str
    wachtwoord: str

class LoginResponse(BaseModel):
    succes: bool
    message: str
    user: Optional[UserResponse] = None



@router.get("/")
def read_root():
    return {"hello": "World"}


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    user = login_db.login(request.email, request.wachtwoord)
    print(user)
    if not user or len(user)== 0:
        return LoginResponse(
            succes=False,
            message="User not found",
            user=None,

        )
    user_tuple = user[0]

    return LoginResponse(succes=True,
                         message="Login successful",
                         user=UserResponse(
                            id=user_tuple[0],
                            voornaam = user_tuple[1],
                            achternaam = user_tuple[2],
                            email = user_tuple[3],)
                         )

@router.post("/adminlogin", response_model=LoginResponse)
def login(request: LoginRequest):
    admin = adminLogin_db.adminlogin(request.email, request.wachtwoord)
    print(admin)
    if not admin or len(admin)== 0:
        return LoginResponse(
            succes=False,
            message="admin not found",
            user=None,

        )
    admin_tuple = admin[0]

    return LoginResponse(succes=True,
                         message="Login successful",
                         user=UserResponse(
                            id=admin_tuple[0],
                            voornaam = admin_tuple[1],
                            achternaam = admin_tuple[2],
                            email = admin_tuple[3],
                            is_admin = True)
                         )

@router.get("/studenten/", response_model=List[dict])
def get_students(
    search: Optional[str] = Query(None, description="Zoek op voor‐ of achternaam"),
    score:  Optional[str] = Query(None, description="Minimale score filter"),
    bronnen: Optional[str] = Query(None, description="Filter op bronnen"),
):
    try:
        studenten = login_db.studenten_lijst(
            search=search,
            score=score,
            bronnen=bronnen
        )
        return studenten if studenten else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving students: {str(e)}")



@router.post("/register/", response_model=dict)
def register(
        voornaam: Optional[str] = Form(...),
        achternaam: Optional[str] = Form(...),
        gebruikersnaam: str = Form(...),
        wachtwoord: str = Form(...),
        studentnummer: str = Form(...),
        email: str = Form(...),
        telefoonnummer: Optional[str] = Form(...),
        postcode: Optional[str] = Form(...),
        geboortedatum: Optional[str] = Form(...),
        geslacht: Optional[str] = Form(...),
        huisnummer: Optional[str] = Form(None),
        afbeelding_icoon: Optional[UploadFile] = File(None),
):
    try:
        saved_filename=None
        if afbeelding_icoon:
            upload_dir = 'static/uploads/'
            os.makedirs(upload_dir, exist_ok=True)

            extension  = afbeelding_icoon.filename.split(".")[-1]
            saved_filename= f"{gebruikersnaam}.{extension}"
            file_path = os.path.join(upload_dir, saved_filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(afbeelding_icoon.file, buffer)

        new_id = register_model.register(
            voornaam=voornaam,
            achternaam=achternaam,
            gebruikersnaam=gebruikersnaam,
            wachtwoord=wachtwoord,
            studentnummer=studentnummer,
            email=email,
            telefoonnummer=telefoonnummer,
            postcode=postcode,
            geboortedatum=geboortedatum,
            geslacht=geslacht,
            huisnummer=huisnummer,
            afbeelding_icoon=saved_filename,
        )
        return {"success": True, "id": new_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding student: {str(e)}")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)