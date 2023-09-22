const express = require('express');
const router = express.Router();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserProfile, updatePassword, updateProfile } = require('../controllers/authControllerSeller');
const { isAuthenticatedUser } = require('../middlewares/authSeller');
const { registerUserGoogle, loginUserGoogle } = require('../controllers/googleAuthController'); // Import Google OAuth controllers

// Apply rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Allow up to 100 requests per windowMs
});

// Set up CSP headers using helmet middleware
router.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'trusted-scripts.com'],
      styleSrc: ["'self'", 'trusted-styles.com', 'stackpath.bootstrapcdn.com'],
      imgSrc: ["'self'", 'data:', 'trusted-images.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'use.fontawesome.com'],
      // Add more directives as needed
    },
  })
);

// Apply the rate limiter to relevant routes
router.use('/register', apiLimiter);
router.use('/login', apiLimiter);
router.use('/password/forgot', apiLimiter);
router.use('/password/reset/:token', apiLimiter);
router.use('/me', apiLimiter);
router.use('/password/update', apiLimiter);
router.use('/me/update', apiLimiter);

// Your existing routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/logout').get(logout);
router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);



module.exports = router;
