async function chargerDashboard() {
    try {
        // Charger le nombre de capteurs
        const capteursResponse = await fetch("http://127.0.0.1:8080/capteurs");
        const capteurs = await capteursResponse.json();
        document.getElementById("capteurs-count").textContent = `${capteurs.length} capteurs`;

        // Charger la consommation totale
        const consommationResponse = await fetch("http://127.0.0.1:8080/consommation-total");
        const consommation = await consommationResponse.json();
        document.getElementById("consommation-total").textContent = `${consommation.total} kWh`;

        // Charger les économies réalisées
        const economiesResponse = await fetch("http://127.0.0.1:8080/economies-total");
        const economies = await economiesResponse.json();
        document.getElementById("economies-total").textContent = `${economies.total} €`;
    } catch (error) {
        console.error("Erreur lors du chargement du tableau de bord :", error);
    }
}


document.addEventListener("DOMContentLoaded", chargerDashboard);