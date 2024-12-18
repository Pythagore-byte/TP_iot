// // Charger les logements et remplir le menu déroulant
// async function chargerLogements() {
//     try {
//         const response = await fetch("http://127.0.0.1:8000/logements");
//         if (!response.ok) throw new Error("Erreur lors du chargement des logements.");

//         const logements = await response.json();
//         const selectLogement = document.getElementById("logement-select");

//         selectLogement.innerHTML = `<option value="">-- Sélectionnez un logement --</option>`; // Réinitialiser le menu

//         logements.forEach(logement => {
//             const option = document.createElement("option");
//             option.value = logement.id;
//             option.textContent = `Logement ${logement.id} - ${logement.adresse}`;
//             selectLogement.appendChild(option);
//         });

//     } catch (error) {
//         console.error("Erreur lors du chargement des logements :", error);
//         alert("Impossible de charger les logements.");
//     }
// }

// // Charger les pièces pour le logement sélectionné
// async function chargerPieces(logementId) {
//     try {
//         const response = await fetch(`http://127.0.0.1:8000/pieces/${logementId}`);
//         if (!response.ok) throw new Error("Erreur lors du chargement des pièces.");

//         const pieces = await response.json();
//         const tableBody = document.getElementById("pieces-table");

//         tableBody.innerHTML = ""; // Réinitialiser le tableau

//         if (pieces.length === 0) {
//             const row = `<tr><td colspan="6">Aucune pièce trouvée pour ce logement.</td></tr>`;
//             tableBody.innerHTML = row;
//             return;
//         }

//         pieces.forEach(piece => {
//             const row = `
//                 <tr>
//                     <td>${piece.id_piece}</td>
//                     <td>${piece.nom_piece}</td>
//                     <td>${piece.coordonnees_x}</td>
//                     <td>${piece.coordonnees_y}</td>
//                     <td>${piece.coordonnees_z}</td>
//                     <td>
//                         <button class="btn btn-warning btn-edit" data-id="${piece.id_piece}">Modifier</button>
//                         <button class="btn btn-danger btn-delete" data-id="${piece.id_piece}">Supprimer</button>
//                     </td>
//                 </tr>
//             `;
//             tableBody.innerHTML += row;
//         });

//         // Ajouter les événements pour les boutons Modifier et Supprimer
//         document.querySelectorAll(".btn-edit").forEach(button => {
//             button.addEventListener("click", () => remplirFormulaireModification(button.dataset.id));
//         });

//         document.querySelectorAll(".btn-delete").forEach(button => {
//             button.addEventListener("click", () => supprimerPiece(button.dataset.id));
//         });

//     } catch (error) {
//         console.error("Erreur lors du chargement des pièces :", error);
//         alert("Impossible de charger les pièces.");
//     }
// }

// // Ajouter une pièce
// document.getElementById("add-piece-form").addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const nomPiece = document.getElementById("nom-piece").value;
//     const idLogement = document.getElementById("id-logement").value;
//     const coordX = document.getElementById("coordonnees-x").value || 0;
//     const coordY = document.getElementById("coordonnees-y").value || 0;
//     const coordZ = document.getElementById("coordonnees-z").value || 0;

//     try {
//         const response = await fetch("http://127.0.0.1:8000/pieces", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 nom_piece: nomPiece,
//                 id_logement: idLogement,
//                 coordonnees_x: parseFloat(coordX),
//                 coordonnees_y: parseFloat(coordY),
//                 coordonnees_z: parseFloat(coordZ)
//             })
//         });

//         if (response.ok) {
//             alert("Pièce ajoutée avec succès !");
//             chargerPieces(idLogement);
//             e.target.reset();
//         } else {
//             const error = await response.json();
//             alert(`Erreur : ${error.detail}`);
//         }

//     } catch (error) {
//         console.error("Erreur lors de l'ajout de la pièce :", error);
//         alert("Impossible d'ajouter la pièce.");
//     }
// });

// // Supprimer une pièce
// async function supprimerPiece(idPiece) {
//     if (!confirm("Voulez-vous vraiment supprimer cette pièce ?")) return;

//     try {
//         const response = await fetch(`http://127.0.0.1:8000/pieces/${idPiece}`, { method: "DELETE" });

