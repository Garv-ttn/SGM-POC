const router = require("express").Router();
const cfg = require("../controllers/cfg.controller.js");

router.get("/", cfg.getAll);
router.get("/:id", cfg.getOne);
router.post("/", cfg.addNew);
router.put("/:id", cfg.editOne);
router.delete("/:id", cfg.delete);

module.exports = router;
