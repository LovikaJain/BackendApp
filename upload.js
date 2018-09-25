var fs = require('fs'),
multiparty = require('multiparty'),
walk = require('walk'),
Config = require('../config/config');


/**
 Display upload Form
 */
exports.display_form = {
    handler: function(requestuest, reply) {
        reply(
            '<form action="/uploadFile" method="post" enctype="multipart/form-data">' +
            '<input type="file" name="file">' +
            '<input type="submit" value="Upload">' +
            '</form>'
        );
    }
};

/* upload file */

exports.uploadFile = {
    payload: {
        maxBytes: 209715200,
        output: 'stream',
        parse: false
    },
    handler: function(request, reply) {
        var form = new multiparty.Form();
        form.parse(request.payload, function(err, fields, files) {
            console.log(fields)
            console.log(files)
            if (err) return reply(err);
            else upload(files, reply);
        });
    }
};


/* upload file function */

var upload = function(files, reply) {
    console.log(files)
    fs.readFile(files.file[0].path, function(err, data) {
        console.log(files.file[0].path)
        console.log(data)
        checkFileExist();
        fs.writeFile(Config.MixInsideFolder + files.file[0].originalFilename, data, function(err) {
            console.log(Config.MixInsideFolder )
            console.log(files.file[0].originalFilename)
            console.log(data)
            if (err) return reply(err);
            else return reply('File uploaded to: ' + Config.MixInsideFolder + files.file[0].originalFilename);

        });
    });
};


/* Check File existence and create if not exist */

var checkFileExist = function() {
    fs.exists(Config.publicFolder, function(exists) {
        console.log(Config.publicFolder)
        if (exists === false) fs.mkdirSync(Config.publicFolder);

        fs.exists(Config.MixFolder, function(exists) {
            console.log(Config.MixFolder)
            if (exists === false) fs.mkdirSync(Config.MixFolder);
        });
    });
};
