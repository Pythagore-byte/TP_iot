from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.responses import HTMLResponse
import sqlite3
import random
import httpx, uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional


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
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#######################################################################
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
    raise HTTPException(status_code=500, detail=str(e))


@app.get("/capteurs")
async def get_capteurs():
    conn = get_db()
    cursor = conn.cursor()
    try:
        # Requête pour obtenir les capteurs avec leur dernière mesure et état
        query = """
            SELECT 
                C.id_capteur_actionneur, 
                C.type, 
                C.reference_commerciale, 
                C.port_communication, 
                P.nom_piece, 
                IFNULL(MAX(M.valeur), 'Aucune') AS derniere_valeur,
                IFNULL(MAX(M.date_insertion), 'Non disponible') AS derniere_mise_a_jour,
                CASE 
                    WHEN MAX(M.date_insertion) >= datetime('now', '-5 minutes') THEN 'Actif'
                    ELSE 'Inactif'
                END AS etat
            FROM CapteurActionneur C
            LEFT JOIN Piece P ON C.id_piece = P.id_piece
            LEFT JOIN Mesure M ON C.id_capteur_actionneur = M.id_capteur_actionneur
            GROUP BY C.id_capteur_actionneur
        """
        cursor.execute(query)
        capteurs = cursor.fetchall()

        # Formater les résultats
        result = [
            {
                "id": row[0],
                "type": row[1],
                "reference_commerciale": row[2],
                "port_communication": row[3],
                "nom_piece": row[4],
                "derniere_valeur": row[5],
                "date_insertion": row[6],
                "etat": row[7]  # État déterminé : Actif/Inactif
            }
            for row in capteurs
        ]
        return result
    finally:
        conn.close()
    
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

#######################################################################

    
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


