var User       		= require('../model/user');
var LocalStrategy   = require('passport-local').Strategy;
var mainuser="Shusmoy";
var mainpassword="ragnar13"
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', isLoggedIn, function(req, res) {
        //module.exports.user=req.user.biggo; // load the index.ejs file

        res.redirect('/profile');
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        User.find({},{} , function(err, user) {
            if(user.length==0){
                var newUser            = new User();

                // set the user's local credentials
                newUser.biggo.email    = mainuser;
                newUser.biggo.password = newUser.generateHash(mainpassword); // use the generateHash function in our user model
                newUser.biggo.usertype = "admin";
                newUser.save(function(err) {});
            }
        });
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/project', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        console.log("here");
        console.log(req.user)
        if(req.user!=undefined)
            res.render('signup', { message: "",layout:'homeadmin', user:req.user.biggo });
        else
        {
            res.render('signup', { message: ""});
        }

    });

    //process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/project', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        session: false,
        failureFlash : true // allow flash messages

    }));
    // =====================================
    // PROFILE SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        //module.exports.user=req.user.biggo;

        //res.cookie('connect.sid',req.user.biggo.id,{maxAge: 2592000000, httpOnly:true});
        //console.log(req.user.biggo.name);
        //res.redirect('/project')
        // if(req.user.biggo.usertype=='admin')
        //     res.redirect('/project')
        if(req.user.biggo.usertype=='admin') {
            res.render('profile1', {
                user:req.user.biggo, layout: 'homeadmin'// get the user out of session and pass to template
            });
        }
        else if(req.user.biggo.usertype=='manager') {
            res.render('profile1', {
                user:req.user.biggo, layout: 'homemanager'// get the user out of session and pass to template
            });
        }
        else
        {

        }
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
       // res.clearCookie('connect.sid');
        res.redirect('/');
    });


    app.post('/print',function (req,res) {

        res.render('print_pdf',{layout:'homeadmin'});
    });

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on

    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
   res.redirect('/login');
}

