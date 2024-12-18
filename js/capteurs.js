
async function chargerCapteurs() {
    try {
        const response = await fetch("http://127.0.0.1:8000/capteurs");
        if (!response.ok) throw new Error("Erreur lors du chargement des capteurs");

        const capteurs = await response.json();
        const tableBody = document.getElementById("capteurs-table");

        tableBody.innerHTML = ""; // Réinitialise le tableau

        capteurs.forEach((capteur) => {
            const row = `
                <tr>
                    <td>${capteur.id}</td>
                    <td>${capteur.type}</td>
                    <td>${capteur.reference_commerciale}</td>
                    <td>${capteur.port_communication}</td>
                    <td>${capteur.nom_piece || "Non assigné"}</td>
                    <td>${capteur.derniere_valeur}</td>
                    <td>${capteur.date_insertion || "Non disponible"}</td>
                    <td>${capteur.etat}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (err) {
        console.error("Erreur lors du chargement des capteurs :", err);
        alert("Impossible de charger les capteurs.");
    }
}

document.addEventListener("DOMContentLoaded", chargerCapteurs);
