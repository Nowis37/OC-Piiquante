const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

// Auth à mettre avant le gestionnaire de route et avant le multer pour qu'il fasse les vérification avant de passer à la suite
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Méthode de modification d'un produit
router.delete('/:id', auth, sauceCtrl.deleteSauce) // Méthode de suppression d'un produit
router.get('/:id', auth, sauceCtrl.getOneSauce); // Afficher la page du produit cliqué 
router.get('/', auth, sauceCtrl.getAllSauce); // Afficher tout les produits

router.post('/:id/like', auth, sauceCtrl.likeSauce); // Afficher tout les produits

module.exports = router;