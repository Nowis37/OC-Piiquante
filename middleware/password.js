// Importation de password-validator
const passwordValidator = require('password-validator') // npm install password-validator

// Création du schéma
const passwordSchema = new passwordValidator()

// Le Schéma que doit respecter le mot de passe
passwordSchema
.is().min(5)                                  
.is().max(25)                                 
.has().uppercase()                             
.has().lowercase()                            
.has().digits(1)                                
.has().not().spaces()                          
.is().not().oneOf(['Passw0rd', 'Password123']);

// Vérification de la qualité du password par rapport au schema

module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){ // Validation du password
        console.log('mdp ok')
        next();
    }else{ 
        // console.log('mdp pas bon')
        // console.log(passwordSchema.validate('req.body.password', { list: true }))
       return res.status(400).json({ error: `Le mot de passe n'est pas assez fort ${passwordSchema.validate('req.body.password', { list: true })}` }) 
    }
}