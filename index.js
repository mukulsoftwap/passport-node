const express = require('express');
const passport = require('passport');
const app = express();
const port = process.env.PORT || 3000;
const User = require('./models/User.js')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.get('/', (req, res) => res.sendFile('auth.html', { root : __dirname}));

app.post('/save', function(req, res){
    console.log(req.body.username)
    let user = new User();
    user.username = req.body.username;
    user.password =  req.body.password;
    user.save(user, function(err, user){
        if(err) return res.status(400).send({error : err.message});
        res.send({message : "saved...."});
    });
});

// Passport Setup

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
      User.findOne({
        username: username
      }, function(err, user) {
          console.log(user)
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        if (user.password != password) {
          return done(null, false);
        }
        return done(null, user);
      });
  }
));

app.post('/',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success?username='+req.user.username);
  });


app.listen(port , () => console.log('App listening on port ' + port));
