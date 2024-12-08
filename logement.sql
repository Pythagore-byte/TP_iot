
-- commandes de destruction des tables
DROP TABLE IF EXISTS Logement;
DROP TABLE IF EXISTS Piece;
DROP TABLE IF EXISTS CapteurActionneur;
DROP TABLE IF EXISTS TypeCapteur;
DROP TABLE IF EXISTS Mesure;
DROP TABLE IF EXISTS Facture;

-- commandes de création des tables

CREATE TABLE Logement (
    id_logement INTEGER PRIMARY KEY AUTOINCREMENT,
    adresse TEXT NOT NULL,
    numero_telephone TEXT NOT NULL,
    adresse_ip TEXT NOT NULL,
    date_insertion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Piece (
    id_piece INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_piece TEXT NOT NULL,
    coordonnees_x REAL,
    coordonnees_y REAL,
    coordonnees_z REAL,
    id_logement INTEGER NOT NULL,
    FOREIGN KEY (id_logement) REFERENCES Logement(id_logement)
);
CREATE TABLE TypeCapteur (
    id_type_capteur INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    unite_mesure VARCHAR(10) NOT NULL,
    plage_precision TEXT NOT NULL
);

CREATE TABLE CapteurActionneur (
    id_capteur_actionneur INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    reference_commerciale TEXT NOT NULL,
    port_communication TEXT NOT NULL,
    date_insertion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_piece INTEGER NOT NULL, 
    id_type_capteur INTEGER NOT NULL,
    FOREIGN KEY (id_piece) REFERENCES Piece(id_piece),
    FOREIGN KEY (id_type_capteur) REFERENCES TypeCapteur(id_type_capteur)     
);


CREATE TABLE Mesure (
    id_mesure INTEGER PRIMARY KEY AUTOINCREMENT,
    valeur REAL NOT NULL,
    date_insertion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_capteur_actionneur INTEGER NOT NULL,
    FOREIGN KEY (id_capteur_actionneur) REFERENCES CapteurActionneur(id_capteur_actionneur)
);

CREATE TABLE Facture (
    id_facture INTEGER PRIMARY KEY AUTOINCREMENT,
    type_facture TEXT NOT NULL,
    date_facture TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Utilisation d'un TIMESTAMP pour la date
    montant REAL NOT NULL,
    valeur_consommee REAL NOT NULL,
    id_logement INTEGER NOT NULL,
    FOREIGN KEY (id_logement) REFERENCES Logement(id_logement)
);

--creation d'un logement avec 4 pieces
BEGIN TRANSACTION;

-- Insertion du logement
INSERT INTO Logement (adresse, numero_telephone, adresse_ip) VALUES ('123 Rue Principale', '0123456789', '192.168.1.10');

-- Récupération de l'ID du logement
--SELECT LAST_INSERT_ROWID() AS new_id_logement;

-- Utilisation de cet ID pour les pièces (remplacez new_id_logement dans chaque insertion)
INSERT INTO Piece (nom_piece, coordonnees_x, coordonnees_y, coordonnees_z, id_logement) 
VALUES ('Salon', 0.0, 0.0, 0.0, 1);

INSERT INTO Piece (nom_piece, Coordonnees_x, Coordonnees_y, Coordonnees_z, id_logement) 
VALUES ('Cuisine', 5.0, 0.0, 0.0, 1);

INSERT INTO Piece (nom_piece, coordonnees_x, coordonnees_y, coordonnees_z, id_logement) 
VALUES ('Chambre', 0.0, 5.0, 0.0, 1);

INSERT INTO Piece (nom_piece, coordonnees_x, coordonnees_y, coordonnees_z, id_logement) 
VALUES ('Salle de bain', 5.0, 5.0, 0.0, 1);

COMMIT;
-- creons au moins 2 CapteurActionneur
-- mais d'abord on doit creer un TypeCapteur
INSERT INTO TypeCapteur (Nom, Unite_mesure, Plage_precision)
VALUES ('Thermomètre', '°C', '0-50');
INSERT INTO TypeCapteur (Nom, Unite_mesure, Plage_precision)
VALUES ('Détecteur de Mouvement', 'Présence', 'Oui/Non');

-- Capteur de température dans le Salon
INSERT INTO CapteurActionneur (Type, Reference_commerciale, Port_communication, id_piece, id_type_capteur)
VALUES ('Température', 'THERMO-001', 'COM1', 1, 1);

-- Détecteur de mouvement dans la Cuisine
INSERT INTO CapteurActionneur (Type, Reference_commerciale, Port_communication, id_piece, id_type_capteur)
VALUES ('Mouvement', 'MOTION-001', 'COM3', 2, 2);

--question 7 : creer au moins 2 mesures par capteuractionneur
-- Première mesure de température dans le Salon
INSERT INTO Mesure (Valeur, id_capteur_actionneur)
VALUES (22.5, 1);

-- Deuxième mesure de température dans le Salon
INSERT INTO Mesure (Valeur, id_capteur_actionneur)
VALUES (23.1, 1);

-- Première mesure de mouvement dans la Cuisine
INSERT INTO Mesure (Valeur, id_capteur_actionneur)
VALUES (1, 2);

-- Deuxième mesure de mouvement dans la Cuisine
INSERT INTO Mesure (Valeur, id_capteur_actionneur)
VALUES (0, 2); -- ici pas de presence

--Question 8 : creer 4 factures ( pour le logement 1) 
-- Facture d'eau
INSERT INTO Facture (Type_facture, Montant, Valeur_consommee, id_logement)
VALUES ('Eau', 45.50, 30.0, 1);

-- Facture d'électricité
INSERT INTO Facture (Type_facture, Montant, Valeur_consommee, id_logement)
VALUES ('Electricité', 75.00, 250.0, 1);

-- Facture de déchets
INSERT INTO Facture (Type_facture, Montant, Valeur_consommee, id_logement)
VALUES ('Déchets', 20.00, 15.0, 1);

-- Facture d'internet
INSERT INTO Facture (Type_facture, Montant, Valeur_consommee, id_logement)
VALUES ('Internet', 50.00, 100.0, 1);
