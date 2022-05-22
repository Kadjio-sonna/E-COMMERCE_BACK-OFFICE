const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const MongoDBStore = require("connect-mongodb-session")(session);

const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");

// Import route Utilisateur
const authRoutes = require("./routes/user/auth");
const userRoutes = require("./routes/user/user");

// Import route Administrateur
const adminRoutes = require("./routes/admin/admin");
const authAdminRoutes = require("./routes/admin/auth");

const app = express();
dotenv.config(); // Permet de charger les variables environnement venant du fichier .env

const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: "mySessions",
});

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    // saveUninitialized: false,
    saveUninitialized: true,
    // cookie: { secure: true }

    store: store,
})
);

// Pour afficher les message alerts de success et error
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// Set template engine EJS
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));
// app.set("views", path.join(__dirname, "/views"));

// appel des routes de l'utilisateur
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);

// appel des routes de l'administrateur
app.use("/dashboard", adminRoutes);
app.use("/dashboard", authAdminRoutes);

// app.use((req, res, next) => {
//     res.send("Backend server on port running");
// });

// app.get("/", (req, res) => {
//     // console.log(req.session)
//     // console.log(req.session.id)

//     req.session.isAuth = true
//     res.send("Hello session Kadjio");
// })

module.exports = app;
