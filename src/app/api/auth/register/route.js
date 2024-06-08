import { User } from "../../../models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { cookieSetter, generateToken, mongoConnect } from "../../../utils/feature";

export async function POST(req) {
    try {
        const body = await req.json();
        const { username, password, email } = body;

        if (!username || !password || !email) {
            return NextResponse.json({ message: "All Fields are Required" }, { status: 404 });
        }

        await mongoConnect();

        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({
                message: "User Already Exists with this email"
            }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            email
        });

        const person = await newUser.save();
        const token = generateToken(person._id);
        console.log(person)
        const response = NextResponse.json({ message: "Registration Successful", person, success:true }, { status: 201 });
        cookieSetter(response, token, true);
        return response;
    } catch (e) {
        return NextResponse.json({
            message: `Internal Server Error ${e}`
        }, { status: 500 });
    }
}
