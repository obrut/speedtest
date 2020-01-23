const util = require('util');
const exec = util.promisify(require('child_process').exec);
const mqtt = require('mqtt');
const cron = require('node-cron');

async function runTest() {
	const {stdout, stderr} = await exec('speedtest-cli --json');
	const o = JSON.parse(stdout);
	return o;
}

function sendMQTT(ping, download, upload) {
	const noTopic = 'speedtest';
	const client  = mqtt.connect(process.env.MQTTServer)
	client.on('connect', function () {
		client.subscribe(process.env.MQTTTopic || noTopic, function (err) {
			if (!err) {
				client.publish(`${process.env.MQTTTopic || noTopic}/download`, download.toString());
				client.publish(`${process.env.MQTTTopic || noTopic}/upload`, upload.toString());
				client.publish(`${process.env.MQTTTopic || noTopic}/ping`, ping.toString());
			}
		})
	})
}

cron.schedule(process.env.CronSchedule, () => {
	return runTest().then(d =>  { sendMQTT(d.ping, d.download, d.upload) });
})
