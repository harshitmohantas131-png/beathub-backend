const userActivityPipeline = [
  {
    $group: {
      _id: "$user",
      playlistCount: { $sum: 1 }
    }
  },
  {
    $sort: { playlistCount: -1 }
  },
  {
    $limit: 5
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "userDetails"
    }
  },
  {
    $project: {
      _id: 0,
      userId: "$_id",
      playlistCount: 1,
      username: { $arrayElemAt: ["$userDetails.username", 0] },
      email: { $arrayElemAt: ["$userDetails.email", 0] }
    }
  }
];

module.exports = userActivityPipeline;