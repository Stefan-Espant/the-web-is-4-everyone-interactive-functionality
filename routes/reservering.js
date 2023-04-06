import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

const reservation = express.Router();

// Maakt een route voor de reserveringspagina
reservation.get("/reserveren", (request, response) => {
	const baseurl = "https://api.oba.fdnd.nl/api/v1";
	const url = `${baseurl}/reserveringen`;

	fetchJson(url).then((data) => {
		response.render("reserveren", data);
	});
});

// Verstuurt de data naar de API
reservation.post("/reserveren", (request, response) => {
	const baseurl = "https://api.oba.fdnd.nl/api/v1";
	const url = `${baseurl}/reserveringen`;

	postJson(url, request.body).then((data) => {
		let newReservation = {
			...request.body,
		};

		console.log(data)

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

export default reservation