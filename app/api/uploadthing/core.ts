import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { isAuthorized } from "../utils/is-authorized";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
 courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
  .middleware(() => isAuthorized())
  .onUploadComplete(() => {}),
 courseAttachment: f(["text", "image", "video", "audio", "pdf"])
  .middleware(() => isAuthorized())
  .onUploadComplete(() => {}),
 chapterVideo: f({ video: { maxFileSize: "512MB", maxFileCount: 1 } })
  .middleware(() => isAuthorized())
  .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
