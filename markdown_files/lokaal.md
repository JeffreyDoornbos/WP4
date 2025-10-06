### Lokaal starten (Zonder docker)

* Mocht de docker niet starten, dan is hier optie nummer 2
* Maak een nieuwe virtual environment aan (nodig voor pip install)!

---

### Back-end

Mocht het allemaal niet werken?

voor backend

typ in bash (command prompt) (1 voor 1):

      cd code
    
      pip install -r requirements.txt

      uvicorn app:app --host 0.0.0.0 --port 8000 --reload

---

### Front-end

Open een nieuwe bash (command prompt) en typ (1 voor 1):

      cd reactapp
      
      npm install

Als npm install niet werkt

      npm install --force

Alle gegevens staan in de package.json en package-lock.json

Als dit klaar is start je op, kies welke je zelf fijner vind:

      npm start

      npx expo start

Vanaf hier kun je verder, ga terug naar de README en start de guides.