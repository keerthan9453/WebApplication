const passport = require('passport');
const GoogelStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = '877499448606-qqaeoumnfveeg24bur8vkau5q68avdq1.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogelStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5001/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
      return done(err, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});