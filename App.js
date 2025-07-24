var express = require('express');
var session = require('express-session');
var bcrypt = require('bcrypt');
var path = require('path');
var connection = require('./dbConfig');

var app = express();
app.use(session({
	secret: 'dsafjdsljflaskjfqpr439809823-904lsdjf',
	resave: true,
	saveUninitialized: true
}));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

//==================================

//'use strict';

//const express = require('express');
//var session = require('express-session');
//var MemoryStore = require('memorystore')(session)

// var staticOptions = {
//     setHeaders: function(res, path, stat) {

//         res.set('x-auth-token', session.authToken);
//         res.set('x-id-token', session.idToken);

// 		//res.req.MemoryStore
// 		console.log('session is:',res.req.session);
//     }

// }
//app.use('/', express.static('public', staticOptions));

//Entry Point to our app
app.get('/', function (req, res, next) {

	res.render('Home', { session: req.session });

});

app.get('/login', function (req, res, next) {
	//res.render('login', { title: 'Login' });
});
//added line of comment

app.get('/register', function (req, res, next) {
	res.render('register', { title: 'Register' });
});

app.post('/register', function (req, res) {

	let username = req.body.username;
	let email = req.body.email;
	let password = req.body.password;
	let passwordVer = req.body.passwordVer;

	if (password == passwordVer) {

		const hashedPassword = bcrypt.hashSync(password, 10);
		console.log('Hashed Password: ', hashedPassword);

		connection.query(
			`INSERT INTO users(name, password, email) VALUES ( "${username}", "${hashedPassword}", "${email}")`,
			
			function (error, results, fields) {
				if(error){
					console.log('Oops some error occured executing the SQL query', error);
				}	
				else{
					console.log('new user record has been entered successfully entered into the database');
					req.session.newUser = username;
					res.render('Home', {session: req.session} );
				}
			}
		);

		// console.log(`Username Value: ${username}`);
		// console.log(`Email Value: ${email}`);
		// console.log(`Password Value: ${password}`);
		// console.log(`PasswordVer Value: ${passwordVer}`);

	}
	else {
		res.send("Oops! your passwords don't match");
		//res.end();
	}

});

app.get('/membersOnly', function (req, res, next) {
	if (req.session.loggedin == true) {

		connection.query("SELECT * FROM users", function(error, records){
			if (error) {
				console.warn(`Error reading users from database`, error);
			}
			else{
				console.log(records);
				res.render('membersOnly',{users: records});
			}
		});
	}
	else {
		res.send('Please login to view this page!');
	}
});


app.get('/auck', function (req, res, next) {
	if (req.session.loggedin == true) {
		res.render('Auckland', { title: 'Auckland Page' });
	}
	else {
		res.send('Sorry, this page is restricted, please login to access it!');
	}

});

app.get('/beaches', function (req, res, next) {
	res.render('beaches', { title: 'Beaches Page' });
});

//app.get('/auth', function(reg,res){});
app.post('/auth', function (req, res) {
	let name = req.body.username;
	let password = req.body.password;

	if (name && password) {
		connection.query(
			'SELECT * FROM users WHERE name= ?',
			[name],
			function (error, results, fields) {
				console.log("Results from Database: ", results);
				if (error) throw error;//this line will force the application to terminate
				if (results.length > 0) {
					const userData = results[0];
					const passwordMatch = bcrypt.compareSync(password, userData.password);
					if(passwordMatch){
						console.log('Password Match', passwordMatch);
						req.session.loggedin = true;
						req.session.username = name;
						res.redirect('/membersOnly');
					}
					
				} else {
					res.send('Incorrect Username and/or Password!');
				}
				res.end();
			}
		);
	}
	///execution will jump to this line if either name or password was null/nondefined
	else {
		res.send("Please enter Username and Password!");
		res.end();
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/');
})

app.listen(3000);
console.log('Node app is running on port 3000');


// app.get('/getData', function(req, res){
// 	db.query("SELECT * FROM customer", function (err, result) {
// 		if (err) throw err;
// 		console.log(result);
// 		res.render('getData', { title: 'Customer Data', customerData: result});
// 	});
// });

// mathUtils.js
function add(a, b) {
  return a + b;
}

function twoFactorAuth(){
//I'm done now.
}

module.exports = { add };