
let consommationChart;

// Fonction pour afficher le graphique
function afficherGraphique(labels, data) {
    const ctx = document.getElementById("consommation-chart").getContext("2d");

    // Si un graphique existe déjà, détruisez-le pour éviter l'erreur
    if (consommationChart) {
        consommationChart.destroy();
    }

    consommationChart = new Chart(ctx, {
        type: "bar", // Type de graphique : barres verticales
        data: {
            labels: labels,
            datasets: [{
                label: "Total Consommé (unités)",
                data: data,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(199, 199, 199, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true, // Activer la légende
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.raw} unités`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        autoSkip: true,
                        maxRotation: 45,
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Fonction pour charger les données de consommation
async function chargerConsommation() {
    try {
        const periode = document.getElementById("periode-select").value;        const apiUrl = `http://127.0.0.1:8080/consommation?echelle=${periode}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
        }

        const consommationData = await response.json();

        // Remplir le tableau
        const tableBody = document.getElementById("consommation-table");
        tableBody.innerHTML = "";
        consommationData.forEach(item => {
            const row = `
                <tr>
                    <td>${item.periode || "N/A"}</td>
                    <td>${item.type_facture}</td>
                    <td>${item.total_consomme.toFixed(2)}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // Préparer les données pour le graphique
        const labels = consommationData.map(item => `${item.type_facture} (${item.periode})`);
        const data = consommationData.map(item => item.total_consomme);

        // Afficher le graphique
        afficherGraphique(labels, data);

    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        alert("Impossible de charger les données de consommation. Veuillez réessayer plus tard.");
    }
}

// Charger les données au chargement de la page et lors du changement de période
document.addEventListener("DOMContentLoaded", chargerConsommation);
document.getElementById("periode-select").addEventListener("change", chargerConsommation);