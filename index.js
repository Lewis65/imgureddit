var express = require('express'),
    app = express();

var mongo = require('mongodb').MongoClient,
    mongoURI = 'mongodb://user:password@ds011923.mlab.com:11923/imgureddit';

var bodyParser = require('body-parser');
var request = require('request');
var morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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



function resultsHandler(req, res, args){
    if (args.sort !== 'recent'){
        args.sort = 'top';
    }
    //make ajax call
    request({
        url: 'https://api.imgur.com/3/gallery/r/' + args.subreddit + '/' + args.sort + '/' + args.offset,
        headers: {
            'Authorization': 'Client-ID 85cc8b5c9abad86'
        }
    }, function(err, response, body){
        if (err){
            throw err;
        } else {
            var results = JSON.parse(body);
            if(results.success){
                //save the search to history
                saveSearch(args);
                resultsToPages(results.data, res, args);
            }
        }
    });
}

//move json results into pages for display
function resultsToPages(data, res, args){
    var length = data.length;
    console.log(length);
    var pages = [[]];
    for (var i = 0, k = 0; i < length; i++){
        if (i % 10 === 0 && pages[k]){
            k++;
            pages[k] = [];
        }
        pages[k].push({
            id: data[i].id,
            title: data[i].title,
            views: data[i].views,
            url: data[i].link
        });
    };
    pages.shift();
    console.log(pages);
    showPage(pages, args, 0, res);
}

//display a page of results
function showPage(pageArray, args, change, res){
    //add page change to offset
    var offset = (Number(args.offset) + change);
    //render last page if offset is greater than results pages
    if (offset > pageArray.length){
        offset = pageArray.length;
    } else if (offset < 0){
        offset = 0;
    }
    //get the current page
    var items = pageArray[offset];
    console.log(pageArray.length + ' - ' + offset)
    console.log(items);
    //concatenate the content
    var cont = '';
    if(items){
        for(var i = 0; i < items.length; i++){
            cont += ('<div class="result">' +
            '<h2>' + items[i].title + '</h2>' +
            '<p>Views: ' + items[i].views + '</p>' +
            '<p><a target="blank" href="' + items[i].url + '">' + items[i].url + '</a></p></div>');
        }
    } else {
        cont = 'Nothing found';
    }
    //keep the checked search method
    var checked = {recent: true, top: false};
    if (args.sort === 'top'){
        checked = {recent: false, top: true};
    }
    res.render('index', {
        content: cont,
        searchTerm: args.subreddit,
        checkedRecent: checked.recent,
        checkedTop: checked.top
    });
}


//search history functions
function saveSearch(args){
    var search = {
        time: new Date,
        subreddit: args.subreddit,
        sort: args.sort
    }
    mongo.connect(mongoURI, function(err, db){
        db.collection('searches').insert({
            search
        });
    })
}

function getSearches(req, res){
    var history = [];
    mongo.connect(mongoURI, function(err, db){
        if (err) throw err;
        db.collection('searches').find().toArray(function(err, data){
            data.forEach(function(doc){
                var url = ('/r/' + doc.search.subreddit + '?sort=' + doc.search.sort);
                history.push('<p><a href="' + url + '">' + doc.search.subreddit + ' sorted by ' + doc.search.sort + '</a> at ' + doc.search.time + '</p>');
            });
            res.render('index', {
                content: history.reverse().join(''),
                searchTerm: '',
                checkedRecent: true,
                checkedTop: false
            });
        });
    });
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
        searchTerm: '',
        checkedRecent: true,
        checkedTop: false
    });
    res.end();
});

app.get(/^\/r\/(.+)(\\?(.+))?$/, function(req, res){
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
    res.redirect('/r/' + args.subreddit + '?sort=' + args.sort + '&offset=' + args.offset);
});

app.get('/history', function(req, res){
    //show search history
    getSearches(req, res);
})

app.listen(process.env.PORT || 8080);
