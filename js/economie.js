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
// async function chargerEconomies() {
//     try {
//         const timeScale = document.getElementById("time-scale").value; // Échelle de temps sélectionnée
//         const apiUrl = `http://127.0.0.1:8000/economie?scale=${timeScale}`;
//         console.log("URL API appelée :", apiUrl);

//         const response = await fetch(apiUrl);

//         if (!response.ok) {
//             throw new Error("Erreur lors du chargement des données.");
//         }

//         const data = await response.json();
//         console.log("Données reçues de l'API :", data);

//         if (data.length === 0) {
//             alert("Aucune donnée disponible pour cette échelle.");
//             return;
//         }

//         // Mettre à jour le tableau et le graphique
//         const tableBody = document.getElementById("economie-table");
//         tableBody.innerHTML = "";

//         const labels = [];
//         const values = [];

//         data.forEach((item) => {
//             labels.push(item.periode);
//             values.push(item.economie);

//             const row = `
//                 <tr>
//                     <td>${item.periode}</td>
//                     <td>${item.economie.toFixed(2)} €</td>
//                 </tr>
//             `;
//             tableBody.innerHTML += row;
//         });

//         genererGraphique(labels, values, timeScale);

//     } catch (error) {
//         console.error("Erreur JS :", error);
//         alert("Impossible de charger les économies.");
//     }
// }

// let chart; // Variable pour stocker le graphique

// async function chargerEconomies() {
//     try {
//         const timeScale = document.getElementById("time-scale").value;
//         const apiUrl = `http://127.0.0.1:8000/economie?scale=${timeScale}`;
//         console.log("URL API :", apiUrl);

//         const response = await fetch(apiUrl);
//         if (!response.ok) {
//             throw new Error("Erreur lors du chargement des données.");
//         }

//         const data = await response.json();
//         console.log("Données reçues :", data);

//         if (data.length === 0) {
//             alert("Aucune donnée disponible pour cette échelle.");
//             return;
//         }

//         // Mettre à jour le tableau
//         const tableBody = document.getElementById("economie-table");
//         tableBody.innerHTML = "";

//         const labels = [];
//         const values = [];

//         data.forEach((item) => {
//             labels.push(item.periode);
//             values.push(item.economie);

//             const row = `
//                 <tr>
//                     <td>${item.periode}</td>
//                     <td>${item.economie.toFixed(2)} €</td>
//                 </tr>
//             `;
//             tableBody.innerHTML += row;
//         });

//         // Générer ou mettre à jour le graphique
//         genererGraphique(labels, values, timeScale);

//     } catch (error) {
//         console.error("Erreur JS :", error);
//         alert("Impossible de charger les données.");
//     }
// }

// function genererGraphique(labels, values, scale) {
//     const ctx = document.getElementById("economie-chart").getContext("2d");

//     const chartTitle =
//         scale === "monthly" ? "Économies Mensuelles (€)" : "Économies Annuelles (€)";

//     // Supprimer l'ancien graphique s'il existe
//     if (chart) {
//         chart.destroy();
//     }

//     chart = new Chart(ctx, {
//         type: "bar",
//         data: {
//             labels: labels,
//             datasets: [
//                 {
//                     label: chartTitle,
//                     data: values,
//                     backgroundColor: "#36A2EB",
//                     borderColor: "#36A2EB",
//                     borderWidth: 1,
//                 },
//             ],
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: { display: false },
//             },
//             scales: {
//                 y: { beginAtZero: true },
//             },
//         },
//     });
// }

// // Charger les données à l'ouverture de la page et au changement d'échelle
// document.addEventListener("DOMContentLoaded", chargerEconomies);
// document.getElementById("time-scale").addEventListener("change", chargerEconomies);
// async function chargerEconomies() {
//     try {
//         const timeScale = document.getElementById("time-scale").value;
//         const apiUrl = `http://127.0.0.1:8000/economie?scale=${timeScale}`;

//         const response = await fetch(apiUrl);
//         if (!response.ok) throw new Error(`Erreur API : ${response.statusText}`);

//         const data = await response.json();
//         if (data.length === 0) {
//             alert("Aucune donnée disponible pour cette échelle.");
//             return;
//         }

//         const tableBody = document.getElementById("economie-table");
//         tableBody.innerHTML = "";

//         const labels = [];
//         const values = [];

//         data.forEach((item) => {
//             labels.push(item.periode);
//             values.push(item.economie);

//             tableBody.innerHTML += `
//                 <tr>
//                     <td>${item.periode}</td>
//                     <td style="color: ${item.economie >= 0 ? 'green' : 'red'};">
//                         ${item.economie.toFixed(2)} €
//                     </td>
//                 </tr>
//             `;
//         });

//         genererGraphique(labels, values);
//     } catch (error) {
//         console.error("Erreur :", error);
//     }
// }

// function genererGraphique(labels, values) {
//     const ctx = document.getElementById("economie-chart").getContext("2d");

//     if (window.economieChart) window.economieChart.destroy();

//     window.economieChart = new Chart(ctx, {
//         type: "bar",
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: "Économies (€)",
//                 data: values,
//                 backgroundColor: values.map(value => value >= 0 ? "green" : "red"),
//             }],
//         },
//         options: {
//             responsive: true,
//             plugins: { legend: { display: false } },
//             scales: { y: { beginAtZero: true } },
//         },
//     });
// }

// document.addEventListener("DOMContentLoaded", chargerEconomies);
// document.getElementById("time-scale").addEventListener("change", chargerEconomies);
async function chargerEconomies() {
    try {
        const timeScale = document.getElementById("time-scale").value;
        const apiUrl = `http://127.0.0.1:8000/economie?scale=${timeScale}`;
        console.log("URL API appelée :", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erreur API : ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Données reçues de l'API :", data);

        if (data.length === 0) {
            alert("Aucune donnée disponible.");
            return;
        }

        // Mise à jour du tableau
        const tableBody = document.getElementById("economie-table");
        tableBody.innerHTML = ""; // Réinitialiser le tableau

        const labels = [];
        const values = [];

        // Traitement des données
        data.forEach((item) => {
            labels.push(item.periode);
            values.push(item.economie);

            // Créer une ligne du tableau avec des couleurs pour les économies
            const row = `
                <tr>
                    <td>${item.periode}</td>
                    <td style="color: ${item.economie >= 0 ? 'green' : 'red'};">
                        ${item.economie.toFixed(2)} €
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row; // Ajouter la ligne au tableau
        });

        // Mise à jour du graphique
        genererGraphique(labels, values, timeScale);

    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        alert("Impossible de charger les données.");
    }
}

function genererGraphique(labels, values, scale) {
    const ctx = document.getElementById("economie-chart").getContext("2d");

    const chartTitle =
        scale === "monthly" ? "Économies Mensuelles (€)" : "Économies Annuelles (€)";

    // Supprimer l'ancien graphique s'il existe
    if (window.economieChart) {
        window.economieChart.destroy();
    }

    window.economieChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: chartTitle,
                    data: values,
                    backgroundColor: values.map(value => value >= 0 ? "green" : "red"),
                    borderColor: "#000000",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
            },
            scales: {
                y: { beginAtZero: true },
            },
        },
    });
}

// Charger les données à l'ouverture de la page et au changement d'échelle
document.addEventListener("DOMContentLoaded", chargerEconomies);
document.getElementById("time-scale").addEventListener("change", chargerEconomies);
