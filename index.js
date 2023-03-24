// Importeert belangrijke onderdelen
import express, { request } from "express";
import dotenv from "dotenv";

// Maakt een nieuwe express app
const server = express();

// Stelt het poortnummer in waar express op gaat luisteren
server.set("port", process.env.PORT || 8000);

// Activeert het .env bestand
dotenv.config();

// Opbouw Boeken URL van de API
const urlBase = "https://zoeken.oba.nl/api/v1/search/";
const urlQuery = "?q=";
const urlDefault = "boek";
const urlKey = `${process.env.KEY}`;
const urlOutput = "&refine=true&output=json";
const defaultUrl =
	urlBase + urlQuery + urlDefault + urlKey + urlOutput;

// Reserveren
const urlReservation =
	"https://api.oba.fdnd.nl/api/v1/reserveringen";

// Stel in hoe express gebruikt kan worden
server.set("view engine", "ejs");
server.set("views", "./views");
server.use(express.static("public"));

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

	console.log(uniqueUrl);
});

// Maakt een route voor de reserveringspagina
server.get("/reserveer-een-plek", (request, response) => {
    const baseurl = "https://api.oba.fdnd.nl/api/v1";

    const url = `${baseurl}/reserveringen`;

	const reservation = request.query.reservations;

	fetchJson(url).then((data) => {
		response.render("reserveer-een-plek", data);
	});
});

// Verstuurt de data naar de API
server.post("/reserveer-een-plek", (request, response) => {
    const baseurl = "https://api.oba.fdnd.nl/api/v1";

    const url = `${baseurl}/reserveringen`;

    console.log(request.body)

    postJson(url, request.body).then((data) => {
        let newReservation = { ...request.body };

        if (data.success) {
            response.redirect("/?reserveringenPosted=true");
        } else {
            const errormessage = `${data.message}: Mogelijk komt dit door het id die al bestaat.`;
            const newdata = {
                error: errormessage,
                values: newReservation,
            };

            response.render("reserveer-een-plek", newdata);
        }
        console.log(data)
    });

    console.log(url)
});

server.get("/profile", (request, response) => {
	fetchJson(defaultUrl).then((data) => {
		response.render("profile", data);
		console.log(data);
	});
});

// Maakt een route voor de profielpagina
server.get("/profile"),
	async (request, response) => {
		fetchJson(defaultUrl).then((data) => {
			response.render("profile", data);
			console.log(data);
		});
	};

// Stelt afhandeling van formulieren in
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

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
		headers: { "Content-Type": "application/json" },
	})
		.then((response) => response.json())
		.catch((error) => error);
}
