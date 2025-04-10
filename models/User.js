const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name required!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email required!"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password required!"],
      trim: true,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isMatchPassword = async function (ps) {
  return await bcrypt.compare(ps, this.password);
};

module.exports = mongoose.model("User", userSchema);
