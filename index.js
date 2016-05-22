var express = require('express'),
    app = express();
var mongo = require('mongodb').MongoClient,
    mongoURI = 'mongodb://user:password@ds011923.mlab.com:11923/imgureddit';

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', function(req, res){
    res.render('index', {content: "content goes here"});
    res.end();
});

app.listen(process.env.PORT || 8080);
