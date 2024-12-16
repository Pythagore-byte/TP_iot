// document.getElementById("configuration-form").addEventListener("submit", async (e) => {
//     e.preventDefault();

//     // Récupérer les valeurs du formulaire
//     const type = document.getElementById("type").value;
//     const reference = document.getElementById("reference").value;
//     const port = document.getElementById("port").value;

//     try {
//         // Envoyer les données à l'API FastAPI
//         const response = await fetch("http://127.0.0.1:8000/configuration", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ type, reference, port })
//         });

//         if (response.ok) {
//             alert("Capteur/Actionneur ajouté avec succès !");
//             // Réinitialiser le formulaire
//             document.getElementById("configuration-form").reset();
//         } else {
//             alert("Erreur lors de l'ajout du capteur/actionneur.");
//         }
//     } catch (error) {
//         console.error("Erreur lors de l'ajout du capteur/actionneur :", error);
//         alert("Impossible de soumettre le formulaire.");
//     }
// });

// Ajouter un capteur/actionneur
document.getElementById("configuration-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Récupérer les valeurs du formulaire
    const type = document.getElementById("type").value;
    const reference = document.getElementById("reference").value;
    const port = document.getElementById("port").value;

    try {
        // Envoyer les données à l'API FastAPI
        const response = await fetch("http://127.0.0.1:8000/configuration", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, reference, port })
        });

        if (response.ok) {
            alert("Capteur/Actionneur ajouté avec succès !");
            // Réinitialiser le formulaire
            document.getElementById("configuration-form").reset();
            chargerCapteurs(); // Recharge la liste après l'ajout
        } else {
            alert("Erreur lors de l'ajout du capteur/actionneur.");
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du capteur/actionneur :", error);
        alert("Impossible de soumettre le formulaire.");
    }
});

// Supprimer un capteur
async function supprimerCapteur(capteur_id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/capteurs/${capteur_id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Capteur supprimé avec succès !");
            chargerCapteurs(); // Recharge la liste après suppression
        } else {
            const error = await response.json();
            alert("Erreur : " + error.detail);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Une erreur s'est produite lors de la suppression du capteur.");
    }
}

// Gestion du formulaire de suppression
document.getElementById("form-suppression").addEventListener("submit", async (event) => {
    event.preventDefault();
    const capteur_id = document.getElementById("capteur_id").value;
    await supprimerCapteur(capteur_id);
});

// Charger la liste des capteurs
async function chargerCapteurs() {
    try {
        const response = await fetch("http://127.0.0.1:8000/capteurs");
        if (!response.ok) {
            throw new Error("Erreur lors du chargement des capteurs");
        }

        const capteurs = await response.json();
        const tableBody = document.getElementById("capteurs-table");
        tableBody.innerHTML = ""; // Réinitialise le tableau

        capteurs.forEach((capteur) => {
            const row = `
                <tr>
                    <td>${capteur.id}</td>
                    <td>${capteur.type}</td>
                    <td>${capteur.reference}</td>
                    <td>${capteur.port}</td>
                    <td>${capteur.piece || "Non défini"}</td>
                    <td>
                        <button class="btn btn-danger" onclick="supprimerCapteur(${capteur.id})">
                            Supprimer
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Erreur lors du chargement des capteurs :", error);
        alert("Impossible de charger la liste des capteurs.");
    }
}
document.querySelectorAll(".submenu-link").forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute("data-section");

        // Active le lien cliqué
        document.querySelectorAll(".submenu-link").forEach((el) => el.classList.remove("active"));
        link.classList.add("active");

        // Affiche la section correspondante
        document.querySelectorAll(".config-section").forEach((section) => {
            section.classList.remove("active");
            if (section.id === sectionId) {
                section.classList.add("active");
            }
        });
    });
});


// Charger la liste des capteurs au démarrage
document.addEventListener("DOMContentLoaded", chargerCapteurs);
