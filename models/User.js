const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    loginCount: {type: Number, default: 0},
    createdAt: { type: Date, default: Date.now},
    role: {
      type: String,
      enum: ['user','admin'],
      default: 'user'
    },
    //Relationship: User -> liked Songs
    likedSongs: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'Song'
    }]
  },
  { timestamps: true}
);

// PASSWORD HASHING HOOK
userSchema.pre("save", async function () {
  console.log("HOOK RUNNING");

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User',userSchema)