import sqlite3
from .database_model import Database 
import os
from typing import List, Any

class Studentenmodel(Database):
    """
    Database‐model voor studenten en bronnen.
    Veronderstelt dat Database de helper‐methoden biedt:
      - self.database_all(query, parameter)
      - self.database_one(query, parameter)
      - self.database_rest(query, parameter, row_id: bool)
    """



    def cascade_delete_bron(self, bron_id: int) -> bool:
        """
        Verwijdert een bron + alle koppeltabellen in de juiste volgorde.
        We schakelen FK‐checks tijdelijk uit om constraint‐fails te voorkomen.
        """
        conn = sqlite3.connect(self.database_path)
        cursor = conn.cursor()
        try:
            # 1) tijdelijke uitschakeling FK‐checks
            cursor.execute("PRAGMA foreign_keys = OFF;")
            # 2) verwijder koppeltabellen
            cursor.execute("DELETE FROM connect_bronnen   WHERE bronnen_id = ?", (bron_id,))
            cursor.execute("DELETE FROM connect_favorieten WHERE bronnen_id = ?", (bron_id,))
            # pas hieronder aan als je wél reacties/beoordeling hebt
            # cursor.execute("DELETE FROM reacties          WHERE bronnen_id = ?", (bron_id,))
            # cursor.execute("DELETE FROM beoordeling       WHERE bronnen_id = ?", (bron_id,))
            # 3) verwijder de bron zelf
            cursor.execute("DELETE FROM bronnen WHERE id = ?", (bron_id,))
            # 4) commit en FK‐checks weer aanzetten
            conn.commit()
            cursor.execute("PRAGMA foreign_keys = ON;")
            return True
        except sqlite3.Error as e:
            print(f"Fout bij cascade_delete_bron: {e}")
            return False
        finally:
            conn.close()

    # Globaal
    def studenten_lijst(self, search=None, score=None, bronnen=None):
        """
        Haal lijst met studenten op, met optionele filters:
         - search: zoekterm op voornaam/achternaam
         - score: 'ASC' of 'DESC' op studenten.score
         - bronnen: minimumaantal gekoppelde bronnen per student
        """
        query = """
        SELECT
            studenten.id,
            studenten.voornaam,
            studenten.achternaam,
            studenten.email,
            studenten.studentnummer,
            studenten.geboortedatum,
            studenten.geslacht,
            studenten.score,
            COUNT(DISTINCT bronnen.id) AS aantal_bronnen,
            studenten.afbeelding_icoon,
            studenten.gebruikersnaam
        FROM studenten
        LEFT JOIN connect_bronnen ON studenten.id = connect_bronnen.studenten_id
        LEFT JOIN bronnen ON connect_bronnen.bronnen_id = bronnen.id
        WHERE studenten.geblokkeerd = 0
        """
        parameter = []

        if search:
            query += " AND (studenten.voornaam LIKE ? OR studenten.achternaam LIKE ?)"
            parameter.extend([f"%{search}%", f"%{search}%"])

        query += " GROUP BY studenten.id"

        if bronnen:
            query += " HAVING COUNT(DISTINCT bronnen.id) >= ?"
            parameter.append(bronnen)

        if score == "ASC":
            query += " ORDER BY studenten.score ASC"
        else:
            query += " ORDER BY studenten.score DESC"

        return self.database_all(query, parameter)


    def bronnen_lijst(self, search, categorie, beoordeling, datum, count):
        """
        Haal lijst met bronnen op inclusief filters:
         0: id
         1: bron_titel
         2: bron_tekst
         3: bron_video
         4: student_naam (GROUP_CONCAT)
         5: aantal_reacties (COUNT)
         6: categorie_namen (GROUP_CONCAT)
         7: indeling_namen (GROUP_CONCAT)
         8: gemiddelde_beoordeling (AVG)
         9: aantal_bronnen (COUNT)
        """
        query = """
        SELECT 
            bronnen.id, 
            bronnen.bron_titel, 
            bronnen.bron_tekst, 
            bronnen.bron_video, 
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
        LEFT JOIN studenten ON connect_bronnen.studenten_id = studenten.id
        LEFT JOIN connect_categorie ON bronnen.id = connect_categorie.bronnen_id
        LEFT JOIN categorie ON connect_categorie.categorie_id = categorie.id
        LEFT JOIN connect_beoordeling ON bronnen.id = connect_beoordeling.bronnen_id
        LEFT JOIN beoordeling ON connect_beoordeling.beoordeling_id = beoordeling.id
        WHERE studenten.geblokkeerd = 0
        """
        parameter = []

        if search:
            query += " AND (bronnen.bron_titel LIKE ? OR bronnen.bron_tekst LIKE ?)"
            parameter.extend([f"%{search}%", f"%{search}%"])

        if categorie:
            query += " AND (categorie.categorie LIKE ? OR categorie.indeling LIKE ?)"
            parameter.extend([f"%{categorie}%", f"%{categorie}%"])

        query += " GROUP BY bronnen.id"
        order_by = []

        if beoordeling == 'ASC':
            order_by.append= " ORDER BY gemiddelde_beoordeling ASC"
        elif beoordeling:
            order_by.append= " ORDER BY gemiddelde_beoordeling DESC"

        if datum == "ASC":
            order_by.append += " ORDER BY bronnen.datum_aangemaakt ASC"
        elif datum == "DESC":
            order_by.append += " ORDER BY bronnen.datum_aangemaakt DESC"

        if order_by:
            query += " ORDER BY " + ", ".join(order_by)

        return self.database_all(query, parameter)


    def bron_bekijken(self, bron_id: int, studenten_id: int = None):
        """
        Haal detail van één bron op, met gekoppelde studenten, reacties, categorieën en gemiddelde beoordeling.
        Retourneert tuple met kolomvolgorde:
          0: id
          1: bron_titel
          2: bron_tekst
          3: bron_link
          4: bron_video
          5: datum_aangemaakt
          6: beoordeeld
          7: student_naam
          8: aantal_reacties
          9: categorie_namen
         10: indeling_namen
         11: gemiddelde_beoordeling
        """
        query = """
        SELECT 
            bronnen.id,
            bronnen.bron_titel,
            bronnen.bron_tekst,
            bronnen.bron_link,
            bronnen.bron_video,
            bronnen.datum_aangemaakt,
            GROUP_CONCAT(DISTINCT studenten.voornaam) AS student_naam,
            COUNT(DISTINCT reactie.id) AS aantal_reacties,
            GROUP_CONCAT(DISTINCT categorie.categorie) AS categorie_namen,
            GROUP_CONCAT(DISTINCT categorie.indeling) AS indeling_namen,
            AVG(beoordeling.beoordeling) AS gemiddelde_beoordeling
        FROM bronnen
        LEFT JOIN connect_reactie ON bronnen.id = connect_reactie.bronnen_id
        LEFT JOIN reactie ON connect_reactie.reactie_id = reactie.id
        LEFT JOIN connect_bronnen ON bronnen.id = connect_bronnen.bronnen_id
        LEFT JOIN studenten ON connect_bronnen.studenten_id = studenten.id
        LEFT JOIN connect_categorie ON bronnen.id = connect_categorie.bronnen_id
        LEFT JOIN categorie ON connect_categorie.categorie_id = categorie.id
        LEFT JOIN connect_beoordeling ON bronnen.id = connect_beoordeling.bronnen_id
        LEFT JOIN beoordeling ON connect_beoordeling.beoordeling_id = beoordeling.id
        WHERE studenten.geblokkeerd = 0
          AND bronnen.id = ?
        GROUP BY bronnen.id
        """

        bron_data = self.database_one(query, [bron_id])
        if not bron_data:
            return None

        beoordeling_student = None
        if studenten_id is not None:
            beoordeling_query = """
            SELECT beoordeling FROM beoordeling
            WHERE studenten_id = ? AND bronnen_id = ?
            """
            res = self.database_one(beoordeling_query, [studenten_id, bron_id])
            if res:
                beoordeling_student = res[0]

        bron_list = list(bron_data)

        bron_list.insert(6, beoordeling_student)

        return tuple(bron_list)


    def student_bekijken(self, student_id: int):
        """
        Laat het aantal bronnen zien, hierop kun je klikken om naar student_bronnen te gaan.
        * Bekijkt de student
        * Alleen mogelijk als de student niet geblokkeerd is?
        """
        query = """
        SELECT studenten.id, 
               studenten.voornaam, 
               studenten.achternaam, 
               studenten.email, 
               studenten.studentnummer,
               studenten.geboortedatum, 
               studenten.geslacht, 
               studenten.score, 
               COUNT(DISTINCT bronnen.id) AS aantal_bronnen,
               studenten.afbeelding_icoon, 
               studenten.gebruikersnaam 
        FROM studenten
        LEFT JOIN connect_bronnen ON studenten.id = connect_bronnen.studenten_id
        LEFT JOIN bronnen ON connect_bronnen.studenten_id = bronnen.id
        WHERE studenten.geblokkeerd = 0 AND studenten.id = ?
        GROUP BY studenten.id
        """

        parameter = [id]

        return self.database_one(query, parameter)


    def mijn_bronnen(self, studenten_id: int) -> List[Any]:
        """
        Haal alle bronnen op die door deze student zijn toegevoegd.
        """
        query = """
        SELECT
            b.id,
            b.bron_titel,
            b.bron_tekst,
            b.bron_link,
            b.bron_video,
            b.datum_aangemaakt,
            b.beoordeeld
        FROM bronnen AS b
        INNER JOIN connect_bronnen AS cb
            ON b.id = cb.bronnen_id
        WHERE cb.studenten_id = ?
        ORDER BY b.datum_aangemaakt DESC
        """
        return self.database_all(query, [studenten_id])

    def nieuwe_bron(self, bron: dict) -> int:
        """
        Maak een nieuwe bron aan, retourneer het nieuw gegenereerde ID (row_id=True).

        Nieuwe bron aanmaken + koppelen met categorie.
        * Maakt een nieuwe bron aan
        * Bron titel
        * Bron tekst
        * Bron link
        * Bron video
        * Datum aangemaakt
        * Beoordeeld = niet beoordeeld 0 / beoordeeld 1 (admin)
        """
        query = """
        INSERT INTO bronnen
                   (bron_titel,
                    bron_tekst,
                    bron_link,
                    bron_video,
                    datum_aangemaakt,
                    beoordeeld)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 0)
        """

        parameter = [
            bron["bron_titel"],
            bron["bron_tekst"],
            bron["bron_link"],
            bron["bron_video"]
        ]

        return self.database_rest(query, parameter, row_id=True)

    def koppel_bron_aan_student(self, bron_id: int, studenten_id: int) -> None:
        """
        Koppel de net aangemaakte bron (bron_id) aan een student (studenten_id).
        """
        query = """
        INSERT INTO connect_bronnen (bronnen_id, studenten_id)
        VALUES (?, ?)
        """
        parameters = [bron_id, studenten_id]
        self.database_rest(query, parameters, row_id=False)

    def wijzig_bron(self, bron_id, bron_data):
        """
        Wijzigt de bron, behoud aanmaakdatum, veranderd beoordeeld standaard naar 0 (niet beoordeeld).
        """
        query = """
        UPDATE bronnen
               SET bron_titel = ?,
                   bron_tekst = ?,
                   bron_link = ?,
                   bron_video = ?,
                   beoordeeld = 0
               WHERE id = ?
        
        """
        parameter = [
            bron_data["bron_titel"],
            bron_data["bron_tekst"],
            bron_data["bron_link"],
            bron_data["bron_video"],
            bron_id
        ]

        return self.database_rest(query, parameter)

    def beoordeel_bron(self, payload: dict) -> bool:
        check_q = """
        SELECT id FROM beoordeling WHERE studenten_id = ? AND bronnen_id = ?
        """
        existing = self.database_one(check_q, [
            payload["studenten_id"],
            payload["bronnen_id"],
        ])

        if existing:
            update_q = """
            UPDATE beoordeling
            SET beoordeling = ?
            WHERE studenten_id = ? AND bronnen_id = ?
            """
            updated = self.database_rest(update_q, [
                payload["beoordeling"],
                payload["studenten_id"],
                payload["bronnen_id"],
            ])
            return bool(updated)
        else:
            insert_q = """
            INSERT INTO beoordeling (studenten_id, bronnen_id, beoordeling)
            VALUES (?, ?, ?)
            """
            inserted = self.database_rest(insert_q, [
                payload["studenten_id"],
                payload["bronnen_id"],
                payload["beoordeling"]
            ])
            return bool(inserted)

    def reactie_bron(self):
        """
        Bronnen_lijst query haalt alle bronnen op.
        Voor filters moet ik nog een oplossing vinden.
        """
        bronnen = self.database_one("SELECT * FROM bronnen")
        return bronnen


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

        parameter = [id]

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

        parameter = [id]

        return self.database_rest(query, parameter)


    # Eigen gegevens
    def mijn_profiel(self, id):
        """
        Bronnen_lijst query haalt alle bronnen op.
        Voor filters moet ik nog een oplossing vinden.
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
               studenten.afbeelding_icoon, 
               studenten.gebruikersnaam,
               studenten.waarschuwing,
               studenten.muted,
               studenten.geblokkeerd,
               studenten.wachtwoord
        FROM studenten
        LEFT JOIN connect_bronnen ON studenten.id = connect_bronnen.studenten_id
        LEFT JOIN bronnen ON connect_bronnen.bronnen_id = bronnen.id
        WHERE studenten.id = ?
        GROUP BY studenten.id
        """

        parameter = [id]

        return self.database_one(query, parameter)

    def profiel_bewerken(self, student_id: int, bron: dict):
        """
        Profiel bewerken student.
        """
        query = """
        UPDATE studenten
               SET gebruikersnaam = ?,
                   postcode = ?,
                   huisnummer = ?,
                   telefoonnummer = ?,
                   wachtwoord = ?,
                   afbeelding_icoon = ?,
                   voornaam = ?,
                   achternaam = ?,
                   email = ?,
                   studentnummer = ?,
                   geboortedatum = ?,
                   geslacht = ? 
               WHERE id = ?

        """
        parameter = [
            bron["gebruikersnaam"],
            bron["postcode"],
            bron["huisnummer"],
            bron["telefoonnummer"],
            bron["wachtwoord"],
            bron["afbeelding_icoon"],
            bron["voornaam"],
            bron["achternaam"],
            bron["email"],
            bron["studentnummer"],
            bron["geboortedatum"],
            bron["geslacht"],
            student_id
        ]

        return self.database_rest(query, parameter)

    def mijn_bronnen(self, search, categorie, beoordeling, datum):
        """
        Bronnen_lijst query haalt alle bronnen op.
        Voor filters moet ik nog een oplossing vinden.
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
                WHERE studenten.geblokkeerd = 0 AND studenten.id = ?
                """

        parameter = [id]

        if search:
            query += "AND (bronnen.titel LIKE ? OR bronnen.tekst LIKE ?)"
            parameter.extend([f"%{search}%", f"%{search}%"])

        if categorie:
            query += " AND (categorie.categorie LIKE ? OR categorie.indeling LIKE ?)"
            parameter.extend([f"%{categorie}%", f"%{categorie}%"])

        query += " GROUP BY bronnen.id"
        order_by = []

        if beoordeling == 'ASC':
            order_by.append= " ORDER BY gemiddelde_beoordeling ASC"
        elif beoordeling:
            order_by.append= " ORDER BY gemiddelde_beoordeling DESC"

        if datum == "ASC":
            order_by.append += " ORDER BY bronnen.datum_aangemaakt ASC"
        elif datum == "DESC":
            order_by.append += " ORDER BY bronnen.datum_aangemaakt DESC"

        if order_by:
            query += " ORDER BY " + ", ".join(order_by)

        return self.database_all(query, parameter)

    def mijn_feedback(self):
        """
        Bronnen_lijst query haalt alle bronnen op.
        Voor filters moet ik nog een oplossing vinden.
        """
        bronnen = self.database_all("SELECT * FROM reactie WHERE = ?")
        return bronnen

    def mijn_ontvangen_feedback(self):
        """
        Bronnen_lijst query haalt alle bronnen op.
        Voor filters moet ik nog een oplossing vinden.
        """
        bronnen = self.database_all("SELECT * FROM reactie WHERE = ?")
        return bronnen

    def mijn_punten(self):
        """
        Bronnen_lijst query haalt alle bronnen op.
        Voor filters moet ik nog een oplossing vinden.
        """
        bronnen = self.database_all("SELECT * FROM bronnen, feedback, beoordeling WHERE = ?")
        return bronnen

    def mijn_sancties(self):
        """
        Bronnen_lijst query haalt alle bronnen op.
        Voor filters moet ik nog een oplossing vinden.
        """
        bronnen = self.database_all("SELECT * FROM bronnen")
        return bronnen

    # Reageren
    def nieuwe_reactie(self):
        """
        Bronnen_lijst query haalt alle bronnen op.
        Voor filters moet ik nog een oplossing vinden.
        """
        bronnen = self.database_all("SELECT * FROM bronnen")
        return bronnen

    def cascade_delete_reactie(self, bron_id):
        """
        Delete de reactie (id) op de bron, incl. koppel tabellen.
        """
        query = """
        DELETE FROM reactie
               WHERE id = ?
        """

        parameter = [id]

        return self.database_rest(query, parameter)

    def voeg_favoriet_toe(self, studenten_id: int, bronnen_id: int) -> None:
        query = """
        INSERT INTO connect_favorieten (studenten_id, bronnen_id)
        VALUES (?, ?)
        """
        parameters = [studenten_id, bronnen_id]
        self.database_rest(query, parameters, row_id=False)

    def verwijder_favoriet(self, studenten_id: int, bronnen_id: int) -> None:
        query = """
        DELETE FROM connect_favorieten
        WHERE studenten_id = ? AND bronnen_id = ?
        """
        parameters = [studenten_id, bronnen_id]
        self.database_rest(query, parameters, row_id=False)

    def lijst_favoriete_bronnen(self, studenten_id: int):
        query = """
        SELECT bronnen.*
        FROM bronnen
        INNER JOIN connect_favorieten
            ON bronnen.id = connect_favorieten.bronnen_id
        WHERE connect_favorieten.studenten_id = ?
        """
        return self.database_all(query, [studenten_id])
