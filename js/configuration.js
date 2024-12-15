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
        } else {
            alert("Erreur lors de l'ajout du capteur/actionneur.");
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du capteur/actionneur :", error);
        alert("Impossible de soumettre le formulaire.");
    }
});
