import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
 course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
 const grouped: { [courseTitle: string]: number } = {};
 purchases.forEach((purchase) => {
  const courseTitle = purchase.course.title;
  if (!grouped[courseTitle]) {
   grouped[courseTitle] = 0;
  }
  grouped[courseTitle] += purchase.course.price!;
 });
 return grouped;
};

// export const getStudentsPur = async () => {
//  // TODO: get students and teachers count by role
//  return {
//   studentsCount: 1370,
//   teachersCount: 140,
//  };
// };

export const getAnalytics = async (userId: string) => {
 try {
  const purchases = await db.purchase.findMany({
   where: {
    userId,
   },
   include: {
    course: true,
   },
  });

  const groupedEarnings = groupByCourse(purchases);
  const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
   name: courseTitle,
   total,
  }));

  const totalRevenue = data.reduce((acc, { total }) => acc + total, 0);
  const totalSales = data.length;

  return {
   data,
   totalRevenue,
   totalSales,
  };
 } catch (error) {
  console.log("[GET_ANALYTICS_ERROR]", error);
  return {
   data: [],
   totalRevenue: 0,
   totalSales: 0,
  };
 }
};
