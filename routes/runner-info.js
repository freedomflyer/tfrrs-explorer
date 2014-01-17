var http = require('http'),
    cheerio = require('cheerio');


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
    var cheerio = require('cheerio');
    var request = require('request')

    console.log('http://tfrrs.org' + req.params.url);

    var req = request('http://tfrrs.org/teams/' + req.params.url, 
        function(error, res, content) {
            var $ = cheerio.load(content);

            var athletes = [];
            $('td.name a').each(function(i, elem) {
                console.log($(this).attr('href'));
                console.log($(this).text());

                athletes.push({url: $(this).attr('href'), name: $(this).text()});
            });
            response.json(athletes);
    });

};



exports.athleteStats = function(req, response) {

    
    var content = "";   

    var req = http.request(req.query.url, function(res) {
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
            content += chunk;
        });

        // After all data has been stored.
        res.on("end", function () {
            var $ = cheerio.load(content);
     
            var runner = [];

             $('#athlete').find(".title").find("h2").each(function() {
                 runner.push({"name" : $(this).text().trim()});
             });

            //Loop through data for each table entry for the athlete.
            $('#results_data').find(".even").each(function() {
                
                //date, meet, event, mark, place.
                var arace = [];

                arace.push({
                    "date" : $(this).find(".date").text().trim(),
                    "meet" : $(this).find(".meet").text().trim(),
                    "event" : $(this).find(".event").text().trim(),
                    "mark" : $(this).find(".mark").text().trim(),
                    "place" : $(this).find(".place").text().trim()
                });
                
                runner.push({"race" : arace});
            });

            response.send(runner);
        });
    });

    req.end();
};

// Add a separate function to get athlete stats based on URL, but don't make it a route so it can be called multiple times


