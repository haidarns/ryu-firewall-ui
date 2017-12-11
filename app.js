var express=require('express');
var bodyParser=require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');

var app=express();

//var db=require('./models/db.js');
var routes=require('./routes/route.js');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.urlencoded({extended:false}));

require('./routes/route.js')(app);

var port = process.env.PORT || 3000;

var server=app.listen(port,function(req,res){
    console.log("Catch the action at http://localhost:"+port);
});


