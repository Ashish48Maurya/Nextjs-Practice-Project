const mongoose = require('mongoose');
const {serialize} =  require('cookie')
const jwt = require('jsonwebtoken')
export async function mongoConnect() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        // await mongoose.connect("mongodb://localhost:27017/blogify1");
        console.log("Connection Successful...");
    } catch (err) {
        console.error(err);
        throw new Error("MongoDB connection error");
    }
}

export const cookieSetter = (res, token, set) => {
    res.headers.append(
        "Set-Cookie",
        serialize("token", set ? token : "", {
            path: "/",
            httpOnly: true,
            maxAge: set ? 15 * 24 * 60 * 60 : 0, 
        })
    );
};

export const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET);
};

export const checkAuth = async (req) => {
    try {
        const isPresent = req.headers.get('cookie')?.includes('token');
        const token = req.headers.get('cookie').split("=")[1]
        if (isPresent) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YOURSECRETKKEYHERE');
            return decoded._id;
        }
        return null;
    } catch (err) {
        console.error('Token verification failed:', err);
        return null;
    }
};
