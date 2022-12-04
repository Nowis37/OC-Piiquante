const multer = require('multer');

const MIME_TYPES = { // Dictionnaire des extentions
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_') // remplacer les espaces par des underscores
        const extension = MIME_TYPES[file.mimetype] // Application de l'extention
        callback(null, name + Date.now() + '.' + extension); // Génération du nom du fichier image (date.now() = timespan)
    }
});

module.exports = multer({ storage }).single('image') // Exportation du middleware terminé (single = fichier unique)
