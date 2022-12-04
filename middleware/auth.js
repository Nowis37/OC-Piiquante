/* Import du package de création de token */
const jwt = require('jsonwebtoken');
 
/* Création du middleware d'authentification */
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // On récupére le token 
       const decodedToken = jwt.verify(token, process.env.JWTTOKEN); // Décodage du token
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};