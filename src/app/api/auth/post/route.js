import { NextResponse, NextRequest } from "next/server";
import { Post } from "../../../models/post";
import { mongoConnect, checkAuth } from "../../../utils/feature";


export async function GET() {
  try {
    await mongoConnect();
    const posts = await Post.find({}).populate('user');
    return NextResponse.json({ data: posts, success: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: `Internal Server Error ${e.message}` }, { status: 500 });
  }
}

export async function POST(req) {
  const body = await req.json();
  const { title, desc, file } = body;
  
  if (!title || !desc || !file) {
    return NextResponse.json({ message: "All Fields Are Required" }, { status: 400 });
  }
  try {
    const id = await checkAuth(req);
    if (!id) {
      return NextResponse.json({ message: "Unauthorized, Login First" }, { status: 401 });
    }

    await mongoConnect();
    const newPost = new Post({
      title,
      file,
      desc,
      user: id,
    });

    const post = await newPost.save();
    return NextResponse.json({ data: post, success: true, message: "Post Added" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: `Internal Server Error: ${e.message}` }, { status: 500 });
  }
}

export async function PUT(req){
  const body = await req.json();
  const post_id = new URL(req.url).searchParams.get('id');
  const { title, desc, file } = body;
  if (!title || !desc || !file) {
    return NextResponse.json({ message: "All Fields Are Required" }, { status: 400 });
  }
  try {
    const id = await checkAuth(req);
    if (!id) {
      return NextResponse.json({ message: "Unauthorized, Login First" }, { status: 401 });
    }

    await mongoConnect();
    const post = await Post.findByIdAndUpdate(post_id,{title,desc,file}, {new: true })
    return NextResponse.json({ data: post, success: true, message: "Post Added" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: `Internal Server Error: ${e.message}` }, { status: 500 });
  }
}