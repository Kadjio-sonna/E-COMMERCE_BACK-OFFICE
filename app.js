const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger/swagger.json');

// Import Utilisateur
const authRoutes = require("./routes/user/auth")
const userRoutes = require("./routes/user/user")

// Import Administrateur
const adminRoutes = require("./routes/admin/admin")

const app = express();
dotenv.config(); // Permet de charger les variables environnement venant du fichier .env

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Set template engine EJS
app.set('view engine', 'ejs');

// appel des routes de l'utilisateur
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);

// appel des routes de l'administrateur
app.use("/", adminRoutes);

app.use((req, res, next) => {
    res.send("Backend server on port running");
});

module.exports = app;
