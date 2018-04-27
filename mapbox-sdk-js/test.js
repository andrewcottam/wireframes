var MapboxClient = require('mapbox');
var fs = require('fs');
var events = require('events');
var client = new MapboxClient("sk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiY2piNm1tOGwxMG9lajMzcXBlZDR4aWVjdiJ9.Z1Jq4UAgGpXukvnUReLO1g");
var id;

var eventEmitter = new events.EventEmitter();
var myEventHandler = function () {
  console.log('The upload has finished');
};
eventEmitter.on('uploaded', myEventHandler);

uploadTileset('/home/biopama/public_html/beta/wireframes/mapbox-sdk-js/planning_units_3857.zip');

function uploadTileset(filename) {
    //get the Amazon S3 credentials
    client.createUploadCredentials(uploadToS3.bind(filename));
}

function uploadToS3(err, credentials) {
    var AWS = require('aws-sdk');
    var s3 = new AWS.S3({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
        region: 'us-east-1'
    });
    //upload the local file to Amazon S3
    s3.putObject({
        Bucket: credentials.bucket,
        Key: credentials.key,
        Body: fs.createReadStream(this.valueOf())
    }, uploadedToMapBox.bind(credentials));
}

function uploadedToMapBox(err, resp) {
    //upload this S3 file to a Mapbox tileset
    client.createUpload({
        tileset: ["blishten", 'mytileset'].join('.'),
        url: this.url
    }, pollUpload);
}

//poll the job to see when it is done
function pollUpload(err, upload) {
    id = setInterval(poller.bind(upload), 1000);
}

//this runs at every interval specified in setInterval
function poller() {
    client.readUpload(this.id, getUpdate);
}

function getUpdate(err, upload) {
    if (upload.progress === 1) {
        clearInterval(id);
        eventEmitter.emit('uploaded');
    }
}
