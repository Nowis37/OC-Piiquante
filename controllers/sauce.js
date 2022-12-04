const Sauce = require('../models/Sauce');
const fs = require('fs'); // fs = "file system" donne accès aux fc qui permettent de modifier le sys de fichier
const sanitize = require('mongo-sanitize');

exports.createSauce = (req, res, next) => { // Uniquement requête POST
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    // delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // likes: 0,
        // dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
    .then(() => res.status(201).json( {message : 'Sauce ajoutée avec succès !'} )) // valide la création
    .catch(error => res.status(400).json({ error })); // renvoie l'erreur
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? { // Vérifier s'il y'a un champ file 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; // Sinon on récupére l'objet dans le corps de la requête

    delete sauceObject._userId;
    Sauce.findOne({ _id: sanitize(req.params.id) })
        .then((sauce) => {
            if(sauce.userId != req.auth.userId){ // Si quelqu'un essaye de modifier un objet qui ne lui appartient pas
                res.status(400).json({ message : 'Non-autorisé '});
            }else{
                  Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
                  .then(() => res.status(200).json({ message : 'Sauce modifiée avec succès' }))
                  .catch(error => res.status(401).json({ error }))
            }
        })
        .catch(error => res.status(400).json({ error }));
};

// Contrôleur de la fonction like des sauces
exports.likeSauce = function (req, res, next) {
    Sauce.findOne({ _id: sanitize(req.params.id) })
      .then(function (likedSauce) {
        switch (req.body.like) {
          // Like = 1 => L'utilisateur aime la sauce (like = +1)
          case 1: //=== if (!likedSauce.usersLiked.includes(req.body.userId) && req.body.like === 1)
              Sauce.updateOne({ _id: req.params.id },
                {
                  $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }
                })
                .then(() => res.status(201).json({ message: "Vous aimez cette sauce !" }) )
                .catch(error => res.status(400).json({ error: error }) );
            // }
            break;
          // L'utilisateur n'aime pas la sauce 
          case -1: //=== if (!likedSauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
              Sauce.updateOne({ _id: req.params.id }, 
                { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, }
              )
                .then(() => res.status(201).json({ message: "Vous n'aimez pas cette sauce !" }))
                .catch(error => res.status(400).json({ error: error }));
            // }
            break;
          // Annulation du like par l'utilisateur
          case 0:
            if (likedSauce.usersLiked.includes(req.body.userId)) {
              Sauce.updateOne({ _id: req.params.id },
                { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, }
              )
                .then(() => res.status(201).json({ message: "Votre like a été retiré !" }))
                .catch(error => res.status(400).json({ error: error }));
            }
            // Annulation du dislike 
            if (likedSauce.usersDisliked.includes(req.body.userId)) {
              Sauce.updateOne(
                { _id: req.params.id },
                { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, }
              )
                .then(() => res.status(201).json({ message: "Votre dislike a été retiré !" }))
                .catch(error => res.status(400).json({ error: error }));
            }
            break;
        }
      })
      .catch(error => res.status(404).json({ error: error }));
  };

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: sanitize(req.params.id) }) // Vérifier les droits (si c'est le bon utilisateur)
    .then(sauce => {
        if(sauce.userId != req.auth.userId){
            res.status(401).json({ message: 'Non-autorisé' })
        } else{ // Utilisateur validé
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({ message: 'Sauce supprimée avec succès !' })})
                .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: sanitize(req.params.id) })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => { // Uniquement les requêtes GET
    Sauce.find()
      .then(sauces => res.status(200).json(sauces)) // renvoie le tableau
      .catch(error => res.status(400).json({ error }));
};