const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // package pour prévenir des attaques par force brute
const userCtrl = require('../controllers/user');

const passLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes : temps défini pour tester l'application
    max: 3 // 3 essais max par adresse ip
  });
  

router.post('/signup', userCtrl.signup);
router.post('/login',passLimiter, userCtrl.login);

module.exports = router;