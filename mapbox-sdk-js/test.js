var MapboxClient = require('mapbox');
var fs = require('fs');
var client = new MapboxClient("sk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiY2piNm1tOGwxMG9lajMzcXBlZDR4aWVjdiJ9.Z1Jq4UAgGpXukvnUReLO1g");
client.createUploadCredentials(function(err, credentials) {
    var AWS = require('aws-sdk');
    var s3 = new AWS.S3({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
        region: 'us-east-1'
    });
    s3.putObject({
        Bucket: credentials.bucket,
        Key: credentials.key,
        Body: fs.createReadStream('/home/biopama/public_html/beta/wireframes/mapbox-sdk-js/planning_units_3857.zip')
    }, function(err, resp) {
        client.createUpload({
            tileset: ["blishten", 'mytileset'].join('.'),
            url: credentials.url
        }, function(err, upload) {
            var progressPoller = setInterval(function() {
                client.readUpload(upload.id, function(err, upload) {
                    console.log(upload);
                    if (upload.progress === 1) {
                        clearInterval(progressPoller);
                        console.log("done!");
                    }
                });
            }, 10000);
            console.log("outside loop");
        });
    });
});
