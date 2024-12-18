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
