var express = require('express');
var session = require('express-session');
var path = require('path');
var connection =require('./dbConfig');
 
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

app.get('/login', function(req, res, next) {
	res.render('login.ejs', { title: 'Login' });
});

app.get('/membersOnly', function(req, res, next) {
	if(req.session.loggedin){
		res.render('membersOnly');
	}
	else{
		res.send('Please login to view this page!');
	}
});

app.get('/', function(req, res, next) {
	res.render('Home', { title: 'Home' });
});


app.get('/auck', function(req, res, next) {
	res.render('Auckland', { title: 'Auckland Page' });
});

app.get('/beaches', function(req, res, next) {
	res.render('beaches', { title: 'Beaches Page' });
});

//app.get('/auth', function(reg,res){});

app.post('/auth', function(req,res){
	let name = req.body.username;
	let password = req.body.password;
	
	if(name && password){
		connection.query(
			'SELECT * FROM users WHERE name= ? AND password=?', 
			[name, password],
			function(error, results, fields){
				if(error) throw error;//this line will force the application to terminate
				if (results.length > 0){
					req.session.loggedin = true;
					req.session.username = name;
					res.redirect('/membersOnly');
				}else{
					res.send('Incorrect Username and/or Password!');
				}
				res.end();
			}
		);
	}
	///execution will jump to this line if either name or password was null/nondefined
	else{
		res.send("Please enter Username and Password!");
		res.end();
	}
});

app.get('/logout', (req,res)=>{
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