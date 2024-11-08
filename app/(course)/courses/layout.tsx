"use client"; // very bad solution, need to change it later

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const CoursesLayout = ({ children }: { children: React.ReactNode }) => {
 const { user } = useUser();
 if (!user) return false;

  if (user?.publicMetadata?.role !== "teacher") return redirect("/");
 return <>{children}</>;
};

export default CoursesLayout;
