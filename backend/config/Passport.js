const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); // Modify the import based on your file structure
const dotenv = require('dotenv');


//setting up config file
dotenv.config({path:'backend/config/config.env'})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Your Google OAuth client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Google OAuth client secret
      callbackURL: '/auth/google/callback', // Callback URL where Google will redirect after authentication
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if a user with the Google ID already exists
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        // If no user with the Google ID exists, create a new user
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value, // Assuming you want to store the email
        });

        await newUser.save();

        return done(null, newUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

module.exports = passport;
