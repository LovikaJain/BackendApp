var https = require("https");
var xmljs = require("libxmljs");
var caldav = require("node-caldav");
var app = express();

var url = "https://calendar.zoho.com/ical/a16de7b67632972144876ca2e6800112b17b02fba60d27c0cc4d49c602362d7f807656c051c634027129af818f0d84ed/pvt_1507943972622jBOaMuFmSJsBoU2itQM";
var username = "lovika@dieselautoexpress.com";
var password = "password";
var timeFormat = "YYYYMMDDTHHmms";

// Function to get the events from Zoho Calendar
var getTodayEvents = function(callback){
    var query_start_date = moment().set({'hour': 0, 'minute': 0, 'second': 10}).format(timeFormat) + "Z";
    var query_end_date = moment().set({'hour': 23, 'minute': 59, 'second': 59}).format(timeFormat) + "Z";
    var output = {};
    output.start_date = query_start_date;
    output.end_date = query_end_date;

    caldav.getEvents(url, username, password, query_start_date, query_end_date, function(res){
      console.log("-----------------the result-----------------")
      console.log(res);
        callback(res);
    });
}
// GET method Route to get the events from the Zoho calendar
app.get('/today', function(request, response){
    getTodayEvents(function(events){
        console.log(events);
        response.send(events);
    })
});

// Listen to port 3000
app.listen(3000,function(){
    console.log("Listening on port 3000..");
})


