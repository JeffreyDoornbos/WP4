from email.policy import default
from fastapi import Query
from flask import Flask, blueprints, jsonify
from .database_model import Database
from typing import Optional

class Registermodel(Database):
    def register(self,
                 voornaam:str,
                 achternaam:str,
                 gebruikersnaam:str,
                 wachtwoord:str,
                 studentnummer:str,
                 email: str,
                 telefoonnummer:str,
                 postcode:str,
                 geboortedatum: str,
                 geslacht:str,
                 huisnummer:str,
                 afbeelding_icoon: Optional[str] = None):
        query = """
        insert into 
            studenten (
            voornaam, 
            achternaam, 
            gebruikersnaam, 
            wachtwoord, 
            studentnummer,
            email, 
            telefoonnummer, 
            postcode,
            geboortedatum,
            geslacht,
            huisnummer,
            afbeelding_icoon) values (?,?,?,?,?,?, ?,?,?, ?,?,?)
        """
        parameters = [voornaam, achternaam, gebruikersnaam, wachtwoord, studentnummer, email, telefoonnummer, postcode, geboortedatum, geslacht, huisnummer, afbeelding_icoon]

        new_id = self.database_rest(query, parameters, row_id=True)
        return new_id