//         if (response.ok) {
//             alert("Pièce supprimée avec succès !");
//             const logementId = document.getElementById("logement-select").value;
//             chargerPieces(logementId);
//         } else {
//             const error = await response.json();
//             alert(`Erreur : ${error.detail}`);
//         }

//     } catch (error) {
//         console.error("Erreur lors de la suppression de la pièce :", error);
//         alert("Impossible de supprimer la pièce.");
//     }
// }

// // Remplir le formulaire pour modifier une pièce
// async function remplirFormulaireModification(idPiece) {
//     try {
//         const response = await fetch(`http://127.0.0.1:8000/pieces/${idPiece}`);
//         if (!response.ok) throw new Error("Erreur lors de la récupération des données de la pièce.");

//         const piece = await response.json();

//         document.getElementById("piece-id-edit").value = piece.id_piece;
//         document.getElementById("nom-piece-edit").value = piece.nom_piece;
//         document.getElementById("coordonnees-x-edit").value = piece.coordonnees_x;
//         document.getElementById("coordonnees-y-edit").value = piece.coordonnees_y;
//         document.getElementById("coordonnees-z-edit").value = piece.coordonnees_z;

//         // Activer l'onglet Modifier
//         document.querySelector('.submenu-link[data-section="modifier-piece"]').click();

//     } catch (error) {
//         console.error("Erreur lors du remplissage du formulaire :", error);
//         alert("Impossible de récupérer les données de la pièce.");
//     }
// }

// // Modifier une pièce
// document.getElementById("edit-piece-form").addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const idPiece = document.getElementById("piece-id-edit").value;
//     const nomPiece = document.getElementById("nom-piece-edit").value;
//     const coordX = document.getElementById("coordonnees-x-edit").value || 0;
//     const coordY = document.getElementById("coordonnees-y-edit").value || 0;
//     const coordZ = document.getElementById("coordonnees-z-edit").value || 0;

//     try {
//         const response = await fetch(`http://127.0.0.1:8000/pieces/${idPiece}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 nom_piece: nomPiece,
//                 coordonnees_x: parseFloat(coordX),
//                 coordonnees_y: parseFloat(coordY),
//                 coordonnees_z: parseFloat(coordZ)
//             })
//         });

//         if (response.ok) {
//             alert("Pièce modifiée avec succès !");
//             const logementId = document.getElementById("logement-select").value;
//             chargerPieces(logementId);
//         } else {
//             const error = await response.json();
//             alert(`Erreur : ${error.detail}`);
//         }

//     } catch (error) {
//         console.error("Erreur lors de la modification de la pièce :", error);
//         alert("Impossible de modifier la pièce.");
//     }
// });

// // Gérer les onglets (sous-menus)
// document.querySelectorAll(".submenu-link").forEach(link => {
//     link.addEventListener("click", (e) => {
//         e.preventDefault();

//         document.querySelectorAll(".submenu-link").forEach(link => link.classList.remove("active"));
//         document.querySelectorAll(".config-section").forEach(section => section.classList.remove("active"));

//         link.classList.add("active");
//         document.getElementById(link.dataset.section).classList.add("active");
//     });
// });

// // Charger les logements au démarrage
// document.addEventListener("DOMContentLoaded", chargerLogements);

// // Charger les pièces lorsque le logement est sélectionné
// document.getElementById("logement-select").addEventListener("change", (e) => {
//     const logementId = e.target.value;
//     if (logementId) chargerPieces(logementId);
// });

// Charger les logements dans le menu déroulant
// async function chargerLogements() {
//     try {
//         const response = await fetch("http://127.0.0.1:8000/logements");
//         if (!response.ok) throw new Error("Erreur lors du chargement des logements.");

//         const logements = await response.json();
//         const selectLogement = document.getElementById("logement-select");

//         selectLogement.innerHTML = `<option value="">-- Sélectionnez un logement --</option>`; // Réinitialiser le menu

//         logements.forEach(logement => {
//             const option = document.createElement("option");
//             option.value = logement.id;
//             option.textContent = `Logement ${logement.id} - ${logement.adresse}`;
//             selectLogement.appendChild(option);
//         });
//     } catch (error) {
//         console.error("Erreur lors du chargement des logements :", error);
//         alert("Impossible de charger les logements.");
//     }
// }

// Charger les pièces pour un logement sélectionné
// document.addEventListener("DOMContentLoaded", () => {
//     chargerLogements();

