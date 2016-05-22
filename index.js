var express = require('express'),
    app = express();
var mongo = require('mongodb').MongoClient,
    mongoURI = 'mongodb://user:password@ds011923.mlab.com:11923/imgureddit';
require('jsdom').env('', function(err, window){
    if (err){
        throw err;
        return;
    }
    var $ = require('jquery')(window);
});

app.use(express.static(__dirname + '/public'));

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
var results = [];

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

app.get(/^\/r\/:subreddit(\?:params)/, function(req, res){
    var params = {
        subreddit: req.params.subreddit,
        sort: req.params.params.slice(
            req.params.params.indexOf('sort='),
            req.params.params.indexOf(/($|&)/)
        ) || 'recent',
        offet: req.params.params.slice(
            req.params.params.indexOF('offset='),
            req.params.params.indexOf(/($|&)/)
        ) || '1'
    }
    //DEBUG
    console.log(params);
})

app.listen(process.env.PORT || 8080);
