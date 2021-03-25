require('console-stamp')(console, '[HH:MM:ss.l]');

console.log('Application started.');

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const mqtt = require('mqtt');
const mqttServer = process.env.MQTTServer || 'mqtt://test.mosquitto.org';
const topic = process.env.MQTTTopic || 'speedtest';

async function runTest() {
	const {stdout, stderr} = await exec('speedtest-cli --json');
	if (stderr)
		console.error(stderr);
	const o = JSON.parse(stdout);
	return o;
}

function sendMQTT(ping, download, upload, o) {
	const client  = mqtt.connect(mqttServer)
	client.on('connect', function () {
		client.subscribe(topic, function (err) {
			if (!err) {
				console.log(`Sending messages to ${mqttServer} on topic ${topic}/+.`);
				client.publish(`${topic}/download`, download.toString());
				client.publish(`${topic}/upload`, upload.toString());
				client.publish(`${topic}/ping`, ping.toString());
				client.publish(`${topic}/complete`, JSON.stringify(o));
			} else {
				console.error(err);
			}
		})
	})
}

console.log(`Running test.`);
const d = await runTest();
sendMQTT(d.ping, d.download, d.upload, d);
