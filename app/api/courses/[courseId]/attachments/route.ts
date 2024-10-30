import { isAuthorized } from "@/app/api/utils/is-authorized";
import { isCourseOwner } from "@/app/api/utils/is-course-owner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
 req: Request,
 { params }: { params: { courseId: string } }
) {
 try {
  const { userId } = isAuthorized();
  const {courseId} = params;
  const { url } = await req.json();
  isCourseOwner({courseId, userId });
  const attachment = await db.attachment.create({
   data: {
    url,
    name: url.split("/").pop(),
    courseId: params.courseId,
   },
  });
  return NextResponse.json(attachment);
 } catch (error) {
  console.log("[COURSE_ID_ATTACHMENTS]", error);
  return new NextResponse("Internal Error", { status: 500 });
 }
}
