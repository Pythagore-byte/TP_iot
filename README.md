# TP_iot
le fichier logement.sql contient les commandes de creation de ma base de donnees ainsi que les differentes tables de celle-ci.
pour lancer ma base de donnee , on procede comme suit : ouvrir le terminal et tapez sqlite3
 ensuite : .open + nom de la base de donnee pour ouvrir la base de donnee

 Pour lancer mon serveur fastApi : on tappe dans le terminal : fastapi run + le nom du fichier python du serveur.
 
 


/* Corps général */
body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
    color: #333;
    overflow-x: hidden;
}

/* Barre de navigation */
.navbar {
    position: fixed;
    width: 100%;
    background-color: #333;
    padding: 1rem 2rem;
    color: white;
    display: flex;
    justify-content: space-between;
    z-index: 1000;
    top: 0;
}

.navbar .logo {
    font-size: 1.5rem;
    text-decoration: none;
    color: #00b894;
    display: flex;
    align-items: center;
}

.navbar .logo i {
    margin-right: 0.5rem;
}

.navbar .nav-links {
    list-style: none;
    display: flex;
    gap: 1.5rem;
}

.navbar .nav-links a {
    text-decoration: none;
    color: white;
    font-weight: bold;
    transition: color 0.3s ease;
}

.navbar .nav-links a:hover,
.navbar .nav-links a.active {
    color: #00b894;
}

/* Bannière */
.banner {
    height: 100vh;
    background: url('assets/banner.jpg') no-repeat center center/cover;
    position: relative;
    color: white;
}

.banner .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
}

.banner-content {
    text-align: center;
    animation: fadeIn 2s ease;
}

.banner-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.banner-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

.banner-content .btn {
    padding: 1rem 2rem;
    background-color: #00b894;
    color: white;
    text-decoration: none;
    font-weight: bold;
    border-radius: 5px;
    transition: background 0.3s;
}

.banner-content .btn:hover {
    background-color: #019875;
}

/* Section des services */
.features {
    padding: 4rem 2rem;
    background: white;
    text-align: center;
}

.features h2 {
    margin-bottom: 3rem;
    font-size: 2.5rem;
}

.feature-cards {
    display: flex;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;
}

.card {
    background: #f4f4f4;
    padding: 2rem;
    border-radius: 10px;
    width: 300px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    text-align: center;
}

.card:hover {
    transform: translateY(-10px);
}

.card i {
    font-size: 3rem;
    color: #00b894;
    margin-bottom: 1rem;
}

/* Témoignages */
.testimonials {
    padding: 4rem 2rem;
    background: #333;
    color: white;
    text-align: center;
}

.testimonial {
    margin: 1rem 0;
    padding: 1rem;
    background: #444;
    border-radius: 10px;
}

.testimonial span {
    display: block;
    margin-top: 1rem;
    font-weight: bold;
    color: #00b894;
}

/* Pied de page */
.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 1rem;
}


/* Corps principal */
.main-container {
    padding: 4rem 2rem;
    text-align: center;
    background: #f4f4f4;
}

.main-container h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
}

.main-container p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #666;
}

/* Formulaires */
.form {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: 0 auto;
    text-align: left;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
}

.form-group input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
}

/* Boutons */
.btn {
    padding: 1rem 2rem;
    background-color: #00b894;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn:hover {
    background-color: #019875;
}

/* Tableaux */
.table {
    width: 100%;
    margin: 2rem auto;
    border-collapse: collapse;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.table th, .table td {
    padding: 1rem;
    text-align: left;
    border: 1px solid #ddd;
}

.table th {
    background-color: #00b894;
    color: white;
}

.table tbody tr:nth-child(even) {
    background-color: #f4f4f4;
}

/* Barre de navigation */
.navbar {
    position: fixed;
    width: 100%;
    background-color: #333;
    padding: 1rem 2rem;
    color: white;
    display: flex;
    justify-content: space-between;
    z-index: 1000;
    top: 0;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); /* Ajout d'un effet d'ombre */
}

/* Conteneur principal */
.main-container {
    padding: 6rem 2rem; /* Ajouter un padding-top pour compenser la hauteur de la navbar */
    text-align: center;
    background: #f4f4f4;
}

/* Tableaux et autres éléments de contenu */
.main-container h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
}

.main-container p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #666;
}
.chart-container {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

#economie-chart {
    max-width: 700px;
    max-height: 500px;
}

.scale-selector {
    margin: 1rem 0;
    text-align: center;
}

.scale-selector label {
    font-weight: bold;
    margin-right: 0.5rem;
}

.scale-selector select {
    padding: 0.5rem;
    font-size: 1rem;
}


/* Conteneur principal */
.main-container {
    padding: 6rem 2rem; /* Ajout de padding pour éviter que le contenu ne soit caché par la navbar */
    text-align: center;
}

/* Titre de la page */
.page-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #333;
}

/* Conteneur des cartes */
.card-container {
    display: flex;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* Styles pour chaque carte */
.card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Ombre légère */
    width: 100%;
    max-width: 600px;
    text-align: left; /* Alignement du texte */
}

/* Groupes de formulaire */
.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
}

.form-group input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
}

/* Boutons */
.btn {
    padding: 0.8rem 2rem;
    background-color: #00b894;
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease; /* Animation de survol */
}

.btn:hover {
    background-color: #019875; /* Couleur plus foncée au survol */
}

/* Tableaux */
.table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
}

