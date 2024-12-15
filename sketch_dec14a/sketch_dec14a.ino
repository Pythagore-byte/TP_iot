// #include <ESP8266WiFi.h>         // Inclure la bibliothèque pour la gestion du Wi-Fi
// #include <ESP8266HTTPClient.h>   // Inclure la bibliothèque pour les requêtes HTTP
// #include "DHT.h"                 // Inclure la bibliothèque pour le capteur DHT

// const char* ssid = "Sekou";           // Nom du réseau Wi-Fi
// const char* password = "Sekouba199800@"; // Mot de passe du réseau Wi-Fi

// const char* serverName ="http://192.168.0.19:8000/donnees-capteur";                                                                                                                                                                                                                                                                                                                                                                                      /donnees-capteur"; // Point d'entrée du serveur
// #define DHTPIN 13                     // Définir la broche à laquelle le capteur DHT est connecté
// #define DHTTYPE DHT11                // Définir le type de capteur DHT utilisé (DHT11)
// #define led 5                        // Définir la broche à laquelle la LED est connectée
// DHT dht(DHTPIN, DHTTYPE);             // Créer un objet DHT pour lire les données du capteur

// void setup() {
//   Serial.begin(9600);                 // Démarrer la communication série à 9600 bauds
//   WiFi.begin(ssid, password);         // Démarrer la connexion au Wi-Fi
//   dht.begin();                        // Initialiser le capteur DHT

//   // Attendre la connexion au Wi-Fi
//   while (WiFi.status() != WL_CONNECTED) {
//     delay(500);                       // Attendre 500 ms
//     Serial.println("Connexion au WiFi..."); // Afficher que l'on tente de se connecter
//   }
//   Serial.println("Connecté au WiFi"); // Afficher que la connexion Wi-Fi est établie
//   Serial.print("L'adresse IP de l'ESP8266 est : "); // Afficher l'adresse IP de l'ESP8266
//   Serial.println(WiFi.localIP());     // Afficher l'adresse IP locale
// }

// void loop() {
  
//   if (WiFi.status() == WL_CONNECTED) { // Vérifier si le Wi-Fi est connecté
//     WiFiClient client;                  // Créer un client Wi-Fi
//     HTTPClient http;                    // Créer un objet HTTPClient

//     http.begin(client, serverName);     // Démarrer la connexion HTTP
//     http.addHeader("Content-Type", "application/json"); // Spécifier que les données seront envoyées au format JSON
//     delay(1000);                        // Attendre 1 seconde avant de lire les données du capteur
//     float h = dht.readHumidity();       // Lire les données d'humidité
//     float t = dht.readTemperature();    // Lire les données de température

//     // Vérifier si les lectures du capteur ont échoué 
//     if (isnan(h) || isnan(t)) {
//       Serial.println("Failed to read from DHT sensor!"); // Afficher l'échec de la lecture
//       return;                            // Quitter la boucle si la lecture échoue
//     }

//     // Créer les données JSON avec les bonnes valeurs
//     String postData = "{\"temperature\":" + String(t) + ",\"humidité\":" + String(h) + "}"; // Stocker les données du capteur au format JSON dans la variable String
     
//     Serial.println(t);                   // Afficher la température lue
//     Serial.println(h);                   // Afficher l'humidité lue
//     // Envoyer une requête POST
//     int httpResponseCode = http.POST(postData); // Envoyer les données avec le protocole HTTP et la méthode POST
//     Serial.println(httpResponseCode);     // Afficher le code de réponse HTTP

//     if (httpResponseCode > 0) {          // Si le code de réponse est positif
//       String response = http.getString(); // Récupérer la réponse du serveur
//       Serial.println(httpResponseCode);   // Afficher le code de réponse
//       Serial.println(response);            // Afficher la réponse du serveur
//       // Vérifier si la LED doit être allumée ou éteinte
//       if (response.indexOf("\"led_state\":\"on\"") != -1) {
//         digitalWrite(LED_BUILTIN, HIGH); // Allumer la LED
//         Serial.println("LED ALLUMÉE !");
//       } else {
//         digitalWrite(LED_BUILTIN, LOW); // Éteindre la LED
//         Serial.println("LED ÉTEINTE !");
//       }

//     }
//     else
//     {
//       Serial.println("Erreur lors de la requête au serveur !");
//     }

//     http.end();                          // Terminer la connexion HTTP
//   }

//   delay(10000);                          // Attendre 1 seconde avant la prochaine requête 
//   digitalWrite(led, LOW);               // Éteindre la LED après l'envoi
// }




#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include "DHT.h"

const char* ssid = "Sekou"; // Nom du réseau Wi-Fi
const char* password = "Sekouba199800@"; // Mot de passe du réseau Wi-Fi
const char* serverName = "http://192.168.0.19:8000/donnees-capteur"; // Adresse du serveur FastAPI

#define DHTPIN 13           // Broche connectée au capteur DHT
#define DHTTYPE DHT11      // Type de capteur DHT utilisé
#define LED_PIN 2          // Broche connectée à la LED

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  dht.begin();
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW); // Éteindre la LED par défaut

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connexion au WiFi...");
  }
  Serial.println("Connecté au WiFi !");
  Serial.print("Adresse IP : ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    // Récupérer la température et l'humidité depuis le capteur DHT
    float temperature = dht.readTemperature();
    float humidite = dht.readHumidity();

    if (isnan(temperature) || isnan(humidite)) {
      Serial.println("Erreur de lecture du capteur DHT !");
      return;
    }
    Serial.println(temperature);                   // Afficher la température lue
    Serial.println(humidite);                   // Afficher l'humidité lue
    // Créer les données JSON à envoyer au serveur
    String postData = "{\"temperature\":" + String(temperature) + ",\"humidité\":" + String(humidite) + "}";

    // Envoyer les données au serveur
    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(postData);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Réponse du serveur :");
      Serial.println(response);

      // Vérifier si la LED doit être allumée ou éteinte
      if (response.indexOf("\"led_state\":\"on\"") != -1) {
        digitalWrite(LED_BUILTIN, !HIGH); // Allumer la LED
        Serial.println("LED ALLUMÉE !");
      } else {
        digitalWrite(LED_BUILTIN, !LOW); // Éteindre la LED
        Serial.println("LED ÉTEINTE !");
      }

    } else {
      Serial.println("Erreur lors de la requête au serveur !");
    }

    http.end(); // Terminer la connexion HTTP
  }

  delay(10000); // Attendre 10 secondes avant d'envoyer une nouvelle requête
}