@app.get("/logements")
async def get_logements():
    try:
        conn = initialisation_base()
        c = conn.cursor()
        query = """
            SELECT id_logement AS id, 
                   adresse, 
                   numero_telephone AS telephone, 
                   adresse_ip AS ip, 
                   date_insertion 
            FROM Logement;
        """
        c.execute(query)
        logements = c.fetchall()
        conn.close()

        return [
            {
                "id": row["id"],
                "adresse": row["adresse"],
                "telephone": row["telephone"],
                "ip": row["ip"],
                "date_insertion": row["date_insertion"],
            }
            for row in logements
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/logements")
async def add_logement(data: dict):
    """
    Endpoint pour ajouter un logement à la base de données.
    Exemple de données envoyées :
    {
        "adresse": "123 Rue des Lilas",
        "numero_telephone": "0102030405",
        "adresse_ip": "192.168.0.1"
    }
    """
    adresse = data.get("adresse")
    numero_telephone = data.get("numero_telephone")
    adresse_ip = data.get("adresse_ip")

    if not all([adresse, numero_telephone, adresse_ip]):
        raise HTTPException(status_code=400, detail="Données manquantes.")

    conn = initialisation_base()
    c = conn.cursor()
    query = "INSERT INTO Logement (adresse, numero_telephone, adresse_ip) VALUES (?, ?, ?)"
    c.execute(query, (adresse, numero_telephone, adresse_ip))
    conn.commit()
    conn.close()

    return {"status": "success", "message": "Logement ajouté avec succès"}


@app.delete("/logements/{id}")
async def delete_logement(id: int):
    conn = initialisation_base()
    c = conn.cursor()
    c.execute("DELETE FROM Logement WHERE id_logement = ?", (id,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Logement supprimé avec succès"}

#######################################################################
@app.put("/logements/{logement_id}")
async def modifier_logement(logement_id: int, data: dict):
    """
    Endpoint pour modifier un logement.
    Exemple de données JSON envoyées :
    {
        "adresse": "Nouvelle adresse",
        "numero_telephone": "123456789",
        "adresse_ip": "192.168.0.1"
    }
    """
    try:
        conn = initialisation_base()
        c = conn.cursor()

        # Construction dynamique de la requête SQL en fonction des champs fournis
        update_fields = []
        update_values = []

        if "adresse" in data and data["adresse"]:
            update_fields.append("adresse = ?")
            update_values.append(data["adresse"])
        if "numero_telephone" in data and data["numero_telephone"]:
            update_fields.append("numero_telephone = ?")
            update_values.append(data["numero_telephone"])
        if "adresse_ip" in data and data["adresse_ip"]:
            update_fields.append("adresse_ip = ?")
            update_values.append(data["adresse_ip"])

        # Si aucun champ n'est fourni, renvoyer une erreur
        if not update_fields:
            raise HTTPException(status_code=400, detail="Aucun champ valide à mettre à jour.")

        # Ajout de l'ID du logement pour la clause WHERE
        update_values.append(logement_id)

        query = f"UPDATE Logement SET {', '.join(update_fields)} WHERE id_logement = ?"
        c.execute(query, update_values)
        conn.commit()

        if c.rowcount == 0:
            raise HTTPException(status_code=404, detail="Logement non trouvé.")
        
        conn.close()
        return {"status": "success", "message": "Logement modifié avec succès."}

    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur SQLite : {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")
#gestion des pieces
class Piece(BaseModel):
    nom_piece: str
    coordonnees_x: float = 0.0
    coordonnees_y: float = 0.0
    coordonnees_z: float = 0.0
    id_logement: int

# Fonction pour initialiser la base
def get_db():
    conn = sqlite3.connect("mabase.db")
    return conn
#######################################################################
@app.get("/pieces/{id_logement}")
async def get_pieces(id_logement: int = Path(..., title="L'identifiant du logement", ge=1)):
    if not id_logement:
        raise HTTPException(status_code=422, detail="L'identifiant du logement est requis.")

    conn = get_db()
    cursor = conn.cursor()

    # Vérifier si le logement existe
    cursor.execute("SELECT COUNT(*) FROM Logement WHERE id_logement = ?", (id_logement,))
    logement_existe = cursor.fetchone()[0]

    if not logement_existe:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Le logement avec ID {id_logement} n'existe pas.")

    # Récupérer les pièces associées à ce logement
    cursor.execute("SELECT * FROM Piece WHERE id_logement = ?", (id_logement,))
    pieces = cursor.fetchall()
    conn.close()

    # Retourner une liste vide si aucune pièce n'est trouvée
    return [
        {
            "id_piece": row[0],
            "nom_piece": row[1],
            "coordonnees_x": row[2],
            "coordonnees_y": row[3],
            "coordonnees_z": row[4]
        }
        for row in pieces
    ]


# Ajouter une pièce

@app.post("/pieces")
async def ajouter_piece(piece: Piece):
    conn = get_db()
    cursor = conn.cursor()
    try:
        # Vérifier si le logement existe
        cursor.execute("SELECT id_logement FROM Logement WHERE id_logement = ?", (piece.id_logement,))
        logement_existe = cursor.fetchone()
        if not logement_existe:
            raise HTTPException(status_code=404, detail=f"Le logement avec ID {piece.id_logement} n'existe pas.")

        # Ajouter la pièce
        cursor.execute(
            """
            INSERT INTO Piece (nom_piece, coordonnees_x, coordonnees_y, coordonnees_z, id_logement) 
            VALUES (?, ?, ?, ?, ?)
            """,
            (piece.nom_piece, piece.coordonnees_x, piece.coordonnees_y, piece.coordonnees_z, piece.id_logement)
        )
        conn.commit()
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur SQLite : {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")
    finally:
        conn.close()
    return {"message": "Pièce ajoutée avec succès."}
#######################################################################

class Piece(BaseModel):
    nom_piece: Optional[str]
    coordonnees_x: Optional[float] = 0
    coordonnees_y: Optional[float] = 0
    coordonnees_z: Optional[float] = 0

@app.put("/pieces/{id_piece}")
async def modifier_piece(id_piece: int, piece: Piece):
    conn = get_db()
    cursor = conn.cursor()
    try:
        # Vérifier si la pièce existe
        cursor.execute("SELECT * FROM Piece WHERE id_piece = ?", (id_piece,))
        existing_piece = cursor.fetchone()
        if not existing_piece:
            raise HTTPException(status_code=404, detail="La pièce n'existe pas.")

        # Mettre à jour la pièce
        cursor.execute(
            """
            UPDATE Piece
            SET nom_piece = COALESCE(?, nom_piece),
                coordonnees_x = COALESCE(?, coordonnees_x),
                coordonnees_y = COALESCE(?, coordonnees_y),
                coordonnees_z = COALESCE(?, coordonnees_z)
            WHERE id_piece = ?
            """,
            (piece.nom_piece, piece.coordonnees_x, piece.coordonnees_y, piece.coordonnees_z, id_piece)
        )
        conn.commit()
        return {"message": "Pièce modifiée avec succès."}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Supprimer une pièce

@app.delete("/pieces/{id_piece}")
async def supprimer_piece(id_piece: int):
    conn = get_db()
    cursor = conn.cursor()

    # Vérifier si la pièce existe
    cursor.execute("SELECT * FROM Piece WHERE id_piece = ?", (id_piece,))
    piece = cursor.fetchone()

    if not piece:
        conn.close()
        raise HTTPException(status_code=404, detail=f"La pièce avec ID {id_piece} n'existe pas.")

    # Supprimer la pièce
    cursor.execute("DELETE FROM Piece WHERE id_piece = ?", (id_piece,))
    conn.commit()

    # Vérifier si une ligne a été supprimée
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Impossible de supprimer la pièce avec ID {id_piece}.")

    conn.close()
    return {"status": "success", "message": f"La pièce avec ID {id_piece} a été supprimée avec succès."}
@app.get("/type_capteurs")
async def get_type_capteurs():
    """
    Récupère tous les types de capteurs avec leurs références.
    """
    try:
        conn = initialisation_base()
        cursor = conn.cursor()
        cursor.execute("SELECT id_type_capteur, nom, unite_mesure, plage_precision FROM TypeCapteur")
        result = cursor.fetchall()
        conn.close()

        return [{"id": row[0], "nom": row[1], "unite_mesure": row[2], "plage_precision": row[3]} for row in result]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {e}")
#######################################################################

@app.get("/", response_class=HTMLResponse)
async def read_root():
    html_content = """
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue sur mon serveur</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #f4f4f4;
                color: #333;
            }
            .container {
                margin-top: 50px;
            }
            h1 {
                color: #00b894;
            }
            p {
                font-size: 1.2rem;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                background-color: #00b894;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
            .btn:hover {
                background-color: #019875;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Bienvenue sur mon serveur FastAPI</h1>
            <p>Explorez les fonctionnalités et services que ce serveur propose.</p>
            <a href="/docs" class="btn">Documentation de l'API</a>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)
@app.get("/consommation")
async def get_consommation(echelle: str = "mois"):
    """
    Endpoint pour récupérer les données de consommation selon l'échelle de temps choisie.
    - `echelle`: peut être "jour", "semaine", "mois", ou "annee".
    """
    try:
        conn = initialisation_base()
        cursor = conn.cursor()

        # Déterminer la colonne de regroupement selon l'échelle
        if echelle == "jour":
            periode_format = "%Y-%m-%d"
        elif echelle == "semaine":
            periode_format = "%Y-%W"
        elif echelle == "mois":
            periode_format = "%Y-%m"
        elif echelle == "annee":
            periode_format = "%Y"
        else:
            raise HTTPException(status_code=400, detail="Échelle invalide. Utilisez 'jour', 'semaine', 'mois' ou 'annee'.")

        # Requête SQL
        query = f"""
            SELECT type_facture, 
                   strftime('{periode_format}', date_facture) AS periode,
                   SUM(valeur_consommee) AS total_consomme
            FROM Facture
            GROUP BY type_facture, periode
            ORDER BY periode, type_facture;
        """
        cursor.execute(query)
        result = cursor.fetchall()

        conn.close()

        # Retourner les résultats sous forme JSON
        return [{"type_facture": row["type_facture"], "periode": row["periode"], "total_consomme": row["total_consomme"]} for row in result]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {e}")


if __name__ == "__main__":
    uvicorn.run("exo_page_web:app", host="127.0.0.1", port=8080, reload=True)

