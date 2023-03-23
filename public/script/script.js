// Regelt de functionaliteit van de zoekbalk
const searchBar = document.querySelector("#site-search");

// Registreert de impuls en selecteert de artikelen
searchBar.addEventListener("keyup", search);
itemResults = document.querySelectorAll(".items > article");

// 
function search() {
	const searchValue = this.value.toLowerCase();

	if (this.value === "") {
		itemResults.forEach((itemResult) => {
			itemResult.hidden = false;
		});
	} else {
		itemResults.forEach((itemResult) => {
			itemResult.hidden = !itemResult.textContent
				.toLowerCase()
				.includes(searchValue);
		});
	}
}
