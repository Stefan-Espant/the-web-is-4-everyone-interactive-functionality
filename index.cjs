// Importeert belangrijke onderdelen
import express, { request } from "express";
import dotenv from "dotenv";


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
server.use(express.urlencoded({ extended: true }))

// Opbouw Boeken URL van de API
const urlBase = "https://zoeken.oba.nl/api/v1/search/";
const urlQuery = "?q=";
const urlDefault = "special:all";
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

    fetchJson(defaultUrl).then((data) => {
		response.render("reserveren", data);
	});
});

// Verstuurt de data naar de API
server.post("/reserveren", (request, response) => {
    const baseurl = "https://api.oba.fdnd.nl/api/v1";
    const url = `${baseurl}/reserveringen`;

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

            response.render("reserveren", newdata);
        }

        console.log(JSON.stringify(data.errors))
    });

});

// Maakt een route voor de profielpagina
server.get("/profile"),
	async (request, response) => {
		fetchJson(defaultUrl).then((data) => {
			response.render("profile", data);
		});
	};

    server.get('/login', (req, res) => {
        res.render('login');
      });
      
      server.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
      
        if (userData[username] && userData[username].password === password) {
          res.send(`Welcome ${username}`);
        } else {
          res.send('Invalid username or password');
        }
      });    

      const bcrypt = require('bcrypt');
      const jwt = require('jsonwebtoken');
      const fs = require('fs');
      
      const app = express();
      
      app.set('view engine', 'ejs');
      app.use(express.urlencoded({ extended: true }));
      
      const secretKey = 'my_secret_key'; // Verander deze sleutel naar een unieke waarde
      
      // Definieer gebruikersdata als een array in een JSON-bestand
      let usersData = JSON.parse(fs.readFileSync('users.json'));
      
      // Definieer een middleware-functie om te controleren of de gebruiker is ingelogd
      const auth = (req, res, next) => {
        try {
          const token = req.cookies.token || '';
          const decoded = jwt.verify(token, secretKey);
          req.user = decoded;
          next();
        } catch (error) {
          res.redirect('/login');
        }
      };
      
      // Definieer de routes voor de applicatie
      app.get('/', auth, (req, res) => {
        res.render('index', { user: req.user });
      });
      
      app.get('/login', (req, res) => {
        res.render('login');
      });
      
      app.post('/login', (req, res) => {
        const { email, password } = req.body;
      
        const user = usersData.find((u) => u.email === email);
      
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return res.status(401).send('Onjuiste inloggegevens');
        }
      
        const token = jwt.sign({ email: user.email }, secretKey);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
      });
      
      app.get('/logout', (req, res) => {
        res.clearCookie('token');
        res.redirect('/login');
      });
    
      
  
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
