process.env.PWD = process.cwd();

// --- LOADING MODULES
var express = require('express'),
    body_parser = require('body-parser'),
    mongoose = require('mongoose');

// --- INSTANTIATE THE APP
var app = express();

// --- MONGOOSE SETUP
mongoose.connect(process.env.CONNECTION || 'mongodb://localhost/jspsychdb'); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('database opened');
});

var emptySchema = new mongoose.Schema({}, { strict: false });
var Entry = mongoose.model('Entry', emptySchema);

// --- STATIC MIDDLEWARE 
app.use(express.static(process.env.PWD + '/public'));
app.use('/jspsych', express.static(process.env.PWD + "/jspsych"));

// --- BODY PARSING MIDDLEWARE
app.use(body_parser.json()); // to support JSON-encoded bodies

// --- VIEW LOCATION, SET UP SERVING STATIC HTML
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// --- ROUTING
app.get('/', function(request, response) {
    response.render('experiment.html');
});

app.get('/experiment', function(request, response) {
    response.render('experiment.html');
});

app.post('/experiment-data', function(request, response){
    Entry.create({
        "data":request.body
    });    
    response.end();
})

app.get('/finish', function(request, response){
    response.render('finish.html');
})

// --- START THE SERVER 
var server = app.listen(process.env.PORT || 3000, function(){
    console.log("Listening on port %d", server.address().port);
});
