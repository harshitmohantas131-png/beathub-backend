const express = require('express');
const router = express.Router();

const Song = require('../models/Song');
const Playlist = require('../models/Playlist');

const topArtistsPipeline = require('../aggregations/top-artists');
const userActivityPipeline = require('../aggregations/user-activity');

router.get('/top-artists', async (req, res) => {
  try {
    const data = await Song.aggregate(topArtistsPipeline);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching top artists" });
  }
});

router.get('/most-active-users', async (req, res) => {
  try {
    const data = await Playlist.aggregate(userActivityPipeline);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

module.exports = router;