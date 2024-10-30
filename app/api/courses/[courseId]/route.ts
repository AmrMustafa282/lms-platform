import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAuthorized } from "../../utils/is-authorized";

export async function PATCH(
 req: Request,
 { params }: { params: { courseId: string } }
) {
 try {
  const { userId } = isAuthorized();

  const course = await db.course.update({
   where: {
    id: params.courseId,
   },
   data: await req.json(),
  });
  if (!course) {
   return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.json(course);
 } catch (error) {
  console.log("[COURSES]", error);
  return new NextResponse("Internal Error", { status: 500 });
 }
}
