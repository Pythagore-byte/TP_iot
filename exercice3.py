from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
import sqlite3
import random
import httpx

# Remplacez par votre clé API OpenWeatherMap
API_KEY = "f3e25221109fa7d38b649edfff5827f2"
BASE_URL = "https://api.openweathermap.org/data/2.5/forecast"

# ouverture/initialisation de la base de donnee 
def initialisation_base():
    conn = sqlite3.connect('mabase.db')  # on crée une connexion
    conn.row_factory = sqlite3.Row
    return conn

app = FastAPI()

tables_autorisees = ["Logement", "Piece", "Facture", "Mesure", "CapteurActionneur", "TypeCapteur", ""]
liste_facture = [
    "Eau",
    "Electricité",
    "Loyer",
    "Déchets",
    "Internet",
    "Assurance"
]
N = 10

@app.get("/Table/{nom_table}")
async def get_valeurs_table(nom_table):
    if nom_table not in tables_autorisees:
        raise HTTPException(status_code=400, detail="Table non autorisée")

    try:
        conn = initialisation_base()
        c = conn.cursor()
        requette = f"SELECT * FROM {nom_table}"
        c.execute(requette)
        lignes = c.fetchall()

        valeurs = [dict(ligne) for ligne in lignes]
        for x in valeurs:
            print(x)
        return valeurs

    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail="Erreur de base de données: {}".format(str(e)))
    finally:
        conn.close()


@app.post("/Table/{nom_table}")
async def post_valeurs_dans_table(nom_table):
    if nom_table not in tables_autorisees:
        raise HTTPException(status_code=400, detail="Table inexistante")
    try:
        conn = initialisation_base()
        c = conn.cursor()
        if nom_table == "Facture":
            req = f"INSERT INTO {nom_table}(Type_facture, Montant, Valeur_consommee, id_logement) VALUES(?,?,?,?)"
            for x in range(N):
                c.execute(req, (random.choice(liste_facture), round(random.uniform(20, 38), 1), round(random.uniform(20, 38), 1), 2))
            conn.commit()

        elif nom_table == "Mesure":
            id = random.randint(1, 2)
            if id == 1:
                L = [round(random.uniform(20, 38), 2) for x in range(N)]
            elif id == 2:
                L = [random.randint(0, 1) for x in range(N)]

            req = f"INSERT INTO {nom_table} (Valeur, id_capteur_actionneur) VALUES (?,?)"
            for valeur in L:
                c.execute(req, (valeur, id))
            conn.commit()
        else:
            print(f"La table {nom_table} n'existe pas, donc insertion impossible.\n")

    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail="Erreur de base de données: {}".format(str(e)))
    finally:
        conn.close()


@app.get("/previsions_meteo", response_class=HTMLResponse)
async def previsions_meteo(ville: str = "Conakry"):
    try:
        # URL pour les prévisions à 5 jours
        url = f"{BASE_URL}?q={ville}&appid={API_KEY}&units=metric&lang=fr"

        # Faire une requête asynchrone à l'API météo
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()

        # Extraire les prévisions pour les 5 jours
        previsions = []
        for forecast in data['list']:
            date = forecast['dt_txt']
            temp = forecast['main']['temp']
            description = forecast['weather'][0]['description']
            previsions.append(f"{date}: {temp}°C, {description}")

        # Générer une page HTML pour afficher les prévisions
        previsions_html = "<br>".join(previsions)
        html_content = f"""
        <html>
            <head><title>Prévisions météo pour {ville}</title></head>
            <body>
                <h1>Prévisions météo pour {ville}</h1>
                <p>{previsions_html}</p>
            </body>
        </html>
        """
        return HTMLResponse(content=html_content)

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Erreur lors de la récupération des prévisions météo.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")
