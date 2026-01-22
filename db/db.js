const { Pool } = require("pg");

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL || "twoja_domyslna_baza",
});
