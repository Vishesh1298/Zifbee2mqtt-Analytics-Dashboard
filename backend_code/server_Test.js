const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const mqtt = require('mqtt');

const app = express();
const port = 3000; // Choose a suitable port

const db = pgp({
    connectionString: 'postgres://postgres:password@localhost:5432/Zigbee2mqtt_DB',
    ssl: process.env.NODE_ENV === 'production',
  
});

const mqttClient = mqtt.connect('mqtt://localhost');

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

mqttClient.on('error', (error) => {
  console.error('MQTT Connection Error:', error);
});

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


  
  //API endpoint to manually trigger a state and write to the database
  app.post('/api/trigger-state', async (req, res) => {
    try {
      const { device_id, state } = req.body;
  
      // Publish the state to MQTT topic
      mqttClient.publish(`zigbee2mqtt/${device_id}/set`, JSON.stringify({ state }));
  
      // Insert the state into the database
      await db.none('INSERT INTO device_states (device_id, state) VALUES ($1, $2)', [device_id, state]);
  
      res.json({ success: true, message: 'State triggered and data written to the database' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  // Get all device states
app.get('/api/device-states', async (req, res) => {
    try {
      const deviceStates = await db.any('SELECT * FROM device_states');
      res.json(deviceStates);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
