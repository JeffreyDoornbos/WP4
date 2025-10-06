from flask import Blueprint, render_template, request
from flask_sqlalchemy import SQLAlchemy

homepage_routes = Blueprint('homepage_routes', __name__)

@homepage_controller.route('/homepage')
def index():
    return render_template("homepage.html") #yoshua je zou hier de homepage in kunnen maken