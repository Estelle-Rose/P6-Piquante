const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const userCtrl = require('../controllers/user');

const passLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes : time set for the application test 
    max: 3
  });
  

router.post('/signup', userCtrl.signup);
router.post('/login',passLimiter, userCtrl.login);

module.exports = router;