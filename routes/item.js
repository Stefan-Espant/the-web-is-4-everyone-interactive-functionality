import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

const server = express.Router();

// Opbouw URL van de API
const urlBase = "https://zoeken.oba.nl/api/v1/search/";
const urlKey = `${process.env.KEY}`;
const urlOutput = "&refine=true&output=json";

// Maakt een route voor de detailpagina
server.get("/item", async (request, response) => {
	let id = request.query.id || "|oba-catalogus|279240";

	let uniqueQuery = "?id=";
	const uniqueUrl =
		urlBase + uniqueQuery + id + urlKey + urlOutput;

	const data = await fetch(uniqueUrl)
		.then((response) => response.json())
		.catch((err) => err);
	response.render("item", data);
});

export default server