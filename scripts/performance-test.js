require('dotenv').config();
const mongoose = require('mongoose');

const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const User = require('../models/User');

async function runTests() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log('\n1️⃣ Electronic songs sorted by duration');
  await Song.find({ genre: 'Electronic' })
    .sort({ duration: -1 });
  console.log('Query 1 executed');

  console.log('\n2️⃣ Songs after 2015');
  await Song.find({ releaseYear: { $gt: 2015 } })
    .sort({ releaseYear: -1 });
  console.log('Query 2 executed');

  console.log('\n3️⃣ Playlists by user');
  const playlist = await Playlist.findOne();
  if (playlist) {
    await Playlist.find({ user: playlist.user });
  }
  console.log('Query 3 executed');

  console.log('\n4️⃣ Songs by artist sorted by plays');
  const randomSong = await Song.findOne();
  if (randomSong) {
    await Song.find({ artist: randomSong.artist })
      .sort({ plays: -1 });
  }
  console.log('Query 4 executed');

  console.log('\n5️⃣ Active users');
  await User.find({ loginCount: { $gt: 100 } });
  console.log('Query 5 executed');

  process.exit(0);
}

runTests();