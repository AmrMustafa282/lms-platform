import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

async function getData(): Promise<any[]> {
 const { userId } = auth();
 if (!userId) {
  return redirect("/");
 }
 const courses = await db.course.findMany({
  where: {
   userId,
  },
  orderBy: {
   createdAt: "desc",
  },
 });
 return courses;
}

const CoursesPage = async () => {
 const data = await getData();
 return (
  <div className="p-4">
   <DataTable columns={columns} data={data} />
  </div>
 );
};

export default CoursesPage;
