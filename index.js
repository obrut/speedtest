const util = require('util');
const exec = util.promisify(require('child_process').exec);
const mqtt = require('mqtt');
const cron = require('node-cron');
const schedule = process.env.CronSchedule || '* 15 * * *';
const mqttServer = process.env.MQTTServer || 'mqtt://test.mosquitto.org';
const topic = process.env.MQTTTopic || 'speedtest';

async function runTest() {
	const {stdout, stderr} = await exec('speedtest-cli --json');
	const o = JSON.parse(stdout);
	return o;
}

function sendMQTT(ping, download, upload) {
	const client  = mqtt.connect(mqttServer)
	client.on('connect', function () {
		client.subscribe(topic, function (err) {
			if (!err) {
				console.log(`Sending messages to ${mqttServer} on topic ${topic}/+.`);
				client.publish(`${topic}/download`, download.toString());
				client.publish(`${topic}/upload`, upload.toString());
				client.publish(`${topic}/ping`, ping.toString());
			}
		})
	})
}

cron.schedule(schedule, async () => {
	console.log(`Running according to schedule [${schedule}].`);
	const d = await runTest();
	sendMQTT(d.ping, d.download, d.upload);
})
