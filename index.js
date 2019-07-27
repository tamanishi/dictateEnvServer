var googlehome = require('google-home-notifier');
var language = 'ja'; // if not set 'us' language will be used

googlehome.device('google home', language); // Change to your Google Home name
// or if you know your Google Home IP
googlehome.ip('192.168.10.102');

googlehome.notify('すなはら まさと です 7さいです 7しょうです', function(res) {
  console.log(res);
});
