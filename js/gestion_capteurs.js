// Gestion de l'ajout d'un capteur
document.getElementById("form-ajout").addEventListener("submit", async (event) => {
    event.preventDefault();

    const type = document.getElementById("type").value;
    const reference = document.getElementById("reference").value;
    const port = document.getElementById("port").value;
    const id_piece = parseInt(document.getElementById("id_piece").value);
    const id_type_capteur = parseInt(document.getElementById("id_type_capteur").value);

    try {
        const response = await fetch("http://127.0.0.1:8080/capteurs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ type, reference_commerciale: reference, port_communication: port, id_piece, id_type_capteur })
        });

        if (response.ok) {
            alert("Capteur ajouté avec succès !");
            event.target.reset();
        } else {
            const error = await response.json();
            alert("Erreur : " + error.detail);
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        alert("Une erreur s'est produite.");
    }
});

// Gestion de la suppression d'un capteur
document.getElementById("form-suppression").addEventListener("submit", async (event) => {
    event.preventDefault();

    const capteur_id = parseInt(document.getElementById("capteur_id").value);

    try {
        const response = await fetch(`http://127.0.0.1:8080/capteurs/${capteur_id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Capteur supprimé avec succès !");
            event.target.reset();
        } else {
            const error = await response.json();
            alert("Erreur : " + error.detail);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Une erreur s'est produite.");
    }
});
