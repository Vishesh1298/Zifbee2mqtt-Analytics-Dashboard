const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const mqtt = require('mqtt');

const app = express();
const port = 3010; // Choose a suitable port

const db = pgp({
  connectionString: 'postgres://postgres:password@localhost:5432/Zigbee2mqtt_DB',
  ssl: process.env.NODE_ENV === 'production',
});

const mqttClient = mqtt.connect('mqtt://localhost:1883');

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Subscribe to the topic where simulated devices will publish messages
  mqttClient.subscribe('zigbee2mqtt');

});

db.one('SELECT $1 AS value', 123)
  .then(data => {
    console.log('Database connection test successful:', data.value);
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });

mqttClient.on('message', async (topic, message) => {
  // Handle incoming MQTT messages here
  console.log(`Received message on topic ${topic}: ${message}`);

  // Extract device_id, state, and mode from the message and handle them as needed
  try {
    const payload = JSON.parse(message);
    const device_id = payload.device_id;
    const state = payload.state;
    const mode = payload.mode;

    // Log the extracted information based on device type
    if (payload.topic.includes('Switch')) {
      console.log(`Switch ${device_id} state is set to ${state}`);
      // Insert the state into the switch_logs table
      await db.none('INSERT INTO switch_logs (switch_id, state) VALUES ($1, $2)', [device_id, state]);
    } else if (payload.topic.includes('Thermostat')) {
      console.log(`Thermostat ${device_id} temperature is set to ${state} in mode ${mode}`);
      // Insert the state into the thermostat_logs table
      await db.none('INSERT INTO thermostat_logs (thermostat_id, temperature, mode) VALUES ($1, $2, $3)', [device_id, state, mode]);
    }

    console.log(`Inserted into the database successfully.`);
  } catch (error) {
    console.error('Error handling MQTT message:', error);
  }
});

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get all device states from switch_logs and thermostat_logs tables
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
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
