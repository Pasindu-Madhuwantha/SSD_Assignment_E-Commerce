const GoogleStrategy = require('passport-google-oauth20')
const dotenv = require('dotenv');

//setting up config file
dotenv.config({path:'backend/config/config.env'})

const googleAuth = (passport) => {
  GoogleStrategy.Strategy;

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URL,
      },
      async (accessToken, refreshToken, profile, callback) => {
        console.log(profile);
        return callback(null, profile)
        

       
      }
    )
  );

  passport.serializeUser((user, callback) => {
    callback(null, user.id);
  });

  passport.deserializeUser((id, callback) => {
    callback(null, id);
  });


};

module.exports = { googleAuth };