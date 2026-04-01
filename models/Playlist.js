const mongoose = require('mongoose');
const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: { type: String},
  //Relationship: Playlist -> User
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  //Relationship: Playlist -> Songs
  songs: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Song',
  }],
  createdAt: {type: Date, default: Date.now}
},
{timestamps: true});
module.exports = mongoose.model('Playlist', playlistSchema);