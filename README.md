# Wunschkiste - Backend

Das Backend der Wunschkiste, einer digitalen Wunschliste als Webanwendung . Es stellt eine REST-API für Nutzerverwaltung (Registrierung/Login mit JWT), sowie das Anlegen, Lesen, Bearbeiten und Löschen von Wünschen inklusive Bild-Upload bereit.

## Beschreibung

Das Backend stellt folgende Kernfunktionen bereit:

- **Registrierung & Login**: Passwörter werden mit `bcrypt` gehasht gespeichert. Beim Login wird ein **JWT** ausgestellt, das das Frontend bei jedem weiteren Request im Header mitschickt.
- **Geschützte Wunsch-Verwaltung**: Alle `/wuensche`-Endpunkte prüfen, ob ein gültiger Token mitgeschickt wurde, bevor Daten zurückgegeben oder verändert werden .
- **CRUD für Wünsche**: Wünsche mit Titel, Kategorie, Preis, Link, Notiz und Bild lassen sich anlegen, auslesen, aktualisieren und löschen.
- **Bild-Upload**: Über `multer` können Bilddateien direkt mit dem Wunsch hochgeladen werden. Die Datei werden im Ordner `uploads/` gespeichert und über eine statische Route ausgeliefert.

## Verwendete Technologien
- **Node.js** mit **Express** (`express.Router()`)
- **MongoDB** über **Mongoose** (Schemas in `models/`)
- **bcrypt** zum Hashen von Passwörtern
- **jsonwebtoken (JWT)** zur Authentifizierung
- **multer** für den Datei-Upload
- **cors** für den Cross-Origin-Requests vom Frontend (Port 4200 → Backend Port 3000)
- **dontev** für Umgebungsvariablen

## Installation

### Schritte

1. Repository klonen:
```bash
git clone https://github.com/bngapinsi/Wunschkiste-backend
cd Wunschkiste-backend
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. `.env`-Datei im Projektstamm anlegen mit folgendem Inhalt:
```env
DB_CONNECTION= 
DATABASE= wunschkiste
PORT=3000
```
4. Ordner für Bild-Uploads anlegen (falls nicht automatisch vorhanden):
```bash
mkdir uploads
```

5. Server starten:
```bash
node server.js
```

Der Server läuft anschließend unter `http://localhost:3000`.

## Verwendung von KI-Tools

**Claude (Antrophic)**:
- **Backend-Setup**: MongoDB-Atlas-Anbindung über Mongoose, sowie CRUD-Routen
- **Datei-Upload für Wunschbilder**: Multer-Integration plus statisches Ausliefern der Uploads über Express
- **Fehlersuche und Debugging**: u.a. fehlerhafte Feldzuordnungen in Backend-Routen, fehlendes Zone.js-Paket sowie fehlende FormData-Übertragung beim Bild-Upload wurden identifiziert und behoben









