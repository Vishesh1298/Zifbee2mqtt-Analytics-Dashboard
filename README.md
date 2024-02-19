# Zigbee2mqtt Analytics Dashboard

This project is an analytics dashboard designed specifically for the Zigbee2mqtt protocol. It provides a centralized platform for aggregating, analyzing, and visualizing data from Zigbee2mqtt-enabled devices.

## Installation

To run the Zigbee2mqtt analytics dashboard, you'll need to install the following dependencies:

- Node.js 
- PostgreSQL 
- MQTT broker (e.g., Mosquitto)
- ThingSpeak account (for real-time data visualization)

## Setup

1. **Download and install Node-RED:**

   - Visit the Node-RED website: [Node-RED](https://nodered.org/docs/getting-started/installation)
   - Follow the installation instructions for your operating system.

2. **Import the flows file into Node-RED:**

   - Open Node-RED in your web browser (usually at http://localhost:1880).
   - Click on the menu icon in the top right corner.
   - Select "Import" > "Clipboard".
   - Paste the contents of the `flows.json` file into the text area.
   - Click "Import" to import the flows.

3. **Setup Mosquitto MQTT broker:**

   - Install Mosquitto if you haven't already (visit the [Mosquitto website](https://mosquitto.org/download/) for instructions).
   - Start the Mosquitto broker using the appropriate command for your operating system.

4. **Setup PostgreSQL database:**

   - Create a new database for the Zigbee2mqtt analytics dashboard.
   - Configure the database connection settings in the server.js file to connect to your PostgreSQL database.



## Running the Dashboard

1. **Start Node-RED:**
   - Start Node-RED by running the appropriate command for your operating system.
   - Navigate to the directory where Node-RED is installed.
   - Run the command to start Node-RED. For example:
     ```
     node-red
     ```
   

2. **Run the server.js file:**
   - Navigate to the `Supporting` directory of the cloned repository.
   - Start the Node.js server by running the following command:

     ```
     node server.js
     ```

3. **Trigger devices on Node-RED:**
   - Use the Node-RED dashboard to trigger devices and send MQTT messages.

4. **Watch and visualize output in ThingSpeak:**
   - Visit the public ThingSpeak channel at https://thingspeak.com/channels/2428636 to view and visualize the data in real-time.
