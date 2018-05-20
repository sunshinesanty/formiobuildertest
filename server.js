
const express = require('express');
const app = express();
var path = require('path');

app.use('/vendor', express.static('node_modules'));
app.use('/app', express.static('dist'));
app.use('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/builder.html'));
});

app.listen(3030, () => console.log('Example app listening on port 3030!'));
