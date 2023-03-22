// Importeert belangrijke onderdelen
import express from "express";
import dotenv from 'dotenv';

// Maakt een nieuwe express app
const server = express();

// Stelt het poortnummer in waar express op gaat luisteren
server.set("port", process.env.PORT || 8000);

// Activeert het .env bestand
dotenv.config();

// Opbouw URL van de API
const urlBase = "https://zoeken.oba.nl/api/v1/search/";
const urlQuery = "?q=";
const urlDefault = "branche";
const urlKey = `${process.env.KEY}`;
const urlOutput = "&refine=true&output=json";
const defaultUrl = urlBase + urlQuery + urlDefault + urlKey + urlOutput;

// Stel in hoe express gebruikt kan worden
server.set("view engine", "ejs");
server.set("views", "./views");
server.use(express.static("public"));

// Haalt de pagina's op
// Maakt een route voor de overzichtspagina
server.get("/", (request, response) => {

    fetchJson(defaultUrl).then((data) => {
        response.render("index", data);
        console.log(data);
    });
});

// Maakt een route voor de detailpagina
server.get("/book", async (request, response) => {
    let isbn = request.query.resultIsbn || "9789045117621";
  
      const uniqueUrl =
      urlBase + urlQuery + isbn + urlKey + urlOutput;
  
      const data = await fetch(uniqueUrl)
          .then((response) => response.json())
          .catch((err) => err);
      response.render("book", data);
  
    console.log(uniqueUrl)
  });

  server.get("/profile", (request, response) => {

    fetchJson(defaultUrl).then((data) => {
        response.render("profile", data);
        console.log(data);
    });
});
  
// Stelt afhandeling van formulieren in
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

// Start express op, haal het ingestelde poortnummer op
server.listen(server.get("port"), function () {
    // Toon een bericht in de console en geef het poortnummer door
    console.log(
        `Application started on http://localhost:${server.get(
            "port"
        )}`
    );
});

async function fetchJson(url, payload = {}) {
    return await fetch(url, payload)
        .then((response) => response.json())
        .catch((error) => error);
}
