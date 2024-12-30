async function chargerLogements() {
    try {
        const response = await fetch("http://127.0.0.1:8080/logements");
        if (!response.ok) throw new Error("Erreur lors du chargement des logements");

        const logements = await response.json();
        const tableBody = document.getElementById("logements-table");

        tableBody.innerHTML = ""; // Réinitialise le tableau

        logements.forEach((logement) => {
            const row = `
                <tr data-id="${logement.id}">
                    <td>${logement.id}</td>
                    <td>${logement.adresse}</td>
                    <td>${logement.telephone || "Non défini"}</td>
                    <td>${logement.ip || "Non défini"}</td>
                    <td>${logement.date_insertion}</td>
                    <td>
                        <button class="btn btn-warning" onclick="remplirFormulaire(${logement.id})">Modifier</button>
                        <button class="btn btn-danger" onclick="supprimerLogement(${logement.id})">Supprimer</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
            
        });
    } catch (err) {
        console.error("Erreur lors du chargement des logements :", err);
        alert("Impossible de charger les logements.");
    }
}

// Ajouter un logement
document.getElementById("add-logement-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const adresse = document.getElementById("adresse-logement").value;
    const numero_telephone = document.getElementById("telephone-logement").value;
    const adresse_ip = document.getElementById("ip-logement").value;

    try {
        const response = await fetch("http://127.0.0.1:8080/logements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adresse, numero_telephone, adresse_ip }),
        });

        if (response.ok) {
            alert("Logement ajouté avec succès !");
            chargerLogements();
            e.target.reset();
        } else {
            const error = await response.json();
            alert(`Erreur : ${error.detail}`);
        }
    } catch (err) {
        console.error("Erreur lors de l'ajout du logement :", err);
        alert("Impossible d'ajouter le logement.");
    }
});

// Supprimer un logement
async function supprimerLogement(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8080/logements/${id}`, { method: "DELETE" });

        if (response.ok) {
            alert("Logement supprimé avec succès !");
            chargerLogements();
        } else {
            const error = await response.json();
            alert(`Erreur : ${error.detail}`);
        }
    } catch (err) {
        console.error("Erreur lors de la suppression du logement :", err);
        alert("Impossible de supprimer le logement.");
    }
}
// Modifier un logement
document.getElementById("edit-logement-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("logement-id-edit").value;
    const adresse = document.getElementById("adresse-logement-edit").value;
    const numero_telephone = document.getElementById("telephone-logement-edit").value;
    const adresse_ip = document.getElementById("ip-logement-edit").value;

    // Création de l'objet payload pour envoyer les données modifiées
    const payload = {};
    if (adresse) payload.adresse = adresse;
    if (numero_telephone) payload.numero_telephone = numero_telephone;
    if (adresse_ip) payload.adresse_ip = adresse_ip;

    try {
        const response = await fetch(`http://127.0.0.1:8080/logements/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            alert("Logement modifié avec succès !");
            chargerLogements(); // Recharge la liste des logements après modification
            e.target.reset();
        } else {
            const error = await response.json();
            alert(`Erreur : ${error.detail}`);
        }
    } catch (err) {
        console.error("Erreur lors de la modification du logement :", err);
        alert("Impossible de modifier le logement.");
    }
});

function remplirFormulaire(id) {
    // Trouver la ligne du tableau correspondante
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;

    // Pré-remplir les champs du formulaire
    document.getElementById("logement-id-edit").value = id;
    document.getElementById("adresse-logement-edit").value = row.children[1].textContent.trim();
    document.getElementById("telephone-logement-edit").value = row.children[2].textContent.trim();
    document.getElementById("ip-logement-edit").value = row.children[3].textContent.trim();

    // Activer l'onglet "Modifier"
    document.querySelector(".submenu-link[data-section='modifier-logement']").click();
}



// Gestion des onglets
document.querySelectorAll(".submenu-link").forEach((tab) => {
    tab.addEventListener("click", (e) => {
        e.preventDefault();

        // Désactiver tous les onglets
        document.querySelectorAll(".submenu-link").forEach((link) => link.classList.remove("active"));
        tab.classList.add("active");

        // Cacher toutes les sections
        document.querySelectorAll(".config-section").forEach((section) => section.classList.remove("active"));

        // Afficher la section correspondante
        const targetSection = tab.getAttribute("data-section");
        document.getElementById(targetSection).classList.add("active");
    });
});

// Charger les logements au démarrage
document.addEventListener("DOMContentLoaded", chargerLogements);
