const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authSeller');

// Apply rate limiting middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Allow up to 100 requests per windowMs
});

// Apply rate limiter and CSP headers to the relevant routes
router.route('/seller/products').get(isAuthenticatedUser, authorizeRoles('seller'), apiLimiter, getProducts);
router.route('/product/:id').get(apiLimiter, getSingleProduct); // Applying rate limiting to this route too

router.route('/seller/product/new').post(isAuthenticatedUser, authorizeRoles('seller'), apiLimiter, newProduct);

router.route('/seller/product/:id')
    .put(isAuthenticatedUser, authorizeRoles('seller'), apiLimiter, updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles('seller'), apiLimiter, deleteProduct);

// Set up CSP headers using helmet middleware
router.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust as needed for inline scripts
        styleSrc: ["'self'", "'unsafe-inline'", 'stackpath.bootstrapcdn.com'], // Allow styles from trusted sources
        imgSrc: ["'self'", 'data:', 'trusted-images.com'], // Allow images from trusted sources
        fontSrc: ["'self'", 'fonts.gstatic.com'], // Allow fonts from trusted sources
        // Add more directives as needed
    }
}));

module.exports = router;
