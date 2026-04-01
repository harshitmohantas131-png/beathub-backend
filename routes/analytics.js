const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const Song = require('../models/Song');
const Playlist = require('../models/Playlist');

const topArtistsPipeline = require('../aggregations/top-artists');
const userActivityPipeline = require('../aggregations/user-activity');


// 🔐 ADMIN ONLY
router.get(
  '/top-artists',
  authenticate,
  authorize('admin'),   // 👈 IMPORTANT
  async (req, res) => {
    const results = await Song.aggregate(topArtistsPipeline);

    res.status(200).json({
      success: true,
      data: results
    });
  }
);


// 🔐 ADMIN ONLY
router.get(
  '/most-active-users',
  authenticate,
  authorize('admin'),   // 👈 IMPORTANT
  async (req, res) => {
    const results = await Playlist.aggregate(userActivityPipeline);

    res.status(200).json({
      success: true,
      data: results
    });
  }
);

module.exports = router;