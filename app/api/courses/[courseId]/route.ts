import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
 req: Request,
 { params }: { params: { courseId: string } }
) {
 try {
  const { userId } = auth();
  if (!userId) {
   return new NextResponse("Unauthorized", { status: 401 });
  }

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
