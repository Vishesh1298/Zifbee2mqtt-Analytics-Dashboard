
### 5.1. API for Zigbee2mqtt:

#### 5.1.1. Install MQTT.js:

First, install the `mqtt` library, which is commonly used for MQTT communication in Node.js:

```bash
npm install mqtt
```

#### 5.1.2. Create MQTT Connection:

In your `server.js` file, set up an MQTT connection to Zigbee2mqtt. You can use the following example code:

```javascript
const mqtt = require('mqtt');

const mqttClient = mqtt.connect('mqtt://localhost'); // Adjust the MQTT broker URL if needed

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

mqttClient.on('error', (error) => {
  console.error('MQTT Connection Error:', error);
});
```

This code establishes a connection to your local MQTT broker (assuming Zigbee2mqtt is running on the same machine). Adjust the broker URL if Zigbee2mqtt is on a different host.

#### 5.1.3. Subscribe to Zigbee2mqtt Topics:

Subscribe to relevant Zigbee2mqtt topics to receive device data. Update the `mqttClient.on('connect', ...)` block:

```javascript
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Subscribe to Zigbee2mqtt topics
  mqttClient.subscribe('zigbee2mqtt/#');
});

mqttClient.on('message', (topic, message) => {
  // Handle incoming messages
  console.log('Received message from topic:', topic, 'Message:', message.toString());
  // Parse and store the data in your database
});
```

This code subscribes to all topics under 'zigbee2mqtt/' to capture all device-related messages.

### 5.2. Data Ingestion:

#### 5.2.1. Update Database Insertion Logic:

Extend the `mqttClient.on('message', ...)` block to parse and insert data into your PostgreSQL database:

```javascript
mqttClient.on('message', async (topic, message) => {
  // Handle incoming messages
  console.log('Received message from topic:', topic, 'Message:', message.toString());

  // Parse message and insert into the database
  const data = JSON.parse(message.toString());

  if (topic.startsWith('zigbee2mqtt/your_device_topic')) {
    // Insert data into the device_states table
    try {
      await db.none('INSERT INTO device_states (device_id, state) VALUES ($1, $2)', [data.device, data.state]);
    } catch (error) {
      console.error('Error inserting into device_states:', error);
    }
  }

  if (topic.startsWith('zigbee2mqtt/your_device_topic/events')) {
    // Insert data into the device_events table
    try {
      await db.none('INSERT INTO device_events (device_id, event_type) VALUES ($1, $2)', [data.device, data.event]);
    } catch (error) {
      console.error('Error inserting into device_events:', error);
    }
});
```

Replace `'your_device_topic'` with the actual topic or device ID you want to capture data for. Adjust the data parsing logic based on the actual structure of Zigbee2mqtt messages.

#### 5.2.2. Test:

Restart your Node.js server and test the data ingestion by manually triggering device actions in Zigbee2mqtt. Observe the console logs and check your PostgreSQL tables for the inserted data.

These additions will allow your backend to subscribe to Zigbee2mqtt topics and store device states and events in your PostgreSQL database. If you encounter any issues or have questions, feel free to ask!