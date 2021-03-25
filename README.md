Image that runs speedtest and sends download, upload and ping to a defined topic on a defined mqtt-server.

Build image: 
    sudo docker build -t obrut/speedtest-mqtt .

Start container:
    docker run obrut/speedtest:latest -e MQTTServer="mqtt://test.mosquitto.org" -e MQTTTopic="speedtest"

Read more about MQTT here https://mosquitto.org/ and SpeedTest here https://www.speedtest.net/apps/cli

Sorry, no tests, no nothing at the moment.