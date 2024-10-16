import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const { video } = new Mux({
 tokenId: process.env.MUX_TOKEN_ID,
 tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function PATCH(
 req: Request,
 { params }: { params: { courseId: string; chapterId: string } }
) {
 try {
  const { userId } = auth();
  if (!userId) {
   return new NextResponse(null, { status: 401 });
  }
  const { courseId, chapterId } = params;
  const courseOwner = await db.course.findUnique({
   where: { id: courseId, userId },
  });
  if (!courseOwner) {
   return new NextResponse(null, { status: 401 });
  }

  const { isPublished, ...values } = await req.json();
  const chapter = await db.chapter.update({
   where: { id: chapterId, courseId },
   data: values,
  });

  if (values.videoUrl) {
   const existingMuxData = await db.muxData.findFirst({
    where: { chapterId },
   });
   if (existingMuxData) {
    await video.assets.delete(existingMuxData.assetId);
    await db.muxData.delete({ where: { id: existingMuxData.id } });
   }
   const asset = await video.assets.create({
    input: values.videoUrl,
    playback_policy: ["public"],
    test: false,
   });
   await db.muxData.create({
    data: {
     assetId: asset.id,
     chapterId,
     playbackId: asset.playback_ids?.[0]?.id,
    },
   });
  }

  if (!chapter) {
   return new NextResponse("Not Found", { status: 404 });
  }
  return NextResponse.json(chapter);
 } catch (error) {
  console.log("[CHAPTER]", error);
  return new NextResponse("Internal Error", { status: 500 });
 }
}