//     // Recharger les pièces lorsque le logement sélectionné change
//     document.getElementById("logement-select").addEventListener("change", (e) => {
//         const logementId = e.target.value;
//         if (logementId) chargerPieces(logementId);
//     });

//     // Ajouter une pièce
//     document.getElementById("add-piece-form").addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const nomPiece = document.getElementById("nom-piece").value;
//         const idLogement = document.getElementById("logement-select").value;
//         const coordX = document.getElementById("coordonnees-x").value || 0;
//         const coordY = document.getElementById("coordonnees-y").value || 0;
//         const coordZ = document.getElementById("coordonnees-z").value || 0;

//         if (!idLogement) {
//             alert("Veuillez sélectionner un logement.");
//             return;
//         }

//         try {
//             const response = await fetch("http://127.0.0.1:8000/pieces", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     nom_piece: nomPiece,
//                     id_logement: idLogement,
//                     coordonnees_x: parseFloat(coordX),
//                     coordonnees_y: parseFloat(coordY),
//                     coordonnees_z: parseFloat(coordZ),
//                 }),
//             });

//             if (response.ok) {
//                 alert("Pièce ajoutée avec succès !");
//                 chargerPieces(idLogement);
//                 e.target.reset();
//             } else {
//                 const error = await response.json();
//                 alert(`Erreur : ${error.detail}`);
//             }
//         } catch (err) {
//             console.error("Erreur lors de l'ajout de la pièce :", err);
//         }
//     });

//     // Modifier une pièce
//     document.getElementById("edit-piece-form").addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const idPiece = document.getElementById("piece-id-edit").value;
//         const nomPiece = document.getElementById("nom-piece-edit").value;
//         const coordX = document.getElementById("coordonnees-x-edit").value || 0;
//         const coordY = document.getElementById("coordonnees-y-edit").value || 0;
//         const coordZ = document.getElementById("coordonnees-z-edit").value || 0;
//         const logementId = document.getElementById("logement-select").value;

//         try {
//             const response = await fetch(`http://127.0.0.1:8000/pieces/${idPiece}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     nom_piece: nomPiece,
//                     coordonnees_x: parseFloat(coordX),
//                     coordonnees_y: parseFloat(coordY),
//                     coordonnees_z: parseFloat(coordZ),
//                 }),
//             });

//             if (response.ok) {
//                 alert("Pièce modifiée avec succès !");
//                 chargerPieces(logementId);
//                 e.target.reset();
//             } else {
//                 const error = await response.json();
//                 alert(`Erreur : ${error.detail}`);
//             }
//         } catch (err) {
//             console.error("Erreur lors de la modification de la pièce :", err);
//         }
//     });

//     // Supprimer une pièce
//     document.getElementById("delete-piece-form").addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const idPiece = document.getElementById("piece-id-delete").value;
//         const logementId = document.getElementById("logement-select").value;

//         if (!confirm("Voulez-vous vraiment supprimer cette pièce ?")) return;

//         try {
//             const response = await fetch(`http://127.0.0.1:8000/pieces/${idPiece}`, { method: "DELETE" });

//             if (response.ok) {
//                 alert("Pièce supprimée avec succès !");
//                 chargerPieces(logementId);
//                 e.target.reset();
//             } else {
//                 const error = await response.json();
//                 alert(`Erreur : ${error.detail}`);
//             }
//         } catch (err) {
//             console.error("Erreur lors de la suppression de la pièce :", err);
//         }
//     });
// });

// // Charger les logements dans le menu déroulant
// async function chargerLogements() {
//     try {
//         const response = await fetch("http://127.0.0.1:8000/logements");
//         const logements = await response.json();
//         const select = document.getElementById("logement-select");

//         logements.forEach((logement) => {
//             select.innerHTML += `<option value="${logement.id}">${logement.adresse} (ID: ${logement.id})</option>`;
//         });
//     } catch (err) {
//         console.error("Erreur lors du chargement des logements :", err);
//     }
// }

// // Charger les pièces pour un logement sélectionné
// async function chargerPieces(logementId) {
//     try {
//         const response = await fetch(`http://127.0.0.1:8000/pieces/${logementId}`);
//         const pieces = await response.json();
//         const tableBody = document.getElementById("pieces-table");

//         tableBody.innerHTML = ""; // Réinitialise le tableau

