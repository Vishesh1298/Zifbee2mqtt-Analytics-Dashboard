const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const mqtt = require('mqtt');
const axios = require('axios');
const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

const app = express();
const port = 3010; // Choose a suitable port

const db = pgp({
  connectionString: 'postgres://postgres:password@localhost:5432/Zigbee2mqtt_DB',
  ssl: process.env.NODE_ENV === 'production',
});

const mqttClient = mqtt.connect('mqtt://localhost:1883');

mqttClient.on('connect', () => {
  logger.info('Connected to MQTT broker');
  mqttClient.subscribe('zigbee2mqtt');
});

db.one('SELECT $1 AS value', 123)
  .then(data => {
    logger.info('Database connection test successful:', data.value);
  })
  .catch(error => {
    logger.error('Error connecting to the database:', error);
  });

mqttClient.on('message', async (topic, message) => {
  try {
    logger.info(`Received message on topic ${topic}: ${message}`);
    const payload = JSON.parse(message);
    const device_id = payload.device_id;
    const state = payload.state;
    const mode = payload.mode;

    if (payload.topic.includes('Switch')) {
      logger.info(`Switch ${device_id} state is set to ${state}`);
      await db.none('INSERT INTO switch_logs (switch_id, state) VALUES ($1, $2)', [device_id, state]);
      const apiKeySwitch = 'WY8GUTDC6GUR9ZS5'; // Replace with your ThingSpeak Write API Key for the switch
      const fieldNumberSwitch = 2;
      let switchStateNumber = 0;
      if (state === 'on') {
        switchStateNumber = 1;
      }
      await axios.post(`https://api.thingspeak.com/update.json?api_key=${apiKeySwitch}&field${fieldNumberSwitch}=${switchStateNumber}`);
    } else if (payload.topic.includes('Thermostat')) {
      logger.info(`Thermostat ${device_id} temperature is set to ${state} in mode ${mode}`);
      await db.none('INSERT INTO thermostat_logs (thermostat_id, temperature, mode) VALUES ($1, $2, $3)', [device_id, state, mode]);
      const apiKey = 'WY8GUTDC6GUR9ZS5'; // Replace with your ThingSpeak Write API Key
      const fieldNumber = 1;
      await axios.post(`https://api.thingspeak.com/update.json?api_key=${apiKey}&field${fieldNumber}=${state}`);
    }

    logger.info('Inserted into the database successfully.');
  } catch (error) {
    logger.error('Error handling MQTT message:', error);
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/device-states', async (req, res) => {
  try {
    const switchLogs = await db.any('SELECT * FROM switch_logs');
    const thermostatLogs = await db.any('SELECT * FROM thermostat_logs');
    const allDeviceStates = {
      switch_logs: switchLogs,
      thermostat_logs: thermostatLogs,
    };
    res.json(allDeviceStates);
  } catch (error) {
    logger.error('Error retrieving device states:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
