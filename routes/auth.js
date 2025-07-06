const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');

router.get('/sign-up', authCtrl.showSignUp);
router.post('/sign-up', authCtrl.signUp);

router.get('/login', authCtrl.showLogin);
router.post('/login', authCtrl.login);

router.get('/logout', authCtrl.logout);

module.exports = router;
