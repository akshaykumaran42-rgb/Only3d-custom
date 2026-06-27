import { PrismaClient } from "../src/generated/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding materials...");

  const pla = await prisma.material.upsert({
    where: { internalCode: "PLA-PRUSA-GALAXY" },
    update: {},
    create: {
      name: "Prusament PLA Galaxy Black",
      internalCode: "PLA-PRUSA-GALAXY",
      category: "Standard",
      brand: "Prusament",
      materialType: "FDM",
      density: 1.24,
      costPerKg: 2999, // 29.99 EUR/USD
      sellingPricePerGram: 0.05, // 5 cents per gram
      defaultPrintSpeedMultiplier: 1.0,
      nozzleTemperature: 215,
      bedTemperature: 60,
      chamberTemperature: null,
      status: "ACTIVE",
      visibility: true,
      displayOrder: 1,
      description: "Premium quality PLA with glitter effect.",
    },
  });

  const petg = await prisma.material.upsert({
    where: { internalCode: "PETG-PRUSA-ORANGE" },
    update: {},
    create: {
      name: "Prusament PETG Prusa Orange",
      internalCode: "PETG-PRUSA-ORANGE",
      category: "Standard",
      brand: "Prusament",
      materialType: "FDM",
      density: 1.27,
      costPerKg: 2999,
      sellingPricePerGram: 0.05,
      defaultPrintSpeedMultiplier: 0.9,
      nozzleTemperature: 250,
      bedTemperature: 90,
      chamberTemperature: null,
      status: "ACTIVE",
      visibility: true,
      displayOrder: 2,
      description: "Tough and temperature resistant PETG.",
    },
  });

  console.log("Seeded:", pla.name, petg.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
