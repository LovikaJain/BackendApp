var script = require('./script.js')
var fs = require('fs');
// var path = require('path');


// Upload a file to server
var upload = function(payload,callback){
            var data = payload;
            if(data.file){
                var name = data.file.hapi.filename;
                var ext = name.split('.');
                var extension = ext[1];
                if(extension == "pdf"){
                    var path = __dirname + "/uploads/" + name;
                    console.log(path);
                    checkFileExist();
                    var file = fs.createWriteStream(path);
                    console.log(file);
                    file.on('error', function (err) { 
                        console.error(err) 
                    });
                    file.on('finish', function () { 
                        var parser = script.pdfParser(path,function(err,resp){
                            if(err){
                                callback(err);
                            }
                            else {
                                callback(null,resp);
                            }
                        })
                        console.log('done'); 
                    });
                    data.file.pipe(file);
                    var fileName = data.file.hapi.filename;
                   
                    // callback(JSON.stringify(fileName));
                }
            }
}

// To Download a file using url from server
var download = function (url, cb) {
    var data = "";
    var request = require("http").get(url, function(res) {
  
      res.on('data', function(chunk) {
        data += chunk;
      });
  
      res.on('end', function() {
        cb(data);
      })
    });
  
    request.on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  }

var checkFileExist = function() {
    var path = __dirname + '/uploads';
    fs.exists(path, function(exists) {
        if (exists === false) fs.mkdirSync(path);
    });
};


module.exports = {
    upload: upload,
    download: download
}