const populate = require("../db/populate");
const db = require("../db/db");
async function renderHomePage(req, res) {
  try {
    const games = await populate.getAllGames();
    res.render("index", {
      games: games,
    });
  } catch (err) {
    console.error("Controller error:", err.message);
    res.status(500).send("Error while loading games occured");
  }
}

async function createNew(req, res) {
  const { title, rating, genre, developer } = req.body;

  try {
    const gameRes = await db.query(
      "INSERT INTO games (title, rating) VALUES ($1, $2) RETURNING id",
      [title, rating],
    );
    const gameId = gameRes.rows[0].id;

    let genreId;
    const genreCheck = await db.query("SELECT id FROM genres WHERE name =$1", [
      genre,
    ]);
    if (genreCheck.rows.length > 0) {
      genreId = genreCheck.rows[0].id;
    } else {
      const newGenre = await db.query(
        "INSERT INTO genres (name) VALUES ($1) RETURNING id",
        [genre],
      );
      genreId = newGenre.rows[0].id;
    }

    let devId;
    const existingDev = await db.query(
      "SELECT id FROM developers WHERE name = $1",
      [developer],
    );
    if (existingDev.rows.length > 0) {
      devId = existingDev.rows[0].id;
    } else {
      const newDev = await db.query(
        "INSERT INTO developers (name) VALUES ($1) RETURNING id",
        [developer],
      );
      devId = newDev.rows[0].id;
    }
    await db.query(
      "INSERT INTO games_genres (game_id, genre_id) VALUES ($1, $2)",
      [gameId, genreId],
    );
    await db.query(
      "INSERT INTO games_developers (game_id, developer_id) VALUES ($1, $2)",
      [gameId, devId],
    );

    await db.query("COMMIT");
    res.redirect("/");
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err.message);
    res.status(500).send("Błąd podczas dodawania gry.");
  }
}

module.exports = { renderHomePage, createNew };
