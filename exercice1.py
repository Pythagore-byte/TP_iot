from fastapi import FastAPI,HTTPException
import sqlite3
import random
# ouverture/initialisation de la base de donnee 



def initialisation_base():
    conn = sqlite3.connect('mabase.db') #on cree une connexion
    conn.row_factory = sqlite3.Row
    return conn


app = FastAPI()

tables_autorisees=["Logement","Piece","Facture","Mesure","CapteurActionneur","TypeCapteur",""]
liste_facture=[
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
        c = conn.cursor() #creer une connexion ( ce qui  nous permettra de communiquer avec la base de donnee a travers les requettes sqk)
        requette = f"SELECT * FROM {nom_table}"
        c.execute(requette)
        lignes = c.fetchall() #recupere toutes les lignes
       
        valeurs =  [dict(ligne) for ligne in lignes] # convertit le resultat en une liste de dico
        for x in valeurs:
            print(x)
        return valeurs
 
    except sqlite3.Error as e:
        raise HTTPException(status_code = 500, detail = "Erreur de base de donnees: {}".format(str(e)))
    finally:
        conn.close()


@app.post("/Table/{nom_table}")
async def post_valeurs_dans_table(nom_table):
    if nom_table not in tables_autorisees:
        raise HTTPException(status_code=400, detail="Table inexistante")
    try:
        conn = initialisation_base()
        c = conn.cursor() #creer une connexion ( ce qui  nous permettra de communiquer avec la base de donnee a travers les requettes sqk)
        if nom_table =="Facture":
            req =f"INSERT INTO {nom_table}(Type_facture,Montant, Valeur_consommee,id_logement) VALUES(?,?,?,?)"
            for x in range(N):
                c.execute(req,(random.choice(liste_facture),round(random.uniform(20,38),1), round(random.uniform(20,38),1),2)) # c'est les facture pour le logement 2
           
            conn.commit() # permet d'envoyer la requette 
            
        elif nom_table =="Mesure":
            id = random.randint(1,2)
           
            if id ==1:
                L=[round(random.uniform(20,38),2) for x in range(N)]
            elif id==2:
                L=[random.randint(0,1) for x in range(N)]

            req =f"INSERT INTO {nom_table} (Valeur , id_capteur_actionneur) VALUES (?,?)" # cette requette c'est pour les mesures
            for valeur in L:
                c.execute(req, (valeur, id))
            conn.commit() # permet d'envoyer la requette
        else:
            print(f"La table{nom_table} n'existe pas, donc insertion impossible. \n") 


        
    except sqlite3.Error as e:
        raise HTTPException(status_code = 500, detail = "Erreur de base de donnees: {}".format(str(e)))
    finally:
        conn.close()















