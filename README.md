# BeatHub Backend

This repository contains the backend data layer for the BeatHub music streaming application.

## Setup Instructions

1. Install dependencies:
npm install

2. Create a `.env` file and add:
MONGO_URI=<your MongoDB connection string>

3. Run the seed script:
node scripts/seed.js

If the script logs "Seeding Complete!", the database has been populated successfully.

Live Deployment URL:
https://beathub-backend-1.onrender.com

Swagger Documentation URL:
https://beathub-backend-1.onrender.com/api-docs

GitHub Repository:
https://github.com/harshitmohantas131-png/beathub-backend

Required Environment Variables:
PORT
MONGO_URI

Local Setup:
npm install
npm start