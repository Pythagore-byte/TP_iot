# Éco-Logement

Éco-Logement est une application permettant de gérer la consommation énergétique, les capteurs et d'autres fonctionnalités liées à l'optimisation de la gestion des logements. Ce guide explique comment configurer et exécuter le projet sur une machine locale.

---

## Prérequis

Avant de commencer, assurez-vous que votre machine dispose des outils suivants :

### 1. **Python**
   - Version requise : **3.8 ou supérieure**
   - [Télécharger Python](https://www.python.org/downloads/)
   - Assurez-vous que Python est accessible depuis votre terminal en tapant :
     ```bash
     python --version
     ```
     ou
     ```bash
     python3 --version
     ```

### 2. **FastAPI**
   - Framework backend utilisé pour créer les API.
   - Installez-le en exécutant :
     ```bash
     pip install fastapi uvicorn
     ```

### 3. **SQLite**
   - Base de données utilisée par le projet.
   - Déjà intégrée à Python, aucune installation supplémentaire n'est nécessaire.

---

## Étapes pour exécuter le projet

### 1. **Clonez le projet**

Clonez ce dépôt dans un répertoire local en utilisant `git` :
```bash
git clone <lien_du_repo_git>
cd <nom_du_dossier_cloné>
```

### 2. **Configuration du backend**

#### a. Assurez-vous que les fichiers nécessaires sont dans le répertoire :
   - Les fichiers essentiels incluent :
     - Le fichier FastAPI principal (ici : `exo_page_web.py`).
     - Le fichier SQL (`logement.sql`) contenant les schémas et données de la base de données.

#### b. Lancer le serveur FastAPI :
   - Dans le répertoire où se trouve le fichier backend (`exo_page_web.py`), exécutez :
     ```bash
     uvicorn exo_page_web:app --reload ou fastapi run exo_page_web.py
     ```

   - Une fois démarré, le serveur sera accessible à :
     ```
     http://127.0.0.1:8080 ici vous verez une petite interface graphique , vous pouvez tout simplement cliquez sur le bouton "Documentation de l'API" afin d'explorez toutes les fonctionnalités et services de mon serveur. 
   
     ```

#### c. Documentation des API :
   - Vous pouvez explorer les API directement via Swagger à l'adresse suivante :
     ```
     http://127.0.0.1:8000/docs
     ```

---

### 3. **Configuration du frontend**

#### a. Naviguez dans le répertoire contenant vos fichiers frontend :
   - Les fichiers frontend incluent des fichiers HTML, CSS et JavaScript.

#### b. Lancer le serveur local pour le site web :
   - Exécutez la commande suivante dans le terminal depuis le répertoire où se trouvent les fichiers HTML :
     ```bash
     python -m http.server
     ```
   - Par défaut, le site sera accessible à : 
   127.0.0.1:8000 , ici on accede directement à la page d'accueil 
     ```
     
     ```

---

## Structure du projet

Voici une brève explication des principaux répertoires et fichiers du projet :

- **Backend**
  - `exo_page_web.py` : Contient les routes et la logique backend.
  - `logement.sql` : Script SQL pour créer et peupler la base de données.

- **Frontend**
  - `index.html` : Page principale du site web.
  - `styles.css` : Fichier de style pour le frontend.
  - `configuration.js` : Script JavaScript pour la gestion des capteurs.
  - et aussi d'autres fichiers js pour differents menus.

---

## Notes importantes

1. **Dépendances Python** :
   - Toutes les dépendances doivent être installées via `pip`. Vous pouvez créer un fichier `requirements.txt` pour les lister si nécessaire.
     Exemple de fichier `requirements.txt` :
     ```
     fastapi
     uvicorn
     ```

     Installez-les avec :
     ```bash
     pip install -r requirements.txt
     ```

2. **Bases de données** :
   - Assurez-vous que le fichier SQLite est bien dans le répertoire backend avant de lancer le serveur.

3. **Ports** :
   - Le backend FastAPI utilise par défaut le port `8000`.
   - Si ce port est utilisé, spécifiez un autre port pour FastAPI avec l'option `--port` :
     ```bash
     uvicorn main:app --reload --port 8080
     mais pour moi il n y avait eu de conflit malgre le fait que j'ai utilise le meme port 8000 pour les deux serveurs. 
     ```

   - Le serveur frontend Python utilise également le port `8000`. Vous pouvez spécifier un autre port pour éviter les conflits :
     ```bash
     python -m http.server 8081
     ```

4. **Éviter les conflits** :
   - Si vous utilisez les deux serveurs en même temps, veillez à exécuter le frontend et le backend sur des ports différents.

---

## Fonctionnalités principales

1. **Gestion des Capteurs** :
   - Ajouter, modifier et supprimer des capteurs.
   - Assigner un capteur à une pièce.

2. **Visualisation des Consommations** :
   - Affichage des consommations énergétiques sous forme de tableau et graphiques.

3. **Navigation Responsive** :
   - Design adaptable aux différentes tailles d'écran.

---

## Ressources supplémentaires

1. **Documentation FastAPI** : [FastAPI Docs](https://fastapi.tiangolo.com/)
2. **Documentation Python** : [Python Docs](https://docs.python.org/3/)
3. **SQLite** : [SQLite Docs](https://sqlite.org/docs.html)

---