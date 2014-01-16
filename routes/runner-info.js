var mongo  = require('mongodb'),
    http = require('http'),
    cheerio = require('cheerio');


exports.athletesOnTeam = function(req, res) {
    var teamURL = req.params.id;

    // Use for remote

    //http://www.tfrrs.org/teams/UT_college_m_BYU.html
    /*var options = {
        host: "www.tfrrs.org",
        port: 80,
        path: "/teams/" + teamURL + ".html"
    };*/

    var htmlContent = "";   


    var htmlreq = http.request("http://www.tfrrs.org/teams/1190.html", function(res) {
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
            htmlContent += chunk;
        });

        //We've gotten our data, let's mine it!
        res.on("end", function () {
            //console.log(htmlContent);
            var $ = cheerio.load(htmlContent);
            var team = [];

            var list = $('td.name');

            $(list).each(function(index){
                console.log(list[index].children[1].type);
            });
            //console.log(list);

        });
    });

    htmlreq.end();
    res.send("getting results...");
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

exports.roster = function(req, res) {

    var options = {
        host: "www.tfrrs.org",
        port: 80,
        //path: "/teams/" + req.params.teamURL
        path: "/athletes/3275363.html"
    };

    console.log(options);
    var content = "";   

    var req = http.request(options, function(res) {
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
            console.log(chunk);
            content += chunk;
        });

        // After all data has been stored.
        res.on("end", function () {
            var $ = cheerio.load(content);
            console.log(content);
            res.send({content: content});
        });
    });
}

exports.athleteStats = function(req, response) {
    var athleteId = req.params.id;

    var options = {
        host: "www.tfrrs.org",
        port: 80,
        path: "/athletes/" + athleteId + ".html"
    };

    var content = "";   

    var req = http.request(options, function(res) {
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


