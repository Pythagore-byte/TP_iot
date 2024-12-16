
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
INSERT INTO CapteurActionneur (Type, Reference_commerciale, Port_communication, id_piece, id_type_capteur)
VALUES ('Humidity', 'HUMIDITY-001', 'COM5', 3, 3);
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

CREATE TABLE IF NOT EXISTS Actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_capteur_actionneur INTEGER,
    action TEXT NOT NULL,
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_capteur_actionneur) REFERENCES CapteurActionneur(id)
);
-------------------------------------------
--Ajout des donnees manuelles pour le test sur le site web

INSERT INTO Facture (type_facture, date_facture, montant, valeur_consommee, id_logement) VALUES
('Eau', '2023-01-15 00:00:00', 48.25, 135.84, 1),
('Eau', '2023-02-14 00:00:00', 44.31, 104.10, 2),
('Eau', '2023-03-16 00:00:00', 74.60, 29.16, 1),
('Eau', '2023-04-15 00:00:00', 68.97, 156.21, 2),
('Eau', '2023-05-15 00:00:00', 78.42, 51.50, 1),
('Electricité', '2023-01-15 00:00:00', 35.73, 192.51, 2),
('Electricité', '2023-02-14 00:00:00', 71.39, 166.28, 1),
('Electricité', '2023-03-16 00:00:00', 92.12, 60.74, 2),
('Electricité', '2023-04-15 00:00:00', 24.56, 86.35, 1),
('Electricité', '2023-05-15 00:00:00', 57.83, 146.09, 2),
('Loyer', '2023-01-15 00:00:00', 52.47, 140.14, 1),
('Loyer', '2023-02-14 00:00:00', 95.56, 11.25, 2),
('Loyer', '2023-03-16 00:00:00', 86.27, 111.87, 1),
('Loyer', '2023-04-15 00:00:00', 27.91, 153.63, 2),
('Loyer', '2023-05-15 00:00:00', 88.17, 68.38, 1),
('Déchets', '2023-01-15 00:00:00', 74.41, 13.46, 2),
('Déchets', '2023-02-14 00:00:00', 46.70, 109.79, 1),
('Déchets', '2023-03-16 00:00:00', 81.99, 153.74, 2),
('Déchets', '2023-04-15 00:00:00', 32.46, 127.85, 1),
('Déchets', '2023-05-15 00:00:00', 94.60, 99.73, 2),
('Internet', '2023-01-15 00:00:00', 27.24, 65.84, 1),
('Internet', '2023-02-14 00:00:00', 78.05, 113.02, 2),
('Internet', '2023-03-16 00:00:00', 38.42, 72.06, 1),
('Internet', '2023-04-15 00:00:00', 66.19, 192.31, 2),
('Internet', '2023-05-15 00:00:00', 45.01, 156.49, 1),
('Assurance', '2023-01-15 00:00:00', 68.87, 190.26, 2),
('Assurance', '2023-02-14 00:00:00', 79.92, 132.84, 1),
('Assurance', '2023-03-16 00:00:00', 52.19, 87.13, 2),
('Assurance', '2023-04-15 00:00:00', 40.38, 38.43, 1),
('Assurance', '2023-05-15 00:00:00', 59.67, 116.78, 2),
('Gaz', '2023-01-15 00:00:00', 25.34, 173.22, 1),
('Gaz', '2023-02-14 00:00:00', 64.98, 76.11, 2),
('Gaz', '2023-03-16 00:00:00', 70.56, 144.27, 1),
('Gaz', '2023-04-15 00:00:00', 48.39, 122.57, 2),
('Gaz', '2023-05-15 00:00:00', 82.47, 149.99, 1);
