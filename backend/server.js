const app = require('./app')
const connectDatabase = require('./config/database')

const dotenv = require('dotenv');
const cloudinary = require('cloudinary')
const { routesInit } = require('./routes/googleRoute');
const passport = require('passport');
const { googleAuth } = require('./config/google.auth');

//Handle Uncaught exceptions /always put rhis on top otherwise it won't caught the error
process.on('uncaughtException',err =>{
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1)
}) 


//setting up config file
dotenv.config({path:'backend/config/config.env'})

//connecting to database

connectDatabase();


//Setting up cloudinary configuration
cloudinary.config({
    cloud_name :process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET

})




app.listen(process.env.PORT,()=>{
    console.log(`server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
 
})