//         if (pieces.length === 0) {
//             tableBody.innerHTML = `<tr><td colspan="6">Aucune pièce trouvée pour ce logement.</td></tr>`;
//             return;
//         }

//         pieces.forEach((piece) => {
//             const row = `
//                 <tr>
//                     <td>${piece.id_piece}</td>
//                     <td>${piece.nom_piece}</td>
//                     <td>${piece.coordonnees_x}</td>
//                     <td>${piece.coordonnees_y}</td>
//                     <td>${piece.coordonnees_z}</td>
//                     <td>
//                         <button class="btn btn-warning" onclick="remplirFormulaireModification(${piece.id_piece}, '${piece.nom_piece}', ${piece.coordonnees_x}, ${piece.coordonnees_y}, ${piece.coordonnees_z})">Modifier</button>
//                         <button class="btn btn-danger" onclick="supprimerPiece(${piece.id_piece})">Supprimer</button>
//                     </td>
//                 </tr>
//             `;
//             tableBody.innerHTML += row;
//         });
//     } catch (err) {
//         console.error("Erreur lors du chargement des pièces :", err);
//         alert("Impossible de charger les pièces.");
//     }
// }

// // Préremplir le formulaire de modification
// function remplirFormulaireModification(idPiece, nomPiece, coordX, coordY, coordZ) {
//     document.getElementById("piece-id-edit").value = idPiece;
//     document.getElementById("nom-piece-edit").value = nomPiece;
//     document.getElementById("coordonnees-x-edit").value = coordX;
//     document.getElementById("coordonnees-y-edit").value = coordY;
//     document.getElementById("coordonnees-z-edit").value = coordZ;

//     // Activer l'onglet de modification
//     document.querySelector('.submenu-link[data-section="modifier-piece"]').click();
// }
// document.addEventListener("DOMContentLoaded", () => {
//     chargerLogements();

//     document.getElementById("logement-select").addEventListener("change", (e) => {
//         const logementId = e.target.value;
//         if (logementId) chargerPieces(logementId);
//     });

//     document.getElementById("piece-form").addEventListener("submit", (e) => {
//         e.preventDefault();
//         const idLogement = document.getElementById("logement-select").value;
//         if (!idLogement) {
//             alert("Veuillez sélectionner un logement !");
//             return;
//         }
//         const pieceId = document.getElementById("piece-id").value;
//         if (pieceId) {
//             modifierPiece(pieceId, idLogement);
//         } else {
//             ajouterPiece(idLogement);
//         }
//     });
// });

// // Charger la liste des logements dans le menu déroulant
// async function chargerLogements() {
//     try {
//         const response = await fetch("http://127.0.0.1:8000/logements");
//         const logements = await response.json();
//         const select = document.getElementById("logement-select");
//         logements.forEach((logement) => {
//             select.innerHTML += `<option value="${logement.id}">${logement.adresse} (ID: ${logement.id})</option>`;
//         });
//     } catch (error) {
//         console.error("Erreur lors du chargement des logements :", error);
//     }
// }

// // Charger les pièces pour un logement
// async function chargerPieces(idLogement) {
//     try {
//         const response = await fetch(`http://127.0.0.1:8000/pieces/${idLogement}`);
//         const pieces = await response.json();
//         const tableBody = document.getElementById("pieces-table");
//         tableBody.innerHTML = "";
//         pieces.forEach((piece) => {
//             tableBody.innerHTML += `
//                 <tr>
//                     <td>${piece.id_piece}</td>
//                     <td>${piece.nom_piece}</td>
//                     <td>${piece.coordonnees_x || "0"}</td>
//                     <td>${piece.coordonnees_y || "0"}</td>
//                     <td>${piece.coordonnees_z || "0"}</td>
//                     <td>
//                         <button onclick="remplirFormulaire(${piece.id_piece}, '${piece.nom_piece}', ${piece.coordonnees_x}, ${piece.coordonnees_y}, ${piece.coordonnees_z})" class="btn btn-warning">Modifier</button>
//                         <button onclick="supprimerPiece(${piece.id_piece}, ${idLogement})" class="btn btn-danger">Supprimer</button>
//                     </td>
//                 </tr>
//             `;
//         });
//     } catch (error) {
//         console.error("Erreur lors du chargement des pièces :", error);
//     }
// }

