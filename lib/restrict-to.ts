import { useUser } from "@clerk/nextjs";

type roles = "user" | "teacher" | "admin";

export const restrictTo = (...roles: roles[]) => {
 const { user } = useUser();
 if (!user) return false;

 return roles.includes(user?.publicMetadata?.role as roles);
};
