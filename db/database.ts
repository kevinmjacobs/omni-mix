import mongoose from 'mongoose';

const connectDB = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/omniMix');
};
connectDB();

const usersSchema = new mongoose.Schema({
  email: String,
  hash: String,
  salt: String,
  access_code: String,
  state: String,
  deleted: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', usersSchema);

export {
  connectDB,
  User
};
