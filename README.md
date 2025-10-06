## RACacademy

---

### Start backend

* 🐳 Docker gebruiken (openen)

##### 1. Ga naar de projectmap (in Bash of Terminal)
Zorg dat je in de hoofdmap zit waar docker-compose.yml staat:

       cd /pad/naar/jouw/project

---

##### 2. Docker image bouwen
Gebruik dit commando om de Docker-container op te bouwen en te starten:

       docker-compose up --build

* Dit bouwt de image, laadt je volumes en start automatisch je backend.

---

##### 3. Controleer of alles draait
Open je browser en ga naar: http://127.0.0.1:8000/docs

* Hier zie je de FastAPI-documentatie als alles correct werkt.

---

##### Extra: Volgende keer opnieuw opstarten?
Als Docker al eerder gebouwd is en je geen wijzigingen hebt in je Dockerfile of requirements:

       docker-compose up

* Docker gebruikt dan automatisch het juiste bestand docker-compose.yml in je projectmap.

---

### Installatie React-Native

##### 1. Ga naar de reactapp
Ga naar de map waar je React Native project zich bevindt:

      cd reactapp

---

##### 2. Installer de dependencies

Als de node_modules/ map ontbreekt (bijvoorbeeld na het clonen van het project),  
installeer dan de benodigde packages:

      npm install

---

##### 3. App starten Expo (web)

Start de Expo bundler met:

      npm start -- --reset-cache

* Dit opent automatisch het Expo menu in je terminal.

----

##### 4. App openen in de browser

Wanneer het Expo menu verschijnt in de terminal, druk op:

    W

* Het is ons niet gelukt om de database te openen via de mobiele app
* Open de web applicatie

---

### Lokaal starten (Zonder Docker)

* Mocht de docker niet starten, dan is hier optie nummer 2
* Maak een nieuwe virtual environment aan (nodig voor pip install)!

[Lokaal starten (zonder Docker)](markdown_files/lokaal.md)


---

## Groepsleden
- [Jeffrey](https://github.com/JeffreyDoornbos)
- [Jordi](https://github.com/jordi-1111805)
- [Julie](https://github.com/Julie-1010439)
- [Yoshua](https://github.com/yoshua-1045100)

---

### Guide
- Admin
- Log in met [Gebruikersnaam: docent@hr.nl] & [Wachtwoord: @]   
[Klik hier voor de admin guide](markdown_files/admin.md)

* Als je als admin ingelogd bent, maak dan geen bron aan of favorieten (De database is niet gekoppeld met een admin!)


- Student
- Maak een account aan of log in met [gebruikersnaam: jeff@hr.nl] & [Wachtwoord: Z ]  
[Klik hier voor de studenten guide](markdown_files/student.md)

---

### Credits

- Onze team (Jeffrey Doornbos), (Jordi Vrolijk), (Julie Blokland), (Yoshua Volkerts)
- Hogeschool Rotterdam: leraren, lessen, powerpoints, workshops & opdrachten
- Reactapp van de docent (Sietze)

---

### Bronnen

[Bronnenlijst & verwijzingen](markdown_files/bronnen.md)

---