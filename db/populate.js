const db = require("./db");

async function getAllGames() {
  const query = `
            SELECT 
                games.id, 
                games.title, 
                games.rating,
                ARRAY_AGG(DISTINCT genres.name) AS genres,
                ARRAY_AGG(DISTINCT developers.name) AS developers
            FROM games
            LEFT JOIN games_genres ON games.id = games_genres.game_id
            LEFT JOIN genres ON games_genres.genre_id = genres.id
            LEFT JOIN games_developers ON games.id = games_developers.game_id
            LEFT JOIN developers ON games_developers.developer_id = developers.id
            GROUP BY games.id;
        `;

  const { rows } = await db.query(query);
  return rows;
}

module.exports = { getAllGames };
