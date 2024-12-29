// Ajouter un capteur/actionneur
document.getElementById("configuration-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Récupérer les valeurs du formulaire
    const type = document.getElementById("type").value;
    console.log(type);
    const reference_commerciale = document.getElementById("reference").value;
    const port_communication = document.getElementById("port").value;
    const id_piece = document.getElementById("id_piece").value;
    const id_type_capteur = document.getElementById("id_type_capteur").value;

    try {
        // Envoyer les données à l'API FastAPI
        const response = await fetch("http://127.0.0.1:8080/configuration", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type,
                reference_commerciale,
                port_communication,
                id_piece,
                id_type_capteur,
            }),
        });

        if (response.ok) {
            alert("Capteur ajouté avec succès !");
            // Réinitialiser le formulaire
            document.getElementById("configuration-form").reset();
        } else {
            const errorData = await response.json();
            alert(`Erreur : ${errorData.detail}`);
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du capteur :", error);
        alert("Impossible d'ajouter le capteur. Veuillez vérifier votre connexion.");
    }
});



// Supprimer un capteur
async function supprimerCapteur(capteur_id) {
    try {
        const response = await fetch(`http://127.0.0.1:8080/capteurs/${capteur_id}`, {
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
        const response = await fetch("http://127.0.0.1:8080/capteurs");
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
        
                    <td>${capteur.reference_commerciale}</td>
                    <td>${capteur.port_communication}</td>
                    <td>${capteur.nom_piece || "Non défini"}</td>
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

document.getElementById("modification-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Récupérer les valeurs du formulaire
    const id = document.getElementById("mod-capteur-id").value;
    const type = document.getElementById("mod-type").value;
    const reference_commerciale = document.getElementById("mod-reference").value;
    const port_communication = document.getElementById("mod-port").value;
    const id_type_capteur = document.getElementById("id_type_capteur").value;

    try {
        // Envoyer les données à l'API FastAPI
        const response = await fetch(`http://127.0.0.1:8080/capteurs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type,
                reference_commerciale,
                port_communication,
                id_type_capteur,
            }),
        });

        if (response.ok) {
            alert("Capteur modifié avec succès !");
            // Réinitialiser le formulaire
            document.getElementById("modification-form").reset();
        } else {
            const errorData = await response.json();
            alert(`Erreur : ${errorData.detail}`);
        }
    } catch (error) {
        console.error("Erreur lors de la modification du capteur :", error);
        alert("Impossible de modifier le capteur. Veuillez vérifier votre connexion.");
    }
});

// Déclarez typeCapteurs en dehors de la fonction pour qu'il soit accessible globalement
let typeCapteurs = [];
async function loadCapteurs() {
    try {
        // Fetch data from the API
        const response = await fetch("http://127.0.0.1:8080/type_capteurs");
        if (!response.ok) {
            throw new Error("Erreur lors du chargement des capteurs");
        }

        // Parse the JSON response
        typeCapteurs = await response.json();


        // Get the select element
        const selectElement = document.getElementById('id_type_capteur');
        // Clear any existing options to prevent appending multiple times
        selectElement.innerHTML = '';

        // Populate the select element with options from capteurs
        typeCapteurs.forEach(capteur => {
            const option = document.createElement('option'); // Create a new <option> element
            option.value = capteur.id; // Assuming each capteur has a unique 'id'
            option.textContent = capteur.nom; // Assuming each capteur has a 'name'
            selectElement.appendChild(option); // Append the option to the <select> element

        });
        const hiddenInput = document.getElementById('type');
        // Select the first option automatically
        if (typeCapteurs.length > 0) {
            selectElement.selectedIndex = 0;
            const selectedCapteur = typeCapteurs.find(capteur => capteur.id == selectElement.value);

            hiddenInput.value = selectedCapteur.nom;
        }

        // Listen for changes in the select element (after options have been loaded)
        selectElement.addEventListener('change', () => {
            // Find the selected capteur by id
            const selectedCapteur = typeCapteurs.find(capteur => capteur.id == selectElement.value);

            if (selectedCapteur) {
                // Set the hidden input value to the selected capteur's name
                hiddenInput.value = selectedCapteur.nom;
                console.log("Hidden field value set to:", hiddenInput.value);
            }
        });
    } catch (error) {
        console.error(error.message);
    }
}

loadCapteurs();





// Déclarez des variables pour les éléments du formulaire
const logementSelect = document.getElementById('id_logement');
const pieceSelect = document.getElementById('id_piece');

// Fonction pour charger les logements (imaginez une API ou un tableau)
async function loadLogements() {
    try {
        // Appel API ou utilisation de données locales pour les logements
        const response = await fetch("http://127.0.0.1:8080/logements");
        if (!response.ok) {
            throw new Error("Erreur lors du chargement des logements");
        }
        const logements = await response.json();

        console.log(logements)

        // Vider le select des logements
        logementSelect.innerHTML = '<option value="">Sélectionnez un logement</option>';

        // Ajouter les options des logements
        logements.forEach(logement => {
            const option = document.createElement('option');
            option.value = logement.id;  // Supposons que chaque logement ait un 'id'
            option.textContent = logement.adresse;  // Supposons que chaque logement ait un 'nom'
            logementSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur dans loadLogements:", error.message);
    }
}

// Fonction pour charger les pièces en fonction du logement sélectionné
async function loadPiecesForLogement(logementId) {
    try {
        // Appel API ou utilisation de données locales pour les pièces du logement
        const response = await fetch(`http://127.0.0.1:8080/pieces/${logementId}`);
        if (!response.ok) {
            throw new Error("Erreur lors du chargement des pièces");
        }
        const pieces = await response.json();

        console.log(pieces)

        // Vider le select des pièces
        pieceSelect.innerHTML = '<option value="">Sélectionnez une pièce</option>';

        // Activer le select des pièces
        pieceSelect.disabled = false;

        // Ajouter les options des pièces
        pieces.forEach(piece => {
            const option = document.createElement('option');
            option.value = piece.id_piece
            ;  // Supposons que chaque pièce ait un 'id'
            option.textContent = piece.nom_piece;  // Supposons que chaque pièce ait un 'nom'
            pieceSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur dans loadPiecesForLogement:", error.message);
    }
}

// Initialiser la liste des logements au chargement de la page
loadLogements();

// Écouteur d'événement pour la sélection d'un logement
logementSelect.addEventListener('change', () => {
    const logementId = logementSelect.value;
    
    if (logementId) {
        loadPiecesForLogement(logementId);  // Charger les pièces pour le logement sélectionné
    } else {
        pieceSelect.innerHTML = '<option value="">Sélectionnez une pièce</option>';
        pieceSelect.disabled = true;  // Désactiver le select des pièces
    }
});
