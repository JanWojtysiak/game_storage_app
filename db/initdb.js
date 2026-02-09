const db = require("./db");

const SQL = `
DROP TABLE IF EXISTS games, genres, developers, games_genres, games_developers CASCADE;
CREATE TABLE games (
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
  console.log("seeding...");

  try {
    // Używamy db.query, co automatycznie pobiera połączenie z puli
    await db.query(SQL);
    console.log("Success: Tables created.");
  } catch (err) {
    console.error("Error executing query:", err.message);
  } finally {
    // Zamykamy wszystkie połączenia w puli, aby skrypt mógł się zakończyć
    await db.end();
    console.log("done");
  }
}

main();
