async function chargerCapteurs() {
    try {
        // Appel de l'API FastAPI pour récupérer les capteurs et leur état
        const response = await fetch("http://127.0.0.1:8000/capteurs");
        if (!response.ok) {
            throw new Error("Erreur lors du chargement des capteurs");
        }

        const capteurs = await response.json();
        const tbody = document.getElementById("capteurs-table");

        // Réinitialiser le tableau
        tbody.innerHTML = "";

        // Insérer chaque capteur dans le tableau
        capteurs.forEach((capteur) => {
            const etat = capteur.valeur
                ? (capteur.valeur > 0 ? "Actif" : "Inactif")
                : "Non défini";

            const row = `
                <tr>
                    <td>${capteur.id}</td>
                    <td>${capteur.type}</td>
                    <td>${capteur.reference}</td>
                    <td>${capteur.port}</td>
                    <td>${capteur.piece || "Non défini"}</td>
                    <td>${capteur.valeur || "Aucune"}</td>
                    <td>${capteur.date || "Non disponible"}</td>
                    <td><span class="badge ${etat === "Actif" ? "bg-success" : "bg-secondary"}">${etat}</span></td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error("Erreur lors du chargement des capteurs :", error);
        alert("Impossible de charger les données des capteurs.");
    }
}

// Charger les capteurs lorsque la page est prête
document.addEventListener("DOMContentLoaded", chargerCapteurs);
