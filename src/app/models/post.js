import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user"
    }
});

mongoose.models = {};
export const Post = mongoose.model("post", postSchema);
