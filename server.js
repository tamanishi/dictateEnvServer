const path = require('path');
const ENV_PATH = path.join(__dirname, '.env');
require('dotenv').config({path: ENV_PATH});
var fs = require('fs');
var express = require('express');
var googlehome = require('google-home-notifier');
var bodyParser = require('body-parser');
var app = express();
const serverPort = 8080;
var exec = require('child_process').exec;
let Voicetext = require('voicetext');
var voice = new Voicetext(process.env.VOICETEXT_APIKEY);

let deviceName = 'Google Home';
googlehome.device(deviceName, 'ja');

let urlencodedParser = bodyParser.urlencoded({ extended: false });

let cmd = process.env.CMD;
let serverUrl = process.env.SERVERURL;

app.use(express.static(path.join(__dirname, '/audio')));

app.post('/google-home-notifier', urlencodedParser, (req, res) => {
  try {
    exec(cmd, (err, stdout, stderr) => {
      let text;
      if(err){
        text = "温湿度情報の計測に失敗しました。";
      } else {
        let envObj = JSON.parse(stdout);
        text = "現在の温度は" + envObj.t + "度。湿度は" + envObj.h + "パーセント。気圧は" + envObj.p + "ヘクトパスカルです。";
      }
      voice
      .speaker(voice.SPEAKER.HIKARI)
      .speak(text, (err, buf) => {
        if(err)console.error(err);
        fs.writeFile(__dirname + '/audio/text.wav', buf, 'binary', (err) => {
          if(err)console.log(err);
        });
      });
//      googlehome.notify(text, () => {});
      googlehome.play(serverUrl + '/text.wav', () => {});
      res.status(200);
      res.send(text);
    });
  } catch(err) {
    let text = "何かしらエラーが発生しました。";
    console.error(err);
    res.status(500);
    res.send(err);
    googlehome.notify(text, () => {});
  }
});

app.listen(serverPort);

