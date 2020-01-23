const util = require('util');
const exec = util.promisify(require('child_process').exec);
const mqtt = require('mqtt');

async function runTest() {
	const {stdout, stderr} = await exec('speedtest-cli --json');
	const o = JSON.parse(stdout);
	return o;
}

function sendMQTT(ping, download, upload) {
	var client  = mqtt.connect('mqtt://192.168.1.72')
	client.on('connect', function () {
		client.subscribe('broadband', function (err) {
			if (!err) {
				client.publish('broadband/download', download.toString());
				client.publish('broadband/upload', upload.toString());
				client.publish('broadband/ping', ping.toString());
			}
		})
	})
}

return runTest().then(d =>  { sendMQTT(d.ping, d.download, d.upload) });
