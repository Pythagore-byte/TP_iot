// async function chargerEconomies() {
//     try {
//         // Appel de l'API FastAPI pour récupérer les données d'économies
//         const response = await fetch("http://127.0.0.1:8000/economie");
//         if (!response.ok) {
//             throw new Error("Erreur lors du chargement des économies");
//         }

//         const economies = await response.json();
//         const tbody = document.getElementById("economie-table");

//         // Réinitialiser le tableau
//         tbody.innerHTML = "";

//         // Insérer chaque ligne dans le tableau
//         economies.forEach((economie) => {
//             const row = `
//                 <tr>
//                     <td>${economie.periode}</td>
//                     <td>${economie.economie} €</td>
//                 </tr>
//             `;
//             tbody.innerHTML += row;
//         });
//     } catch (error) {
//         console.error("Erreur lors du chargement des économies :", error);
//         alert("Impossible de charger les données d'économies.");
//     }
// }

// // Charger les économies lorsque la page est prête
// document.addEventListener("DOMContentLoaded", chargerEconomies);
async function chargerEconomies() {
    try {
        const timeScale = document.getElementById("time-scale").value; // Échelle de temps sélectionnée
        const apiUrl = `http://127.0.0.1:8000/economie?scale=${timeScale}`;
        console.log("URL API appelée :", apiUrl);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Erreur lors du chargement des données.");
        }

        const data = await response.json();
        console.log("Données reçues de l'API :", data);

        if (data.length === 0) {
            alert("Aucune donnée disponible pour cette échelle.");
            return;
        }

        // Mettre à jour le tableau et le graphique
        const tableBody = document.getElementById("economie-table");
        tableBody.innerHTML = "";

        const labels = [];
        const values = [];

        data.forEach((item) => {
            labels.push(item.periode);
            values.push(item.economie);

            const row = `
                <tr>
                    <td>${item.periode}</td>
                    <td>${item.economie.toFixed(2)} €</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        genererGraphique(labels, values, timeScale);

    } catch (error) {
        console.error("Erreur JS :", error);
        alert("Impossible de charger les économies.");
    }
}
