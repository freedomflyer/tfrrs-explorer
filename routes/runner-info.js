var http = require('http'),
    cheerio = require('cheerio'),
    redis   = require('redis'),
    request = require('request');

if(process.env.REDISCLOUD_URL) {
    var client = redis.createClient(proces.env.REDISCLOUD_URL, {no_ready_check: true});
}
else {
    var client = redis.createClient();
}


exports.teams = function(req, res) {
    var fs = require('fs');
    var obj;
    fs.readFile('teams.js', 'utf8', function (err, data) {
      if (err) throw err;
      eval(data);
      res.json(autocomplete_teams);
    });
}

// Get the roster of peeps
exports.roster = function(req, response){
    var teamURL = 'http://tfrrs.org/teams/' + req.params.url;


    client.get(teamURL, function(err, reply){
        if(reply != null) {
            console.log("Page exists....");
            var $ = cheerio.load(reply);
            var athletes = [];

            $('td.name a').each(function(i, elem) {
                console.log($(this).attr('href'));
                console.log($(this).text());

                athletes.push({url: $(this).attr('href'), name: $(this).text()});
            });
            athletes.splice(0, 1);
            response.json(athletes);
        }
        else {
            console.log("Page doesn't exists....");
            var content = '';
            request(teamURL, function(error, res, content) {
                client.set(teamURL, content, redis.print);
                var $ = cheerio.load(content);

                var athletes = [];
                $('td.name a').each(function(i, elem) {
                    console.log($(this).attr('href'));
                    console.log($(this).text());

                    athletes.push({url: $(this).attr('href'), name: $(this).text()});
                });
                athletes.splice(0, 1);
                response.json(athletes);
            });
        }

    });


};


exports.athleteStats = function(req, response) {
    request("http://www.tfrrs.org/athletes/" + req.params.id + ".html", function(error, res, content) {
        var $ = cheerio.load(content);
        
        var athlete = {};

        $('#athlete').find(".title").find("h2").each(function() {
            athlete.name = $(this).text().trim();
        });


        athlete.tfrrs_id = req.params.id;
        athlete.tfrrs_url = "http://www.tfrrs.org/athletes/" + req.params.id + "/html";
        athlete.bests = [];
        athlete.races = [];

        // Bests Logic
        var headings = $(".topperformances > :first-child > :first-child > :first-child").children().toArray();
        $(".marked").each(function(){
            var numBefore = $(this).parent().prevAll().length;
            var eventName = headings[numBefore].children[0].children[0].data.replace(/\s+/g, '');
            athlete.bests.push({event : eventName, time : $(this).text()});       
        });

        //Loop through data for each table entry for the athlete.
        $('#results_data').find(".even").each(function() {
            
            athlete.races.push({
                "date" : $(this).find(".date").text().trim(),
                "meet" : $(this).find(".meet").text().trim(),
                "event" : $(this).find(".event").text().trim(),
                "mark" : $(this).find(".mark").text().trim(),
                "place" : $(this).find(".place").text().trim()
            });
        });


        response.json(athlete);
    });
};











