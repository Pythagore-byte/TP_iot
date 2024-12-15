// google.charts.load('current', { packages: ['corechart'] });
// google.charts.setOnLoadCallback(drawChart);

// async function drawChart() {
//     try {
//         // Appel de l'API FastAPI pour récupérer les données de consommation
//         const response = await fetch("http://127.0.0.1:8000/consommation");
//         if (!response.ok) {
//             throw new Error("Erreur lors du chargement des consommations");
//         }

//         const data = await response.json();

//         // Préparer les données pour Google Charts
//         const chartData = [["Type", "Consommation"]];
//         data.forEach((item) => chartData.push([item.type, item.total]));

//         // Créer le graphique
//         const googleData = google.visualization.arrayToDataTable(chartData);
//         const options = {
//             title: "Consommation énergétique",
//             is3D: true
//         };
//         const chart = new google.visualization.PieChart(document.getElementById("chart_div"));
//         chart.draw(googleData, options);
//     } catch (error) {
//         console.error("Erreur lors du chargement des consommations :", error);
//         alert("Impossible de charger les données de consommation.");
//     }
// }
// async function chargerConsommation() {
//     try {
//         // URL de l'endpoint API pour les données de consommation
//         const apiUrl = "http://127.0.0.1:8000/consommation";
//         const response = await fetch(apiUrl);

//         // Vérification de la réponse
//         if (!response.ok) {
//             throw new Error("Erreur lors du chargement des données de consommation");
//         }

//         const data = await response.json();

//         // Sélection du tableau dans le DOM
//         const tableBody = document.getElementById("consommation-table");

//         // Vider le tableau pour éviter les doublons
//         tableBody.innerHTML = "";

//         // Insérer les données dans le tableau
//         data.forEach((item) => {
//             const row = `
//                 <tr>
//                     <td>${item.type_facture}</td>
//                     <td>${item.total_consomme || "N/A"}</td>
//                 </tr>
//             `;
//             tableBody.innerHTML += row;
//         });
//     } catch (error) {
//         console.error("Erreur :", error);
//         alert("Impossible de charger les données de consommation.");
//     }
// }

// // Charger les données à l'ouverture de la page
// document.addEventListener("DOMContentLoaded", chargerConsommation);
async function chargerConsommation() {
    try {
        // URL de l'endpoint API pour les données de consommation
        const apiUrl = "http://127.0.0.1:8000/consommation";
        const response = await fetch(apiUrl);

        // Vérification de la réponse
        if (!response.ok) {
            throw new Error("Erreur lors du chargement des données de consommation");
        }

        const data = await response.json();

        // Sélection du tableau dans le DOM
        const tableBody = document.getElementById("consommation-table");

        // Vider le tableau pour éviter les doublons
        tableBody.innerHTML = "";

        // Insérer les données dans le tableau
        data.forEach((item) => {
            const row = `
                <tr>
                    <td>${item.type_facture}</td>
                    <td>${item.total_consomme || "N/A"}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Erreur :", error);
        alert("Impossible de charger les données de consommation.");
    }
}

// Charger les données à l'ouverture de la page
document.addEventListener("DOMContentLoaded", chargerConsommation);
