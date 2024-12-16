# TP_iot
le fichier logement.sql contient les commandes de creation de ma base de donnees ainsi que les differentes tables de celle-ci.
pour lancer ma base de donnee , on procede comme suit : ouvrir le terminal et tapez sqlite3
 ensuite : .open + nom de la base de donnee pour ouvrir la base de donnee

 Pour lancer mon serveur fastApi : on tappe dans le terminal : fastapi run + le nom du fichier python du serveur.
 
 



code html economie precedent: 

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Économie - Éco-Logement</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <!-- Barre de navigation -->
    <nav class="navbar">
        <div class="container">
            <a href="index.html" class="logo"><i class="fas fa-leaf"></i> Éco-Logement</a>
            <ul class="nav-links">
                <li><a href="index.html">Accueil</a></li>
                <li><a href="consommation.html"><i class="fas fa-chart-bar"></i> Consommation</a></li>
                <li><a href="capteurs.html"><i class="fas fa-microchip"></i> Capteurs</a></li>
                <li><a href="economie.html" class="active"><i class="fas fa-coins"></i> Économie</a></li>
                <li><a href="configuration.html"><i class="fas fa-tools"></i> Configuration</a></li>
            </ul>
        </div>
    </nav>

    <!-- Section principale -->
    <main class="main-container">
        <h1>Économies Réalisées</h1>
        <p>Visualisez les économies réalisées selon différentes échelles de temps.</p>

        <!-- Choix de l'échelle de temps -->
        <div class="scale-selector">
            <label for="time-scale">Choisissez une échelle de temps :</label>
            <select id="time-scale">
                <option value="monthly">Mensuelle</option>
                <option value="yearly">Annuelle</option>
            </select>
        </div>

        <!-- Tableau des données -->
        <table class="table">
            <thead>
                <tr>
                    <th>Période</th>
                    <th>Économies réalisées (€)</th>
                </tr>
            </thead>
            <tbody id="economie-table">
                <!-- Les données seront insérées ici via JavaScript -->
            </tbody>
        </table>

        <!-- Conteneur pour le graphique -->
        <div class="chart-container">
            <canvas id="economie-chart"></canvas>
        </div>
    </main>

    <!-- Pied de page -->
    <footer class="footer">
        <p>&copy; 2024 Éco-Logement - Tous droits réservés.</p>
    </footer>

    <script src="js/economie.js"></script>
</body>
</html>
