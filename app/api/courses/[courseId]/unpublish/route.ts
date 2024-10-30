import { isAuthorized } from "@/app/api/utils/is-authorized";
import { isCourseOwner } from "@/app/api/utils/is-course-owner";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {


try {
  const { userId } = isAuthorized();
  let { courseId } = params;
  courseId = courseId.charAt(courseId.length - 1) === "}" ? courseId.slice(0, -1) : courseId;
  if(!courseId) {
    return new NextResponse("courseID is missing", { status: 404 });
  }
isCourseOwner({ courseId, userId });
const course = await db.course.findUnique({
  where: {
    id: courseId,
  }
});
if (!course) {
  return new NextResponse("Course not found", { status: 404 });
}

await db.course.update({
  where: {
    id: courseId,
    userId
  },
  data: {
    isPublished: false,
  },
});



  return NextResponse.json("Course unpublished successfully");
} catch (error) {
  console.log("[COURSE_ID_UNPUBLISH_PATCH]", error);
  return new NextResponse("Internal Error", { status: 500 });
}
}
