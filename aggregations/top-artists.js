const topArtistsPipeline = [
  {
    $group: {
      _id: "$artist",
      totalSongs: { $sum: 1 }
    }
  },
  {
    $sort: { totalSongs: -1 }
  },
  {
    $limit: 5
  },
  {
    $lookup: {
      from: "artists",
      localField: "_id",
      foreignField: "_id",
      as: "artistDetails"
    }
  },
  {
    $project: {
      _id: 0,
      artistId: "$_id",
      totalSongs: 1,
      artistName: { $arrayElemAt: ["$artistDetails.name", 0] },
      genre: { $arrayElemAt: ["$artistDetails.genre", 0] }
    }
  }
];

module.exports = topArtistsPipeline;