import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: [6, "Password too short"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

mongoose.models = {};
export const User = mongoose.model("user", UserSchema);
