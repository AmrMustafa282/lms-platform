import { db } from "@/lib/db";

export const revalidatePublishment = async (courseId : string) =>{

  const pushlishedChaptersInCourse = await db.chapter.findMany({
  where: {courseId, isPublished: true},
 });
if(!pushlishedChaptersInCourse.length){
  await db.course.update({
    where: {id: courseId},
    data: {isPublished: false},
  });
}}
