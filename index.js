// Importeert basis modules uit npm
import express from "express";
import dotenv from "dotenv";
import fs from "fs";

// Importeert bestanden via routes
import indexRoute from './routes/index.js';
import categoryRoute from './routes/categorie.js';
import itemRoute from './routes/item.js';
import reservationRoute from './routes/reservering.js';

// Maakt een nieuwe express app
const server = express();

// Stelt het poortnummer in waar express op gaat luisteren
server.set("port", process.env.PORT || 8000);

// Activeert het .env bestand
dotenv.config();

// Stel afhandeling van formulieren in
server.use(express.json());
server.use(
	express.urlencoded({
		extended: true,
	})
);

// Stel de public map in
server.use(express.static('public'))

// Stelt de routes in
server.use('/', indexRoute)
server.get('/categorieen', categoryRoute)
server.get('/item', itemRoute)
server.get('/reserveren', reservationRoute)

// Extenties voor de URL
const space = "%20";
const bookItems = "boeken";

// Opbouw URL van de API
const urlBase = "https://zoeken.oba.nl/api/v1/search/";
const urlQuery = "?q=";
const urlDefault = "special:all";
const urlKey = `${process.env.KEY}`;
const urlOutput = "&refine=true&output=json";
const defaultUrl =
	urlBase + urlQuery + urlDefault + space + bookItems + urlKey + urlOutput;

// Stel in hoe express gebruikt kan worden
server.set("view engine", "ejs");
server.set("views", "./views");

// Maakt een route voor de profielpagina
server.get("/profile"),
	(request, response) => {
		response.render("profile");
	};

// Maakt een route voor de plekreservering
server.get("/reserveer-een-plek", (request, response) => {
	response.render("reserveer-een-plek");
});

// Regelt de afhandeling van de reservering
server.post("/reserveer-een-plek", (request, response) => {
	response.render("reserveer-een-plek");
});

// Definieer gebruikersdata als een array in een JSON-bestand
let usersData = JSON.parse(
	fs.readFileSync("./users.json", "utf8")
);

server.get("/login", (req, response) => {
	response.render("login");
});

server.post("/login", (request, response) => {
	const { email, password } = request.body;

	const user = usersData.find((u) => u.email === email);

	if (!user || user.password !== password) {
		return response
			.status(401)
			.send("Onjuiste inloggegevens");
	}

	response.redirect("/");
});

server.get("/logout", (request, response) => {
	response.redirect("/login");
});

// Stelt afhandeling van formulieren in
server.use(express.json());
server.use(
	express.urlencoded({
		extended: true,
	})
);

// Start express op, haal het ingestelde poortnummer op
server.listen(server.get("port"), function () {
	// Toon een bericht in de console en geef het poortnummer door
	console.log(
		`Application started on http://localhost:${server.get(
			"port"
		)}`
	);
});

/**
 * fetchJson() is a wrapper for the experimental node fetch api. It fetches the url
 * passed as a parameter and returns the response body parsed through json.
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
 export async function fetchJson(url, payload = {}) {
	return await fetch(url, payload)
		.then((response) => response.json())
		.catch((error) => error);
}

export async function postJson(url, body) {
	return await fetch(url, {
		method: "post",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.catch((error) => error);
}