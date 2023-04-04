// Importeert basis modules uit npm
import express from "express";
import dotenv from "dotenv";
import fs from "fs";

// Importeert bestanden via routes
import indexRoute from './routes/index.js'
import categoryRoute from './routes/categorie.js'
import itemRoute from './routes/item.js'

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
server.use('categorieen', categoryRoute)
server.use('/item', itemRoute)

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
server.use(express.static("public"));

// Maakt een route voor de reserveringspagina
server.get("/reserveren", (request, response) => {
	const baseurl = "https://api.oba.fdnd.nl/api/v1";
	const url = `${baseurl}/reserveringen`;

	fetchJson(url).then((data) => {
		response.render("reserveren", data);
	});
});

// Verstuurt de data naar de API
server.post("/reserveren", (request, response) => {
	const baseurl = "https://api.oba.fdnd.nl/api/v1";
	const url = `${baseurl}/reserveringen`;

	postJson(url, request.body).then((data) => {
		let newReservation = {
			...request.body,
		};

		if (data.success) {
			response.redirect("/");
		} else {
			const errormessage = `${data.message}: Mogelijk komt dit door het id die al bestaat.`;
			const newdata = {
				error: errormessage,
				values: newReservation,
			};

			response.render("reserveren", newdata);
		}

		console.log(JSON.stringify(data.errors));

	});
});

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
