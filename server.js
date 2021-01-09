var express = require('express');
var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Recipe = require('./models/recipe');  

var app = express();

// Configuración de cabeceras y CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Connect to database
(async () => {
    try {
    await mongoose.connect('mongodb://localhost/recipes', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
            });
    } catch(e) { console.log(e); }
})()

// Variables
app.set('port', process.env.PORT || 3000); // Puerto del S.O o el 3000.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(__dirname + '/frontend'));

app.get('/', (req,res) => {
    res.status(200).send("Welcome to the CookREST");
    //const filename = path.join(__dirname, 'frontend', 'index.html');
    //res.sendFile(__dirname); // envía el index.html
});

app.get('/recipes', (req,res) => {
    Recipe.find().exec(function (err, data) {
            if (err) {return handleError(err); }
            else { res.send(data); }
    });
});

app.post('/recipes', (req,res) => {
    var newRecipe = new Recipe({title: req.body.title, ingredients: req.body.ingredients, dificult: req.body.dificult})
    newRecipe.save(function(err, doc){
        if (err) {
            console.log(err)
        } else { 
            res.status(200).send('Receta insertada correctamente'); 
        }
    });
});

app.delete('/recipes', (req, res) => {
    Recipe.deleteMany().exec(function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send("Recetas borradas");
        }
    });

});

http.createServer(app).listen(app.get('port'), () => {
    console.log('Server listening on port ' + `${app.get('port')}`);
});