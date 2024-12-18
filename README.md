# TP_iot
le fichier logement.sql contient les commandes de creation de ma base de donnees ainsi que les differentes tables de celle-ci.
pour lancer ma base de donnee , on procede comme suit : ouvrir le terminal et tapez sqlite3
 ensuite : .open + nom de la base de donnee pour ouvrir la base de donnee

 Pour lancer mon serveur fastApi : on tappe dans le terminal : fastapi run + le nom du fichier python du serveur.
 
 


<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consommation - Éco-Logement</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <!-- Barre de navigation -->
    <nav class="navbar">
        <div class="container">
            <a href="index.html" class="logo"><i class="fas fa-leaf"></i> Éco-Logement</a>
            <ul class="nav-links">
                <li><a href="index.html"><i class="fas fa-home"></i> Accueil</a></li>
                <li><a href="consommation.html"class="active"><i class="fas fa-chart-bar"></i> Consommation</a></li>
                <li><a href="capteurs.html"><i class="fas fa-microchip"></i> Capteurs</a></li>
                <li><a href="economie.html"><i class="fas fa-coins"></i> Économie</a></li>
                <li><a href="configuration.html"><i class="fas fa-tools"></i> Configuration</a></li>
                <li><a href="logements.html" ><i class="fas fa-building"></i> Logements</a></li>
                <li><a href="pieces.html" ><i class="fas fa-couch"></i> Pièces</a></li>
            </ul>
        </div>
    </nav>

    <!-- Section principale -->
    <main class="main-container">
        <h1>Consommation Énergétique</h1>
        <p>Suivez vos consommations en temps réel.</p>
        <table class="table">
            <thead>
                <tr>
                    <th>Type de Facture</th>
                    <th>Total Consommé (kWh)</th>
                </tr>
            </thead>
            <tbody id="consommation-table">
                <!-- Les données seront insérées ici via JavaScript -->
            </tbody>
        </table>
    </main>

    <!-- Pied de page -->
    <footer class="footer">
        <p>&copy; 2024 Éco-Logement - Tous droits réservés.</p>
    </footer>

    <script src="js/consommation.js"></script>
</body>
</html>