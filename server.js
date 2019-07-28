const path = require('path');
const ENV_PATH = path.join(__dirname, '.env');
require('dotenv').config({path: ENV_PATH});
var express = require('express');
var googlehome = require('google-home-notifier');
var bodyParser = require('body-parser');
var app = express();
const serverPort = 8080;
var exec = require('child_process').exec;

var deviceName = 'Google Home';
googlehome.device(deviceName, 'ja');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

let cmd = process.env.CMD;

app.post('/google-home-notifier', urlencodedParser, (req, res) => {
  try {
//    console.log("ENV_PATH : " + ENV_PATH);
//    console.log("cmd : " + cmd);
    exec(cmd, (err, stdout, stderr) => {
      let text;
      if(err){
        text = "温湿度情報の計測に失敗しました。";
      } else {
        let envObj = JSON.parse(stdout);
        text = "現在の温度は" + envObj.t + "度。湿度は" + envObj.h + "パーセント。気圧は" + envObj.p + "ヘクトパスカルです。";
      }
      googlehome.notify(text, () => {});
      res.sendStatus(200);
      res.send();
    });
  } catch(err) {
    let text = "何かしらエラーが発生しました。";
    console.log(err);
    res.sendStatus(500);
    res.send(err);
    googlehome.notify(text, () => {});
  }
});

app.listen(serverPort);

