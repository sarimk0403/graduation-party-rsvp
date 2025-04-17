import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // First, delete any existing events
  await prisma.guest.deleteMany();
  await prisma.event.deleteMany();

  // Create the new event with updated details
  const event = await prisma.event.create({
    data: {
      title: "Graduation Party 2025",
      description: "Join us to celebrate Sarim's Graduation!",
      date: new Date("2025-05-11T12:00:00Z"), // Sunday, May 11th 2025
      location: "2505 S Walton Blvd A, Bentonville, AR 72712"
    },
  });

  console.log('Created event:', event);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 