require('dotenv').config();
var express = require('express');
var googlehome = require('google-home-notifier');
// var ngrok = require('ngrok');
var bodyParser = require('body-parser');
var app = express();
const serverPort = 8080;
var exec = require('child_process').exec

var deviceName = 'Google Home';
googlehome.device(deviceName, 'ja');
// googlehome.accent('uk'); // uncomment for british voice

var urlencodedParser = bodyParser.urlencoded({ extended: false });

let cmd = process.env.CMD;

app.post('/google-home-notifier', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  console.log(req.body);
  var text = req.body.text;
  if (text){
    try {
      googlehome.notify(text, function(notifyRes) {
        console.log(notifyRes);
        res.send(deviceName + ' will say: ' + text + '\n');
        exec(cmd, (err, stdout, stderr) => {
          if(err){
            console.log(err);
          }
          console.log(stdout);
        });
      });
    } catch(err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  }else{
    res.send('Please POST');
  }

})

app.listen(serverPort, function () {
  console.log('curl -X POST -d "text=Hello World" http://localhost:' + serverPort + '/google-home-notifier');
});
