const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // npm install --save mongoose-unique-validator

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true}, // required:true = obligatoire & unique:true = une seule adresse mail registered
    password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator); 

module.exports = mongoose.model('User', userSchema);