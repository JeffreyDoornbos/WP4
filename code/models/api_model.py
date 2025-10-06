from flask import Flask, blueprints, jsonify
from database_model import Database


class Apimodel(Database):

    def admins(self):
        return jsonify

    def studenten(self):
        return jsonify

    def nieuwe_bron(self):
        # for ?? in ??:
        # if
        # if not
        return jsonify