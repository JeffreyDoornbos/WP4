from fastapi import APIRouter, Query, HTTPException, Body, Form
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from passlib.hash import bcrypt
from models.studenten_model import Studentenmodel

router = APIRouter()
api = Studentenmodel()

class BronCreate(BaseModel):
    bron_titel: str
    bron_tekst: str
    bron_link: str
    bron_video: Optional[str] = Field(None)


@router.get("/studenten_lijst", response_model=List[Dict])
def get_studenten_lijst(
    search: str = None,
    score: str = "asc",
    bronnen: int = None,
    waarschuwing: int = 0,
    muted: int = 0,
    geblokkeerd: int = 0,
):
    try:
        studenten = api.studenten_lijst(
            search=search,
            score=score,
            bronnen=bronnen,
            waarschuwing=waarschuwing,
            muted=muted,
            geblokkeerd=geblokkeerd,
        )
        if not studenten:
            raise HTTPException(status_code=404, detail="Er zijn helaas geen studenten beschikbaar.")
        return studenten
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving studenten: {e}")


@router.post("/studenten/{student_id}/nieuwe_bron")
def nieuwe_bron(student_id: int, bron_data: BronCreate):
    try:
        new_id = api.nieuwe_bron(bron_data.dict())
        print(f"{new_id}")
        api.koppel_bron_aan_student(new_id, student_id)
        print(f'Bron {new_id} gekoppeld aan student {student_id}')
        return {"success": True, "id": new_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating bron: {str(e)}")

@router.get("/alle_bronnen", response_model=List[Dict])
def alle_bronnen():
    """
    Haalt ALLE records uit de tabel `bronnen` met hun categorieën.
    """
    try:
        query = """
        SELECT
            b.id,
            b.bron_titel,
            b.bron_tekst,
            b.bron_link,
            b.bron_video,
            b.datum_aangemaakt,
            b.beoordeeld,
            GROUP_CONCAT(c.categorie, ',') AS categorieen
        FROM bronnen b
        LEFT JOIN connect_categorie cc ON b.id = cc.bronnen_id
        LEFT JOIN categorie c ON cc.categorie_id = c.id
        GROUP BY b.id, b.bron_titel, b.bron_tekst, b.bron_link, b.bron_video, b.datum_aangemaakt, b.beoordeeld
        """
        rows = api.database_all(query, [])
        resultaten = []
        for r in rows:
            resultaten.append({
                "id":               r[0],
                "bron_titel":       r[1],
                "bron_tekst":       r[2],
                "bron_link":        r[3],
                "bron_video":       r[4],
                "datum_aangemaakt": r[5],
                "beoordeeld":       r[6],
                "categorieen":      r[7] if r[7] else "",
            })
        return resultaten
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving bronnen: {e}")


@router.get("/bronnen_lijst")
def get_bronnen_lijst(
    search: Optional[str] = None,
    categorie: Optional[str] = None,
    beoordeling_admin: Optional[int] = None,
    beoordeling: Optional[str] = None,
    datum: Optional[str] = None,
):
    """
    Lijst met bronnen voor het dashboard, incl. admin-beoordeling en filters.
    """
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
    """
    Haalt het profiel van één student op (dashboard view).
    """
    print("Aangevraagd id:", id)
    student = api.student_bekijken(id)
    print("Aangevraagd id:", id)
    if not student:
        raise HTTPException(status_code=404, detail="Student niet gevonden.")
    return student

@router.get("/profiel/{id}")
def get_mijn_profiel(id: int):
    """
    Haalt het profiel van de gebruiker op (eigen profiel).
    """
    mijn_profiel = api.mijn_profiel(id)
    if not mijn_profiel:
        raise HTTPException(status_code=404, detail="Student niet gevonden.")
    return mijn_profiel

@router.put('/profiel_bewerken/{id}')
async def profiel_bewerken(
                           student_id: int = Form(...),
                           gebruikersnaam: str = Form(...),
                           postcode: str = Form(...),
                           huisnummer: str = Form(...),
                           telefoonnummer: str = Form(...),
                           wachtwoord: str = Form(...),
                           afbeelding_icoon: str = Form(...),
                           voornaam: str = Form(...),
                           achternaam: str = Form(...),
                           email: str = Form(...),
                           studentnummer: int = Form(...),
                           geboortedatum: str = Form(...),
                           geslacht: str = Form(...),
                           ):
    """
    Bewerkt het profiel van de student.
    Geblokkeerde leden, mogen hun profiel niet bewerken!
    Haalt ook oude data weer op indien het veld leeg is.

    Ik heb het wachtwoord van mijn profiel erbij gezet, maar die laat ik niet zien.
    Het wachtwoord is toch gehashed en ik weet dat het eigenlijk niet zo veilig is,
    maar ik had even geen idee hoe ik dit anders snel kon oplossen.
    """

    try:
        bestaand = api.mijn_profiel(student_id)
        if not bestaand:
            return {"success": False, "message": "Student niet gevonden."}

        if bestaand[16] or bestaand[15] == 1:
            return {"success": False, "message": "Jou account is gemute of geblokkeerd en kan niet gewijzigd worden!."}

        student_id = bestaand[0]
        gebruikersnaam = gebruikersnaam or bestaand[14]
        postcode = postcode or bestaand[6]
        huisnummer = huisnummer or bestaand[7]
        telefoonnummer = telefoonnummer or bestaand[8]
        wachtwoord = wachtwoord or bestaand[17]
        afbeelding_icoon = afbeelding_icoon or bestaand[12]
        voornaam = voornaam or bestaand[1]
        achternaam = achternaam or bestaand[2]
        email = email or bestaand[3]
        studentnummer = studentnummer or bestaand[4]
        geboortedatum = geboortedatum or bestaand[5]
        geslacht = geslacht or bestaand[9]

        # if wachtwoord != bestaand[5]:
        #     wachtwoord = bcrypt.hash(wachtwoord)

        update_data = {
            "gebruikersnaam": gebruikersnaam,
            "postcode": postcode,
            "huisnummer": huisnummer,
            "telefoonnummer": telefoonnummer,
            "wachtwoord": wachtwoord,
            "afbeelding_icoon": afbeelding_icoon,
            "voornaam": voornaam,
            "achternaam": achternaam,
            "email": email,
            "studentnummer": studentnummer,
            "geboortedatum": geboortedatum,
            "geslacht": geslacht,
        }

        succes = api.profiel_bewerken(student_id, update_data)

        if succes:
            return {"success": True, "message": "Je profiel is gewijzigd!"}
        else:
            return {"success": False, "message": "Het is niet gelukt om je profiel te wijzigen!"}

    except Exception as e:
        return {"success": False, "message": str(e)}


@router.get("/bron_bekijken/{id}")
def get_bron_bekijken(id: int, studenten_id: int = Query(None)):
    """
    Haalt één bron op met dashboard-data.
    Studenten_id is optioneel, om de beoordeling van die student mee te halen.
    """
    bron = api.bron_bekijken(id, studenten_id)
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
    """
    Bronnen van één student (dashboard context).
    """
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
    """
    Wijzigt een bron (dashboard).
    """
    updated = api.wijzig_bron(id, data)
    return updated


@router.delete("/delete_bron/{id}")
def delete_bron(id: int):
    """
    Verwijdert een bron inclusief cascade.
    """
    deleted = api.cascade_delete_bron(id)
    return deleted


@router.get("/categorie_filter")
def categorie_filter():
    """
    Vult filters: categorieën en indelingen.
    """
    cats = api.categorie_filter()
    inds = api.indeling_filter()
    if not cats and not inds:
        raise HTTPException(status_code=404, detail="Er zijn geen categorieën beschikbaar.")
    return {"categorieën": cats, "indelingen": inds}


@router.put("/wijzig_reactie/{id}")
def wijzig_reactie(id: int, data: dict = Body(...)):
    """
    Wijzigt een reactie (dashboard).
    """
    updated = api.wijzig_reactie(id, data)
    return updated


@router.delete("/verwijder_reactie/{id}")
def verwijder_reactie(id: int):
    """
    Verwijdert een reactie inclusief cascade.
    """
    deleted = api.cascade_delete_reactie(id)
    return deleted


@router.get("/highscore")
def highscore():
    """
    Haalt de totale highscore op.
    """
    return api.highscore()

@router.post('/favoriet_toevoegen')
def favoriet_toevoegen(studenten_id: int, bronnen_id: int):
    api.voeg_favoriet_toe(studenten_id, bronnen_id)
    return {"message": "Bron toegevoegd aan favorieten."}

@router.delete('/favoriet_verwijderen')
def favoriet_verwijderen(studenten_id: int, bronnen_id: int):
    api.verwijder_favoriet(studenten_id, bronnen_id)
    return {"message": "Bron verwijderd uit favorieten."}

@router.get('/favorieten')
def favorieten(studenten_id: int):
    favorieten = api.lijst_favoriete_bronnen(studenten_id)
    if favorieten:
        return favorieten
    return {"message": "Je hebt nog geen favoriete bronnen."}


@router.post("/beoordeel_bron")
def beoordeel_bron(studenten_id: int, bronnen_id: int, beoordeling: int):
    """
    Geef een beoordeling (1–5) aan een bron door deze student.
    """
    success = api.beoordeel_bron({
        "studenten_id": studenten_id,
        "bronnen_id": bronnen_id,
        "beoordeling": beoordeling,
    })
    if success:
        return {"success": True}
    raise HTTPException(status_code=400, detail="Kon beoordeling niet zetten.")



@router.get("/student_bekijken/{studenten_id}")
def student_bekijken(studenten_id: int):
    """
    Laat de detail van één student zien, inclusief het aantal bronnen.
    Alleen als de student niet geblokkeerd is.
    """
    result = api.student_bekijken(studenten_id)
    if not result:
        raise HTTPException(status_code=404, detail="Student niet gevonden of geblokkeerd.")
    return result


@router.get("/mijn_bronnen/{studenten_id}")
def mijn_bronnen(studenten_id: int):
    """
    Haal alle bronnen op die de ingelogde student (studenten_id) heeft toegevoegd.
    """
    # Eenvoudige SQL die alleen de bronnen van deze student teruggeeft:
    query = """
    SELECT b.id,
           b.bron_titel,
           b.bron_tekst,
           b.bron_link,
           b.bron_video,
           b.datum_aangemaakt,
           b.beoordeeld
    FROM bronnen AS b
    JOIN connect_bronnen AS cb
      ON b.id = cb.bronnen_id
    WHERE cb.studenten_id = ?
    ORDER BY b.datum_aangemaakt DESC
    """
    resultaten = api.database_all(query, [studenten_id])
    if resultaten is None:
        raise HTTPException(status_code=404, detail="Geen bronnen gevonden.")
    return resultaten


@router.delete("/mijn_bronnen/{studenten_id}/{bron_id}")
def delete_mijn_bron(studenten_id: int, bron_id: int):
    """
    Verwijder de bron met id=bron_id (incl. koppelingen) voor student studenten_id.
    """
    success = api.cascade_delete_bron(bron_id)
    if success:
        return {"success": True}
    raise HTTPException(status_code=500, detail="Kon bron niet verwijderen.")