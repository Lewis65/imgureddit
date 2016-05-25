var express = require('express'),
    app = express();

var mongo = require('mongodb').MongoClient,
    mongoURI = 'mongodb://user:password@ds011923.mlab.com:11923/imgureddit';

var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', './views');

//FUNCTIONALITY
//1. search for images
//--a) pagination by adding ?offset={page}
//--b) get page url, image url, and alt text
//2. remember search history
//--a) show time of search and search query

//TO DO
//1. Make AJAX call to imgur api
//2. Render all results
//3. Render paginated results
//4.

//set page number
var offset = 0;
//store paginated results
var results;

function getResults(term){
    //make call to imgur api
    //on callback split results to array of pages
    //display page 1
}

function showPage(num, max){
    //num = page number, max = number of results pages
    //render last page if offset is greater than results pages
    if (num > max){
        showPage(max, max);
    } else {
        //clear the content div
        //render the relevant page
    }
}

//ROUTES
//--/ = index
//--/r/:subreddit = search
//use a regexp to match subreddit and optional params
//set default values as page 1, recent
//POST will route to a GET with the form's params
//----?offset=x = pagination
//----?sort=[top/time] = sort by recent or top
//--/history = search history

app.get('/', function(req, res){
    res.render('index', {
        content: '<p>Welcome to imgureddit! You can search for a subreddit in the search bar above, or navigate directly to a URL like so:</p>       <p>/r/(subreddit)?sort=(recent OR top)&offset=(page number)</p>',
        searchTerm: 'testing stuff'
    });
    res.end();
});

app.get(/^\/r\/(.+)(\\?(.+))?$/, function(req, res){
    //DEBUG
    console.log('got the params query from a GET');
    console.log(req.params);
    console.log(req.query);
    var args = {
        subreddit: req.params[0],
        offset: '0',
        sort: 'recent'
    }
    if (req.query.offset && req.query.offset.match(/[0-9]+/)){
        args.offset = req.query.offset;
    }
    if (req.query.sort === 'recent' || req.query.sort === 'top'){
        args.sort = req.query.sort;
    }
    resultsHandler(req, res, args);
});
app.post('/*', function(req, res){
    //DEBUG
    console.log('got the params query from a POST');
    console.log(req.body);
    var args = {
        subreddit: req.body.subreddit,
        offset: '0',
        sort: req.body.sort
    }
    resultsHandler(req, res, args);
});

function resultsHandler(req, res, args){
    //DEBUG
    console.log(args);
    res.render('index', {
        content: args.sort + ' ' + args.offset,
        searchTerm: args.subreddit
    });
}

app.listen(process.env.PORT || 8080);
