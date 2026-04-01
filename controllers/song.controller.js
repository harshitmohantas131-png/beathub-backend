const mongoose = require("mongoose");
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
    // 1. Get query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 2. Calculate skip
    const skip = (page - 1) * limit;

    // 3. Count total documents
    const totalDocuments = await Song.countDocuments();

    // 4. Fetch paginated songs
    const songs = await Song.find()
      .populate("artist album")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 5. Send response
    res.status(200).json({
      success: true,
      metadata: {
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit),
        totalDocuments,
        hasNext: page < Math.ceil(totalDocuments / limit),
        hasPrev: page > 1,
      },
      data: songs
    });

  } catch (error) {
    error.statusCode = 400;
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
const { encodeCursor, decodeCursor } = require('../utils/cursor');

exports.getSongsCursor = async (req, res) => {
  console.log("CURSOR API CALLED"); // 

  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const encodedCursor = req.query.cursor;

    let cursor = null;

    if (encodedCursor) {
  const decoded = decodeCursor(encodedCursor);

  // ✅ validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(decoded)) {
    return res.status(400).json({
      success: false,
      message: "Invalid cursor"
    });
  }

  cursor = decoded;
}
const query = cursor
  ? { _id: { $lt: new mongoose.Types.ObjectId(cursor) } }
  : {};

    const songs = await Song.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = songs.length > limit;

    if (hasMore) {
      songs.pop();
    }

    const nextCursor =
      hasMore && songs.length > 0
        ? encodeCursor(songs[songs.length - 1]._id)
        : null;

    res.status(200).json({
      success: true,
      data: songs,
      pagination: {
        nextCursor,
        hasMore,
        limit,
        count: songs.length
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};