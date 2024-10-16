const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
 try {
  await database.category.createMany({
   data: [
    { name: "Computer Science" },
    { name: "Mathematics" },
    { name: "Physics" },
    { name: "Music" },
    { name: "Fitness" },
    { name: "Photography" },
    { name: "Chemistry" },
    { name: "Biology" },
    { name: "History" },
    { name: "Geography" },
    { name: "Literature" },
   ],
  });
  console.log("Successfully seeded the database categories");
 } catch (error) {
  console.log(`Error seeding the database categories , ${error}`);
 } finally {
  await database.$disconnect();
 }
}
main();
