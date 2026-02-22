const Song = require("../models/Song");

// CREATE
exports.createSong = async (req, res, next) => {
  try {
    const song = await Song.create(req.body);
    res.status(201).json(song);
  } catch (error) {
    error.statusCode=400;
    next(error);
  }
};

// GET ALL
exports.getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().populate("artist album");
    res.status(200).json(songs);
  } catch (error) {
    error.statusCode=400;
    next(error);
  }
};

// GET ONE
exports.getSongById = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json(song);
  } catch (error) {
    error.statusCode=400;
    next(error);
  }
};

// UPDATE
exports.updateSong = async (req, res, next) => {
  try {
    const updated = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    error.statusCode=400;
    next(error);
  }
};

// DELETE
exports.deleteSong = async (req, res, next) => {
  try {
    const deleted = await Song.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(204).send();
  } catch (error) {
    error.statusCode=400;
    next(error);
  }
};