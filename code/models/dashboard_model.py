from typing import Optional, Any, List
from models.database_model import Database


class Dashboardmodel(Database):


    def studenten_lijst(self) -> List[Any]:
        """
        Haal alle studenten op, zonder filters.
        """
        query = """
        SELECT
            s.id,
            s.voornaam,
            s.achternaam,
            s.email,
            s.studentnummer,
            s.geboortedatum,
            s.postcode,
            s.huisnummer,
            s.telefoonnummer,
            s.geslacht,
            s.score,
            COUNT(cb.bronnen_id) AS aantal_bronnen,
            s.waarschuwing,
            s.muted,
            s.geblokkeerd,
            s.afbeelding_icoon,
            s.gebruikersnaam
        FROM studenten AS s
        LEFT JOIN connect_bronnen AS cb
          ON s.id = cb.studenten_id
        GROUP BY s.id
        ORDER BY s.score DESC
        """
        return self.database_all(query)





    def update_student_field(self, studenten_id: int, field: str, value: int) -> bool:
        """
        Dynamisch één veld van een student updaten.
        """
        if field not in ("muted", "geblokkeerd"):
            return False
        query = f"UPDATE studenten SET {field} = ? WHERE id = ?"
        return self.database_rest(query, [value, studenten_id])


    

    def bronnen_lijst(self, search, categorie, beoordeling, datum, beoordeling_admin):
        """
        Laat de bronnen met profiel zien, filteren en beoordeeld door admin.
        Bronnen_lijst query haalt alle bronnen incl. filters op.

        * Alle bronnen
        * Gekoppelde studenten naam (of username als er tijd is)
        * gekoppelde reacties optellen (gekoppeld aan de bron)
        * Gekoppelde categorieën (gekoppeld aan de bron)
        * Gekoppelde categorie indeling (gekoppeld aan de bron)
        * average beoordeling per bron (van alle beoordelingen per bron)
        * Alle bronnen opgeteld voor bovenin het scherm

        * Filter op titel + tekst (typ zoekbalk)
        * Filter op categorie of indeling (Aan de gekoppelde bronnen)
        * Filter op beoordeeld (admin only, nieuwe bronnen zijn nog niet beoordeeld en 0)
        * Beoordeling van de bron op volgorde hoog of laag
        * Datum van de bron op volgorde hoog of laag
        """
        query = """
        SELECT bronnen.bron_titel,
               bronnen.bron_tekst,
               bronnen.bron_video,
               GROUP_CONCAT(DISTINCT studenten.afbeelding_icoon) AS student_icoon, 
               GROUP_CONCAT(DISTINCT studenten.voornaam) AS student_naam, 
               COUNT(DISTINCT reactie.id) AS aantal_reacties, 
               GROUP_CONCAT(DISTINCT categorie.categorie) AS categorie_namen, 
               GROUP_CONCAT(DISTINCT categorie.indeling) AS indeling_namen,
               AVG(beoordeling.beoordeling) AS gemiddelde_beoordeling,
               COUNT(bronnen.id) AS aantal_bronnen
        FROM bronnen
        LEFT JOIN connect_reactie ON bronnen.id = connect_reactie.bronnen_id
        LEFT JOIN reactie ON connect_reactie.reactie_id = reactie.id
        LEFT JOIN connect_bronnen ON bronnen.id = connect_bronnen.bronnen_id
        LEFT join studenten ON connect_bronnen.studenten_id = studenten.id
        LEFT JOIN connect_categorie ON bronnen.id = connect_categorie.bronnen_id
        LEFT JOIN categorie ON connect_categorie.categorie_id = categorie.id
        LEFT JOIN connect_beoordeling ON bronnen.id = connect_beoordeling.bronnen_id
        LEFT JOIN beoordeling ON bronnen.id = beoordeling.id
        WHERE 1=1
        """

        parameter = []

        # Algemeen zoeken door bronnen (Kan handig zijn).
        if search:
            query += "AND bronnen.titel LIKE ? OR bronnen.tekst LIKE ?"
            parameter.extend([f"%{search}%", f"%{search}%"])

        if categorie:
            query += " AND GROUP_CONCAT(categorie.categorie, categorie.indeling, ', ') LIKE ?"
            parameter.append(f"%{categorie}%")

        # Dit is de beoordeling voor een admin (gezien = 1), die nog niet gezien is.
        if beoordeling_admin:
            query += " AND bronnen.beoordeling = 0"

        query += "GROUP BY beoordeling.id"

        if beoordeling == 'ASC':
            query += " ORDER BY beoordeling.beoordeling ASC"
        else:
            query += " ORDER BY beoordeling.beoordeling DESC"

        query -= " GROUP BY bronnen.id"
        query += " ORDER BY bronnen.id"

        if datum == 'ASC':
            query += " ORDER BY bronnen.datum_aangemaakt ASC"
        else:
            query += " ORDER BY bronnen.datum_aangemaakt DESC"

        return self.database_all(query, parameter)

    def bronnen_sanctie(self, waarschuwing, muted, geblokkeerd):
        """
        Start gelijk met 1 van de sancties, zodra er op een sanctie knop gedrukt wordt.
        Laat de bronnen met profiel zien, filteren en beoordeeld door admin.
        Bronnen_lijst query haalt alle bronnen incl. filters op.

        * Alle bronnen
        * Gekoppelde studenten naam (of username als er tijd is)
        * gekoppelde reacties optellen (gekoppeld aan de bron)
        * Gekoppelde categorieën (gekoppeld aan de bron)
        * Gekoppelde categorie indeling (gekoppeld aan de bron)
        * average beoordeling per bron (van alle beoordelingen per bron)
        * Alle bronnen opgeteld voor bovenin het scherm

        * Filter op titel + tekst (typ zoekbalk)
        * Filter op categorie of indeling (Aan de gekoppelde bronnen)
        * Filter op beoordeeld (admin only, nieuwe bronnen zijn nog niet beoordeeld en 0)
        * Beoordeling van de bron op volgorde hoog of laag
        * Datum van de bron op volgorde hoog of laag
        """
        query = """
        SELECT *, 
               GROUP_CONCAT(studenten.voornaam), 
               COUNT(DISTINCT reactie.id), 
               GROUP_CONCAT(DISTINCT categorie.categorie), 
               GROUP_CONCAT(DISTINCT categorie.indeling),
               AVG(beoordeling.beoordeling),
               COUNT(bronnen.id)
        FROM bronnen
        LEFT JOIN connect_reactie ON bronnen.id = connect_reactie.bronnen_id
        LEFT JOIN reactie ON connect_reactie.reactie_id = reactie.id
        LEFT JOIN connect_bronnen ON bronnen.id = connect_bronnen.bronnen_id
        LEFT join studenten ON connect_bronnen.studenten_id = studenten.id
        LEFT JOIN connect_categorie ON bronnen.id = connect_categorie.bronnen_id
        LEFT JOIN categorie ON connect_categorie.categorie_id = categorie.id
        LEFT JOIN connect_beoordeling ON bronnen.id = connect_beoordeling.bronnen_id
        LEFT JOIN beoordeling ON bronnen.id = beoordeling.id
        WHERE 1=1
        """

        parameter = []

        if waarschuwing:
            query += " AND studenten.waarschuwing > == 1"

        if muted == 1:
            query += " AND studenten.muted == 1"

        if geblokkeerd == 1:
            query += " AND studenten.geblokkeerd == 1"

        return self.database_all(query, parameter)


    # Student
    def student_profiel(self, id):
        """
        Profiel van de student bekijken door admin. !!!
        """
        query = """
        SELECT studenten.id, 
               studenten.voornaam, 
               studenten.achternaam, 
               studenten.email, 
               studenten.studentnummer,
               studenten.geboortedatum, 
               studenten.postcode,
               studenten.huisnummer, 
               studenten.telefoonnummer, 
               studenten.geslacht, 
               studenten.score, 
               COUNT(DISTINCT bronnen.id) AS aantal_bronnen, 
               studenten.waarschuwing, 
               studenten.muted,
               studenten.geblokkeerd, 
               studenten.afbeelding_icoon, 
               studenten.gebruikersnaam 
        FROM studenten
        LEFT JOIN connect_bronnen ON studenten.id = connect_bronnen.studenten_id
        LEFT JOIN bronnen ON connect_bronnen.studenten_id = bronnen.id
        WHERE studenten.id = ?
        """

        parameter = [id]

        return self.database_one(query, parameter)

    def student_wijzigen(self, student_id: int, bron: dict):
        """
        Admin kan de geklikte student wijzigen. !!!
        Ook kunnen admins ook waarschuwen, muten of blokkeren.
        Misschien alleen de profielfoto/ Gebruikersnaam (start met studentnummer)/ waarschuwing/ mute/ ban
        """
        query = """
        UPDATE studenten
               SET voornaam = ?,
                   achternaam = ?,
                   gebruikersnaam = ?,
                   email = ?,
                   wachtwoord = ?,
                   studentnummer = ?,
                   postcode = ?,
                   telefoonnummer = ?,
                   geslacht = ?,
                   waarschuwing = ?,
                   muted = ?,
                   geblokkeerd = ?,
                   afbeelding_icoon = ?
               WHERE id = ?
        """
        parameter = [
            bron["voornaam"],
            bron["achternaam"],
            bron["gebruikersnaam"],
            bron["email"],
            bron["wachtwoord"],
            bron["studentnummer"],
            bron["postcode"],
            bron["Huisnummer"],
            bron["telefoonnummer"],
            bron["geslacht"],
            bron["waarschuwing"],
            bron["mute"],
            bron["geblokkeerd"],
            bron["afbeelding_icoon"],
            student_id
        ]

        return self.database_one(query, parameter)


    # bron
    def bronnen_student(self, search, categorie, beoordeling_admin, beoordeling, datum):
        """
        Op basis van bronnen per student (aangeklikt op studenten.id).
        """
        query = """
        SELECT *, 
               GROUP_CONCAT(DISTINCT studenten.id),
               GROUP_CONCAT(studenten.voornaam), 
               COUNT(DISTINCT reactie.id), 
               GROUP_CONCAT(DISTINCT categorie.categorie), 
               GROUP_CONCAT(DISTINCT categorie.indeling),
               AVG(beoordeling.beoordeling),
               COUNT(bronnen.id)
        FROM bronnen
        LEFT JOIN connect_reactie ON bronnen.id = connect_reactie.bronnen_id
        LEFT JOIN reactie ON connect_reactie.reactie_id = reactie.id
        LEFT JOIN connect_bronnen ON bronnen.id = connect_bronnen.bronnen_id
        LEFT join studenten ON connect_bronnen.studenten_id = studenten.id
        LEFT JOIN connect_categorie ON bronnen.id = connect_categorie.bronnen_id
        LEFT JOIN categorie ON connect_categorie.categorie_id = categorie.id
        LEFT JOIN connect_beoordeling ON bronnen.id = connect_beoordeling.bronnen_id
        LEFT JOIN beoordeling ON bronnen.id = beoordeling.id
        WHERE studenten.id = ?
        ORDER BY bronnen.datum_aangemaakt ASC
        """

        parameter = [id]

        # Algemeen zoeken door bronnen (Kan handig zijn).
        if search:
            query += "AND bronnen.titel LIKE ? OR bronnen.tekst LIKE ?"
            parameter.extend([f"%{search}%", f"%{search}%"])

        if categorie:
            query += " AND GROUP_CONCAT(categorie.categorie, categorie.indeling, ', ') LIKE ?"
            parameter.append(f"%{categorie}%")

        # Dit is de beoordeling voor een admin (gezien = 1), die nog niet gezien is.
        if beoordeling_admin:
            query += " AND bronnen.beoordeling = 0"

        query += "GROUP BY beoordeling.id"

        if beoordeling == 'ASC':
            query += " ORDER BY beoordeling.beoordeling ASC"
        else:
            query += " ORDER BY beoordeling.beoordeling DESC"

        query -= " GROUP BY bronnen.id"
        query += " ORDER BY bronnen.id"

        if datum == 'ASC':
            query += " ORDER BY bronnen.datum_aangemaakt ASC"
        else:
            query += " ORDER BY bronnen.datum_aangemaakt DESC"

        return self.database_all(query, parameter)

    def bron_bekijken_student(self):
        query = """
        SELECT *,
               GROUP_CONCAT(studenten.id),
               GROUP_CONCAT(studenten.voornaam), 
               COUNT(reactie.id),
               GROUP_CONCAT(DISTINCT reactie.id), 
               GROUP_CONCAT(categorie.categorie), 
               GROUP_CONCAT(categorie.indeling),
               AVG(beoordeling.beoordeling),
               COUNT(bronnen.id)
        FROM bronnen
        LEFT JOIN connect_reactie ON bronnen.id = connect_reactie.bronnen_id
        LEFT JOIN reactie ON connect_reactie.reactie_id = reactie.id
        LEFT JOIN connect_bronnen ON bronnen.id = connect_bronnen.bronnen_id
        LEFT join studenten ON connect_bronnen.studenten_id = studenten.id
        LEFT JOIN connect_categorie ON bronnen.id = connect_categorie.bronnen_id
        LEFT JOIN categorie ON connect_categorie.categorie_id = categorie.id
        LEFT JOIN connect_beoordeling ON bronnen.id = connect_beoordeling.bronnen_id
        LEFT JOIN beoordeling ON bronnen.id = beoordeling.id
        WHERE studenten.id = ?
        """

        parameter = [id]

        return self.database_one(query, parameter)

    def bron_id(self):
        query = """
                SELECT *, 
                       GROUP_CONCAT(studenten.voornaam), 
                       COUNT(DISTINCT reactie.id),
                       GROUP_CONCAT(DISTINCT reactie.id), 
                       GROUP_CONCAT(DISTINCT categorie.categorie), 
                       GROUP_CONCAT(DISTINCT categorie.indeling),
                       AVG(beoordeling.beoordeling)
                FROM bronnen
                LEFT JOIN connect_reactie ON bronnen.id = connect_reactie.bronnen_id
                LEFT JOIN reactie ON connect_reactie.reactie_id = reactie.id
                LEFT JOIN connect_bronnen ON bronnen.id = connect_bronnen.bronnen_id
                LEFT join studenten ON connect_bronnen.studenten_id = studenten.id
                LEFT JOIN connect_categorie ON bronnen.id = connect_categorie.bronnen_id
                LEFT JOIN categorie ON connect_categorie.categorie_id = categorie.id
                LEFT JOIN connect_beoordeling ON bronnen.id = connect_beoordeling.bronnen_id
                LEFT JOIN beoordeling ON bronnen.id = beoordeling.id
                WHERE 1=1
        """
        parameter = []

        return self.database_one(query, parameter)

    def bron_wijzigen(self, bron):
        """
        Wijzigt de bron, behoud aanmaakdatum, zet beoordeeld naar 0 (admin past de bron aan).
        """
        query = """
        UPDATE bronnen
               SET bron_titel = ?,
                   bron_tekst = ?,
                   bron_link = ?,
                   bron_video = ?,
                   beoordeeld = 1
               WHERE id = ?

        """
        parameter = [
            bron["id"],
            bron["bron_titel"],
            bron["bron_tekst"],
            bron["bron_link"],
            bron["bron_video"],
        ]

        return self.database_rest(query, parameter)

    def bron_verwijderen(self, bron):
        """
        Verwijderd de bron incl. de koppel tabellen.
        Koppel verwijder tabellen staan onderin!
        Als, delete on cascade werkt, dan mag deze verwijderd worden of vervangen.
        """
        query = """
        DELETE FROM bronnen
               WHERE id = ?
        """
        parameter = [
            bron["id"],
            bron["bron_titel"],
            bron["bron_tekst"],
            bron["bron_link"],
            bron["bron_video"],
        ]

        return self.database_rest(query, parameter)

    def bron_beoordelen_admin(self, bron):
        """
        Conditie maken voor beoordeeld of niet.
        """
        query = """
        UPDATE bronnen
               SET bronnen.beoordeeld = ?
               WHERE bronnen.id = ?
        """
        parameter = [
            bron["bronnen.beoordeeld"],
        ]

        return self.database_one(query, parameter)


    # handelingen
    def waarschuwing(self, bron):
        """
        Waarschuwing = 0, bij waarschuwen zet die op 1, na een aantal dagen gaat het automatisch
        naar 0, tenzij de student opnieuw gewaarschuwd wordt.
        """
        query = """
        UPDATE studenten
               SET studenten.waarschuwing = ?
               WHERE studenten.id = ?
        """
        parameter = [
            bron["studenten.waarschuwing"],
        ]

        return self.database_rest(query, parameter)

    def mute(self, bron):
        """
        Mogelijkheid om te checken of de conditie 0 of 1 is, zoals een aan of uit knop.
        :return:
        """
        query = """
        UPDATE studenten
               SET studenten.muted = ?
               WHERE studenten.id = ?
        """
        parameter = [
            bron["studenten.muted"],
        ]

        return self.database_one(query, parameter)

    def blokkeren(self, bron):
        query = """
        UPDATE studenten
               SET studenten.geblokkeerd = ?
               WHERE studenten.id = ?
        """

        parameter = [
            bron["studenten.geblokkeerd"],
        ]

        return self.database_one(query, parameter)


    # Filters
    def aantal_per_pagina(self):
        query = """
                        """
        parameter = []

        return self.database_all(query, parameter)


    # Categorie
    def categorie_filter(self):
        """
        Hergebruiken bij studenten om de filters van categorieën aan te geven.
        Geeft de filter aan bij een bepaalde categorie.
        """
        query = """
        SELECT categorie 
        FROM categorie
        ORDER BY categorie.id ASC
        """

        parameter = []

        return self.database_all(query, parameter)

    def categorie_indeling_filter(self):
        """
        Hergebruiken bij studenten om de filters van indeling aan te geven.
        Geeft een filter aan bij de indeling (kunnen er dus meerdere zijn).
        """
        query = """
        SELECT indeling 
        FROM categorie
        ORDER BY categorie.id ASC
        """

        parameter = []

        return self.database_rest(query, parameter)

    # Categorie toevoegen # Admin
    def categorie_toevoegen(self):
        query = """
        INSERT INTO categorie
                   (categorie,
                   indeling)
        VALUES (?,?)
        """

        parameter = []

        return self.database_rest(query, parameter, row_id=True)


    # Koppel tabellen # admin + studenten

    # Voor het toevoegen van categorieën aan een bron. # Admins + studenten
    def koppel_categorie_bron(self):
        query = """
                INSERT INTO connect_categorie
                    (bronnen_id,
                     categorie_id)
                VALUES (?,?) 
                """

        parameter = []
        return self.database_rest(query, parameter, row_id=True)

    def b_del_connect_categorie(self, bron):
        """
        Verwijderd de bron incl. de koppel tabellen.
        Kan ook gebruikt worden als er een categorie verwijderd wordt.
        """
        query = """
        DELETE FROM connect_categorie
               WHERE bronnen_id = ?
        """
        parameter = [
            bron["id"]
        ]

        return self.database_rest(query, parameter)

    def b_del_connect_beoordeling(self, bron):
        """
        Verwijderd de bron incl. de koppel tabellen.
        """
        query = """
        DELETE FROM connect_beoordeling
               WHERE bronnen_id = ?
        """
        parameter = [
            bron["id"]
        ]

        return self.database_rest(query, parameter)

    # Delete on cascade (database updaten en opslaan) # Admins + Studenten
    def cascade_delete_bron(self,bron):
        """
        Delete de bron (id) van de bron uit de gehele database, incl koppel tabellen.
        """
        query = """
        DELETE FROM bronnen
               WHERE id = ?
        """

        parameter = [
            bron["id"]
        ]

        return self.database_rest(query, parameter)

    def cascade_delete_reactie(self, bron):
        """
        Delete de reactie (id) op de bron, incl koppel tabellen.
        """
        query = """
        DELETE FROM reactie
               WHERE id = ?
        """

        parameter = [
            bron["id"]
        ]

        return self.database_rest(query, parameter)

    # Admin

    def admin_profiel(self, id):
        """
        De profiel van de admin.
        """
        query = """
                SELECT beheerders.id, 
                       beheerders.voornaam, 
                       beheerders.achternaam, 
                       beheerders.email, 
                       beheerders.wachtwoord
                FROM beheerders
                WHERE beheerders.id = ?
                GROUP BY beheerders.id
                """

        parameter = [id]

        return self.database_one(query, parameter)

    def admin_bewerken(self, admin_id: int, bron: dict):
        """
        Profiel bewerken student.
        """
        query = """
        UPDATE beheerders
               SET voornaam = ?,
                   achternaam = ?,
                   email = ?,
                   wachtwoord = ?
               WHERE id = ?

        """
        parameter = [
            bron["voornaam"],
            bron["achternaam"],
            bron["email"],
            bron["wachtwoord"],
            admin_id
        ]

        return self.database_rest(query, parameter)

    def admin_lijst(self) -> List[Any]:
        """
        Haal alle admins op, zonder filters.
        """
        query = """
        SELECT
            beheerders.id,
            beheerders.voornaam,
            beheerders.achternaam,
            beheerders.email,
            beheerders.wachtwoord
        FROM beheerders
        GROUP BY beheerders.id
        ORDER BY beheerders.id ASC
        """

        return self.database_all(query)

    def delete_admin(self, bron: dict):
        """
        Delete de admin die aangeklikt is.
        """
        query = """
        DELETE FROM beheerders
               WHERE beheerders.id = ?
        """
        parameter = [
            bron["id"]
        ]

        return self.database_rest(query, parameter)

    def admin_register(self,
                 voornaam: str,
                 achternaam: str,
                 email: str,
                 wachtwoord: str,):

        query = """
        INSERT INTO beheerders (
                voornaam,
                achternaam,
                email,
                wachtwoord,
                geboortedatum,
                postcode,
                telefoonnummer,
                geslacht
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """

        parameter = [voornaam,
                     achternaam,
                     email,
                     wachtwoord,
                     "Leeg",
                     "Leeg",
                     0,
                     "Leeg"
                     ]

        return self.database_rest(query, parameter, row_id=True)
