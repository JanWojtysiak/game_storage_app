const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.renderHomePage);
indexRouter.post("/", indexController.createNew);
module.exports = indexRouter;
