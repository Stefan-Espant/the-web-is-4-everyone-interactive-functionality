<img width="1440" alt="Schermafbeelding 2023-03-30 om 09 38 19" src="https://user-images.githubusercontent.com/89298385/228764344-3b8fb2b2-05e7-4af6-aef9-542d1fcac9b1.png">

# oba · the web is 4 everyone
<!-- Geef je project een titel en schrijf in één zin wat het is -->
Een dynamische website waarmee iedereen bij de oba een boek kan reserveren.

## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Gebruik](#gebruik)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving
<!-- Bij Beschrijving staat kort beschreven wat voor project het is en wat je hebt gemaakt -->
<!-- Voeg een mooie poster visual toe 📸 -->
<!-- Voeg een link toe naar Github Pages 🌐-->
Voor deze repo heb ik een functionaliteit gebouwd waarmee iedereen bij de oba een boek kan reserveren. Dit is mogelijk gemaakt met een formulier die data post op een API. De data die daarnaar word verstuurd zijn een id, een voornaam van degene die hem reserveerd en een datum vanaf wanneer het boek kan owrden opgehaald of vanaf wanneer het boek kan worden gereserveerd.

## Gebruik
<!-- Bij Gebruik staat de user story, hoe het werkt en wat je er mee kan. -->
Uit de backlog heb ik de volgende userstory uitgekozen.
> Als gebruiker wil ik een boek zoeken en kunnen reserveren, zodat ik het later op kan halen.

Ik heb hiervoor een reserveringspagina met een formulier opgebouwd die 

## Kenmerken
<!-- Bij Kenmerken staat welke technieken zijn gebruikt en hoe. Wat is de HTML structuur? Wat zijn de belangrijkste dingen in CSS? Wat is er met JS gedaan en hoe? Misschien heb je iets met NodeJS gedaan, of heb je een framwork of library gebruikt? -->
Om de toegankelijkheid voor iedereen optimaal te houden, heb ik voor dit project de methode progressive enhancement toegepast.

### html
Eerst bouwde ik de content op met `html`, geïntegreerd in `ejs`. Hieronder een voorbeeld van het formulier die een post methode uitvoerd:
```ejs
<form
 class="reservation"
 action="/reserveren"
 method="post"
 autocomplete="on"
> 
</form>
```

### css
Voor css heb ik diverse stijlen gebruikt om het formulier te stijlen in de huisstijl van de oba. 
```css
.searchbar input:valid, input:read-only  {
  border: var(--u-micro) solid var(--c-accent-50);
}
```

### javascript
Voor het formulier heb ik geen javascript gebruikt om het zo toegankelijk te houden. Wel heb ik het gebruikt voor een zoekbalk op de homepage. 
```js
// Regelt de functionaliteit van de zoekbalk
const searchBar = document.querySelector("#site-search");

// Registreert de impuls en selecteert de artikelen
searchBar.addEventListener("keyup", search);
itemResults = document.querySelectorAll(".items > article");

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
```

## Installatie
<!-- Bij Instalatie staat hoe een andere developer aan jouw repo kan werken -->
Voor dit project heb ik gebruik gemaakt van node en express. Hiervoor heb ik met de terminal in Visual Studio Code een aantal commando's voor gebruikt voor het initialiseren `npm init`, installeren `npm install` en testen `npm start`. In de map node_modules heb ik nodemon geactiveerd om bij iedere aanpassing die ik op heb geslagen de server te laten verversen. Hiervoor gebruikte ik het commando `npm install nodemon`.

## Bronnen
[docs/INSTRUCTIONS.md](docs/INSTRUCTIONS.md)

[CSS-tricks](https://css-tricks.com/a-complete-guide-to-css-media-queries/)

[MDN · form validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