.table th,
.table td {
    padding: 0.8rem;
    border: 1px solid #ddd;
    text-align: center; /* Centrer le contenu */
}

.table th {
    background-color: #00b894;
    color: white;
    text-transform: uppercase;
}

/* Sous-menus */
.submenu {
    margin-bottom: 2rem;
    text-align: center;
}

.submenu ul {
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.submenu-link {
    text-decoration: none;
    padding: 0.8rem 1.5rem;
    background-color: #00b894;
    color: white;
    border-radius: 5px;
    transition: background 0.3s;
}

.submenu-link.active {
    background-color: #019875;
    font-weight: bold;
}

.submenu-link:hover {
    background-color: #019875;
}

/* Sections dynamiques */
.config-section {
    display: none;
}

.config-section.active {
    display: block;
}
/* Correction pour éviter que le contenu soit masqué par la barre de navigation */
body {
    margin: 0;
    padding: 0;
}

/* Navbar fixe en haut */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000; /* Assure que la barre de navigation est au-dessus du contenu */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Ajout d'un effet d'ombre */
}

/* Espacement sous la barre de navigation */
.main-container {
    margin-top: 80px; /* Ajuste cet espace selon la hauteur réelle de la navbar */
    padding: 1rem;
}

/* Tableaux */
.table {
    margin-top: 1rem;
    border-collapse: collapse;
}

.table th, .table td {
    text-align: center;
    padding: 1rem;
    border: 1px solid #ddd;
}

.table th {
    background-color: #00b894;
    color: white;
    text-transform: uppercase;
}

.table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}

/* Text Centering */
.text-center {
    text-align: center;
}

/* pour les logements */
/* Tabs pour le menu des logements */
.tabs {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 2rem 0;
    border-bottom: 2px solid #ddd;
}

.tabs li {
    margin-right: 2rem;
}

.tabs .tab-link {
    text-decoration: none;
    color: #555;
    font-weight: bold;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid transparent;
    transition: border-color 0.3s, color 0.3s;
}

.tabs .tab-link:hover,
.tabs .tab-link.active {
    color: #00b894;
    border-color: #00b894;
}

/* Contenu des tabs */
.tab-content {
    display: none;
    margin-top: 2rem;
}

.tab-content.active {
    display: block;
}
/* Gestion des sous-menus */
.submenu ul {
    display: flex;
    list-style: none;
    padding: 0;
    gap: 1rem;
    margin-top: 1rem;
}

.submenu ul li a {
    text-decoration: none;
    padding: 0.5rem 1rem;
    background: #ddd;
    color: #333;
    border-radius: 5px;
    transition: background 0.3s;
}

.submenu ul li a.active {
    background: #00b894;
    color: white;
}

/* Sections dynamiques */
.config-section {
    display: none;
    margin-top: 2rem;
}

.config-section.active {
    display: block;
}
.config-section {
    display: none; /* Les sections sont masquées par défaut */
    opacity: 0;
    transition: opacity 0.3s ease;
}

.config-section.active {
    display: block; /* La section active est visible */
    opacity: 1;
}




mon capteurs.html un peu fonctionnel


<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>État des Capteurs et Actionneurs</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    Barre de navigation
    <!-- <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container-fluid">
            <a class="navbar-brand" href="index.html"><i class="fas fa-leaf"></i> Éco-Logement</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item"><a class="nav-link" href="index.html">Accueil</a></li>
                    <li class="nav-item"><a class="nav-link" href="consommation.html">Consommation</a></li>
                    <li class="nav-item"><a class="nav-link active" href="capteurs.html">Capteurs</a></li>
                    <li class="nav-item"><a class="nav-link" href="economie.html">Économie</a></li>
                    <li class="nav-item"><a class="nav-link" href="configuration.html">Configuration</a></li>
                    <li class="nav-item"><a class="nav-link" href="logements.html">Logements</a></li>
                    <li><a href="pieces.html" class="active"><i class="fas fa-couch"></i> Pièces</a></li>
                </ul>
            </div>
        </div>
    </nav> -->
    <nav class="navbar">
        <div class="container">
            <a href="index.html" class="logo">
                <i class="fas fa-leaf"></i> Éco-Logement
            </a>
            <ul class="nav-links">
                <li><a href="index.html"><i class="fas fa-home"></i> Accueil</a></li>
                <li><a href="consommation.html"><i class="fas fa-chart-bar"></i> Consommation</a></li>
                <li><a href="capteurs.html" class="active"><i class="fas fa-microchip"></i> Capteurs</a></li>
                <li><a href="economie.html"><i class="fas fa-coins"></i> Économie</a></li>
                <li><a href="configuration.html"><i class="fas fa-tools"></i> Configuration</a></li>
                <li><a href="logements.html"><i class="fas fa-building"></i> Logements</a></li>
                <li><a href="pieces.html"><i class="fas fa-couch"></i> Pièces</a></li>
            </ul>
        </div>
    </nav>
    
    

    <!-- Conteneur principal -->
    <div class="container main-container">
        <h1 class="text-center">État des Capteurs et Actionneurs</h1>
        <p class="text-center">Surveillez l'état des capteurs et actionneurs installés dans votre maison intelligente.</p>

        <!-- Tableau des capteurs -->
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Référence</th>
                    <th>Port</th>
                    <th>Pièce</th>
                    <th>Dernière Mesure</th>
                    <th>Date</th>
                    <th>État</th>
                </tr>
            </thead>
            <tbody id="capteurs-table"></tbody>
        </table>
    </div>

    <script src="js/capteurs.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>