import { NextResponse } from "next/server";
import { Post } from "../../../models/post";
import { mongoConnect } from "../../../utils/feature";
import { User } from "../../../models/user";

export async function GET(req){
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }
    try{
        // const id = await checkAuth();
        await mongoConnect();
        const value = await Post.findById(id);
        const value1 = await User.findById(value.user).populate();
        if (!value) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
        return NextResponse.json({data:value,user:value1,success:true},{status:200})
    }
    catch(e){
        return NextResponse.json({message: "Internal Server Error"},{status:500})
    }
}