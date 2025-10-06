from fastapi import APIRouter, HTTPException, Body, Form
from typing import Optional
from passlib.hash import bcrypt
from models.dashboard_model import Dashboardmodel

router = APIRouter()
api = Dashboardmodel()


@router.get("/studenten_lijst")
def get_studenten_lijst():
    """
    Haal de volledige lijst studenten op, zonder filters.
    """
    studenten = api.studenten_lijst()
    if not studenten:
        raise HTTPException(status_code=404, detail="Er zijn helaas geen studenten beschikbaar.")
    return studenten

@router.put("/student_mute")
def student_mute(studenten_id: int, muted: int):
    """
    Zet de `muted`-flag voor een student.
    Query-params: ?studenten_id=<id>&muted=0|1
    """
    success = api.update_student_field(studenten_id, "muted", muted)
    if success:
        return {"success": True}
    raise HTTPException(status_code=500, detail="Kon mute niet bijwerken")

@router.put("/student_block")
def student_block(studenten_id: int, geblokkeerd: int):
    """
    Zet de `geblokkeerd`-flag voor een student.
    Query-params: ?studenten_id=<id>&geblokkeerd=0|1
    """
    success = api.update_student_field(studenten_id, "geblokkeerd", geblokkeerd)
    if success:
        return {"success": True}
    raise HTTPException(status_code=500, detail="Kon geblokkeerd niet bijwerken")


@router.get("/bronnen_lijst")
def get_bronnen_lijst(
    search: Optional[str] = None,
    categorie: Optional[str] = None,
    beoordeling_admin: Optional[int] = None,
    beoordeling: Optional[str] = None,
    datum: Optional[str] = None,
):
    bronnen = api.bronnen_lijst(
        search=search,
        categorie=categorie,
        beoordeling_admin=beoordeling_admin,
        beoordeling=beoordeling,
        datum=datum,
    )
    if not bronnen:
        raise HTTPException(status_code=404, detail="Er zijn helaas geen bronnen beschikbaar.")
    return bronnen


@router.get("/studenten/{id}")
def get_student_profiel(id: int):
    student = api.student_profiel(id)
    if not student:
        raise HTTPException(status_code=404, detail="Student niet gevonden.")
    return student


@router.put("/profiel_bewerken/{id}")
def profiel_bewerken(id: int, data: dict = Body(...)):
    updated = api.profiel_bewerken(id, data)
    return updated


@router.get("/bron_bekijken/{id}")
def get_bron_bekijken(id: int):
    bron = api.bron_bekijken(id)
    if not bron:
        raise HTTPException(status_code=404, detail="Bron niet gevonden.")
    return bron


@router.get("/studenten/{id}/bronnen")
def get_student_bronnen(
    id: int,
    search: Optional[str] = None,
    categorie: Optional[str] = None,
    beoordeling_admin: Optional[int] = None,
    beoordeling: Optional[str] = None,
    datum: Optional[str] = None,
):
    bronnen_student = api.bronnen_student(
        search=search,
        categorie=categorie,
        beoordeling_admin=beoordeling_admin,
        beoordeling=beoordeling,
        datum=datum,
        id=id,
    )
    if not bronnen_student:
        raise HTTPException(status_code=404, detail="Geen bronnen voor deze student.")
    return bronnen_student


@router.put("/wijzig_bron/{id}")
def wijzig_bron(id: int, data: dict = Body(...)):
    updated = api.wijzig_bron(id, data)
    return updated


@router.delete("/delete_bron/{id}")
def delete_bron(id: int):
    deleted = api.cascade_delete_bron(id)
    return deleted


@router.get("/categorie_filter")
def categorie_filter():
    cats = api.categorie_filter()
    inds = api.indeling_filter()
    if not cats and not inds:
        raise HTTPException(status_code=404, detail="Er zijn geen categorieën beschikbaar.")
    return {"categorieën": cats, "indelingen": inds}


@router.put("/wijzig_reactie/{id}")
def wijzig_reactie(id: int, data: dict = Body(...)):
    updated = api.wijzig_reactie(id, data)
    return updated


@router.delete("/verwijder_reactie/{id}")
def verwijder_reactie(id: int):
    deleted = api.cascade_delete_reactie(id)
    return deleted


@router.get("/highscore")
def highscore():
    return api.highscore()

# Admin
@router.get("/admin/profiel/{id}")
def admin_profiel(id: int):
    """
    Haalt het profiel van de gebruiker op (eigen profiel).
    """
    admin_profiel = api.admin_profiel(id)
    if not admin_profiel:
        raise HTTPException(status_code=404, detail="Student niet gevonden.")
    return admin_profiel

@router.put('/admin/profiel_bewerken/{id}')
async def admin_profiel_bewerken(
                           admin_id: int = Form(...),
                           voornaam: str = Form(...),
                           achternaam: str = Form(...),
                           email: str = Form(...),
                           wachtwoord: str = Form(...),
                           ):
    """
    Bewerkt het profiel van de admin.
    Haalt ook oude data weer op indien het veld leeg is.
    """

    try:
        bestaand = api.admin_profiel(admin_id)
        if not bestaand:
            return {"success": False, "message": "Admin niet gevonden."}

        admin_id = bestaand[0]
        voornaam = voornaam or bestaand[1]
        achternaam = achternaam or bestaand[2]
        email = email or bestaand[3]
        wachtwoord = wachtwoord or bestaand[4]

        # if wachtwoord != bestaand[4]:
        #     wachtwoord = bcrypt.hash(wachtwoord)

        update_data = {
            "voornaam": voornaam,
            "achternaam": achternaam,
            "email": email,
            "wachtwoord": wachtwoord,
        }

        succes = api.admin_bewerken(admin_id, update_data)

        if succes:
            return {"success": True, "message": "Uw profiel is gewijzigd!"}
        else:
            return {"success": False, "message": "Het is niet gelukt om uw profiel te wijzigen!"}

    except Exception as e:
        return {"success": False, "message": str(e)}

@router.get("/admin_lijst")
def get_admin_lijst():
    """
    Haal de volledige lijst met admins op, zonder filters.
    """
    admin_lijst = api.admin_lijst()
    print("werkt dit wel?")

    if not admin_lijst:
        raise HTTPException(status_code=404, detail="Er zijn helaas geen studenten beschikbaar.")
    return admin_lijst

@router.delete("/delete/{id}")
def admin_delete(id: int):
    """
    Delete de geklikte admin.
    Je kunt iedere admin klikken behalve jezelf -> frontend?
    """

    delete = api.delete_admin({"id":id})

    if not delete:
        raise HTTPException(status_code=404, detail="Er zijn helaas geen studenten beschikbaar.")
    return delete

@router.post("/register")
def admin_register(
        voornaam: Optional[str] = Form(...),
        achternaam: Optional[str] = Form(...),
        email: str = Form(...),
        wachtwoord: str = Form(...)
):
    """
    Maak een nieuwe admin aan.
    Registratie gebruikt van Jordi
    """
    try:
        admin = api.admin_register(
            voornaam=voornaam,
            achternaam=achternaam,
            email=email,
            wachtwoord=wachtwoord,
        )
        return {"success": True, "id": admin}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding student: {str(e)}")






