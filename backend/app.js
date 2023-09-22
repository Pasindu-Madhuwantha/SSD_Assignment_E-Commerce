const express =require('express');
const app = express();
const cors = require('cors'); // Import the cors middleware

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const passport = require('passport');

const session = require('express-session');
const errorMiddleware = require('./middlewares/errors')
const dotenv = require('dotenv');




//setting up config file
dotenv.config({path:'backend/config/config.env'})


app.set('trust proxy', 'loopback');

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload());

// Set X-Frame-Options header to prevent clickjacking
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    next();
});

//import all routes
const products = require('./routes/product');
const auth = require('./routes/authSeller');
const order = require('./routes/orderSeller');
const google = require('./routes/googleRoute')


app.use('/api/v1', products)
app.use('/api/v1',auth)
app.use('/api/v1', order)
app.use('/api/v1', google)



app.use(errorMiddleware);




module.exports = app
