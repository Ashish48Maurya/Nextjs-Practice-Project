import { cookieSetter, generateToken, mongoConnect } from "../../../utils/feature";
import { User } from "../../../models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export async function POST(req) {
    const body = await req.json();
    const { password, email } = body;
    if (!password || !email) {
        return NextResponse.json({ message: "Invalid Email or Password" }, { status: 404 })
    }
    try {
        await mongoConnect();
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return NextResponse.json({
                message: "User not Exist with this email"
            }, { status: 404 })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = generateToken(user._id);
            const response = NextResponse.json({ message: "Login Successful", success:true, user }, { status: 201 });
            cookieSetter(response, token, true);
            return response;
        }
        return NextResponse.json({ message: "Incorrect email or password" }, { status: 404 })
    }
    catch (e) {
        return NextResponse.json({ message: e }, { status: 500 });
    }
}