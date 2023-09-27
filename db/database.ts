import mongoose from 'mongoose';

const connectDB = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/omniMix');
};
connectDB();

interface IUser {
  email: string;
  hash: string;
  salt: string;
  access_token: string;
  refresh_token: string;
  spotify_id: string;
  deleted: boolean;
}

type UserModel = mongoose.Model<IUser, object>;

const usersSchema = new mongoose.Schema<IUser, UserModel>({
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
  spotify_id: String,
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
