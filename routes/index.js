var router = require("express").Router();
var viewsRoutes = require("./views");

router.use("/views", viewsRoutes);

module.exports = router;