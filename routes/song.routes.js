const express = require("express");
const router = express.Router();
const songController = require("../controllers/song.controller");

// CREATE
router.post("/", songController.createSong);

// CURSOR PAGINATION (🔥 MUST BE BEFORE /:id)
router.get("/cursor", songController.getSongsCursor);

// GET ALL
router.get("/", songController.getAllSongs);

// GET ONE
router.get("/:id", songController.getSongById);

// UPDATE
router.put("/:id", songController.updateSong);

// DELETE
router.delete("/:id", songController.deleteSong);

module.exports = router;