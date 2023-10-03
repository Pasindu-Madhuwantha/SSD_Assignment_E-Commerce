// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const googleAuthController = require('../controllers/googleAuthController');
const { isAuthenticatedUser } = require('../middlewares/authSeller');

router.route('/google-login').post( googleAuthController.handleGoogleLogin);


module.exports = router;
