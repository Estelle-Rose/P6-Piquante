const bcrypt = require('bcrypt'); // chiffrement
const User = require('../models/User'); // modele user
const jwt = require('jsonwebtoken'); // token generator package
const emailValidator = require('email-validator');// email validator package
const passwordValidator = require('password-validator'); // password validator package

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(50)                                  // Maximum length 50
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                // Must have at least 1 digit
.has().not().symbols();                         // Has no symbols
//.has().not().spaces()                           // Should not have spaces is a wrong rule to apply

exports.signup = (req, res, next) => { // inscription du user
if (!emailValidator.validate(req.body.email) || !passwordSchema.validate(req.body.password)) { // si l'email et le mot de passe ne sont pas valides
  return res.status(400).json({ message: 'Check your email address format and your password should be at least 8 characters long, contain uppercase, lowercase letter and digit '});
  
} else if (emailValidator.validate(req.body.email) || passwordSchema.validate(req.body.password)) { // s'ils sont valides

    bcrypt.hash(req.body.password, 10) // bcrypt hashe le mot de passe
    .then(hash => {
        const user = new User ({        // crée un nouveau user
            email: req.body.email,
            password: hash
        });
        user.save()   // et mongoose le stocke dans la bdd
        .then( hash => res.status(201).json({ message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
    };

}




exports.login = (req, res, next) => { // connexion du user
    User.findOne({ email: req.body.email }) // on vérifie que l'adresse mail figure bien dan la bdd
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // on compare les mots de passes
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({ 
              userId: user._id,
              token: jwt.sign( // on génère un token de session pour le user maintenant connecté
                  { userId: user._id},
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h'}
              )
              
            })
            
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
