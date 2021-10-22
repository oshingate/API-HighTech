let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
// const Profile = require('./Profile');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: { type: String },
  address: { type: String, default: null },
  profilePhoto: { type: String, default: null },
});

userSchema.pre('save', async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    let result = await bcrypt.compare(password, this.password);

    return result;
  } catch (error) {
    return error;
  }
};

userSchema.methods.createToken = async function (password) {
  try {
    let payload = {
      username: this.username,
      email: this.email,
      profilePhoto: this.profilePhoto,
    };

    let token = await jwt.sign(payload, process.env.TOKEN_SECRET);

    return token;
  } catch (error) {
    return error;
  }
};

let User = mongoose.model('User', userSchema);

module.exports = User;
