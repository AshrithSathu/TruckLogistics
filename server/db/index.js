const { Pool } = require("pg");

const pool = new Pool();

// Exporting the query function using module.exports
module.exports.query = (text, params) => pool.query(text, params);
