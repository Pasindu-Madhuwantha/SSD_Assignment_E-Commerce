const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const {
    newOrder,
    getSingleOrder,
    myOrders,
    allOrders,
    updateOrder,
    deleteOrder
} = require('../controllers/orderControllerSeller');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authSeller');

// Apply rate limiting middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Allow up to 100 requests per windowMs
});

// Apply rate limiter and CSP headers to the relevant routes
router.route('/order/new').post(isAuthenticatedUser, apiLimiter, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, apiLimiter, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, apiLimiter, myOrders);
router.route('/seller/orders/').get(isAuthenticatedUser, authorizeRoles('seller'), apiLimiter, allOrders);
router.route('/seller/order/:id')
    .put(isAuthenticatedUser, authorizeRoles('seller'), apiLimiter, updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles('seller'), apiLimiter, deleteOrder);

// Set up CSP headers using helmet middleware
router.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'trusted-scripts.com'], // Add 'unsafe-inline' for inline scripts (Bootstrap)
        styleSrc: ["'self'", 'trusted-styles.com', 'stackpath.bootstrapcdn.com', 'use.fontawesome.com', 'cloudinary.com'], // Allow styles from trusted sources
        imgSrc: ["'self'", 'data:', 'trusted-images.com', 'res.cloudinary.com'], // Allow images from trusted sources
        fontSrc: ["'self'", 'fonts.gstatic.com', 'use.fontawesome.com'], // Allow fonts from trusted sources
        // Add more directives as needed
    }
}));

module.exports = router;
