var express = require('express');
var router = express.Router();
var UserModel = require('../models/User.js');
var jwt = require('jwt-simple');
var moment = require('moment');
var bodyParser = require('body-parser');

router.get('/', function(req, res) {
  res.render('login', { title: 'Login', message: null });
});

router.post('/', function(req, res) {

    if (req.body.username && req.body.password) {

        // Fetch the appropriate user, if they exist
        UserModel.findOne({
            username: req.body.username
        }, function(err, user) {

            console.log('before err');

            if (err || !user) {
                // user cannot be found; may wish to log that fact here. For simplicity, just return a 401
                // res.send('Authentication error', 401)
                res.render('login', { title: 'Login', message: 'Authentication failed. Login or password is incorrect.' });
                return;
            }

            console.log('before compare password');

            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) {
                    // an error has occured checking the password. For simplicity, just return a 401
                    // res.send('Authentication error', 401)
                	res.render('login', { title: 'Login', message: 'Authentication failed. Login or password is incorrect.' });
                	return;
                }
                if (isMatch) {

                    // Great, user has successfully authenticated, so we can generate and send them a token.	
                    var expires = moment().add('days', 7).valueOf()
                    var token = jwt.encode({
                            iss: user.id,
                            exp: expires
                        },
                        app.get('jwtTokenSecret')
                    );
                    res.redirect('/?token=' + token);
                    // res.json({
                    //     token: token,
                    //     expires: expires,
                    //     user: user.toJSON()
                    // });
                } else {
                    // The password is wrong...
                    // res.send('Authentication error', 401)
                    res.render('login', { title: 'Login', message: 'Authentication failed. Login or password is incorrect.' });
                    return;
                }
            });

        });
    } else {
        // No username provided, or invalid POST request. For simplicity, just return a 401
        // res.send('Authentication error', 401)
        res.render('login', { title: 'Login', message: 'Authentication failed. Login or password is incorrect.' });
        return;
    }
})

module.exports = router;