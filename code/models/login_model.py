from email.policy import default
from fastapi import Query
from flask import Flask, blueprints, jsonify
from .database_model import Database


class Loginmodel(Database):


    def login(self, email: str, wachtwoord: str):

        query = """
        SELECT studenten.id, studenten.voornaam, studenten.achternaam, studenten.email, studenten.studentnummer, studenten.wachtwoord,
        studenten.score, studenten.geblokkeerd, studenten.gebruikersnaam 
        FROM studenten
        WHERE studenten.email = ? AND studenten.wachtwoord = ?
        """

        parameter = [email, wachtwoord]
        return self.database_all(query, parameter)

class adminLoginmodel(Database):


    def adminlogin(self, email: str, wachtwoord: str):

        query = """
        SELECT beheerders.id, beheerders.voornaam, beheerders.achternaam, beheerders.email, beheerders.wachtwoord
        FROM beheerders
        WHERE beheerders.email = ? AND beheerders.wachtwoord = ?
        """

        parameter = [email, wachtwoord]
        return self.database_all(query, parameter)
