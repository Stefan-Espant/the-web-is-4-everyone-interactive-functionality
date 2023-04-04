import * as dotenv from 'dotenv'

import express from 'express'
import { fetchJson } from '../helpers/fetchWrapper.js'

dotenv.config()

const index = express.Router()

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

// Maakt een route voor de index
index.get("/", (request, response) => {
	fetchJson(defaultUrl).then((data) => {
		response.render("index", data);
	});
});

export default index