const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GoogleUser = require('../models/').GoogleUser;
//const sequelize = require("../config/connection");
require('dotenv').config

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/redirect",
        passReqToCallback   : true
        },
    function(request, accessToken, refreshToken, profile, done) {
         return done(null, profile);
  }
));

module.exports = passport;
