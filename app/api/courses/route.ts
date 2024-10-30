import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAuthorized } from "../utils/is-authorized";

export async function POST(req: Request) {
 try {
  const { userId } = isAuthorized();
  const { title } = await req.json();
  const course = await db.course.create({
   data: {
    userId,
    title,
   },
  });
  return NextResponse.json(course);
 } catch (error) {
  console.log("[COURSES]", error);
  return new NextResponse("Internal Error", { status: 500 });
 }
}
