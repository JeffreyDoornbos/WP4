import sqlite3, os

base_dir = os.path.dirname(os.path.abspath(__file__))
database_path = os.path.join(base_dir, '...', 'database', 'database.db')
print(database_path)

conn = sqlite3.connect("database_path")
cursor = conn.cursor()

# Admins van de website
def admins():
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS beheerders(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    voornaam TEXT NOT NULL,
    achternaam TEXT NOT NULL,
    email TEXT NOT NULL,
    wachtwoord TEXT NOT NULL,
    geboortedatum TEXT NOT NULL,
    postcode TEXT NOT NULL,
    telefoonnummer INTEGER NOT NULL,
    geslacht TEXT NOT NULL,
    privileges INTEGER NOT NULL DEFAULT 0
    )
    ''')

# Studenten van de website
def studenten():
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS studenten(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    voornaam TEXT NOT NULL,
    achternaam TEXT NOT NULL,
    gebruikersnaam TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    wachtwoord TEXT NOT NULL,
    studentnummer INTEGER NOT NULL,
    geboortedatum TEXT NOT NULL,
    postcode TEXT NOT NULL,
    huisnummer TEXT NOT NULL,
    telefoonnummer INTEGER NOT NULL,
    geslacht TEXT NOT NULL,
    score INTEGER,
    waarschuwing INTEGER DEFAULT 0,
    muted INTEGER DEFAULT 0,
    geblokkeerd INTEGER DEFAULT 0,
    afbeelding_icoon TEXT
    )
    ''')

# Bronnen
def bronnen():
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS bronnen(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bron_titel TEXT NOT NULL,
    bron_tekst TEXT NOT NULL,
    bron_link TEXT,
    Bron_video TEXT,
    datum_aangemaakt DATETIME DEFAULT CURRENT_TIMESTAMP,
    beoordeeld INTEGER DEFAULT 0
    )
    ''')

# Beoordeling 0 tot 10 (omzetten in (halve)sterren
def beoordeling():
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS beoordeling(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beoordeling INTEGER NOT NULL,
    studenten_id INTEGER REFERENCES studenten(id),
    datum_aangemaakt DATETIME DEFAULT CURRENT_TIMESTAMP,
    bronnen_id INTEGER REFERENCES bronnen(id) ON DELETE CASCADE
    )
    ''')

# Categorie bronnen (Admins zouden eventueel zelf categorieën kunnen toevoegen/verwijderen)
def categorie():
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS categorie(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categorie TEXT NOT NULL,
    indeling TEXT NOT NULL
    )
    ''')

# Reactie van andere studenten
def reactie():
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS reactie(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reactie TEXT NOT NULL,
    beoordeeld INTEGER DEFAULT 0,
    datum_aangemaakt DATETIME DEFAULT CURRENT_TIMESTAMP,
    bronnen_id INTEGER REFERENCES bronnen(id) ON DELETE CASCADE
    )
    ''')

# Connect student met bronnen
def connect_bronnen():
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS connect_bronnen(
    studenten_id INTEGER REFERENCES studenten(id),
    bronnen_id INTEGER REFERENCES bronnen(id) ON DELETE CASCADE
    )
    ''')

# Connect bron met categorie (meerdere categorieën mogelijk)
def connect_categorie():
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS connect_categorie(
    bronnen_id INTEGER REFERENCES bronnen(id) ON DELETE CASCADE, 
    categorie_id INTEGER REFERENCES categorie(id)
    )
    ''')

# Connect bron met individuele beoordeling (Max 1 beoordeling per student)
def connect_beoordeling():
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS connect_beoordeling(
    bronnen_id INTEGER REFERENCES bronnen(id) ON DELETE CASCADE,
    beoordeling_id INTEGER REFERENCES beoordeling(id)
    )
    ''')

# Connect bron met reactie (meerdere reacties mogelijk)
def connect_reactie():
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS connect_reactie(
    bronnen_id INTEGER REFERENCES bronnen(id) ON DELETE CASCADE,
    reactie_id INTEGER REFERENCES reactie(id) ON DELETE CASCADE,
    studenten_id INTEGER REFERENCES studenten(id)
    )
    ''')

# insert categorie bronnen
def insert_categorie(categorie, indeling):
    cursor.execute('''
    INSERT OR REPLACE INTO categorie (categorie, indeling)
    VALUES ( ?, ?)
    ''', (categorie, indeling,))

    conn.commit()

categorie_lijst = [
    # Werkplaats
    ("Werkplaats 1", "Werkplaats"),
    ("Werkplaats 2", "Werkplaats"),
    ("Werkplaats 3", "Werkplaats"),
    ("Werkplaats 4", "Werkplaats"),
    ("Werkplaats 5", "Werkplaats"),
    ("Werkplaats 6", "Werkplaats"),
    ("Geen werkplaats", "Werkplaats"),
    ("Werkplaats herkansing", "Werkplaats"),

    # Programmeertalen
    ("HTML", "Programmeertalen"),
    ("CSS", "Programmeertalen"),
    ("Javascript", "Programmeertalen"),
    ("Python", "Programmeertalen"),
    ("Overige programmeertalen", "Programmeertalen"),

    #Software
    ("GitHub", "Software"),
    ("Docker", "Software"),

    # Databases
    ("SQLite", "Databases"),
    ("MyQuery", "Databases"),
    ("Overige databases", "Databases"),

    # Frameworks
    ("React", "Frameworks"),
    ("Flask", "Frameworks"),
    ("Jinja", "Frameworks"),
    ("Overige frameworks", "Frameworks"),

    # Integraties
    ("API's", "Integraties"),
    ("JSON", "Integraties"),
    ("Overige integraties", "Integraties"),

    # Python packages
    ("Pygame", "Packages"),
    ("Jinja2", "Packages"),
    ("OS", "Packages"),
    ("Faker", "Packages"),
    ("Pip", "Packages"),
    ("NumPy", "Packages"),
    ("Overige packages", "Packages"),

    # Technologie
    ("Frontend", "Ontwikkelgebieden"),
    ("Backend", "Ontwikkelgebieden"),
    ("Fullstack", "Ontwikkelgebieden"),

]

# Aanroepen tot functies
admins()
studenten()
bronnen()
beoordeling()
categorie()
reactie()
connect_bronnen()
connect_categorie()
connect_beoordeling()
connect_reactie()

# Insert lijst van categorieën
for categorie in categorie_lijst:
    insert_categorie(*categorie)

conn.commit()
conn.close()