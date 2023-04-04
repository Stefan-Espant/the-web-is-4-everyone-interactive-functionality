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