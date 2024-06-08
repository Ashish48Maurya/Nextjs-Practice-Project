import { NextResponse } from "next/server";
import { checkAuth } from "../../../utils/feature";

export async function GET(req){
    try{
        const id = await checkAuth(req);
        if(!id){
            return NextResponse.json({message:'Login First'},{status:401})
        }
        return NextResponse.json({cloudName:`${process.env.CLOUD_NAME}`,success:true, cloudID:`${process.env.CLOUD_ID}`},{status:200})
    }
    catch(err){
        return NextResponse.json({message:`Internal Server Error ${err.message}}`},{status:401})
    }
}