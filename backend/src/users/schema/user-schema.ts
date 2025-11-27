import mongoose, { Schema } from 'mongoose';

const userSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
//schema for the users collection

export const User = mongoose.model('User', userSchema);
//creates the user model, allowing to make operations like create, find, etc. Also creates the "users" collection