document.addEventListener("DOMContentLoaded", () => {
    chargerLogements();

    // Recharger les pièces lors du changement de logement
    document.getElementById("logement-select").addEventListener("change", (e) => {
        const logementId = e.target.value;
        if (logementId) chargerPieces(logementId);
    });

    // Ajouter une pièce
    document.getElementById("add-piece-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const logementId = document.getElementById("logement-select").value;
        if (!logementId) {
            alert("Veuillez sélectionner un logement !");
            return;
        }
        await ajouterPiece(logementId);
    });
});

// Charger les logements
async function chargerLogements() {
    const select = document.getElementById("logement-select");
    select.innerHTML = '<option value="">-- Sélectionnez un logement --</option>';
    try {
        const response = await fetch("http://127.0.0.1:8000/logements");
        const logements = await response.json();

        logements.forEach((logement) => {
            select.innerHTML += `<option value="${logement.id}">${logement.adresse} (ID: ${logement.id})</option>`;
        });
    } catch (error) {
        console.error("Erreur lors du chargement des logements :", error);
    }
}

// Charger les pièces
async function chargerPieces(idLogement) {
    const tableBody = document.getElementById("pieces-table");
    tableBody.innerHTML = "";

    try {
        const response = await fetch(`http://127.0.0.1:8000/pieces/${idLogement}`);
        const pieces = await response.json();

        pieces.forEach((piece) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${piece.id_piece}</td>
                    <td>${piece.nom_piece}</td>
                    <td>${piece.coordonnees_x || "0"}</td>
                    <td>${piece.coordonnees_y || "0"}</td>
                    <td>${piece.coordonnees_z || "0"}</td>
                    <td>
                        <button class="btn btn-warning" onclick="remplirFormulaireModification(${piece.id_piece}, '${piece.nom_piece}', ${piece.coordonnees_x}, ${piece.coordonnees_y}, ${piece.coordonnees_z})">Modifier</button>
                        <button class="btn btn-danger" onclick="supprimerPiece(${piece.id_piece}, ${idLogement})">Supprimer</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erreur lors du chargement des pièces :", error);
    }
}

// Ajouter une pièce
async function ajouterPiece(idLogement) {
    const data = {
        nom_piece: document.getElementById("nom-piece-add").value,
        coordonnees_x: document.getElementById("coordonnees-x-add").value || 0,
        coordonnees_y: document.getElementById("coordonnees-y-add").value || 0,
        coordonnees_z: document.getElementById("coordonnees-z-add").value || 0,
        id_logement: idLogement
    };

    try {
        await fetch("http://127.0.0.1:8000/pieces", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        alert("Pièce ajoutée !");
        chargerPieces(idLogement);
        document.getElementById("add-piece-form").reset();
    } catch (error) {
        console.error("Erreur lors de l'ajout de la pièce :", error);
    }
}

// Remplir le formulaire de modification
function remplirFormulaireModification(id, nom, x, y, z) {
    const nomPiece = prompt("Entrez le nouveau nom de la pièce :", nom);
    const coordX = prompt("Nouvelle coordonnée X :", x);
    const coordY = prompt("Nouvelle coordonnée Y :", y);
    const coordZ = prompt("Nouvelle coordonnée Z :", z);

    if (nomPiece !== null && coordX !== null && coordY !== null && coordZ !== null) {
        modifierPiece(id, nomPiece, coordX, coordY, coordZ);
    }
}

// Modifier une pièce
async function modifierPiece(idPiece, nom, x, y, z) {
    const data = {
        nom_piece: nom,
        coordonnees_x: parseFloat(x) || 0,
        coordonnees_y: parseFloat(y) || 0,
        coordonnees_z: parseFloat(z) || 0
    };

    try {
        const logementId = document.getElementById("logement-select").value;
        await fetch(`http://127.0.0.1:8000/pieces/${idPiece}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        alert("Pièce modifiée !");
        chargerPieces(logementId);
    } catch (error) {
        console.error("Erreur lors de la modification de la pièce :", error);
    }
}

// Supprimer une pièce
async function supprimerPiece(idPiece, idLogement) {
    if (!confirm("Voulez-vous vraiment supprimer cette pièce ?")) return;

    try {
        await fetch(`http://127.0.0.1:8000/pieces/${idPiece}`, { method: "DELETE" });
        alert("Pièce supprimée !");
        chargerPieces(idLogement);
    } catch (error) {
        console.error("Erreur lors de la suppression de la pièce :", error);
    }
}
