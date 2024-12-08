from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
import sqlite3
import random

# Fonction pour initialiser la base de données
def initialisation_base():
    conn = sqlite3.connect('mabase.db')  # Création de la connexion
    conn.row_factory = sqlite3.Row
    return conn

app = FastAPI()

tables_autorisees = ["Logement", "Piece", "Facture", "Mesure", "CapteurActionneur", "TypeCapteur"]
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
async def get_valeurs_table(nom_table: str):
    if nom_table not in tables_autorisees:
        raise HTTPException(status_code=400, detail="Table non autorisée")

    try:
        conn = initialisation_base()
        c = conn.cursor()
        requette = f"SELECT * FROM {nom_table}"
        c.execute(requette)
        lignes = c.fetchall()
       
        valeurs = [dict(ligne) for ligne in lignes]
        return valeurs
 
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur de base de données: {str(e)}")
    finally:
        conn.close()

@app.post("/Table/{nom_table}")
async def post_valeurs_dans_table(nom_table: str):
    if nom_table not in tables_autorisees:
        raise HTTPException(status_code=400, detail="Table inexistante")
    
    try:
        conn = initialisation_base()
        c = conn.cursor()
        
        if nom_table == "Facture":
            req = f"INSERT INTO {nom_table} (Type_facture, Montant, Valeur_consommee, id_logement) VALUES (?, ?, ?, ?)"
            for _ in range(N):
                c.execute(req, (random.choice(liste_facture), round(random.uniform(20, 38), 1), round(random.uniform(20, 38), 1), 2))
            conn.commit()
        
        elif nom_table == "Mesure":
            id = random.randint(1, 2)
            L = [round(random.uniform(20, 38), 2) if id == 1 else random.randint(0, 1) for _ in range(N)]
            req = f"INSERT INTO {nom_table} (Valeur, id_capteur_actionneur) VALUES (?, ?)"
            for valeur in L:
                c.execute(req, (valeur, id))
            conn.commit()
        else:
            raise HTTPException(status_code=400, detail=f"La table {nom_table} n'existe pas, donc insertion impossible.")
        
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur de base de données: {str(e)}")
    finally:
        conn.close()

@app.get("/facture_chart", response_class=HTMLResponse)
async def get_facture_chart():
    try:
        conn = initialisation_base()
        c = conn.cursor()
        c.execute("SELECT Type_facture, SUM(Montant) as total FROM Facture GROUP BY Type_facture")
        resultats = c.fetchall()
        
        data = [["Type de Facture", "Montant Total"]]
        for row in resultats:
            data.append([row["Type_facture"], row["total"]])

        # HTML avec Google Charts pour afficher le camembert
        html_content = f"""
        <html>
            <head>
                <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
                <script type="text/javascript">
                    google.charts.load('current', {{'packages':['corechart']}});
                    google.charts.setOnLoadCallback(drawChart);
                    
                    function drawChart() {{
                        var data = google.visualization.arrayToDataTable({data});
                        
                        var options = {{
                            title: 'Répartition des factures',
                            is3D: true,
                        }};
                        
                        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
                        chart.draw(data, options);
                    }}
                </script>
            </head>
            <body>
                <h1>Camembert des Montants des Factures</h1>
                <div id="piechart" style="width: 900px; height: 500px;"></div>
            </body>
        </html>
        """
        
        return HTMLResponse(content=html_content)
    
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Erreur de base de données: {str(e)}")
    finally:
        conn.close()
