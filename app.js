var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var geocoder = require('geocoder');

// Configuration
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/bower_components'));
app.set('view engine', 'ejs')
app.use(methodOverride('_method'));
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoUrl = "mongodb://localhost:27017/myDb";
var db;
MongoClient.connect(mongoUrl, function(err, database){
  if (err) {
    console.log(err);
  }
  console.log("bird on!");
  db = database;
  process.on('exit', db.close);
});
// Routes
app.get('/', function(req, res){
  res.render('index');
});

app.get('/sightings/new', function(req, res){

  res.render('form');
});

app.get('/sightings', function(req, res){
  db.collection('birds').find({}).sort({sighting_date: -1}).limit(3).toArray(function(err, results){
    res.json(results)
  })
});

app.get('/api/sightings', function(req, res){
  db.collection('birds').find({}).toArray(function(err, results){
    res.json(results)
  })
});

app.post('/sightings', function(req, res){
  console.log(req.body.location)
  geocoder.geocode(req.body.location, function ( err, data ) {
    req.body.gps_location = data.results[0].geometry.location
    newBird = req.body;
    db.collection('birds').insert(newBird);
    res.redirect('/');
  });
})

app.get('/demo', function(req, res){
  db.collection('birds').find({}).sort({sighting_date: -1}).toArray(function(err, results){
    res.json(results)
  })
});

app.listen(process.env.PORT || 3000);
