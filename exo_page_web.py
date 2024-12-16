from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
import sqlite3
import random
import httpx
from fastapi.middleware.cors import CORSMiddleware

API_KEY = "f3e25221109fa7d38b649edfff5827f2"
BASE_URL = "https://api.openweathermap.org/data/2.5/forecast"

# ouverture/initialisation de la base de donnee 
def initialisation_base():
    conn = sqlite3.connect('mabase.db')  # on crée une connexion
    conn.row_factory = sqlite3.Row
    return conn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Remplacez "*" par les domaines autorisés si nécessaire
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



tables_autorisees = ["Logement", "Piece", "Facture", "Mesure", "CapteurActionneur", "TypeCapteur", ""]
liste_facture = [
    "Eau",
    "Electricité",
    "Loyer",
    "Déchets",
    "Internet",
    "Assurance",
    "Gaz"
]
liste_piece=[
    "Salon",
    "Chambre",
    "Cuisine",
    "Salle de bain"
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
        elif nom_table =="Piece": 
            req = f"INSERT INTO {nom_table} (nom_piece, coordonnees_x, coordonnees_y,coordonnees_z, id_logement) VALUES (?,?,?,?,?)"    
            c.execute(req, (random.choice(liste_piece), random.randint(1,100),random.randint(1,100),random.randint(1,100),random.randint(1,100)))     
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
@app.post("/typecapteur/creer")
async def creer_typecapteur(nom: str, unite: str, precision: str):
    """
    Endpoint pour créer un nouveau type de capteur.
    Exemple :
    POST /typecapteur/creer
    Body JSON :
    {
        "nom": "Humidité",
        "unite": "%",
        "precision": "0.1"
    }
    """
    try:
        # Connexion à la base
        conn = initialisation_base()
        c = conn.cursor()

        # Insérer le type de capteur
        req = """
            INSERT INTO TypeCapteur (nom, Unite_mesure, Plage_precision)
            VALUES (?, ?, ?)
        """
        c.execute(req, (nom, unite, precision))
        conn.commit()
        conn.close()

        return {"status": "success", "message": f"TypeCapteur '{nom}' créé avec succès."}

    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur de base de données : {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/donnees-capteur")
async def recevoir_donnees_capteur(data: dict):
    """
    Endpoint pour recevoir les données des capteurs/actionneurs.
    :param data: Dictionnaire contenant les données JSON du capteur.
        Exemple: {"temperature": 35, "humidite": 45}
    """
    try:
        # Récupérer les données envoyées
        temperature = data.get("temperature")
        humidite = data.get("humidité")

        if temperature is None or humidite is None:
            raise HTTPException(status_code=400, detail="Données manquantes dans la requête")

        # Déterminer si une action est nécessaire
        action = None
        led_state = "off"

        if temperature > 30:
            action = "Allumer la LED (température élevée)"
            led_state = "on"
            print(f"Température détectée : {temperature}°C. Action : {action}")
        elif humidite < 20:
            action = "Activer l'humidificateur"
            print(f"Humidité détectée : {humidite}%. Action : {action}")

        # Sauvegarder les données dans la base
        conn = initialisation_base()
        c = conn.cursor()

        # Enregistrer les mesures dans la table Mesure
        req_mesure = "INSERT INTO Mesure (Valeur, id_capteur_actionneur) VALUES (?, ?)"  
        c.execute(req_mesure, (temperature,1))
        c.execute(req_mesure, (humidite,3))

        # Enregistrer l'action dans la table Actions si nécessaire
        if action:
            req_action = """
                INSERT INTO Actions (id_capteur_actionneur, action, date_action)
                VALUES (NULL, ?, CURRENT_TIMESTAMP)
            """
            c.execute(req_action, (action,))

        conn.commit()
        return {
            "status": "success",
            "message": "Données reçues et traitées avec succès.",
            "led_state": led_state  # Ajouter l'état de la LED dans la réponse
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/capteurs")
async def get_capteurs():
    try:
        conn = initialisation_base()
        c = conn.cursor()

        # Récupérer la dernière mesure et déterminer le statut
        query = """
            SELECT 
                c.id_capteur_actionneur AS id,
                c.type AS type_capteur,
                c.reference_commerciale AS reference,
                c.port_communication AS port,
                p.nom_piece AS piece,
                m.valeur AS derniere_valeur,
                m.date_insertion AS date_mesure,
                CASE 
                    WHEN (strftime('%s', 'now') - strftime('%s', m.date_insertion)) <= 300 THEN 'Actif'
                    ELSE 'Inactif'
                END AS statut
            FROM CapteurActionneur c
            LEFT JOIN Mesure m ON c.id_capteur_actionneur = m.id_capteur_actionneur
            LEFT JOIN Piece p ON c.id_piece = p.id_piece
            WHERE m.date_insertion = (
                SELECT MAX(date_insertion)
                FROM Mesure
                WHERE id_capteur_actionneur = c.id_capteur_actionneur
            )
            OR m.id_capteur_actionneur IS NULL;
        """
        c.execute(query)
        capteurs = c.fetchall()
        conn.close()

        return [
            {
                "id": row["id"],
                "type": row["type_capteur"],
                "reference": row["reference"],
                "port": row["port"],
                "piece": row["piece"],
                "derniere_valeur": row["derniere_valeur"],
                "date_mesure": row["date_mesure"],
                "statut": row["statut"],
            }
            for row in capteurs
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
@app.get("/economie")
async def get_economie(scale: str = "monthly"):
    """
    Endpoint pour récupérer les économies réalisées.
    :param scale: Échelle de temps ("monthly" ou "yearly").
    """
    try:
        conn = initialisation_base()
        cursor = conn.cursor()

        if scale == "monthly":
            query = """
                WITH MonthlyConsumption AS (
                    SELECT 
                        strftime('%Y-%m', date_facture) AS periode,
                        type_facture,
                        SUM(valeur_consommee) AS consommation_totale
                    FROM Facture
                    GROUP BY periode, type_facture
                ),
                MonthlyEconomy AS (
                    SELECT 
                        periode,
                        type_facture,
                        consommation_totale,
                        LAG(consommation_totale) OVER (PARTITION BY type_facture ORDER BY periode) AS consommation_precedente,
                        (LAG(consommation_totale) OVER (PARTITION BY type_facture ORDER BY periode) - consommation_totale) AS economie
                    FROM MonthlyConsumption
                )
                SELECT 
                    periode,
                    SUM(economie) AS economie_totale
                FROM MonthlyEconomy
                WHERE economie IS NOT NULL
                GROUP BY periode
                ORDER BY periode ASC;
            """
        elif scale == "yearly":
            query = """
                WITH YearlyConsumption AS (
                    SELECT 
                        strftime('%Y', date_facture) AS periode,
                        type_facture,
                        SUM(valeur_consommee) AS consommation_totale
                    FROM Facture
                    GROUP BY periode, type_facture
                ),
                YearlyEconomy AS (
                    SELECT 
                        periode,
                        type_facture,
                        consommation_totale,
                        LAG(consommation_totale) OVER (PARTITION BY type_facture ORDER BY periode) AS consommation_precedente,
                        (LAG(consommation_totale) OVER (PARTITION BY type_facture ORDER BY periode) - consommation_totale) AS economie
                    FROM YearlyConsumption
                )
                SELECT 
                    periode,
                    SUM(economie) AS economie_totale
                FROM YearlyEconomy
                WHERE economie IS NOT NULL
                GROUP BY periode
                ORDER BY periode ASC;
            """
        else:
            raise HTTPException(status_code=400, detail="Échelle de temps invalide.")

        print("Requête exécutée :", query)
        cursor.execute(query)
        results = cursor.fetchall()
        conn.close()

        print("Résultats :", results)
        return [{"periode": row[0], "economie": row[1]} for row in results]

    except Exception as e:
        print("Erreur serveur :", e)
        raise HTTPException(status_code=500, detail="Erreur serveur : " + str(e))

    
@app.get("/consommation")
async def get_consommation():
    """
    Endpoint pour récupérer les données de consommation.
    Retourne un JSON avec les données groupées par type de facture.
    """
    try:
        conn = initialisation_base()
        cursor = conn.cursor()

        # Exemple de requête SQL
        query = """
            SELECT type_facture, SUM(valeur_consommee) AS total_consomme
            FROM Facture
            GROUP BY type_facture;
        """
        cursor.execute(query)
        result = cursor.fetchall()

        conn.close()

        # Retourner les données en format JSON
        return [{"type_facture": row["type_facture"], "total_consomme": row["total_consomme"]} for row in result]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {e}")

@app.post("/configuration")
async def ajouter_capteur_actionneur(data: dict):
    """
    Endpoint pour ajouter un capteur/actionneur à la base de données.
    Exemple de données JSON envoyées :
    {
        "type": "Température",
        "reference_commerciale": "TMP123",
        "port_communication": "COM3",
        "id_piece": 1,
        "id_type_capteur": 1
    }
    """
    try:
        # Récupérer les données JSON du client
        type_capteur = data.get("type")
        reference_commerciale = data.get("reference_commerciale")
        port_communication = data.get("port_communication")
        id_piece = data.get("id_piece")
        id_type_capteur = data.get("id_type_capteur")

        # Vérification des données requises
        if not all([type_capteur, reference_commerciale, port_communication, id_piece, id_type_capteur]):
            raise HTTPException(status_code=400, detail="Données manquantes dans la requête.")

        conn = initialisation_base()
        c = conn.cursor()

        # Ajouter le capteur/actionneur
        query = """
            INSERT INTO CapteurActionneur (
                type, reference_commerciale, port_communication, id_piece, id_type_capteur
            ) VALUES (?, ?, ?, ?, ?);
        """
        c.execute(query, (type_capteur, reference_commerciale, port_communication, id_piece, id_type_capteur))
        conn.commit()
        conn.close()

        return {"status": "success", "message": "Capteur/Actionneur ajouté avec succès."}

    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur SQLite : {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")
    

@app.delete("/capteurs/{capteur_id}")
async def supprimer_capteur(capteur_id: int):
    try:
        conn = initialisation_base()
        c = conn.cursor()
        c.execute("DELETE FROM CapteurActionneur WHERE id_capteur_actionneur = ?", (capteur_id,))
        conn.commit()
        conn.close()

        if c.rowcount == 0:
            raise HTTPException(status_code=404, detail="Capteur introuvable.")
        return {"message": "Capteur supprimé avec succès."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/capteurs/{capteur_id}")
async def modifier_capteur(capteur_id: int, data: dict):
    """
    Endpoint pour modifier un capteur existant dans la base de données.
    """
    try:
        # Récupérer les données envoyées
        type_capteur = data.get("type")
        reference_commerciale = data.get("reference_commerciale")
        port_communication = data.get("port_communication")

        # Vérifier qu'au moins un champ est renseigné
        if not any([type_capteur, reference_commerciale, port_communication]):
            raise HTTPException(status_code=400, detail="Aucune donnée à modifier n'a été fournie.")

        # Construire dynamiquement la requête de mise à jour
        update_fields = []
        update_values = []

        if type_capteur:
            update_fields.append("type = ?")
            update_values.append(type_capteur)
        if reference_commerciale:
            update_fields.append("reference_commerciale = ?")
            update_values.append(reference_commerciale)
        if port_communication:
            update_fields.append("port_communication = ?")
            update_values.append(port_communication)

        update_values.append(capteur_id)

        conn = initialisation_base()
        c = conn.cursor()
        query = f"""
            UPDATE CapteurActionneur
            SET {', '.join(update_fields)}
            WHERE id_capteur_actionneur = ?
        """
        c.execute(query, tuple(update_values))
        conn.commit()

        # Vérifier si un capteur a été mis à jour
        if c.rowcount == 0:
            raise HTTPException(status_code=404, detail="Capteur introuvable.")

        conn.close()
        return {"status": "success", "message": "Capteur modifié avec succès."}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur SQLite : {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")
