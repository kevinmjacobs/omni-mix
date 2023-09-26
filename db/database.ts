import mongoose from 'mongoose';

const connectDB = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/omniMix');
};
connectDB();

const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  hash:  {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  access_token: String,
  refresh_token: String,
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
