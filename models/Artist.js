const mongoose = require('mongoose');
const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true,
    trim:true,
    unique:true
  },
  genre: {
    type: String,
    required: true,
    enum: ['Pop', 'Rock', 'HipHop', 'Jazz', 'Electronic']
  },
  bio: {
    type: String,
  },
  followers: {
    type: Number,
    default: 0
  },
  socialLinks: {
    twitter: String,
    instagram: String
  },
  //Relationships
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album'}],
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song'}]
},
{timestamps: true}
);
module.exports = mongoose.model('Artist', artistSchema);