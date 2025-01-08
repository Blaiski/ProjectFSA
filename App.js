var express = require('express');
var path = require('path');
var db=require('./dbConfig');
 
var app = express();
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
	res.render('Home', { title: 'Home' });
});


app.get('/auck', function(req, res, next) {
	res.render('Auckland', { title: 'Auckland Page' });
});

app.get('/beaches', function(req, res, next) {
	res.render('beaches', { title: 'Beaches Page' });
});

app.listen(3000);
console.log('Node app is running on port 3000');


// app.get('/getData', function(req, res){
// 	db.query("SELECT * FROM customer", function (err, result) {
// 		if (err) throw err;
// 		console.log(result);
// 		res.render('getData', { title: 'Customer Data', customerData: result});
// 	});
// });