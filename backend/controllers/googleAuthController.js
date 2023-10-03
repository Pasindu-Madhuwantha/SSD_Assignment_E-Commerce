// controllers/authController.js
const User = require('../models/seller');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
var generator = require('generate-password');

async function handleGoogleLogin(req, res) {
  try {
    // Handle Google authentication data here
    const googleAuthData = req.body; // This will contain the data sent from the frontend
    console.log(googleAuthData);

    // Extract information from the JWT token in the 'credential' field
    const credentialDecoded = jwt_decode(googleAuthData.credential);
    console.log(credentialDecoded);

    // Extract user information from Google Auth data
    const { email, name, picture, sub } = credentialDecoded;

    // Check if the user with this email already exists in your database
    let user = await User.findOne({ email });

    if (!user) {
      // If the user does not exist, generate a random password for them
      function generateRandomPassword(length) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&";
        let password = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }
      
        return password;
      }
      
      // Generate a random password with a length of 12 characters
      const randomPassword = generateRandomPassword(12);

      console.log(randomPassword)
      
    
      // Create a new user with the extracted data and generated password
      user = new User({
        email,
        name,
        password: randomPassword,
        avatar: {
          public_id: '', // You can set this if you have it, or leave it empty
          url: picture, // Set the 'url' field with the Google profile picture URL
        },
        googleId: sub, // Store Google ID for future reference
        // Additional user properties
      });

      // Save the new user to the database
      await user.save();
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Structure the response to match the regular login payload
    const avatar = {
      public_id: user.avatar.public_id,
      url: user.avatar.url
    };

    const _id = user._id
    const password = user.password
    const role = user.role
    const createdAt = user.createdAt

    // Send a response to the frontend with the token and structured payload
    res.status(200).json({ message: 'Google login successful', token, avatar , _id , name , email , password , role ,createdAt, redirect: '/me' });
  } catch (error) {
    // Handle any errors that occur during this process
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  handleGoogleLogin,
};
