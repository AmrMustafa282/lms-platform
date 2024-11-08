import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isAuthorized } from "../api/utils/is-authorized";

export async function GET() {
 try {
  const { userId } = isAuthorized();
  const isAdmin =
   (await clerkClient.users.getUser(userId)).privateMetadata?.role === "admin";
  if (!isAdmin) return new NextResponse("Unauthorized", { status: 401 });
  await clerkClient.users.updateUserMetadata(userId, {
   privateMetadata: {
    role: "teacher",
   },
   publicMetadata: {
    role: "teacher",
   },
  });
  return NextResponse.json({ success: true });
 } catch (error) {
  console.log(`Error updating user metadata , ${error}`);
  return new NextResponse("Internal Server Error");
 }
}
