var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');


var app = express();
app.use(express.static(__dirname + '/../client/dist'));

console.log('listening on port 3000');
app.listen(3000);