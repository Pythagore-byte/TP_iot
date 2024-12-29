
document.addEventListener("DOMContentLoaded", () => {
    chargerLogements();

    document.getElementById("logement-select").addEventListener("change", (e) => {
        const logementId = e.target.value;
        if (logementId) {
            chargerPieces(logementId);
        } else {
            document.getElementById("pieces-table").innerHTML = `<tr><td colspan="6">Aucune pièce sélectionnée.</td></tr>`;
        }
    });

    // Gérer le bouton pour ouvrir le modal Ajouter une pièce
    document.getElementById("open-add-piece-modal").addEventListener("click", () => {
        ouvrirModal("Ajouter une Pièce");
        document.getElementById("piece-id").value = ""; // Réinitialiser ID
        document.getElementById("piece-form").reset();
    });

    // Fermer le modal
    document.getElementById("close-modal").addEventListener("click", fermerModal);

    // Gestion de la soumission du formulaire pour ajouter ou modifier une pièce
    document.getElementById("piece-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const logementId = document.getElementById("logement-select").value;
        if (!logementId) {
            alert("Veuillez sélectionner un logement !");
            return;
        }

        const pieceId = document.getElementById("piece-id").value;
        if (pieceId) {
            modifierPiece(pieceId, logementId);
        } else {
            ajouterPiece(logementId);
        }
    });
});

// Charger la liste des logements
async function chargerLogements() {
    try {
        const response = await fetch("http://127.0.0.1:8000/logements");
        const logements = await response.json();
        const select = document.getElementById("logement-select");
        logements.forEach((logement) => {
            select.innerHTML += `<option value="${logement.id}">${logement.adresse} (ID: ${logement.id})</option>`;
        });
    } catch (error) {
        console.error("Erreur lors du chargement des logements :", error);
    }
}


async function chargerPieces(idLogement) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/pieces/${idLogement}`);
        
        // Vérifie si la réponse est correcte
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des pièces : ${response.statusText}`);
        }

        const pieces = await response.json();
        const tableBody = document.getElementById("pieces-table");
        tableBody.innerHTML = ""; // Réinitialise le tableau

        if (pieces.length === 0) {
            // Afficher un  message si aucune pièce n'est trouvée
            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align: center; color: #999; font-style: italic;">
                        Ce logement ne contient actuellement aucune pièce. Cliquez sur "Ajouter une Pièce" pour commencer !
                    </td>
                </tr>
            `;
            return;
        }

        // Affichage des pièces si disponibles
        pieces.forEach((piece) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${piece.id_piece}</td>
                    <td>${piece.nom_piece}</td>
                    <td>${piece.coordonnees_x || "0"}</td>
                    <td>${piece.coordonnees_y || "0"}</td>
                    <td>${piece.coordonnees_z || "0"}</td>
                    <td>
                        <button onclick="remplirFormulaire(${piece.id_piece}, '${piece.nom_piece}', ${piece.coordonnees_x}, ${piece.coordonnees_y}, ${piece.coordonnees_z})" class="btn btn-warning">Modifier</button>
                        <button onclick="supprimerPiece(${piece.id_piece}, ${idLogement})" class="btn btn-danger">Supprimer</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erreur lors du chargement des pièces :", error);

        // Afficher un message d'erreur dans le tableau
        const tableBody = document.getElementById("pieces-table");
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: red;">
                    Erreur : Impossible de charger les pièces. Veuillez réessayer plus tard.
                </td>
            </tr>
        `;
    }
}



// Ajouter une pièce
async function ajouterPiece(idLogement) {
    const data = {
        nom_piece: document.getElementById("nom-piece").value,
        coordonnees_x: parseFloat(document.getElementById("coordonnees-x").value) || 0,
        coordonnees_y: parseFloat(document.getElementById("coordonnees-y").value) || 0,
        coordonnees_z: parseFloat(document.getElementById("coordonnees-z").value) || 0,
        id_logement: idLogement
    };

    await fetch("http://127.0.0.1:8000/pieces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert("Pièce ajoutée !");
    
    chargerPieces(idLogement);
    fermerModal();
}

// Remplir le formulaire pour modification
function remplirFormulaire(id, nom, x, y, z) {
    ouvrirModal("Modifier la Pièce");
    document.getElementById("piece-id").value = id;
    document.getElementById("nom-piece").value = nom;
    document.getElementById("coordonnees-x").value = x;
    document.getElementById("coordonnees-y").value = y;
    document.getElementById("coordonnees-z").value = z;
}

// Modifier une pièce
async function modifierPiece(idPiece, idLogement) {
    const data = {
        nom_piece: document.getElementById("nom-piece").value,
        coordonnees_x: parseFloat(document.getElementById("coordonnees-x").value),
        coordonnees_y: parseFloat(document.getElementById("coordonnees-y").value),
        coordonnees_z: parseFloat(document.getElementById("coordonnees-z").value)
    };

    await fetch(`http://127.0.0.1:8000/pieces/${idPiece}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert("Pièce modifiée  avec succes !");
    chargerPieces(idLogement);
    fermerModal();
}

// Supprimer une pièce
async function supprimerPiece(idPiece, idLogement) {
    if (!confirm("Voulez-vous vraiment supprimer cette pièce ?")) return;

    await fetch(`http://127.0.0.1:8000/pieces/${idPiece}`, { method: "DELETE" });
    alert("Pièce supprimée avec succes !");
    chargerPieces(idLogement);
}

// Gestion des modals
function ouvrirModal(title) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("piece-modal").classList.remove("hidden");
}

function fermerModal() {
    document.getElementById("piece-modal").classList.add("hidden");
}
