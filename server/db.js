const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => console.log('Connected successfully'))
  .catch(e => console.error('Error connecting to the database:', e.stack))
  .finally(() => client.end());
