const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // package qui valide l'unicité de l'email

const userSchema = mongoose.Schema({ // structure du modèle user demandé
    email: { type: String, required: true, unique: true }, // unique -> une adresse mail = un user
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // utilisation du package
module.exports = mongoose.model('User', userSchema);