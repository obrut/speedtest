# Speedtest

Image that runs speedtest at a defined schedule and sends download, upload and ping to a defined topic on a defined mqtt-server.

## Build image: 
    `sudo docker build -t obrut69/speedtest .`

## Start container:
    `docker run obrut69/speedtest:latest -e MQTTServer="mqtt://test.mosquitto.org" -e MQTTTopic="speedtest" -e CronSchedule="0 0,6,12,18 * * *"`

## Or run:
    `node . --MQTTServer 'mqtt://test.mosquitto.org' --MQTTTopic 'speedtest' --CronSchedule '0 0,6,12,18 * * *'`

Read more about MQTT here https://mosquitto.org/ and SpeedTest here https://www.speedtest.net/apps/cli, minimist here https://github.com/substack/minimist and node-cron here https://github.com/node-cron/node-cron

Sorry, no tests, no nothing at the moment.