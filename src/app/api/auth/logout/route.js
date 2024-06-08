import { NextResponse } from "next/server"
import {cookieSetter} from "../../../utils/feature"
export async function GET(){
    const res = NextResponse.json({success:true, message:"LoggedOut Successfully"},{status:200})
    cookieSetter(res,'',false)
    return res;
}