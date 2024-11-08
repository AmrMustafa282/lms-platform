import { auth, clerkClient } from "@clerk/nextjs/server";

type roles = "user" | "teacher" | "admin";

export const securedRestrictTo = async (...roles: roles[]) => {
 const { userId } = auth();
 const user = await clerkClient.users.getUser(userId || "");
 if (!user) return false;

 return roles.includes(user?.privateMetadata?.role as roles);
};
