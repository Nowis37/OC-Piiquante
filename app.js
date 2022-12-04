const express = require('express');
const mongoose = require('mongoose');
const xss = require('xss-clean');
const nocache = require('nocache');
const helmet = require('helmet')
const path = require('path');
const app = express();
const rateLimit = require("express-rate-limit");

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://' + process.env.BDD_USER + ':' + process.env.BDD_PASSWORD + '@' + process.env.BDD_NAME + '.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP"
});

app.use(limiter);
app.use(express.json()); // Intercepte les requêtes JSON 
app.use(nocache());
app.use(xss());
app.listen(8080);

/* Indique au site que l'API peut être accessible par tout le monde (évite le blocage) */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Autorise à toutes les origines " * "
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Autorise certaines méthodes
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Autorise certaines requête
  next();
});

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // crossOriginR... = autorise l'accès à l'affichage des images

app.use('/api/sauces', sauceRoutes); // Routes Sauce
app.use('/api/auth', userRoutes); // Routes utilisateur
app.use('/images', express.static(path.join(__dirname, 'images')));

// Export et exploitation de l'API
module.exports = app;