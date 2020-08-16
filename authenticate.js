var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/users');


passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
        done(err, user);
      });
});

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); }

        if (!user) { return done(null, false, { message: 'Incorrect username.' }); }

        if (!user.password==password) { return done(null, false, { message: 'Incorrect password.' }); }

        return done(null, user)
    })
}));
