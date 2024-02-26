# Zigbee2mqtt Analytics Dashboard

## Overview

The Zigbee2mqtt Analytics Dashboard is a centralized platform designed to aggregate, analyze, and visualize data from Zigbee2mqtt-enabled devices. It provides insights into device behavior, trends, and anomalies, empowering users to make data-driven decisions in IoT deployments.

## Project Description

This project aims to address the challenges faced in managing and visualizing data from Zigbee2mqtt-enabled devices by providing a comprehensive analytics solution. The dashboard offers real-time monitoring, historical data analysis, and interactive visualizations, enhancing the usability and effectiveness of Zigbee2mqtt-based IoT systems.

## Features

- Real-time monitoring of device states and activities.
- Historical data analysis for trend identification and anomaly detection.
- Interactive visualizations for intuitive data exploration.
- Scalable architecture to accommodate growing numbers of devices.
- Integration with external services such as ThingSpeak for real-time data visualization.

## Dependencies

To run the Zigbee2mqtt Analytics Dashboard, you'll need the following dependencies:

- Node.js
- PostgreSQL
- MQTT broker (e.g., Mosquitto)
- ThingSpeak account (for real-time data visualization)

## Configuration

Before running the dashboard, ensure you configure the following settings:

- MQTT broker connection settings (e.g., host, port, username, password)
- PostgreSQL database connection settings (e.g., host, port, database name, username, password)
- ThingSpeak API key for data visualization integration

## Installation and Setup

### Prerequisites

Ensure you have the necessary dependencies installed on your system.

### Installation Steps

1. Download and install Node-RED from [Node-RED website](https://nodered.org/docs/getting-started/installation).
2. Import the Node-RED flows file (`flows.json`) located in the `Node-RED_Flows` directory.
3. Start the Mosquitto MQTT broker.
4. Start the PostgreSQL database server.
5. Navigate to the `Supporting` directory and install dependencies using `npm install`.
6. Start the Node.js server by running `node server.js`.
7. Use the Node-RED dashboard to trigger devices and send MQTT messages.
8. Visualize data in real-time on the public ThingSpeak channel.

## Usage

Once the dashboard is set up, you can navigate the interface to monitor device states, analyze historical data, and explore visualizations. Use the provided controls to interact with devices and view real-time updates.

- Visit the public ThingSpeak channel at https://thingspeak.com/channels/2428636 to view and visualize the data in real-time.



