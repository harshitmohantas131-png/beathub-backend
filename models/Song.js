const mongoose = require('mongoose');
const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: Number,
      required: true
    },
    //Relationship: Song -> Artist
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true
    },
    //Relationship: Song -> Album
    album:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      required: true
    }
  },
  { timestamps: true}
);
module.exports = mongoose.model('Song', songSchema);