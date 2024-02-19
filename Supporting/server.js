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
    // Console transport for logging to console
    new winston.transports.Console(),
    // File transport for error logs
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // File transport for combined logs
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

// MQTT client connection event
mqttClient.on('connect', () => {
  logger.info('Connected to MQTT broker');
  // Subscribe to the topic where simulated devices will publish messages
  mqttClient.subscribe('zigbee2mqtt');
});

// Database connection test
db.one('SELECT $1 AS value', 123)
  .then(data => {
    logger.info('Database connection test successful:', data.value);
  })
  .catch(error => {
    logger.error('Error connecting to the database:', error);
  });

// MQTT message event handler
mqttClient.on('message', async (topic, message) => {
  try {
    logger.info(`Received message on topic ${topic}: ${message}`);
    const payload = JSON.parse(message);
    const device_id = payload.device_id;
    const state = payload.state;
    const mode = payload.mode;

    if (payload.topic.includes('Switch')) {
      logger.info(`Switch ${device_id} state is set to ${state}`);
      // Insert the state into the switch_logs table
      await db.none('INSERT INTO switch_logs (switch_id, state) VALUES ($1, $2)', [device_id, state]);
      // Update ThingSpeak with switch state data
      const apiKeySwitch = 'WY8GUTDC6GUR9ZS5'; // Replace with your ThingSpeak Write API Key for the switch
      const fieldNumberSwitch = 2;
      let switchStateNumber = 0;
      if (state === 'on') {
        switchStateNumber = 1;
      }
      await axios.post(`https://api.thingspeak.com/update.json?api_key=${apiKeySwitch}&field${fieldNumberSwitch}=${switchStateNumber}`);
    } else if (payload.topic.includes('Thermostat')) {
      logger.info(`Thermostat ${device_id} temperature is set to ${state} in mode ${mode}`);
      // Insert the state into the thermostat_logs table
      await db.none('INSERT INTO thermostat_logs (thermostat_id, temperature, mode) VALUES ($1, $2, $3)', [device_id, state, mode]);
      // Update ThingSpeak with thermostat temperature data
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

// API endpoint to retrieve device states
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

// Start the server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});