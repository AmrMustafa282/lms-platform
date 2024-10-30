import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const isCourseOwner = async({ courseId, userId }:{courseId:string, userId :string}) => {
  await db.course.findUnique({
  where: { id: courseId, userId },
 });
 if (!isCourseOwner) {
  return new NextResponse("Your are not authorized to do this action", { status: 401 });
 }}
