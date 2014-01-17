var express = require('express'),
    times = require('./routes/runner-info'),
    path = require('path');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
	app.use(express.cookieParser("here is my secret"));
	app.use(express.session());
});


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'client/app')));
app.set('views', __dirname + '/views');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));

app.get('/athlete/:id', times.athleteStats);
app.get('/teams', times.teams);
app.get('/teams/roster/teams/:url', times.roster);

app.listen(process.env.PORT || 5000);
console.log('Listening on port 5000...');