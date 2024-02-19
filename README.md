
# Zigbee2mqtt Analytics Dashboard

## Overview

This project is an analytics dashboard designed specifically for the Zigbee2mqtt protocol. It provides a centralized platform for aggregating, analyzing, and visualizing data from Zigbee2mqtt-enabled devices.

## Folder Contents

- **Node-RED_Flows**: Contains the Node-RED flows configuration file (`flows.json`) for importing into Node-RED to set up the dashboard.
- **Supporting**: Contains server-side Node.js code (`server.js`) for handling MQTT messages, interacting with the PostgreSQL database, and serving the dashboard.
- **Database**: Placeholder directory for PostgreSQL database scripts and configuration files (not included in this repository).

## Installation and Setup

### Prerequisites

Before running the dashboard, ensure you have the following dependencies installed:

- Node.js 
- PostgreSQL 
- MQTT broker (e.g., Mosquitto)
- ThingSpeak account (for real-time data visualization)

### Installation Steps

1. **Download and install Node-RED:**

   - Visit the Node-RED website: [Node-RED](https://nodered.org/docs/getting-started/installation)
   - Follow the installation instructions for your operating system.

2. **Import the flows file into Node-RED:**

   - Open Node-RED in your web browser (usually at http://localhost:1880).
   - Click on the menu icon in the top right corner.
   - Select "Import" > "Clipboard".
   - Paste the contents of the `flows.json` file from the `Node-RED_Flows` directory into the text area.
   - Click "Import" to import the flows.

3. **Start Mosquitto MQTT broker:**

   - Install Mosquitto if you haven't already (visit the [Mosquitto website](https://mosquitto.org/download/) for instructions).
   - Start the Mosquitto broker using the appropriate command for your operating system.

4. **Start PostgreSQL database:**

   - Start the PostgreSQL database server using the appropriate command for your operating system.

5. **Run the server.js file:**

   - Navigate to the `Supporting` directory of the cloned repository.
   - Install dependencies by running `npm install`.
   - Start the Node.js server by running the following command:

     ```
     node server.js
     ```

6. **Trigger devices on Node-RED:**

   - Use the Node-RED dashboard to trigger devices and send MQTT messages.

7. **Watch and visualize output in ThingSpeak:**

   - Visit the public ThingSpeak channel at https://thingspeak.com/channels/2428636 to view and visualize the data in real-time.
