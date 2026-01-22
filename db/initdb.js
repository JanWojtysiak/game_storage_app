const { Client } = require("pg");
const connectionString = process.argv[2];
const SQL = `CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    rating DECIMAL(3, 1)
);

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE developers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


CREATE TABLE games_genres (
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, genre_id)
);

CREATE TABLE games_developers (
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    developer_id INTEGER REFERENCES developers(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, developer_id)
);`;

async function main() {
  if (!connectionString) {
    console.error("Error, you need to pass an argument");
    process.exit(1);
  }
  console.log("seeding...");
  const client = new Client({
    connectionString: connectionString,
  });
  try {
    await client.connect();
    await client.query(SQL);
  } catch (err) {
    console.error(err.message);
  } finally {
    console.log("done");
    await client.end();
  }

  main();
}
