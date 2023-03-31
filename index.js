// Importeert belangrijke onderdelen
import express, {
	request
} from "express";
import dotenv from "dotenv";
import fs from 'fs';

// Importeert bestanden via routes
// import indexRoute from './routes/index.js'
// import objectRoute from './routes/object.js'

// Maakt een nieuwe express app
const server = express();

// Stelt het poortnummer in waar express op gaat luisteren
server.set("port", process.env.PORT || 8000);

// Activeert het .env bestand
dotenv.config();

// Stel afhandeling van formulieren in
server.use(express.json())
server.use(express.urlencoded({
	extended: true
}))

// Opbouw Boeken URL van de API
const urlBase = "https://zoeken.oba.nl/api/v1/search/";
const urlQuery = "?q=";
const urlDefault = "boek";
const urlKey = `${process.env.KEY}`;
const urlOutput = "&refine=true&output=json";
const defaultUrl =
	urlBase + urlQuery + urlDefault + urlKey + urlOutput;

// Stel in hoe express gebruikt kan worden
server.set("view engine", "ejs");
server.set("views", "./views");
server.use(express.static("public"));

// Maakt een route voor de overzichtspagina
server.get("/", (request, response) => {

	fetchJson(defaultUrl).then((data) => {
		response.render("index", data);
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
});



// Maakt een route voor de reserveringspagina
server.get("/reserveren", (request, response) => {
	const baseurl = "https://api.oba.fdnd.nl/api/v1";
	const url = `${baseurl}/reserveringen`;

	const reservation = request.query.reservations;

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
			...request.body
		};

		if (data.success) {
			response.redirect("/?reserveringenPosted=true");
		} else {
			const errormessage = `${data.message}: Mogelijk komt dit door het id die al bestaat.`;
			const newdata = {
				error: errormessage,
				values: newReservation,
			};

			response.render("reserveren", newdata);
		}

		console.log(JSON.stringify(data.errors))
	});

});

// Maakt een route voor de profielpagina
server.get("/profile"), (request, response) => {
		response.render("profile");
};

// Maakt een route voor de plekreservering 
server.get("/reserveer-een-plek",(request, response) => {
		response.render("reserveer-een-plek");
});

server.post("/reserveer-een-plek",(request, response) => {
	response.render("reserveer-een-plek");
});



// Definieer gebruikersdata als een array in een JSON-bestand
let usersData = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

server.get('/login', (req, response) => {
	response.render('login');
});

server.post('/login', (request, response) => {
	const {
		email,
		password
	} = request.body;

	const user = usersData.find((u) => u.email === email);

	if (!user || user.password !== password) {
		return response.status(401).send('Onjuiste inloggegevens');
	}

	response.redirect('/');
});

server.get('/logout', (req, response) => {
	response.redirect('/login');
});

// Stelt afhandeling van formulieren in
server.use(express.json());
server.use(express.urlencoded({
	extended: true
}));

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

export async function postJson(url, body) {
	return await fetch(url, {
			method: "post",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json"
			},
		})
		.then((response) => response.json())
		.catch((error) => error);
}