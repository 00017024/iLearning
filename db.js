const Pool = require('pg').Pool

const pool = new Pool({
    user: "postgres",
    password: "Firdavs786",
    host: "localhost",
    port: 5433,
    database: "forms"
});

module.exports = pool;